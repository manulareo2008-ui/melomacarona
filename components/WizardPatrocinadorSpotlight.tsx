"use client";

import type { GeneralArea } from "@/lib/domain";
import { partnerSiteUrlForArea, type AreaLinksMap } from "@/lib/partnerAreaUrl";

const AREA_LABELS: Record<string, string> = {
  technology: "Tecnologia",
  health: "Saúde",
  humanities: "Humanas",
  arts_design: "Artes e Design",
  business_admin: "Negócios",
  engineering: "Engenharia",
};

const TIPO_LABELS: Record<string, string> = {
  instituicao: "Instituição",
  professor: "Professor",
  plataforma: "Plataforma",
};

export type SpotlightPatrocinador = {
  id: string;
  nome: string;
  tipo: string;
  logo_url: string | null;
  site_url: string | null;
  areas_foco: string[] | null;
  links_por_area?: AreaLinksMap | null;
};

type Props = {
  patrocinadores: SpotlightPatrocinador[];
  userArea: GeneralArea | "";
  areaLabel: string;
  onContinueToCourses: () => void;
};

export function WizardPatrocinadorSpotlight({
  patrocinadores,
  userArea,
  areaLabel,
  onContinueToCourses,
}: Props) {
  const primary = patrocinadores[0];
  const primaryUrl = partnerSiteUrlForArea(
    primary?.site_url,
    primary?.links_por_area ?? null,
    userArea
  );

  const openPrimaryLearnMore = () => {
    if (!primaryUrl) return;
    window.open(primaryUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative flex min-h-[min(85vh,720px)] flex-col rounded-3xl border border-emerald-500/35 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 px-4 py-8 sm:px-8">
      <p className="mx-auto max-w-xl text-center text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/90">
        Parceiro na sua jornada
      </p>
      <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Antes dos cursos, conheça{" "}
        {patrocinadores.length === 1 ? "nossa instituição parceira" : "nossas instituições parceiras"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-slate-400">
        Suas recomendações já foram preparadas. A seguir você verá o catálogo completo; por aqui destacamos{" "}
        {patrocinadores.length === 1 ? "o parceiro alinhado" : "os parceiros alinhados"} à sua área{" "}
        <span className="font-semibold text-emerald-200">{areaLabel}</span>.
      </p>

      {primaryUrl && (
        <div className="mx-auto mt-6 max-w-lg">
          <button
            type="button"
            onClick={openPrimaryLearnMore}
            className="w-full rounded-2xl border border-emerald-400/40 bg-emerald-600/20 px-4 py-3 text-center text-sm font-semibold text-emerald-100 transition hover:bg-emerald-600/30"
          >
            Saber mais sobre os cursos relacionados a minha área na instituição parceira
          </button>
        </div>
      )}

      <div className="mx-auto mt-10 flex w-full max-w-2xl flex-1 flex-col gap-8">
        {patrocinadores.map((p) => {
          const deepUrl = partnerSiteUrlForArea(p.site_url, p.links_por_area ?? null, userArea);
          return (
            <article
              key={p.id}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-8 text-center shadow-inner"
            >
              <div className="flex flex-col items-center gap-4">
                {p.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logo_url}
                    alt={`Logo ${p.nome}`}
                    className="max-h-24 w-auto object-contain sm:max-h-28"
                  />
                ) : (
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-600 text-3xl font-bold text-white sm:h-28 sm:w-28 sm:text-4xl"
                    aria-hidden
                  >
                    {p.nome.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                {deepUrl && (
                  <a
                    href={deepUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-500 hover:to-green-500"
                  >
                    Acessar site — {areaLabel}
                  </a>
                )}
                {!deepUrl && p.site_url && (
                  <p className="text-xs text-amber-200/90">Configure a URL do site para habilitar o acesso direcionado por área.</p>
                )}
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{p.nome}</h3>
              <span className="mt-2 inline-flex rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
                {TIPO_LABELS[p.tipo] ?? p.tipo}
              </span>
              {(p.areas_foco?.length ?? 0) > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {(p.areas_foco ?? []).map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {AREA_LABELS[a] ?? a}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="h-16 shrink-0 sm:h-20" aria-hidden />

      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={onContinueToCourses}
          className="pointer-events-auto inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-slate-400/60 bg-slate-900/95 px-5 py-2.5 text-sm font-semibold text-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm transition hover:border-emerald-400/50 hover:bg-slate-800"
        >
          Ir aos cursos convencionais
        </button>
      </div>
    </div>
  );
}
