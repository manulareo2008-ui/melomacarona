import type { InternationalCourse } from "@/lib/coursesData";
import type { GeneralArea, Modality } from "@/lib/domain";
import type { PillarScoreBreakdown } from "@/lib/recommendation/types";

const WEIGHTS = {
  area: 0.25,
  niche: 0.45,
  price: 0.2,
  modality: 0.1,
} as const;

const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  "ia generativa": ["llm", "genai", "prompt", "transformer", "gpt"],
  "ui ux": ["interface", "prototipo", "figma", "usabilidade", "design system"],
  "financas startups": ["fluxo de caixa", "valuation", "mvp", "unit economics", "cap table"],
  dados: ["analytics", "machine learning", "sql", "python", "estatistica"],
  cloud: ["aws", "azure", "gcp", "infraestrutura", "devops"],
};

function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

function buildSemanticTokens(rawNiche: string): Set<string> {
  const tokens = tokenize(rawNiche);
  const expanded = new Set(tokens);
  const nicheNormalized = normalize(rawNiche);

  for (const [key, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
    if (!nicheNormalized.includes(key)) continue;
    for (const synonym of synonyms) {
      for (const token of tokenize(synonym)) {
        expanded.add(token);
      }
    }
  }

  return expanded;
}

function tokenizeCourseText(course: InternationalCourse): Set<string> {
  const joined = [
    course.name,
    course.shortDescription,
    course.about,
    course.subArea,
    ...course.tags,
  ].join(" ");

  return new Set(tokenize(joined));
}

function scoreArea(courseArea: GeneralArea, selectedArea: GeneralArea): number {
  return courseArea === selectedArea ? 100 : 0;
}

function scoreModality(courseModality: Modality, selectedModality: Modality): number {
  return courseModality === selectedModality ? 100 : 0;
}

function scorePrice(priceBrl: number, budgetMaxBrl: number): number {
  if (priceBrl > budgetMaxBrl) return 0;
  if (budgetMaxBrl <= 0) return priceBrl === 0 ? 100 : 0;
  const ratio = priceBrl / budgetMaxBrl;
  const score = Math.max(0, Math.round((1 - ratio) * 100));
  return score;
}

function scoreNiche(course: InternationalCourse, niche: string): number {
  const nicheTokens = buildSemanticTokens(niche);
  if (nicheTokens.size === 0) return 0;

  const courseTokens = tokenizeCourseText(course);
  let overlap = 0;
  for (const token of nicheTokens) {
    if (courseTokens.has(token)) overlap += 1;
  }

  return Math.round((overlap / nicheTokens.size) * 100);
}

export function computePillarScores(
  course: InternationalCourse,
  input: {
    area: GeneralArea;
    niche: string;
    budgetMaxBrl: number;
    modality: Modality;
  }
): PillarScoreBreakdown {
  return {
    area: scoreArea(course.area, input.area),
    niche: scoreNiche(course, input.niche),
    price: scorePrice(course.priceBrl, input.budgetMaxBrl),
    modality: scoreModality(course.modality, input.modality),
  };
}

export function computeAffinityScore(scores: PillarScoreBreakdown): number {
  const weighted =
    scores.area * WEIGHTS.area +
    scores.niche * WEIGHTS.niche +
    scores.price * WEIGHTS.price +
    scores.modality * WEIGHTS.modality;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}
