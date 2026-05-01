import {
  INTERNATIONAL_COURSES,
  getCourseById as getFallbackCourseById,
  type InternationalCourse,
} from "../coursesData";
import type { GeneralArea, Modality } from "../domain";
import { createServerSupabaseClient } from "./server";

export type SupabaseCourse = {
  id: string;
  nome: string;
  descricao_curta: string | null;
  descricao_completa: string | null;
  instituicao: string;
  plataforma: string;
  area: string;
  sub_area: string | null;
  nivel: string;
  modalidade: string;
  publico_alvo: string;
  preco_brl: number;
  preco_display: string | null;
  duracao: string | null;
  prerequisitos: string[] | null;
  url_destino: string;
  url_status: string | null;
  url_verificado_em: string | null;
  tags: string[] | null;
  internacional: boolean | null;
  pais_origem: string | null;
  cidade: string | null;
  estado: string | null;
  patrocinador_id: string | null;
  fonte: string | null;
  ativo: boolean | null;
  criado_em: string | null;
  atualizado_em: string | null;
};

type CourseFilter = {
  area?: string;
  modalidade?: string;
  maxPrice?: number;
  publicoAlvo?: string;
};

let lastFilterUsedFallback = false;

export function didLastGetCoursesByFilterUseFallback(): boolean {
  return lastFilterUsedFallback;
}

function fromInternationalCourse(course: InternationalCourse): SupabaseCourse {
  return {
    id: course.id,
    nome: course.name,
    descricao_curta: course.shortDescription,
    descricao_completa: course.about,
    instituicao: course.institution,
    plataforma: course.platform,
    area: course.area,
    sub_area: course.subArea,
    nivel: course.level,
    modalidade: course.modality,
    publico_alvo: "ambos",
    preco_brl: course.priceBrl,
    preco_display: course.priceDisplay,
    duracao: course.duration,
    prerequisitos: course.prerequisites,
    url_destino: course.registrationUrl,
    url_status: "active",
    url_verificado_em: null,
    tags: course.tags,
    internacional: course.isInternational,
    pais_origem: course.originCountry,
    cidade: null,
    estado: null,
    patrocinador_id: null,
    fonte: "manual",
    ativo: true,
    criado_em: null,
    atualizado_em: null,
  };
}

function getFallbackActiveCourses(): SupabaseCourse[] {
  return INTERNATIONAL_COURSES.map(fromInternationalCourse).filter(
    (course) => course.ativo === true && course.url_status === "active"
  );
}

export function toInternationalCourse(curso: SupabaseCourse): InternationalCourse {
  return {
    id: curso.id,
    name: curso.nome,
    shortDescription: curso.descricao_curta ?? "",
    about: curso.descricao_completa ?? "",
    institution: curso.instituicao,
    platform: curso.plataforma,
    area: curso.area as GeneralArea,
    subArea: curso.sub_area ?? "",
    level: (curso.nivel ?? "Iniciante") as InternationalCourse["level"],
    modality: curso.modalidade as Modality,
    priceBrl: Number(curso.preco_brl ?? 0),
    priceDisplay: curso.preco_display ?? "",
    duration: curso.duracao ?? "",
    prerequisites: curso.prerequisitos ?? [],
    registrationUrl: curso.url_destino,
    isInternational: Boolean(curso.internacional),
    originCountry: curso.pais_origem ?? "Brasil",
    tags: curso.tags ?? [],
  };
}

export async function getAllActiveCourses(): Promise<SupabaseCourse[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("ativo", true)
      .eq("url_status", "active")
      .order("area", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SupabaseCourse[];
  } catch (error) {
    console.warn("Supabase unavailable in getAllActiveCourses; using local fallback.", error);
    return getFallbackActiveCourses()
      .sort((a, b) => a.area.localeCompare(b.area, "pt-BR") || a.nome.localeCompare(b.nome, "pt-BR"));
  }
}

export async function getCoursesByFilter(filter: CourseFilter): Promise<SupabaseCourse[]> {
  lastFilterUsedFallback = false;
  try {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("cursos")
      .select("*")
      .eq("ativo", true)
      .eq("url_status", "active")
      .order("preco_brl", { ascending: true })
      .limit(120);

    if (filter.area !== undefined) query = query.eq("area", filter.area);
    if (filter.modalidade !== undefined) query = query.eq("modalidade", filter.modalidade);
    if (filter.maxPrice !== undefined) query = query.lte("preco_brl", filter.maxPrice);
    if (filter.publicoAlvo !== undefined) query = query.eq("publico_alvo", filter.publicoAlvo);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as SupabaseCourse[];
  } catch (error) {
    lastFilterUsedFallback = true;
    console.warn("Supabase unavailable in getCoursesByFilter; using local fallback.", error);
    return getFallbackActiveCourses()
      .filter((course) => (filter.area !== undefined ? course.area === filter.area : true))
      .filter((course) =>
        filter.modalidade !== undefined ? course.modalidade === filter.modalidade : true
      )
      .filter((course) => (filter.maxPrice !== undefined ? course.preco_brl <= filter.maxPrice : true))
      .filter((course) =>
        filter.publicoAlvo !== undefined ? course.publico_alvo === filter.publicoAlvo : true
      )
      .sort((a, b) => a.preco_brl - b.preco_brl)
      .slice(0, 120);
  }
}

export async function getCourseById(id: string): Promise<SupabaseCourse | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", id)
      .eq("ativo", true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return (data as SupabaseCourse | null) ?? null;
  } catch (error) {
    console.warn("Supabase unavailable in getCourseById; using local fallback.", error);
    const fallback = getFallbackCourseById(id);
    return fallback ? fromInternationalCourse(fallback) : null;
  }
}

export async function getCoursesByIds(ids: string[]): Promise<SupabaseCourse[]> {
  if (ids.length === 0) return [];
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .in("id", ids)
      .eq("ativo", true);

    if (error) throw error;
    return (data ?? []) as SupabaseCourse[];
  } catch (error) {
    console.warn("Supabase unavailable in getCoursesByIds; using local fallback.", error);
    const idSet = new Set(ids);
    return getFallbackActiveCourses().filter((course) => idSet.has(course.id));
  }
}
