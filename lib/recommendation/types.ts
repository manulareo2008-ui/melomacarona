import type { GeneralArea, Modality } from "@/lib/domain";
import type { InternationalCourse } from "@/lib/coursesData";

export type RecommendationRequest = {
  area: GeneralArea;
  niche: string;
  budgetMaxBrl: number;
  modality: Modality;
  personalGoal?: string;
  limit?: number;
};

export type PillarScoreBreakdown = {
  area: number;
  niche: number;
  price: number;
  modality: number;
};

export type RecommendedCourse = {
  course: InternationalCourse;
  affinityScore: number;
  pillarScores: PillarScoreBreakdown;
  recommendationPitch: string;
};

export type RecommendationResponse = {
  input: RecommendationRequest;
  totalCandidates: number;
  usedLlm: boolean;
  recommendations: RecommendedCourse[];
};
