/** Áreas gerais, sub-áreas e opções de filtro do assistente. */

export const GENERAL_AREAS = [
  "technology",
  "health",
  "humanities",
  "arts_design",
  "business_admin",
  "engineering",
] as const;

export type GeneralArea = (typeof GENERAL_AREAS)[number];

/**
 * 6 nichos predefinidos por área (cards no passo 2) + 7.ª opção
 * `OUTRA_ESPECIFICA` com texto livre.
 */
export const OUTRA_ESPECIFICA = "outra-especifica" as const;
export const OUTRA_ESPECIFICA_LABEL = "other_specific";

export const SUB_AREAS: Record<GeneralArea, string[]> = {
  technology: [
    "software_programming",
    "data_ml",
    "ux_ui_product",
    "frontend_web",
    "cloud_infrastructure_networks",
    "cybersecurity_devops_automation",
  ],
  health: [
    "nursing_clinical_care",
    "wellbeing_mental_health",
    "health_management_policy",
    "epidemiology_public_health",
    "nutrition_health_habits",
    "health_education_communication",
  ],
  humanities: [
    "communication_public_speaking",
    "psychology_behavior_development",
    "law_ethics_citizenship",
    "languages_reading_academics",
    "philosophy_critical_humanities",
    "sociology_politics_society",
  ],
  arts_design: [
    "visual_arts_illustration_identity",
    "audiovisual_cinema_photography_media",
    "music_audio_performance_production",
    "animation_games_interactive_arts",
    "fashion_aesthetics_branding",
    "storytelling_screenwriting_culture",
  ],
  business_admin: [
    "sales_negotiation_customer_success",
    "digital_marketing_content_analytics",
    "finance_control_budget",
    "entrepreneurship_innovation_business",
    "leadership_people_operations",
    "strategy_quality_processes",
  ],
  engineering: [
    "civil_construction_budgeting",
    "mechanical_materials_industrial",
    "energy_sustainability_environment",
    "automation_robotics_industry4",
    "projects_standards_safety",
    "infrastructure_installations_resources",
  ],
};

/**
 * Teto de preço em BRL (campo `priceBrl` do catálogo), cumulativo:
 * p.ex. "Até R$ 500" inclui gratuitos, até R$ 100, etc. `null` = sem teto.
 */
export const PRICE_OPTIONS = [
  { id: "onlyFree" as const, label: "Apenas cursos gratuitos", maxBrl: 0 as number },
  { id: "max100" as const, label: "Até R$ 100,00 (inclui gratuitos)", maxBrl: 100 },
  { id: "max500" as const, label: "Até R$ 500,00 (inclui tudo abaixo)", maxBrl: 500 },
  { id: "max1000" as const, label: "Até R$ 1.000,00 (inclui tudo abaixo)", maxBrl: 1_000 },
  {
    id: "unlimited" as const,
    label: "Sem limite (qualquer investimento)",
    maxBrl: null,
  },
] as const;

export type PriceRangeId = (typeof PRICE_OPTIONS)[number]["id"];
export type Modality = "Presencial" | "Online" | "Híbrido";

/** Filtro cumulativo: `maxBrl === 0` = só gratuitos; `null` = qualquer preço. */
export function priceWithinUserCeiling(
  priceBrl: number,
  range: PriceRangeId
): boolean {
  const option = PRICE_OPTIONS.find((o) => o.id === range);
  if (!option) return false;
  if (option.maxBrl === null) return true;
  if (option.maxBrl === 0) return priceBrl === 0;
  return priceBrl <= option.maxBrl;
}
