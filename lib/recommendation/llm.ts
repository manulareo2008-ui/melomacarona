import type { InternationalCourse } from "@/lib/coursesData";
import type { RecommendationRequest } from "@/lib/recommendation/types";

type LlmProvider = "openai" | "gemini";

type LlmEnrichment = {
  scoreAdjustment: number;
  pitch: string;
};

function parseProvider(value: string | undefined): LlmProvider {
  return value?.toLowerCase() === "gemini" ? "gemini" : "openai";
}

function hasLlmConfig(): boolean {
  return Boolean(process.env.LLM_API_KEY);
}

async function callOpenAi(prompt: string): Promise<string> {
  const model = process.env.LLM_MODEL ?? "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      input: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
  };

  return data.output_text ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const model = process.env.LLM_MODEL ?? "gemini-1.5-pro";
  const apiKey = process.env.LLM_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function buildPrompt(input: RecommendationRequest, course: InternationalCourse): string {
  return [
    "Voce e um motor de recomendacao de cursos.",
    "Responda SOMENTE em JSON valido com chaves: scoreAdjustment, pitch.",
    "scoreAdjustment deve ser inteiro de -15 a 15.",
    "pitch em pt-BR, maximo 240 caracteres, personalizado.",
    "",
    `Perfil do usuario: area=${input.area}; niche=${input.niche}; budgetMaxBrl=${input.budgetMaxBrl}; modalidade=${input.modality}; objetivo=${input.personalGoal ?? ""}`,
    `Curso: nome=${course.name}; descricao=${course.shortDescription}; sobre=${course.about}; tags=${course.tags.join(", ")}; modalidade=${course.modality}; preco=${course.priceBrl}`,
  ].join("\n");
}

function parseLlmOutput(raw: string): LlmEnrichment | null {
  try {
    const clean = raw.trim().replace(/^```json/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(clean) as { scoreAdjustment?: number; pitch?: string };
    if (typeof parsed.scoreAdjustment !== "number") return null;
    if (typeof parsed.pitch !== "string" || !parsed.pitch.trim()) return null;
    const bounded = Math.max(-15, Math.min(15, Math.round(parsed.scoreAdjustment)));
    return { scoreAdjustment: bounded, pitch: parsed.pitch.trim() };
  } catch {
    return null;
  }
}

export async function enrichWithLlm(
  input: RecommendationRequest,
  course: InternationalCourse
): Promise<LlmEnrichment | null> {
  if (!hasLlmConfig()) return null;
  const provider = parseProvider(process.env.LLM_PROVIDER);
  const prompt = buildPrompt(input, course);

  try {
    const raw =
      provider === "gemini" ? await callGemini(prompt) : await callOpenAi(prompt);
    return parseLlmOutput(raw);
  } catch {
    return null;
  }
}
