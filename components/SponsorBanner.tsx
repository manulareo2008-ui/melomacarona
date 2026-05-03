"use client";

const TIPO_LABELS: Record<string, string> = {
  instituicao: "Instituição",
  professor: "Professor",
  plataforma: "Plataforma",
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
  technology: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  health: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  humanities: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  arts_design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  business_admin: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  engineering: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function areaBadgeClass(area: string): string {
  return (
    AREA_COLORS[area] ??
    "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  );
}

export type SponsorBannerProps = {
  patrocinadores: Array<{
    id: string;
    nome: string;
    tipo: string;
    logo_url: string | null;
    site_url: string | null;
    cidades_cobertura: string[] | null;
    areas_foco: string[] | null;
  }>;
  cidade: string;
  estado: string;
};

function LocationIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={props.className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9.69 18.933a.75.75 0 001.062 0l4.054-4.055a6.25 6.25 0 10-8.566 0l4.055 4.054zm1.343-6.343a3.75 3.75 0 10-5.304 0 5.303 5.303 0 005.304 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SponsorBanner({
  patrocinadores,
  cidade,
  estado,
}: SponsorBannerProps) {
  if (!patrocinadores.length) return null;

  const regiaoLabel =
    estado.trim().length > 0
      ? `${cidade.trim()} (${estado.trim().toUpperCase()})`
      : cidade.trim();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {patrocinadores.map((p) => (
        <article
          key={p.id}
          className="group relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 to-zinc-900/80 p-6 shadow-lg shadow-violet-500/5 transition-all duration-200 hover:border-violet-500/60"
        >
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-200/95">
            <LocationIcon className="h-4 w-4 shrink-0 text-violet-400" />
            <span>Parceiro na sua região</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {p.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logo_url}
                  alt=""
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white"
                  aria-hidden
                >
                  {p.nome.trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-lg font-semibold leading-snug text-zinc-100">
                {p.nome}
              </h3>
              <span className="inline-flex rounded-full border border-violet-500/35 bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-200">
                {TIPO_LABELS[p.tipo] ?? p.tipo}
              </span>

              {(p.areas_foco?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(p.areas_foco ?? []).map((a) => (
                    <span
                      key={a}
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${areaBadgeClass(a)}`}
                    >
                      {AREA_LABELS[a] ?? a}
                    </span>
                  ))}
                </div>
              )}

              <p className="pt-1 text-sm leading-relaxed text-zinc-400">
                Esta instituição oferece cursos na região de{" "}
                <span className="font-medium text-zinc-200">{regiaoLabel}</span>
              </p>

              {p.site_url && (
                <p className="pt-1">
                  <a
                    href={p.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-semibold text-violet-400 underline-offset-2 transition hover:text-violet-300 hover:underline"
                  >
                    Visitar site
                  </a>
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
