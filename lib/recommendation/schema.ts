import { z } from "zod";
import { GENERAL_AREAS, type Modality } from "@/lib/domain";

const MODALITIES: Modality[] = ["Presencial", "Online", "Híbrido"];

export const KNOWLEDGE_LEVELS = [
  "iniciante",
  "intermediario",
  "avancado",
] as const;

export const recommendationInputSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  idade: z.number().int().min(12).max(120),
  area: z.enum(GENERAL_AREAS),
  nicho: z.string().trim().min(2).max(120),
  modalidade: z.enum(MODALITIES),
  budget: z.number().finite().min(0).max(100_000),
  nivel_conhecimento: z.enum(KNOWLEDGE_LEVELS),
  objetivos: z.string().trim().min(3).max(700),
  texto_livre: z.string().trim().max(700).optional().default(""),
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;

export const recommendationOutputSchema = z.object({
  recomendacoes: z.array(
    z.object({
      id: z.string().min(1),
      nome: z.string().min(1),
      categoria: z.string().min(1),
      preco: z.number().finite().min(0),
      cargaHoraria: z.string().min(1),
      linkAfiliado: z.string().min(1),
      score_afinidade: z.number().int().min(0).max(100),
      pitch_venda: z.string().min(1),
    })
  ),
  metadata: z.object({
    provider: z.enum(["anthropic", "local", "mock-external-api"]),
    total_cursos_pre_filtrados: z.number().int().min(0),
  }),
});

export type RecommendationOutput = z.infer<typeof recommendationOutputSchema>;
