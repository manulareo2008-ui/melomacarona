import { getAllActiveCourses, toInternationalCourse } from "@/lib/supabase/courses";
import { enrichWithLlm } from "@/lib/recommendation/llm";
import { computeAffinityScore, computePillarScores } from "@/lib/recommendation/scoring";
import type {
  RecommendedCourse,
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/recommendation/types";

const DEFAULT_LIMIT = 8;
const LLM_ENRICH_LIMIT = 5;

function defaultPitch(input: RecommendationRequest): string {
  const personalGoalText = input.personalGoal?.trim()
    ? ` e conversa com seu objetivo: "${input.personalGoal.trim()}"`
    : "";

  return `Este curso e ideal para voce porque tem aderencia ao nicho "${input.niche}"${personalGoalText} e respeita seu budget de ate R$ ${input.budgetMaxBrl}.`;
}

export async function recommendCourses(
  input: RecommendationRequest
): Promise<RecommendationResponse> {
  const limit = Math.max(1, Math.min(20, input.limit ?? DEFAULT_LIMIT));
  const courses = (await getAllActiveCourses()).map(toInternationalCourse);

  // Regra inegociavel de negocio: nunca sugerir curso acima do teto.
  const budgetCompliant = courses.filter((course) => course.priceBrl <= input.budgetMaxBrl);

  const scored = budgetCompliant
    .map((course) => {
      const pillarScores = computePillarScores(course, input);
      const affinityScore = computeAffinityScore(pillarScores);
      const recommendation: RecommendedCourse = {
        course,
        affinityScore,
        pillarScores,
        recommendationPitch: defaultPitch(input),
      };
      return recommendation;
    })
    .sort((a, b) => b.affinityScore - a.affinityScore)
    .slice(0, limit);

  let usedLlm = false;
  const llmEnriched: RecommendedCourse[] = [];

  for (let i = 0; i < scored.length; i += 1) {
    const current = scored[i];
    if (!current) continue;

    if (i >= LLM_ENRICH_LIMIT) {
      llmEnriched.push(current);
      continue;
    }

    const llmData = await enrichWithLlm(input, current.course);
    if (!llmData) {
      llmEnriched.push(current);
      continue;
    }

    usedLlm = true;
    llmEnriched.push({
      ...current,
      affinityScore: Math.max(0, Math.min(100, current.affinityScore + llmData.scoreAdjustment)),
      recommendationPitch: llmData.pitch,
    });
  }

  const recommendations = llmEnriched.sort((a, b) => b.affinityScore - a.affinityScore);

  return {
    input,
    totalCandidates: budgetCompliant.length,
    usedLlm,
    recommendations,
  };
}
