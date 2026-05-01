import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { InternationalCourse } from "@/lib/coursesData";
import { recommendationInputSchema } from "@/lib/recommendation/schema";
import { getCoursesForRag } from "@/lib/recommendation/courseRepository";
import { getAllActiveCourses, toInternationalCourse } from "@/lib/supabase/courses";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const RECOMMENDATION_COUNT = 5;

type RankedCourse = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  cargaHoraria: string;
  linkAfiliado: string;
  score_afinidade: number;
  pitch_venda: string;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

function nicheAffinity(niche: string, course: InternationalCourse): number {
  const nicheTokens = new Set(tokenize(niche));
  if (nicheTokens.size === 0) return 0;
  const courseTokens = new Set(
    tokenize(`${course.subArea} ${course.name} ${course.shortDescription} ${course.tags.join(" ")}`)
  );
  let overlap = 0;
  for (const token of nicheTokens) {
    if (courseTokens.has(token)) overlap += 1;
  }
  return Math.round((overlap / nicheTokens.size) * 100);
}

function localScore(
  input: {
    area: string;
    modalidade: string;
    budget: number;
    nicho: string;
    objetivos: string;
  },
  course: InternationalCourse
): number {
  const areaScore = course.area === input.area ? 30 : 0;
  const modalityScore = course.modality === input.modalidade ? 20 : 0;
  const budgetScore = Math.max(0, Math.round((1 - course.priceBrl / Math.max(input.budget, 1)) * 20));
  const nicheScore = Math.round(nicheAffinity(input.nicho, course) * 0.6);

  const userTokens = new Set(tokenize(`${input.nicho} ${input.objetivos}`));
  const courseTokens = new Set(
    tokenize(`${course.name} ${course.shortDescription} ${course.about} ${course.subArea} ${course.tags.join(" ")}`)
  );
  let overlap = 0;
  for (const token of userTokens) {
    if (courseTokens.has(token)) overlap += 1;
  }
  const semanticScore =
    userTokens.size === 0 ? 0 : Math.round((overlap / userTokens.size) * 30);

  return Math.max(
    0,
    Math.min(100, areaScore + modalityScore + budgetScore + semanticScore + nicheScore)
  );
}

async function buildLocalRecommendations(
  input: {
    area: string;
    modalidade: string;
    budget: number;
    nicho: string;
    objetivos: string;
  }
): Promise<RankedCourse[]> {
  const activeCourses = await getAllActiveCourses();
  const normalizedCourses = activeCourses.map(toInternationalCourse);
  const preFiltered = normalizedCourses
    .filter((course) => course.area === input.area && course.priceBrl <= input.budget)
    .sort((a, b) => nicheAffinity(input.nicho, b) - nicheAffinity(input.nicho, a));

  return preFiltered
    .map((course) => ({
      id: course.id,
      nome: course.name,
      categoria: course.subArea,
      preco: course.priceBrl,
      cargaHoraria: course.duration,
      linkAfiliado: course.registrationUrl,
      score_afinidade: localScore(input, course),
      pitch_venda: `Recomendado para ${input.nicho} porque combina com seu objetivo "${input.objetivos}" na modalidade ${course.modality}.`,
    }))
    .sort((a, b) => b.score_afinidade - a.score_afinidade)
    .slice(0, RECOMMENDATION_COUNT);
}

async function generateWithClaude(prompt: string): Promise<RankedCourse[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is missing.");

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20240620";

  const response = await client.messages.create({
    model,
    max_tokens: 1200,
    temperature: 0.2,
    system:
      "Você é um recomendador de cursos. Priorize fortemente aderência ao nicho/subárea informado pelo usuário. Retorne somente JSON válido com chave 'recomendacoes' (array de 5 itens), cada item contendo id, nome, categoria, preco, cargaHoraria, linkAfiliado, score_afinidade e pitch_venda.",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  const clean = text
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  const parsed = JSON.parse(clean) as { recomendacoes?: RankedCourse[] };

  if (!parsed.recomendacoes || !Array.isArray(parsed.recomendacoes)) {
    throw new Error("Claude response did not include recomendacoes.");
  }

  return parsed.recomendacoes.slice(0, RECOMMENDATION_COUNT);
}

async function resolveUserIdFromAuthHeader(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
    const token = authHeader.slice("bearer ".length).trim();
    if (!token) return null;
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

async function saveRecommendationLog(
  input: unknown,
  recommendations: RankedCourse[],
  provider: string,
  userId: string | null
) {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.from("recomendacoes_ia").insert({
      user_id: userId,
      nome: (input as { nome: string }).nome,
      idade: (input as { idade: number }).idade,
      area: (input as { area: string }).area,
      nicho: (input as { nicho: string }).nicho,
      modalidade: (input as { modalidade: string }).modalidade,
      budget: (input as { budget: number }).budget,
      nivel_conhecimento: (input as { nivel_conhecimento: string }).nivel_conhecimento,
      objetivos: (input as { objetivos: string }).objetivos,
      provider,
      input_payload: input,
      recommendations_payload: recommendations,
    });
  } catch (error) {
    console.warn("Could not persist recomendacoes_ia.", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = recommendationInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload invalido.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const preFiltered = await getCoursesForRag({
      area: input.area,
      budget: input.budget,
      modalidade: input.modalidade,
      maxRows: 60,
    });

    const userId = await resolveUserIdFromAuthHeader(request);

    let provider: "anthropic" | "local" = "local";
    let recomendacoes: RankedCourse[] = await buildLocalRecommendations(input);

    if (preFiltered.length > 0 && process.env.ANTHROPIC_API_KEY) {
      try {
        const prompt = JSON.stringify(
          {
            perfil_usuario: input,
            lista_cursos_disponiveis: preFiltered.map((course) => ({
              id: course.id,
              nome: course.name,
              categoria: course.subArea,
              preco: course.priceBrl,
              cargaHoraria: course.duration,
              linkAfiliado: course.registrationUrl,
              resumo: course.shortDescription,
            })),
          },
          null,
          2
        );
        recomendacoes = await generateWithClaude(prompt);
        provider = "anthropic";
      } catch (error) {
        console.warn("Claude unavailable, using local fallback.", error);
      }
    }

    await saveRecommendationLog(input, recomendacoes, provider, userId);

    return NextResponse.json({
      recomendacoes,
      metadata: {
        provider,
        total_cursos_pre_filtrados: preFiltered.length,
      },
    });
  } catch (error) {
    console.error("recommendations route error", error);
    return NextResponse.json({ error: "Falha ao recomendar cursos." }, { status: 500 });
  }
}
