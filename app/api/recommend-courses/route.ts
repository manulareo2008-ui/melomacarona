import { NextResponse } from "next/server";
import type { InternationalCourse } from "@/lib/coursesData";
import { GENERAL_AREAS, type GeneralArea, type Modality } from "@/lib/domain";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { getCoursesForRag } from "@/lib/recommendation/courseRepository";

const MODALITIES: Modality[] = ["Presencial", "Online", "Híbrido"];
const MAX_BUDGET = 100_000;
const RECOMMENDATION_COUNT = 3;
const LLM_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT =
  "Você é um consultor educacional de elite. Sua missão é analisar o 'Perfil do Usuário' e compará-lo com a 'Lista de Cursos Disponíveis' (fornecida em JSON). \n" +
  "Regras:\n" +
  "- Escolha os 3 cursos que melhor se alinham aos objetivos, área e modalidade do usuário.\n" +
  "- O raciocínio deve ser semântico: entenda o contexto do 'texto_livre' do usuário para encontrar sinergias com a ementa dos cursos, mesmo que os termos não sejam idênticos.\n" +
  "- Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, contendo um array 'recomendacoes'. Cada item do array deve ter o 'curso_id', 'nome_curso', um 'score_afinidade' (0 a 100) e um 'pitch_venda' (uma justificativa persuasiva e direta em português de até 3 linhas explicando por que este curso é ideal para este usuário).";

type RecommendPayload = {
  area: GeneralArea;
  nicho: string;
  budget: number;
  modalidade: Modality;
  texto_livre: string;
};

type LlmRecommendation = {
  curso_id: string;
  nome_curso: string;
  score_afinidade: number;
  pitch_venda: string;
};

type ProviderUsed = "openai" | "gemini" | "local";

const requestSchema = z.object({
  area: z.enum(GENERAL_AREAS),
  nicho: z.string().trim().min(2),
  budget: z.number().finite().min(0).max(MAX_BUDGET),
  modalidade: z.enum(MODALITIES),
  texto_livre: z.string().trim().default(""),
});

function streamingHeaders(provider: ProviderUsed, totalCourses: number): HeadersInit {
  return {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Recommendation-Provider": provider,
    "X-Courses-Pre-Filtered": String(totalCourses),
  };
}

function buildTextStreamResponse(
  source: ReadableStream<Uint8Array>,
  provider: ProviderUsed,
  totalCourses: number
): Response {
  return new Response(source, {
    status: 200,
    headers: streamingHeaders(provider, totalCourses),
  });
}

async function openAiChatCompletionStream(
  userPrompt: string,
  signal: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const stream = await client.chat.completions.create(
    {
      model,
      temperature: 0.2,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    },
    { signal }
  );

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content ?? "";
          if (content) controller.enqueue(encoder.encode(content));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

async function geminiContentStream(
  userPrompt: string,
  signal: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const modelName = process.env.GEMINI_MODEL ?? "gemini-1.5-pro";
  const client = new GoogleGenerativeAI(apiKey);
  const geminiModel = client.getGenerativeModel({ model: modelName });
  const { stream } = await geminiModel.generateContentStream(
    [{ text: SYSTEM_PROMPT }, { text: userPrompt }],
    { signal }
  );

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

function stringAsChunkedStream(text: string, chunkSize = 512): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < text.length; i += chunkSize) {
        controller.enqueue(encoder.encode(text.slice(i, i + chunkSize)));
      }
      controller.close();
    },
  });
}

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

function localScore(
  input: RecommendPayload,
  course: InternationalCourse
): number {
  const areaScore = course.area === input.area ? 30 : 0;
  const modalityScore = course.modality === input.modalidade ? 20 : 0;
  const budgetScore = Math.max(0, Math.round((1 - course.priceBrl / Math.max(input.budget, 1)) * 20));

  const userTokens = new Set(tokenize(`${input.nicho} ${input.texto_livre}`));
  const courseTokens = new Set(
    tokenize(`${course.name} ${course.shortDescription} ${course.about} ${course.subArea} ${course.tags.join(" ")}`)
  );
  let overlap = 0;
  for (const token of userTokens) {
    if (courseTokens.has(token)) overlap += 1;
  }
  const semanticScore =
    userTokens.size === 0 ? 0 : Math.round((overlap / userTokens.size) * 30);

  return Math.max(0, Math.min(100, areaScore + modalityScore + budgetScore + semanticScore));
}

function buildLocalPitch(input: RecommendPayload, course: InternationalCourse): string {
  const goal = input.texto_livre.trim();
  const goalPart = goal
    ? ` e conversa com seu objetivo "${goal}"`
    : "";
  return `Ideal para ${input.nicho} porque cobre competencias alinhadas${goalPart}, na modalidade ${course.modality}, e dentro do budget de ate R$ ${input.budget}.`;
}

function localFallbackRecommendations(
  input: RecommendPayload,
  courses: InternationalCourse[]
): { recomendacoes: LlmRecommendation[] } {
  const recomendacoes = courses
    .map((course) => ({
      curso_id: course.id,
      nome_curso: course.name,
      score_afinidade: localScore(input, course),
      pitch_venda: buildLocalPitch(input, course),
    }))
    .sort((a, b) => b.score_afinidade - a.score_afinidade)
    .slice(0, RECOMMENDATION_COUNT);

  return { recomendacoes };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Payload inválido.", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { area, nicho, budget, modalidade, texto_livre } = validation.data as RecommendPayload;
    const courses = await getCoursesForRag({
      area,
      budget,
      modalidade,
    });

    if (courses.length === 0) {
      return NextResponse.json(
        {
          recomendacoes: [],
          metadata: {
            total_cursos_pre_filtrados: 0,
            provider: "local",
          },
        },
        { status: 200 }
      );
    }

    const userPrompt = JSON.stringify(
      {
        perfil_usuario: {
          area,
          nicho,
          budget,
          modalidade,
          texto_livre,
        },
        lista_cursos_disponiveis: courses.map((course) => ({
          curso_id: course.id,
          nome_curso: course.name,
          descricao_curta: course.shortDescription,
          ementa: course.about,
          area: course.area,
          sub_area: course.subArea,
          modalidade: course.modality,
          preco: course.priceBrl,
          instituicao: course.institution,
          tags: course.tags,
        })),
      },
      null,
      2
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    try {
      const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
      const hasGemini = Boolean(process.env.GEMINI_API_KEY);

      if (hasOpenAi) {
        try {
          const readable = await openAiChatCompletionStream(userPrompt, controller.signal);
          return buildTextStreamResponse(readable, "openai", courses.length);
        } catch (openAiError) {
          console.warn("OpenAI falhou, tentando Gemini fallback...", openAiError);
        }
      }

      if (hasGemini) {
        try {
          const readable = await geminiContentStream(userPrompt, controller.signal);
          return buildTextStreamResponse(readable, "gemini", courses.length);
        } catch (geminiError) {
          console.warn("Gemini falhou, usando fallback local...", geminiError);
        }
      }

      const local = localFallbackRecommendations(
        { area, nicho, budget, modalidade, texto_livre },
        courses
      );
      const jsonBody = JSON.stringify({ recomendacoes: local.recomendacoes });
      const readable = stringAsChunkedStream(jsonBody);
      return buildTextStreamResponse(readable, "local", courses.length);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("recommend-courses error", error);
    return NextResponse.json(
      { error: "Falha ao gerar recomendação." },
      { status: 500 }
    );
  }
}
