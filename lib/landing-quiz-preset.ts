import type { GeneralArea } from "@/lib/domain";

/** Slugs usados em `/quiz?tema=` e na home (Explore por categoria). */
export type LandingQuizTemaSlug =
  | "programacao"
  | "design"
  | "dados"
  | "negocios"
  | "marketing"
  | "produto";

export type LandingQuizPreset = {
  area: GeneralArea;
  /** Chave de `SUB_AREAS[area]` ou `OUTRA_ESPECIFICA`. */
  subChoice: string;
};

const VALID_SLUGS = new Set<string>([
  "programacao",
  "design",
  "dados",
  "negocios",
  "marketing",
  "produto",
]);

/**
 * Mapeia o botão da landing para área + nicho padrão (etapa “tema” do quiz).
 */
export function parseLandingQuizPreset(
  raw: string | null | undefined
): LandingQuizPreset | null {
  const slug = raw?.trim().toLowerCase();
  if (!slug || !VALID_SLUGS.has(slug)) return null;

  switch (slug as LandingQuizTemaSlug) {
    case "programacao":
      return { area: "technology", subChoice: "software_programming" };
    case "design":
      return { area: "arts_design", subChoice: "visual_arts_illustration_identity" };
    case "dados":
      return { area: "technology", subChoice: "data_ml" };
    case "negocios":
      return {
        area: "business_admin",
        subChoice: "entrepreneurship_innovation_business",
      };
    case "marketing":
      return {
        area: "business_admin",
        subChoice: "digital_marketing_content_analytics",
      };
    case "produto":
      return { area: "technology", subChoice: "ux_ui_product" };
    default:
      return null;
  }
}
