import type { ExternalCourseRecommendation } from "@/lib/courseRecommendationApi";
import type { GeneralArea } from "@/lib/domain";
import type { InternationalCourse } from "@/lib/coursesData";
import { getCourseById } from "@/lib/coursesData";
import type { AreaLinksMap } from "@/lib/partnerAreaUrl";

export type WizardPatrocinadorRow = {
  id: string;
  nome: string;
  tipo: string;
  logo_url: string | null;
  site_url: string | null;
  cidades_cobertura: string[] | null;
  estados_cobertura?: string[] | null;
  areas_foco: string[] | null;
  links_por_area?: AreaLinksMap | null;
};

const AREA_KEYWORDS: Record<string, string> = {
  technology: "tecnologia software programacao dados digital cloud devops seguranca",
  health: "saude enfermagem clinica nutricao bem estar",
  humanities: "humanas comunicacao psicologia educacao",
  arts_design: "arte design ux ui criativo midia",
  business_admin: "negocios gestao administracao marketing empreendedor",
  engineering: "engenharia operacoes infraestrutura industrial",
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(value: string): Set<string> {
  return new Set(
    normalizeText(value)
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2)
  );
}

function tokenOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) {
    if (b.has(t)) n += 1;
  }
  return n;
}

export function patrocinadorMatchesUserRegion(
  p: WizardPatrocinadorRow,
  userState: string,
  userCity: string
): boolean {
  const uf = userState.trim().toUpperCase();
  if (uf) {
    const estados = p.estados_cobertura ?? [];
    if (estados.some((e) => e.trim().toUpperCase() === uf)) return true;
  }
  const city = userCity.trim().toLowerCase();
  if (city) {
    const cidades = p.cidades_cobertura ?? [];
    if (cidades.some((c) => c.trim().toLowerCase() === city)) return true;
  }
  return false;
}

export function buildWizardCoursePool(
  exactMatches: InternationalCourse[],
  externalRecommendations: ExternalCourseRecommendation[],
  similarMatches: InternationalCourse[]
): InternationalCourse[] {
  const ranked = [...externalRecommendations].sort(
    (a, b) => b.score_afinidade - a.score_afinidade
  );
  const fromExternal = ranked
    .map((r) => getCourseById(r.id))
    .filter((c): c is InternationalCourse => Boolean(c));

  const seen = new Set<string>();
  const out: InternationalCourse[] = [];
  for (const c of [...exactMatches, ...fromExternal, ...similarMatches.slice(0, 6)]) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}

export function patrocinadorMatchesRecommendedCourses(
  p: WizardPatrocinadorRow,
  coursePool: InternationalCourse[],
  userArea: GeneralArea | ""
): boolean {
  if (coursePool.length === 0) return false;
  const focus = p.areas_foco ?? [];
  if (userArea && focus.includes(userArea)) return true;

  const sponsorExtra = focus.map((k) => AREA_KEYWORDS[k] ?? k).join(" ");
  const sponsorTokens = tokenize(`${p.nome} ${sponsorExtra}`);

  for (const c of coursePool) {
    if (focus.includes(c.area)) return true;
    const courseTokens = tokenize(
      `${c.name} ${c.shortDescription} ${c.subArea} ${c.institution} ${(c.tags ?? []).join(" ")}`
    );
    if (tokenOverlap(sponsorTokens, courseTokens) >= 2) return true;
    const instTokens = tokenize(c.institution);
    if (instTokens.size && tokenOverlap(sponsorTokens, instTokens) >= 1) return true;
  }
  return false;
}

export function filterPatrocinadoresForWizard(
  all: WizardPatrocinadorRow[],
  opts: {
    userState: string;
    userCity: string;
    userArea: GeneralArea | "";
    isLoadingRecommendations: boolean;
    coursePool: InternationalCourse[];
  }
): WizardPatrocinadorRow[] {
  return all.filter((p) => {
    const region = patrocinadorMatchesUserRegion(p, opts.userState, opts.userCity);
    if (opts.isLoadingRecommendations) {
      return region;
    }
    const courses = patrocinadorMatchesRecommendedCourses(p, opts.coursePool, opts.userArea);
    return region || courses;
  });
}
