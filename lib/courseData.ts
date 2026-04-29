/**
 * Motor de busca e utilidades (catálogo em `coursesData.ts`).
 */

export {
  GENERAL_AREAS,
  SUB_AREAS,
  OUTRA_ESPECIFICA,
  OUTRA_ESPECIFICA_LABEL,
  PRICE_OPTIONS,
  priceWithinUserCeiling,
  type GeneralArea,
  type PriceRangeId,
  type Modality,
} from "./domain";

import type { GeneralArea, Modality, PriceRangeId } from "./domain";
import { priceWithinUserCeiling } from "./domain";
import type { InternationalCourse } from "./coursesData";
import { INTERNATIONAL_COURSES } from "./coursesData";

export type { InternationalCourse } from "./coursesData";
export { getCourseById } from "./coursesData";

const MAX_EXACT = 12;
const MAX_SIMILAR = 12;
const MIN_EXACT = 3;

const LEGACY_SUBAREA_TO_KEY: Record<string, string> = {
  "Programação e fundamentos de software": "software_programming",
  "Dados, analytics e aprendizado de máquina": "data_ml",
  "Design de interfaces, UX e produto": "ux_ui_product",
  "Desenvolvimento web e aplicações front-end": "frontend_web",
  "Infraestrutura, cloud e redes": "cloud_infrastructure_networks",
  "Cibersegurança, DevOps e automação": "cybersecurity_devops_automation",
  "Enfermagem, cuidados e simulação clínica": "nursing_clinical_care",
  "Bem-estar, saúde mental e mindfulness": "wellbeing_mental_health",
  "Gestão em saúde, políticas e sistemas": "health_management_policy",
  "Epidemiologia, evidências e saúde pública": "epidemiology_public_health",
  "Nutrição, hábitos e promoção de saúde": "nutrition_health_habits",
  "Educação, comunicação e humanização em saúde": "health_education_communication",
  "Comunicação, oratória e escrita": "communication_public_speaking",
  "Psicologia, comportamento e desenvolvimento": "psychology_behavior_development",
  "Direito, ética, justiça e cidadania": "law_ethics_citizenship",
  "Línguas, leitura e estudos acadêmicos": "languages_reading_academics",
  "Filosofia, crítica e humanidades": "philosophy_critical_humanities",
  "Sociologia, política e relações sociais": "sociology_politics_society",
  "Artes visuais, ilustração e identidade": "visual_arts_illustration_identity",
  "Audiovisual, cinema, fotografia e mídias": "audiovisual_cinema_photography_media",
  "Música, áudio, performance e produção": "music_audio_performance_production",
  "Animação, games e artes interativas": "animation_games_interactive_arts",
  "Moda, estética e projetos de branding": "fashion_aesthetics_branding",
  "Narrativas, roteiro e criação cultural": "storytelling_screenwriting_culture",
  "Vendas, negociação e atendimento": "sales_negotiation_customer_success",
  "Marketing digital, conteúdo e analytics": "digital_marketing_content_analytics",
  "Finanças, controle e orçamento": "finance_control_budget",
  "Empreendedorismo, inovação e negócios": "entrepreneurship_innovation_business",
  "Liderança, pessoas e operações": "leadership_people_operations",
  "Estratégia, qualidade e processos": "strategy_quality_processes",
  "Civil, obras, orçamento e canteiro": "civil_construction_budgeting",
  "Mecânica, materiais e processos industriais": "mechanical_materials_industrial",
  "Energia, sustentabilidade e meio ambiente": "energy_sustainability_environment",
  "Automação, robótica e indústria 4.0": "automation_robotics_industry4",
  "Projetos, normas técnicas e segurança": "projects_standards_safety",
  "Infraestrutura, instalações e recursos": "infrastructure_installations_resources",
};

const DIRECT_URL_POOL_BY_AREA: Record<GeneralArea, string[]> = {
  technology: [
    "https://www.coursera.org/professional-certificates/google-ux-design",
    "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
    "https://www.udemy.com/course/terraform-aws-devops/",
  ],
  health: [
    "https://www.coursera.org/learn/introduction-nursing",
    "https://www.coursera.org/learn/the-science-of-well-being",
    "https://www.edx.org/course/healthcare-quality",
  ],
  humanities: [
    "https://www.coursera.org/specializations/public-speaking",
    "https://www.coursera.org/learn/introduction-psychology",
    "https://www.edx.org/course/justice-2",
  ],
  arts_design: [
    "https://www.coursera.org/specializations/game-design",
    "https://www.udemy.com/course/brand-identity-and-logo-design-process/",
    "https://www.coursera.org/specializations/photography",
  ],
  business_admin: [
    "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
    "https://www.coursera.org/learn/wharton-marketing-analytics",
    "https://www.coursera.org/learn/wharton-finance",
  ],
  engineering: [
    "https://www.coursera.org/learn/mechanics-of-materials-1",
    "https://www.coursera.org/specializations/modern-robotics",
    "https://www.edx.org/course/solar-energy-0",
  ],
};

