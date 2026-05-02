import { NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Periodo = "hoje" | "7dias" | "30dias";

type DashboardData = {
  periodo: Periodo;
  resumo: {
    total_cliques: number;
    cliques_sucesso: number;
    cliques_falha: number;
    taxa_sucesso: number;
    total_quizzes: number;
    total_leads: number;
    total_cursos_ativos: number;
  };
  cursos_mais_clicados: Array<{
    curso_id: string;
    nome: string;
    area: string;
    total_cliques: number;
  }>;
  cliques_por_area: Array<{ area: string; total: number }>;
  cliques_por_cidade: Array<{
    cidade: string;
    estado: string;
    total: number;
  }>;
  quizzes_por_area: Array<{ area: string; total: number }>;
  cliques_por_dia: Array<{ dia: string; total: number }>;
};

function parsePeriodo(raw: string | null): Periodo {
  if (raw === "hoje" || raw === "7dias" || raw === "30dias") return raw;
  return "7dias";
}

function getInicioPeriodoIso(periodo: Periodo): string {
  const now = Date.now();
  if (periodo === "hoje") {
    const day = new Date().toISOString().split("T")[0];
    return `${day}T00:00:00Z`;
  }
  const days = periodo === "30dias" ? 30 : 7;
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function withNoCacheHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-cache");
  return response;
}

function emptyDashboard(periodo: Periodo): DashboardData {
  return {
    periodo,
    resumo: {
      total_cliques: 0,
      cliques_sucesso: 0,
      cliques_falha: 0,
      taxa_sucesso: 0,
      total_quizzes: 0,
      total_leads: 0,
      total_cursos_ativos: 0,
    },
    cursos_mais_clicados: [],
    cliques_por_area: [],
    cliques_por_cidade: [],
    quizzes_por_area: [],
    cliques_por_dia: [],
  };
}

function countByKey<T extends string | null>(
  rows: Array<Record<string, T>>,
  key: keyof (typeof rows)[number]
): Map<string, number> {
  const m = new Map<string, number>();
  for (const row of rows) {
    const v = row[key];
    if (v == null || String(v).trim() === "") continue;
    const k = String(v);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function toSortedEntries(
  m: Map<string, number>,
  limit?: number
): Array<{ key: string; total: number }> {
  const arr = [...m.entries()].map(([key, total]) => ({ key, total }));
  arr.sort((a, b) => b.total - a.total);
  return limit != null ? arr.slice(0, limit) : arr;
}

export async function GET(request: Request) {
  if (!(await isAdminSessionValid())) {
    return withNoCacheHeaders(
      NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    );
  }

  const { searchParams } = new URL(request.url);
  const periodo = parsePeriodo(searchParams.get("periodo"));
  const inicio = getInicioPeriodoIso(periodo);

  const data = emptyDashboard(periodo);

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (error) {
    console.error("[dashboard] Supabase client failed", error);
    return withNoCacheHeaders(
      NextResponse.json({ ok: true, data }, { status: 200 })
    );
  }

  try {
    const { count, error } = await supabase
      .from("course_clicks")
      .select("*", { count: "exact", head: true })
      .gte("criado_em", inicio);
    if (error) throw error;
    data.resumo.total_cliques = count ?? 0;
  } catch (error) {
    console.error("[dashboard] total_cliques", error);
  }

  try {
    const { count, error } = await supabase
      .from("course_clicks")
      .select("*", { count: "exact", head: true })
      .gte("criado_em", inicio)
      .eq("sucesso", true);
    if (error) throw error;
    data.resumo.cliques_sucesso = count ?? 0;
  } catch (error) {
    console.error("[dashboard] cliques_sucesso", error);
  }

  try {
    const { count, error } = await supabase
      .from("course_clicks")
      .select("*", { count: "exact", head: true })
      .gte("criado_em", inicio)
      .eq("sucesso", false);
    if (error) throw error;
    data.resumo.cliques_falha = count ?? 0;
  } catch (error) {
    console.error("[dashboard] cliques_falha", error);
  }

  const total = data.resumo.total_cliques;
  data.resumo.taxa_sucesso =
    total === 0 ? 0 : round1((data.resumo.cliques_sucesso / total) * 100);

  try {
    const { count, error } = await supabase
      .from("recomendacoes_ia")
      .select("*", { count: "exact", head: true })
      .gte("created_at", inicio);
    if (error) throw error;
    data.resumo.total_quizzes = count ?? 0;
  } catch (error) {
    console.error("[dashboard] total_quizzes", error);
  }

  try {
    const { count, error } = await supabase
      .from("marketing_leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", inicio);
    if (error) throw error;
    data.resumo.total_leads = count ?? 0;
  } catch (error) {
    console.error("[dashboard] total_leads", error);
  }

  try {
    const { count, error } = await supabase
      .from("cursos")
      .select("*", { count: "exact", head: true })
      .eq("ativo", true)
      .eq("url_status", "active");
    if (error) throw error;
    data.resumo.total_cursos_ativos = count ?? 0;
  } catch (error) {
    console.error("[dashboard] total_cursos_ativos", error);
  }

  try {
    const { data: clickRows, error } = await supabase
      .from("course_clicks")
      .select("curso_id")
      .gte("criado_em", inicio)
      .not("curso_id", "is", null);
    if (error) throw error;
    const byCurso = countByKey(
      (clickRows ?? []) as Array<{ curso_id: string | null }>,
      "curso_id"
    );
    const top = toSortedEntries(byCurso, 10);
    const ids = top.map((t) => t.key).filter(Boolean);
    let nomeById = new Map<string, { nome: string; area: string }>();
    if (ids.length > 0) {
      const { data: cursosRows, error: cErr } = await supabase
        .from("cursos")
        .select("id, nome, area")
        .in("id", ids);
      if (cErr) throw cErr;
      nomeById = new Map(
        (cursosRows ?? []).map((c: { id: string; nome: string; area: string }) => [
          c.id,
          { nome: c.nome ?? "", area: c.area ?? "" },
        ])
      );
    }
    data.cursos_mais_clicados = top.map((t) => {
      const meta = nomeById.get(t.key);
      return {
        curso_id: t.key,
        nome: meta?.nome ?? "",
        area: meta?.area ?? "",
        total_cliques: t.total,
      };
    });
  } catch (error) {
    console.error("[dashboard] cursos_mais_clicados", error);
    data.cursos_mais_clicados = [];
  }

  try {
    const { data: rows, error } = await supabase
      .from("course_clicks")
      .select("area")
      .gte("criado_em", inicio)
      .not("area", "is", null);
    if (error) throw error;
    const m = countByKey((rows ?? []) as Array<{ area: string | null }>, "area");
    data.cliques_por_area = toSortedEntries(m).map(({ key, total }) => ({
      area: key,
      total,
    }));
  } catch (error) {
    console.error("[dashboard] cliques_por_area", error);
    data.cliques_por_area = [];
  }

  try {
    const { data: rows, error } = await supabase
      .from("course_clicks")
      .select("cidade_usuario, estado_usuario")
      .gte("criado_em", inicio)
      .not("cidade_usuario", "is", null);
    if (error) throw error;
    const m = new Map<string, number>();
    for (const r of rows ?? []) {
      const row = r as { cidade_usuario: string | null; estado_usuario: string | null };
      const cidade = row.cidade_usuario?.trim();
      if (!cidade) continue;
      const estado = (row.estado_usuario ?? "").trim();
      const k = `${cidade}\u0000${estado}`;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    const sorted = [...m.entries()]
      .map(([k, total]) => {
        const [cidade, estado] = k.split("\u0000");
        return { cidade, estado, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
    data.cliques_por_cidade = sorted;
  } catch (error) {
    console.error("[dashboard] cliques_por_cidade", error);
    data.cliques_por_cidade = [];
  }

  try {
    const { data: rows, error } = await supabase
      .from("recomendacoes_ia")
      .select("area")
      .gte("created_at", inicio);
    if (error) throw error;
    const m = countByKey((rows ?? []) as Array<{ area: string | null }>, "area");
    data.quizzes_por_area = toSortedEntries(m).map(({ key, total }) => ({
      area: key,
      total,
    }));
  } catch (error) {
    console.error("[dashboard] quizzes_por_area", error);
    data.quizzes_por_area = [];
  }

  try {
    const { data: rows, error } = await supabase
      .from("course_clicks")
      .select("criado_em")
      .gte("criado_em", inicio);
    if (error) throw error;
    const byDay = new Map<string, number>();
    for (const r of rows ?? []) {
      const row = r as { criado_em: string };
      const d = new Date(row.criado_em);
      const dia = Number.isNaN(d.getTime())
        ? row.criado_em.split("T")[0] ?? ""
        : d.toISOString().split("T")[0] ?? "";
      if (!dia) continue;
      byDay.set(dia, (byDay.get(dia) ?? 0) + 1);
    }
    data.cliques_por_dia = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dia, total]) => ({ dia, total }));
  } catch (error) {
    console.error("[dashboard] cliques_por_dia", error);
    data.cliques_por_dia = [];
  }

  return withNoCacheHeaders(NextResponse.json({ ok: true, data }));
}
