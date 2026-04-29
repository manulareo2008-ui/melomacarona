import type { GeneralArea } from "@/lib/domain";

export type RiasecType =
  | "realistic"
  | "investigative"
  | "artistic"
  | "social"
  | "enterprising"
  | "conventional";

export type VocationalQuestion = {
  id: string;
  statement: string;
  type: RiasecType;
};

export const VOCATIONAL_QUESTIONS: VocationalQuestion[] = [
  { id: "q1", statement: "Gosto de montar, consertar ou testar equipamentos.", type: "realistic" },
  { id: "q2", statement: "Prefiro atividades práticas em vez de apenas teoria.", type: "realistic" },
  { id: "q3", statement: "Tenho interesse por projetos de engenharia e construção.", type: "realistic" },
  { id: "q4", statement: "Me vejo trabalhando com operações e processos técnicos.", type: "realistic" },
  { id: "q5", statement: "Curto resolver problemas concretos com ferramentas e métodos.", type: "realistic" },
  { id: "q6", statement: "Sinto motivação ao ver um resultado técnico tangível.", type: "realistic" },

  { id: "q7", statement: "Tenho interesse em analisar dados e resolver problemas complexos.", type: "investigative" },
  { id: "q8", statement: "Gosto de pesquisar causas, hipóteses e explicações técnicas.", type: "investigative" },
  { id: "q9", statement: "Me identifico com lógica, investigação e pensamento crítico.", type: "investigative" },
  { id: "q10", statement: "Sinto curiosidade por ciência, tecnologia e inovação.", type: "investigative" },
  { id: "q11", statement: "Tenho facilidade para aprender assuntos analíticos.", type: "investigative" },
  { id: "q12", statement: "Gosto de estudar antes de tomar decisões importantes.", type: "investigative" },

  { id: "q13", statement: "Sinto prazer em criar design, arte, música ou conteúdo visual.", type: "artistic" },
  { id: "q14", statement: "Quero trabalhar com criatividade e inovação visual.", type: "artistic" },
  { id: "q15", statement: "Gosto de explorar ideias originais e formas diferentes de expressão.", type: "artistic" },
  { id: "q16", statement: "Me identifico com áreas que valorizam estética e storytelling.", type: "artistic" },
  { id: "q17", statement: "Sinto energia ao criar algo autoral.", type: "artistic" },
  { id: "q18", statement: "Prefiro ambientes profissionais menos rígidos e mais criativos.", type: "artistic" },

  { id: "q19", statement: "Me sinto bem orientando, ensinando ou ajudando pessoas.", type: "social" },
  { id: "q20", statement: "Tenho interesse em saúde, comportamento e desenvolvimento humano.", type: "social" },
  { id: "q21", statement: "Gosto de atividades com colaboração e impacto social.", type: "social" },
  { id: "q22", statement: "Tenho empatia e escuta ativa em conversas difíceis.", type: "social" },
  { id: "q23", statement: "Sinto propósito ao apoiar o crescimento de outras pessoas.", type: "social" },
  { id: "q24", statement: "Prefiro trabalhar em funções com interação humana frequente.", type: "social" },

  { id: "q25", statement: "Gosto de liderar projetos, vender ideias e negociar.", type: "enterprising" },
  { id: "q26", statement: "Me identifico com empreendedorismo e impacto em resultados.", type: "enterprising" },
  { id: "q27", statement: "Tenho facilidade para convencer pessoas com argumentos.", type: "enterprising" },
  { id: "q28", statement: "Sinto motivação por metas e crescimento profissional.", type: "enterprising" },
  { id: "q29", statement: "Gosto de tomar iniciativa e assumir responsabilidade por decisões.", type: "enterprising" },
  { id: "q30", statement: "Quero atuar em contextos de negócios, vendas ou gestão.", type: "enterprising" },

  { id: "q31", statement: "Tenho facilidade com organização, rotinas e planejamento.", type: "conventional" },
  { id: "q32", statement: "Curto trabalhar com processos, métricas e controle de qualidade.", type: "conventional" },
  { id: "q33", statement: "Me sinto confortável em ambientes estruturados e com regras claras.", type: "conventional" },
  { id: "q34", statement: "Tenho atenção a detalhes e precisão em tarefas.", type: "conventional" },
  { id: "q35", statement: "Gosto de planejar etapas e acompanhar execução.", type: "conventional" },
  { id: "q36", statement: "Prefiro trabalhar com previsibilidade e organização.", type: "conventional" },
];

export const RIASEC_LABELS: Record<RiasecType, string> = {
  realistic: "Realista",
  investigative: "Investigativo",
  artistic: "Artístico",
  social: "Social",
  enterprising: "Empreendedor",
  conventional: "Convencional",
};

