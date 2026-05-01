import { config } from "dotenv";

config({ path: ".env.local" });

function normalizeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function main() {
  const { createServerSupabaseClient } = await import("../lib/supabase/server");
  const supabase = createServerSupabaseClient();

  const { count: cursosCount, error: cursosCountError } = await supabase
    .from("cursos")
    .select("*", { count: "exact", head: true });

  if (cursosCountError) {
    throw new Error(`Erro ao contar cursos: ${cursosCountError.message}`);
  }

  const { data: cursosList, error: cursosListError } = await supabase
    .from("cursos")
    .select("id, nome, area, url_status")
    .order("area", { ascending: true })
    .order("nome", { ascending: true });

  if (cursosListError) {
    throw new Error(`Erro ao listar cursos: ${cursosListError.message}`);
  }

  console.log(`Total de cursos: ${cursosCount ?? 0}`);
  console.log("\nLista de cursos (id | nome | area | url_status):");
  for (const curso of cursosList ?? []) {
    console.log(`- ${curso.id} | ${curso.nome} | ${curso.area} | ${curso.url_status}`);
  }

  const { count: clicksCount, error: clicksError } = await supabase
    .from("course_clicks")
    .select("*", { count: "exact", head: true });

  if (clicksError) {
    throw new Error(`Erro ao contar course_clicks: ${clicksError.message}`);
  }

  const { count: patrocinadoresCount, error: patrocinadoresError } = await supabase
    .from("patrocinadores")
    .select("*", { count: "exact", head: true });

  if (patrocinadoresError) {
    throw new Error(`Erro ao contar patrocinadores: ${patrocinadoresError.message}`);
  }

  console.log(`\nTotal de course_clicks: ${clicksCount ?? 0}`);
  console.log(`Total de patrocinadores: ${patrocinadoresCount ?? 0}`);
}

main().catch((error) => {
  console.error("Falha ao verificar seed:", normalizeError(error));
  process.exit(1);
});
