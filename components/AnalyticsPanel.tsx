"use client";

import { useEffect, useMemo, useState } from "react";
import { getTrackedEvents, type AnalyticsEvent } from "@/lib/analytics";

const readNumber = (events: AnalyticsEvent[], eventName: string) =>
  events.filter((event) => event.event === eventName).length;

type DataSource = "local" | "server";

type Props = {
  /** "local" = so este browser. "server" = leitura agregada (ingest) para o time. */
  dataSource?: DataSource;
};

export function AnalyticsPanel({ dataSource = "local" }: Props) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (dataSource === "server") {
      let alive = true;
      const load = async () => {
        const res = await fetch("/api/admin/analytics", { credentials: "include" });
        if (!res.ok) {
          if (alive) setLoadError("Falha ao carregar");
          return;
        }
        const data = (await res.json()) as { events: AnalyticsEvent[] };
        if (alive) {
          setLoadError(null);
          setEvents(data.events ?? []);
        }
      };
      void load();
      const id = setInterval(() => {
        void load();
      }, 15_000);
      return () => {
        alive = false;
        clearInterval(id);
      };
    }

    setEvents(getTrackedEvents());
    const onTracked = () => setEvents(getTrackedEvents());
    window.addEventListener("analytics:tracked", onTracked);
    return () => window.removeEventListener("analytics:tracked", onTracked);
  }, [dataSource]);

  const summary = useMemo(() => {
    const funnelStarted = readNumber(events, "funnel_started");
    const resultViewed = readNumber(events, "step_completed");
    const finalClick = readNumber(events, "final_cta_clicked");
    const journeyCompleted = readNumber(events, "journey_completed");
    const conversionToClick =
      resultViewed > 0 ? Math.round((finalClick / resultViewed) * 100) : 0;

    return {
      totalEvents: events.length,
      funnelStarted,
      resultViewed,
      finalClick,
      journeyCompleted,
      conversionToClick,
    };
  }, [events]);

  if (dataSource === "server" && loadError) {
    return (
      <section className="w-full rounded-2xl border border-red-200/90 bg-red-50/80 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
        {loadError}
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-zinc-800/90 bg-zinc-950 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
        {dataSource === "server"
          ? "Painel de metricas (agregado no servidor)"
          : "Painel de metricas (local)"}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <p className="rounded-xl bg-zinc-900 px-3 py-2 text-xs">
          Eventos totais: <strong>{summary.totalEvents}</strong>
        </p>
        <p className="rounded-xl bg-zinc-900 px-3 py-2 text-xs">
          Funil iniciado: <strong>{summary.funnelStarted}</strong>
        </p>
        <p className="rounded-xl bg-zinc-900 px-3 py-2 text-xs">
          Resultado visto: <strong>{summary.resultViewed}</strong>
        </p>
        <p className="rounded-xl bg-zinc-900 px-3 py-2 text-xs">
          Clique CTA final: <strong>{summary.finalClick}</strong>
        </p>
        <p className="rounded-xl bg-zinc-900 px-3 py-2 text-xs">
          Jornada concluida: <strong>{summary.journeyCompleted}</strong>
        </p>
        <p className="rounded-xl bg-emerald-100 px-3 py-2 text-xs text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300">
          Conversao para clique: <strong>{summary.conversionToClick}%</strong>
        </p>
      </div>
    </section>
  );
}