const RIASEC_EXPLANATIONS: Record<RiasecType, string> = {
  realistic: "Você tende a preferir desafios técnicos e práticos, com foco em execução e resultado concreto.",
  investigative:
    "Seu perfil valoriza análise, pesquisa e resolução de problemas complexos com pensamento crítico.",
  artistic:
    "Você demonstra forte inclinação criativa, com interesse em expressão autoral, design e inovação estética.",
  social:
    "Seu perfil se destaca na interação humana, empatia e contribuição para o desenvolvimento de outras pessoas.",
  enterprising:
    "Você tende a buscar protagonismo, liderança e geração de resultados em ambientes dinâmicos de negócio.",
  conventional:
    "Seu perfil valoriza organização, método e consistência, com excelente aderência a processos estruturados.",
};

const PRIORITY_NICHES_BY_AREA_AND_TYPE: Partial<
  Record<GeneralArea, Partial<Record<RiasecType, string[]>>>
> = {
  technology: {
    investigative: ["data_ml", "software_programming", "cloud_infrastructure_networks"],
    realistic: ["cloud_infrastructure_networks", "cybersecurity_devops_automation"],
    artistic: ["ux_ui_product", "frontend_web"],
  },
  health: {
    social: ["nursing_clinical_care", "health_education_communication", "wellbeing_mental_health"],
    investigative: ["epidemiology_public_health", "health_management_policy"],
  },
  arts_design: {
    artistic: ["visual_arts_illustration_identity", "animation_games_interactive_arts", "audiovisual_cinema_photography_media"],
    enterprising: ["fashion_aesthetics_branding", "storytelling_screenwriting_culture"],
  },
  business_admin: {
    enterprising: ["sales_negotiation_customer_success", "entrepreneurship_innovation_business", "leadership_people_operations"],
    conventional: ["finance_control_budget", "strategy_quality_processes"],
    investigative: ["digital_marketing_content_analytics"],
  },
  engineering: {
    realistic: ["civil_construction_budgeting", "mechanical_materials_industrial", "infrastructure_installations_resources"],
    investigative: ["automation_robotics_industry4", "energy_sustainability_environment"],
    conventional: ["projects_standards_safety"],
  },
  humanities: {
    social: ["communication_public_speaking", "psychology_behavior_development"],
    conventional: ["law_ethics_citizenship", "languages_reading_academics"],
    artistic: ["philosophy_critical_humanities", "sociology_politics_society"],
  },
};

export function calculateRiasecScores(
  answers: Record<string, number>
): Record<RiasecType, number> {
  const scores: Record<RiasecType, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  for (const q of VOCATIONAL_QUESTIONS) {
    scores[q.type] += answers[q.id] ?? 0;
  }
  return scores;
}

export function mapRiasecToGeneralArea(
  scores: Record<RiasecType, number>
): GeneralArea {
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = ordered[0]?.[0] as RiasecType | undefined;

  const map: Record<RiasecType, GeneralArea> = {
    realistic: "engineering",
    investigative: "technology",
    artistic: "arts_design",
    social: "health",
    enterprising: "business_admin",
    conventional: "humanities",
  };

  return top ? map[top] : "technology";
}

export function getTopRiasecProfiles(
  scores: Record<RiasecType, number>,
  count = 3
): Array<{ type: RiasecType; label: string; score: number }> {
  return (Object.keys(scores) as RiasecType[])
    .map((type) => ({
      type,
      label: RIASEC_LABELS[type],
      score: scores[type],
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function buildVocationalExplanation(
  topProfiles: Array<{ type: RiasecType; label: string; score: number }>,
  suggestedArea: GeneralArea
): string {
  const first = topProfiles[0];
  const second = topProfiles[1];
  const third = topProfiles[2];
  if (!first || !second || !third) {
    return "Seu resultado indica boa aderência à área sugerida. Recomendamos explorar os nichos prioritários para aprofundar a decisão.";
  }
  return [
    `Seu perfil dominante é ${first.label}, seguido por ${second.label} e ${third.label}.`,
    RIASEC_EXPLANATIONS[first.type],
    `Por isso, a área ${suggestedArea} tende a oferecer maior alinhamento entre motivação, estilo de aprendizagem e potencial de carreira.`,
  ].join(" ");
}

export function prioritizeNichesForArea(
  area: GeneralArea,
  subAreas: string[],
  topProfiles: Array<{ type: RiasecType; label: string; score: number }>
): string[] {
  const preferred: string[] = [];
  for (const profile of topProfiles) {
    const mapped = PRIORITY_NICHES_BY_AREA_AND_TYPE[area]?.[profile.type] ?? [];
    for (const niche of mapped) {
      if (subAreas.includes(niche) && !preferred.includes(niche)) {
        preferred.push(niche);
      }
    }
  }

  const rest = subAreas.filter((item) => !preferred.includes(item));
  return [...preferred, ...rest];
}