function canonicalSubAreaKey(value: string): string {
  return LEGACY_SUBAREA_TO_KEY[value] ?? value;
}

function humanizeSubAreaKey(value: string): string {
  if (!value.includes("_")) return value;
  return value
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function directFillUrl(area: GeneralArea, seed: number): string {
  const pool = DIRECT_URL_POOL_BY_AREA[area];
  return pool[seed % pool.length] ?? "https://www.coursera.org/";
}

function priceBrlForSynthetic(range: PriceRangeId, index: number): number {
  switch (range) {
    case "onlyFree":
      return 0;
    case "max100":
      return [29, 55, 99][index % 3];
    case "max500":
      return [120, 280, 450][index % 3];
    case "max1000":
      return [400, 720, 999][index % 3];
    case "unlimited":
      return [1500, 2800, 5200][index % 3];
    default:
      return 0;
  }
}

function fillExactCourses(
  exact: InternationalCourse[],
  area: GeneralArea,
  modality: Modality,
  priceRange: PriceRangeId,
  niche: string | null,
  query: string | null
): InternationalCourse[] {
  if (exact.length >= MIN_EXACT) return exact;
  const out = [...exact];
  const existing = new Set(exact.map((c) => c.id));
  let i = 0;
  while (out.length < MIN_EXACT) {
    const priceBrl = priceBrlForSynthetic(priceRange, i);
    if (!priceWithinUserCeiling(priceBrl, priceRange)) {
      i += 1;
      continue;
    }
    const qNorm = query ? normalize(query).replace(/\s+/g, "-").slice(0, 32) : "interesse";
    const subLabel = niche
      ? canonicalSubAreaKey(niche)
      : `Interesse: ${query ?? ""}`.slice(0, 80);
    const id = `fill-${area}-${slugId(subLabel)}-${slugId(modality)}-${priceRange}-${i}-${qNorm.slice(0, 12)}`;
    if (existing.has(id)) {
      i += 1;
      continue;
    }
    existing.add(id);
    const name = niche
      ? [
          `Formação Prática em ${niche}`,
          `Projeto Guiado de ${niche}`,
          `Especialização Rápida: ${niche}`,
        ][out.length % 3]
      : [
          `${query ?? "Busca"} Aplicado ao Mercado`,
          `Laboratório Intensivo: ${query ?? "Busca"}`,
          `Trilha Estratégica em ${query ?? "Busca"}`,
        ][out.length % 3];
    const tags = query
      ? [
          normalize(query),
          ...normalize(query)
            .split(/\s+/)
            .filter((t) => t.length > 1),
        ]
      : [
          ...(niche ? [niche.toLowerCase()] : []),
          area.toLowerCase(),
        ];
    out.push({
      id,
      name,
      shortDescription: query
        ? `Curso orientado por prática para desenvolver competências em ${query.trim()} com foco em aplicação imediata.`
        : `Curso de ${humanizeSubAreaKey(niche ?? "especialização")} com exercícios guiados, estudos de caso e entregáveis para portfólio.`,
      institution: "Catálogo complementar (protótipo)",
      platform: "Matrícula",
      modality,
      area,
      subArea: subLabel,
      priceBrl,
      priceDisplay:
        priceBrl === 0
          ? "100% Gratuito (protótipo)"
          : `${priceBrl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (protótipo)`,
      about:
        "Entrada sintética para manter o mínimo de três resultados exatos nesta combinação de filtros.",
      duration: "3 semanas",
      level: "Iniciante",
      prerequisites: ["Nenhum pré-requisito obrigatório"],
      registrationUrl: directFillUrl(area, i),
      isInternational: false,
      originCountry: "Brasil",
      tags: tags.length ? tags : ["geral"],
    });
    i += 1;
  }
  return out;
}

function slugId(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Correspondência flexível: substring no conjunto; ou tokens (≥2 chars) todos presentes.
 */
export function courseMatchesFreeText(
  course: InternationalCourse,
  rawQuery: string
): boolean {
  const t = normalize(rawQuery);
  if (t.length < 2) return false;
  const bundle = [
    course.name,
    course.shortDescription,
    course.about,
    course.subArea,
    ...course.tags,
  ]
    .join(" \n ")
    .toLowerCase();
  if (bundle.includes(t)) return true;
  const parts = t.split(/\s+/).filter((w) => w.length >= 2);
  if (parts.length === 0) return bundle.includes(t);
  return parts.every((p) => bundle.includes(p));
}

export type SubAreaSearchInput =
  | { type: "preset"; niche: string }
  | { type: "custom"; query: string };

export type GroupedSearchResults = {
  exact: InternationalCourse[];
  similar: InternationalCourse[];
};

function sortByModalityFirst(
  list: InternationalCourse[],
  preferred: Modality
): InternationalCourse[] {
  return [...list].sort((a, b) => {
    const as = a.modality === preferred ? 0 : 1;
    const bs = b.modality === preferred ? 0 : 1;
    if (as !== bs) return as - bs;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

/** Preserva a ordem; O(n) com um Set de IDs vistos. */
function dedupeByIdKeepOrder(
  courses: InternationalCourse[]
): InternationalCourse[] {
  const seen = new Set<string>();
  const out: InternationalCourse[] = [];
  for (const c of courses) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

/** Chave estável O(1) para o mesmo "curso" com IDs diferentes no catálogo. */
function courseDisplayKey(c: InternationalCourse): string {
  return [normalize(c.name), normalize(c.institution), c.modality].join("\u0000");
}

/**
 * Remove o mesmo título+instituição+modalidade em duplicata (ex.: mesmo curso, IDs distintos),
 * dando prioridade à ordem em `exact` e depois `similar`.
 */
function dedupeByDisplayKeyExactThenSimilar(
  exact: InternationalCourse[],
  similar: InternationalCourse[]
): GroupedSearchResults {
  const seen = new Set<string>();
  const outExact: InternationalCourse[] = [];
  for (const c of exact) {
    const k = courseDisplayKey(c);
    if (seen.has(k)) continue;
    seen.add(k);
    outExact.push(c);
  }
  const outSimilar: InternationalCourse[] = [];
  for (const c of similar) {
    const k = courseDisplayKey(c);
    if (seen.has(k)) continue;
    seen.add(k);
    outSimilar.push(c);
  }
  return { exact: outExact, similar: outSimilar };
}

/**
 * Garante IDs únicos em `exact` e que `similar` não repita nenhum ID de `exact`;
 * em seguida evita o mesmo curso (chave de exibição) em listas distintas ou repetido.
 */
function finalizeGroupedSearchResults(
  exact: InternationalCourse[],
  similar: InternationalCourse[]
): GroupedSearchResults {
  const exactDeduped = dedupeByIdKeepOrder(exact);
  const exactIdSet = new Set(exactDeduped.map((c) => c.id));
  const similarDeduped = dedupeByIdKeepOrder(similar).filter(
    (c) => !exactIdSet.has(c.id)
  );
  return dedupeByDisplayKeyExactThenSimilar(exactDeduped, similarDeduped);
}

/**
 * Niche predefinido: exato = mesma sub + preço (cumul.) + modalidade;
 * similares = mesma área + preço, outras sub-áreas, qualquer modalidade.
 * Texto livre: exato = área + preço + modalidade + match em nome/descrição/tags;
 * similares = restante na área + preço (não exatos).
 */
export function searchCourses(
  area: GeneralArea,
  subInput: SubAreaSearchInput,
  modality: Modality,
  priceRange: PriceRangeId
): GroupedSearchResults {
  if (INTERNATIONAL_COURSES.length === 0) {
    return { exact: [], similar: [] };
  }

  const inAreaAndPrice = (c: InternationalCourse) =>
    c.area === area && priceWithinUserCeiling(c.priceBrl, priceRange);

  if (subInput.type === "preset") {
    const { niche } = subInput;
    let exact = INTERNATIONAL_COURSES.filter(
      (c) =>
        c.area === area &&
        canonicalSubAreaKey(c.subArea) === canonicalSubAreaKey(niche) &&
        priceWithinUserCeiling(c.priceBrl, priceRange) &&
        c.modality === modality
    );
    exact = fillExactCourses(exact, area, modality, priceRange, niche, null);
    const exactIds = new Set(exact.map((c) => c.id));
    const similarRaw = INTERNATIONAL_COURSES.filter(
      (c) =>
        inAreaAndPrice(c) &&
        canonicalSubAreaKey(c.subArea) !== canonicalSubAreaKey(niche) &&
        !exactIds.has(c.id)
    );
    return finalizeGroupedSearchResults(
      sortByModalityFirst(exact, modality).slice(0, MAX_EXACT),
      sortByModalityFirst(similarRaw, modality).slice(0, MAX_SIMILAR)
    );
  }

  const q = subInput.query;
  if (normalize(q).length < 2) {
    return { exact: [], similar: [] };
  }

  let exact = INTERNATIONAL_COURSES.filter(
    (c) =>
      inAreaAndPrice(c) &&
      c.modality === modality &&
      courseMatchesFreeText(c, q)
  );
  exact = fillExactCourses(exact, area, modality, priceRange, null, q);
  const exactIds = new Set(exact.map((c) => c.id));
  const similarRaw = INTERNATIONAL_COURSES.filter(
    (c) => inAreaAndPrice(c) && !exactIds.has(c.id)
  );
  return finalizeGroupedSearchResults(
    sortByModalityFirst(exact, modality).slice(0, MAX_EXACT),
    sortByModalityFirst(similarRaw, modality).slice(0, MAX_SIMILAR)
  );
}

export function formatPriceBrl(value: number): string {
  if (value === 0) return "Gratuito";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
