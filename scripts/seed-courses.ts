import { config } from "dotenv";

config({ path: ".env.local" });

type CursoRow = {
  id: string;
  nome: string;
  descricao_curta: string;
  descricao_completa: string;
  instituicao: string;
  plataforma: string;
  area: string;
  sub_area: string;
  nivel: string;
  modalidade: string;
  publico_alvo: "ambos";
  preco_brl: number;
  preco_display: string;
  duracao: string;
  prerequisitos: string[];
  url_destino: string;
  url_status: "active";
  internacional: boolean;
  pais_origem: string;
  tags: string[];
  patrocinador_id: null;
  fonte: "manual";
  ativo: true;
};

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

async function main() {
  const { INTERNATIONAL_COURSES } = await import("../lib/coursesData");
  const { createServerSupabaseClient } = await import("../lib/supabase/server");

  const supabase = createServerSupabaseClient();

  const rows: CursoRow[] = INTERNATIONAL_COURSES.map((course) => ({
    id: course.id,
    nome: course.name,
    descricao_curta: course.shortDescription,
    descricao_completa: course.about,
    instituicao: course.institution,
    plataforma: course.platform,
    area: course.area,
    sub_area: course.subArea,
    nivel: course.level,
    modalidade: course.modality,
    publico_alvo: "ambos",
    preco_brl: course.priceBrl,
    preco_display: course.priceDisplay,
    duracao: course.duration,
    prerequisitos: course.prerequisites,
    url_destino: course.registrationUrl,
    url_status: "active",
    internacional: course.isInternational,
    pais_origem: course.originCountry,
    tags: course.tags,
    patrocinador_id: null,
    fonte: "manual",
    ativo: true,
  }));

  const batches = chunk(rows, 10);
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    if (!batch) continue;
    let batchInserted = 0;

    const { error } = await supabase.from("cursos").upsert(batch, { onConflict: "id" });

    if (!error) {
      inserted += batch.length;
      batchInserted = batch.length;
      console.log(`Batch ${i + 1}/${batches.length}: ${batchInserted} cursos inseridos`);
      continue;
    }

    for (const course of batch) {
      const { error: rowError } = await supabase.from("cursos").upsert(course, { onConflict: "id" });
      if (rowError) {
        errors += 1;
        console.error(`[ERRO] curso ${course.id}: ${rowError.message}`);
      } else {
        inserted += 1;
        batchInserted += 1;
      }
    }

    console.log(`Batch ${i + 1}/${batches.length}: ${batchInserted} cursos inseridos`);
    console.error(`[ERRO] Batch ${i + 1}/${batches.length}: ${normalizeError(error)}`);
  }

  console.log(`Seed completo: ${inserted} cursos inseridos, ${errors} erros`);
}

main().catch((error) => {
  console.error("Falha ao executar seed-courses:", normalizeError(error));
  process.exit(1);
});
