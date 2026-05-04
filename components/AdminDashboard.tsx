"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DashboardPeriodo = "hoje" | "7dias" | "30dias";

export type DashboardData = {
  periodo: DashboardPeriodo;
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

const AREA_LABELS: Record<string, string> = {
  technology: "Tecnologia",
  health: "Saúde",
  humanities: "Humanas",
  arts_design: "Artes e Design",
  business_admin: "Negócios",
  engineering: "Engenharia",
};

const AREA_COLORS: Record<string, string> = {
  technology: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  health: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  humanities: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  arts_design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  business_admin: "bg-green-500/20 text-green-300 border-green-500/30",
  engineering: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function areaLabel(area: string): string {
  return AREA_LABELS[area] ?? area;
}

function areaBadgeClass(area: string): string {
  return (
    AREA_COLORS[area] ??
    "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  );
}

function formatDiaBr(isoDate: string): string {
  const d = new Date(isoDate + (isoDate.includes("T") ? "" : "T12:00:00Z"));
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}

function taxaColorClass(taxa: number): string {
  if (taxa >= 80) return "text-emerald-400";
  if (taxa >= 50) return "text-amber-400";
  return "text-red-400";
}

type ApiOk = { ok: true; data: DashboardData };
type ApiErr = { ok: false; error?: string };

export function AdminDashboard() {
  const [periodo, setPeriodo] = useState<DashboardPeriodo>("7dias");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hadDataRef = useRef(false);

  useEffect(() => {
    setData(null);
    hadDataRef.current = false;
  }, [periodo]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/dashboard?periodo=${encodeURIComponent(periodo)}`,
        { credentials: "include" }
      );
      const json = (await res.json()) as ApiOk | ApiErr;
      if (!res.ok || !json.ok) {
        const msg =
          !json.ok && "error" in json && json.error
            ? json.error
            : "Não foi possível carregar o painel.";
        setError(msg);
        if (!hadDataRef.current) setData(null);
        return;
      }
      hadDataRef.current = true;
      setData(json.data);
      setError(null);
    } catch {
      setError("Falha de rede ao carregar o painel.");
      if (!hadDataRef.current) setData(null);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => {
      void load();
    }, 30_000);
    return () => clearInterval(id);
  }, [load]);

  const maxCliquesDia = useMemo(() => {
    if (!data?.cliques_por_dia?.length) return 1;
    return Math.max(...data.cliques_por_dia.map((d) => d.total), 1);
  }, [data]);

  const maxBarCliquesArea = useMemo(() => {
    if (!data?.cliques_por_area?.length) return 1;
    return Math.max(...data.cliques_por_area.map((d) => d.total), 1);
  }, [data]);

  const maxBarQuizzesArea = useMemo(() => {
    if (!data?.quizzes_por_area?.length) return 1;
    return Math.max(...data.quizzes_por_area.map((d) => d.total), 1);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="w-full space-y-6 rounded-2xl border border-zinc-800/90 bg-[#0A0A0F] p-6 shadow-sm">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-zinc-900/80"
            />
          ))}
        </div>
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900/80" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <section className="w-full rounded-2xl border border-red-800/80 bg-red-950/40 p-6 text-center">
        <p className="text-sm text-red-200">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-500"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  const r = data?.resumo;

  return (
    <div className="w-full space-y-10">
      {/* Período */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Período
        </span>
        {(
          [
            ["hoje", "Hoje"],
            ["7dias", "7 dias"],
            ["30dias", "30 dias"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriodo(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              periodo === key
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
        {loading && data && (
          <span className="ml-2 text-xs text-zinc-500">Atualizando…</span>
        )}
      </div>

      {/* SEÇÃO 1 — Resumo */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Resumo
        </h2>
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
            r && r.total_leads > 0
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4"
          }`}
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-200">
            <p className="text-xs font-medium text-zinc-400">
              Cliques em cursos
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-100">
              {r?.total_cliques ?? 0}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              {r?.cliques_sucesso ?? 0} ok · {r?.cliques_falha ?? 0}{" "}
              falhas
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-200">
            <p className="text-xs font-medium text-zinc-400">
              Taxa de sucesso
            </p>
            <p
              className={`mt-2 text-3xl font-semibold ${taxaColorClass(
                r?.taxa_sucesso ?? 0
              )}`}
            >
              {(r?.taxa_sucesso ?? 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              })}
              %
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-200">
            <p className="text-xs font-medium text-zinc-400">
              Quizzes completados
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-100">
              {r?.total_quizzes ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-200">
            <p className="text-xs font-medium text-zinc-400">
              Cursos no catálogo
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-100">
              {r?.total_cursos_ativos ?? 0}
            </p>
          </div>
          {r && r.total_leads > 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 transition-all duration-200">
              <p className="text-xs font-medium text-zinc-400">
                Leads capturados
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">
                {r.total_leads}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* SEÇÃO 2 — Cliques por dia */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Cliques por dia
        </h2>
        {!data?.cliques_por_dia?.length ? (
          <p className="text-sm text-zinc-500">Sem dados no período</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.cliques_por_dia.map((row) => (
              <div key={row.dia} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="w-16 shrink-0 text-xs text-zinc-400">
                  {formatDiaBr(row.dia)}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-200"
                      style={{
                        width: `${(row.total / maxCliquesDia) * 100}%`,
                        minWidth: row.total > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-zinc-100">
                    {row.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEÇÃO 3 — Cursos mais clicados */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Cursos mais clicados
        </h2>
        {!data?.cursos_mais_clicados?.length ? (
          <p className="text-sm text-zinc-500">Nenhum clique no período</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
                  <th className="pb-3 pr-3 font-medium">#</th>
                  <th className="pb-3 pr-3 font-medium">Nome do curso</th>
                  <th className="pb-3 pr-3 font-medium">Área</th>
                  <th className="pb-3 text-right font-medium">Cliques</th>
                </tr>
              </thead>
              <tbody>
                {data.cursos_mais_clicados.map((c, idx) => (
                  <tr
                    key={`${c.curso_id}-${idx}`}
                    className="border-b border-zinc-800/80 transition-colors duration-200 hover:bg-zinc-800/50"
                  >
                    <td className="py-3 pr-3 text-zinc-400">{idx + 1}</td>
                    <td className="py-3 pr-3 font-medium text-zinc-100">
                      {c.nome || c.curso_id}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${areaBadgeClass(c.area)}`}
                      >
                        {areaLabel(c.area)}
                      </span>
                    </td>
                    <td className="py-3 text-right tabular-nums text-zinc-100">
                      {c.total_cliques}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SEÇÃO 4 — Distribuição por área */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Distribuição por área
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xs font-medium text-zinc-500">
              Cliques por área
            </h3>
            {!data?.cliques_por_area?.length ? (
              <p className="text-sm text-zinc-500">Sem dados no período</p>
            ) : (
              <div className="space-y-3">
                {data.cliques_por_area.map((row) => (
                  <div key={row.area}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-zinc-300">
                        {areaLabel(row.area)}
                      </span>
                      <span className="tabular-nums text-zinc-400">
                        {row.total}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-200"
                        style={{
                          width: `${(row.total / maxBarCliquesArea) * 100}%`,
                          minWidth: row.total > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-xs font-medium text-zinc-500">
              Quizzes por área
            </h3>
            {!data?.quizzes_por_area?.length ? (
              <p className="text-sm text-zinc-500">Sem dados no período</p>
            ) : (
              <div className="space-y-3">
                {data.quizzes_por_area.map((row) => (
                  <div key={row.area}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-zinc-300">
                        {areaLabel(row.area)}
                      </span>
                      <span className="tabular-nums text-zinc-400">
                        {row.total}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-200"
                        style={{
                          width: `${(row.total / maxBarQuizzesArea) * 100}%`,
                          minWidth: row.total > 0 ? "4px" : "0",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — Cliques por cidade */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Cliques por cidade
        </h2>
        {!data?.cliques_por_cidade?.length ? (
          <p className="text-sm text-zinc-500">Sem dados de localização</p>
        ) : (
          <ul className="space-y-2 text-sm text-zinc-300">
            {data.cliques_por_cidade.map((row, i) => (
              <li key={`${row.cidade}-${row.estado}-${i}`}>
                {row.cidade}
                {row.estado ? `, ${row.estado}` : ""} —{" "}
                <span className="font-medium text-zinc-100">
                  {row.total} cliques
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
