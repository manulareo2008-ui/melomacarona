import { INTERNATIONAL_COURSES } from "@/lib/coursesData";
import { GENERAL_AREAS } from "@/lib/domain";
import { parseLandingQuizPreset, type LandingQuizTemaSlug } from "@/lib/landing-quiz-preset";
import ptBR from "@/locales/pt-BR.json";

/*
 * Fatos da home tirados do catálogo real. Só os componentes de servidor importam
 * este módulo: o catálogo não vai para o bundle do cliente, só os resumos.
 */

/** As 6 áreas da home, na ordem da lista (slugs de `/quiz?tema=`). */
const THEMES: { name: string; slug: LandingQuizTemaSlug }[] = [
  { name: "Programação", slug: "programacao" },
  { name: "Design", slug: "design" },
  { name: "Dados & IA", slug: "dados" },
  { name: "Negócios", slug: "negocios" },
  { name: "Marketing", slug: "marketing" },
  { name: "Produto", slug: "produto" },
];

const EXAMPLES_SHOWN = 3;

export type AreaSummary = {
  name: string;
  slug: string;
  /** Nicho em que o teste já começa ao clicar na área. */
  niche: string;
  /** Ex.: "3 cursos, de grátis a R$ 350". */
  summary: string;
  examples: { name: string; institution: string; price: string }[];
  /** Cursos do nicho além dos exemplos. */
  more: number;
};

export type ProofFacts = {
  courses: number;
  free: number;
  areas: number;
  institutions: number;
};

type Categories = Record<string, { subareas: Record<string, { label: string }> }>;

function price(value: number) {
  return value === 0 ? "Gratuito" : `R$ ${value.toLocaleString("pt-BR")}`;
}

function priceRange(prices: number[]) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (max === 0) return prices.length === 1 ? "gratuito" : "todos gratuitos";
  if (min === max) return price(max);
  return `de ${min === 0 ? "grátis" : price(min)} a ${price(max)}`;
}

export function getAreaSummaries(): AreaSummary[] {
  const categories = ptBR.categories as Categories;
  return THEMES.map(({ name, slug }) => {
    const preset = parseLandingQuizPreset(slug);
    const niche = preset ? categories[preset.area]?.subareas[preset.subChoice]?.label ?? "" : "";
    const courses = INTERNATIONAL_COURSES.filter(
      (course) => course.area === preset?.area && course.subArea === niche,
    );
    const count = `${courses.length} ${courses.length === 1 ? "curso" : "cursos"}`;
    return {
      name,
      slug,
      niche,
      summary: courses.length ? `${count}, ${priceRange(courses.map((course) => course.priceBrl))}` : "",
      examples: courses.slice(0, EXAMPLES_SHOWN).map((course) => ({
        name: course.name,
        institution: course.institution,
        price: price(course.priceBrl),
      })),
      more: Math.max(0, courses.length - EXAMPLES_SHOWN),
    };
  });
}

/** "MIT (via edX e parceiros)" e "MIT (Bootcamps / parceiro)" contam como uma instituição só. */
function institutionName(raw: string) {
  return raw.replace(/\s*\(.*\)\s*$/, "");
}

export function getProofFacts(): ProofFacts {
  const institutions = new Set(INTERNATIONAL_COURSES.map((course) => institutionName(course.institution)));
  return {
    courses: INTERNATIONAL_COURSES.length,
    free: INTERNATIONAL_COURSES.filter((course) => course.priceBrl === 0).length,
    areas: GENERAL_AREAS.length,
    institutions: institutions.size,
  };
}
