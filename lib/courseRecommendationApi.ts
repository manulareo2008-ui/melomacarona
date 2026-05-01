import { INTERNATIONAL_COURSES } from "@/lib/coursesData";
import type { GeneralArea, Modality } from "@/lib/domain";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
// TODO: Fase 1.2 client migration — fallback pode usar endpoint API em vez de array local

export type UserProfile = {
  nome?: string;
  idade?: number;
  area: GeneralArea;
  nicho: string;
  budget: number;
  modalidade: Modality;
  nivel_conhecimento?: "iniciante" | "intermediario" | "avancado";
  objetivos?: string;
  texto_livre?: string;
};

export type ExternalCourseRecommendation = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  cargaHoraria: string;
  linkAfiliado: string;
  score_afinidade: number;
  pitch_venda: string;
};

export type RecommendationApiResult = {
  recomendacoes: ExternalCourseRecommendation[];
  metadata: {
    provider: "mock-external-api" | "anthropic" | "local";
    total_cursos_pre_filtrados: number;
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const tokenize = (value: string) =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);

const semanticScore = (
  userNiche: string,
  freeText: string | undefined,
  courseText: string
) => {
  const userTokens = new Set(tokenize(`${userNiche} ${freeText ?? ""}`));
  const courseTokens = new Set(tokenize(courseText));
  if (userTokens.size === 0) return 0;

  let overlap = 0;
  for (const token of userTokens) {
    if (courseTokens.has(token)) overlap += 1;
  }

  return Math.round((overlap / userTokens.size) * 100);
};

export const fetchCourseRecommendations = async (
  userProfile: UserProfile
): Promise<RecommendationApiResult> => {
  try {
    let accessToken: string | undefined;
    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      accessToken = data.session?.access_token;
    } catch {
      accessToken = undefined;
    }

    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        nome: userProfile.nome ?? "Aluno",
        idade: userProfile.idade ?? 18,
        area: userProfile.area,
        nicho: userProfile.nicho,
        modalidade: userProfile.modalidade,
        budget: userProfile.budget,
        nivel_conhecimento: userProfile.nivel_conhecimento ?? "iniciante",
        objetivos: userProfile.objetivos ?? userProfile.texto_livre ?? userProfile.nicho,
        texto_livre: userProfile.texto_livre ?? "",
      }),
    });

    if (response.ok) {
      return (await response.json()) as RecommendationApiResult;
    }
  } catch (error) {
    console.warn("Falling back to local recommendation adapter.", error);
  }

  const preFiltered = INTERNATIONAL_COURSES.filter(
    (course) => course.area === userProfile.area && course.priceBrl <= userProfile.budget
  );

  // Simula latencia de API externa de cursos (SaaS/Afiliacao).
  await sleep(450);

  const ranked = preFiltered
    .map((course) => {
      const nicheScore = semanticScore(
        userProfile.nicho,
        userProfile.texto_livre,
        `${course.name} ${course.shortDescription} ${course.about} ${course.subArea} ${course.tags.join(" ")}`
      );
      const modalityScore = course.modality === userProfile.modalidade ? 100 : 50;
      const budgetScore =
        userProfile.budget <= 0
          ? course.priceBrl === 0
            ? 100
            : 0
          : Math.max(0, Math.round((1 - course.priceBrl / userProfile.budget) * 100));

      const score = Math.round(nicheScore * 0.55 + modalityScore * 0.2 + budgetScore * 0.25);

      return {
        id: course.id,
        nome: course.name,
        categoria: course.subArea,
        preco: course.priceBrl,
        cargaHoraria: course.duration,
        linkAfiliado: `${course.registrationUrl}?utm_source=mvp&utm_medium=affiliate&utm_campaign=wizard`,
        score_afinidade: Math.max(0, Math.min(100, score)),
        pitch_venda: `Curso recomendado por alta sinergia com "${userProfile.nicho}", modalidade ${course.modality} e investimento dentro do seu teto.`,
      };
    })
    .sort((a, b) => b.score_afinidade - a.score_afinidade)
    .slice(0, 6);

  return {
    recomendacoes: ranked,
    metadata: {
      provider: "mock-external-api",
      total_cursos_pre_filtrados: preFiltered.length,
    },
  };
};

