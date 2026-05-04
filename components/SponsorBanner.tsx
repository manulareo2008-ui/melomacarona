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
  technology: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  health: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  humanities: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  arts_design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  business_admin: "bg-green-500/20 text-green-300 border-green-500/30",
  engineering: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function areaBadgeClass(area: string): string {
  return (
    AREA_COLORS[area] ??
    "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
  );
}

export type PatrocinadorBannerItem = {
  id: string;
  nome: string;
  tipo: string;
  logo_url: string | null;
  site_url: string | null;
  cidades_cobertura: string[] | null;
  estados_cobertura?: string[] | null;
  areas_foco: string[] | null;
};

export type SponsorBannerProps = {
  patrocinadores: PatrocinadorBannerItem[];
  cidade: string;
  estado: string;
  /** `featured`: vitrine ampla em coluna única (ex.: resultados do wizard). */
  layout?: "default" | "featured";
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

function regionDescription(cidade: string, estado: string): string {
  const city = cidade.trim();
  const uf = estado.trim().toUpperCase();
  if (city && uf) return `${city} (${uf})`;
  if (uf) return `estado ${uf}`;
  if (city) return city;
  return "as regiões indicadas no cadastro do parceiro";
}

export function SponsorBanner({
  patrocinadores,
  cidade,
  estado,
  layout = "default",
}: SponsorBannerProps) {
  if (!patrocinadores.length) return null;

  const regiaoLabel = regionDescription(cidade, estado);
  const featured = layout === "featured";

  return (
    <div
      className={
        featured
          ? "mx-auto w-full max-w-5xl space-y-5"
          : "grid gap-4 sm:grid-cols-2"
      }
    >
      {patrocinadores.map((p) => (
        <article
          key={p.id}
          className={
            featured
              ? "group relative overflow-hidden rounded-3xl border border-emerald-500/45 bg-gradient-to-br from-emerald-950/45 via-zinc-900/90 to-zinc-950/95 p-6 shadow-[0_20px_50px_-20px_rgba(22,163,74,0.35)] transition-all duration-200 sm:p-8"
              : "group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/35 to-zinc-900/80 p-6 shadow-lg shadow-emerald-500/5 transition-all duration-200 hover:border-emerald-500/60"
          }
        >
          <div
            className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-200/95 ${featured ? "text-sm" : ""}`}
          >
            <LocationIcon className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{featured ? "Parceiro em destaque" : "Parceiro na sua região"}</span>
          </div>

          <div
            className={`flex flex-col gap-5 ${featured ? "sm:flex-row sm:items-start sm:gap-8" : "sm:flex-row sm:items-start"}`}
          >
            <div className="shrink-0">
              {p.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logo_url}
                  alt=""
                  className={
                    featured
                      ? "max-h-16 w-auto object-contain sm:max-h-20"
                      : "max-h-12 w-auto object-contain"
                  }
                />
              ) : (
                <div
                  className={`flex items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white ${featured ? "h-16 w-16 text-2xl sm:h-20 sm:w-20" : "h-12 w-12 rounded-full text-lg"}`}
                  aria-hidden
                >
                  {p.nome.trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <h3
                className={`font-semibold leading-snug text-zinc-100 ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}
              >
                {p.nome}
              </h3>
              <span className="inline-flex rounded-full border border-emerald-500/35 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                {TIPO_LABELS[p.tipo] ?? p.tipo}
              </span>

              {(p.areas_foco?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {(p.areas_foco ?? []).map((a) => (
                    <span
                      key={a}
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${areaBadgeClass(a)}`}
                    >
                      {AREA_LABELS[a] ?? a}
                    </span>
                  ))}
                </div>
              )}

              {cidade.trim() || estado.trim() ? (
                <p className={`leading-relaxed text-zinc-400 ${featured ? "text-base" : "text-sm"}`}>
                  Esta instituição oferece cursos na região de{" "}
                  <span className="font-medium text-zinc-200">{regiaoLabel}</span>
                </p>
              ) : (p.estados_cobertura?.length ?? 0) > 0 || (p.cidades_cobertura?.length ?? 0) > 0 ? (
                <p className={`leading-relaxed text-zinc-400 ${featured ? "text-base" : "text-sm"}`}>
                  Cobertura declarada no cadastro:
                  {(p.estados_cobertura?.length ?? 0) > 0 && (
                    <span className="mt-1 block font-medium text-zinc-200">
                      Estados: {(p.estados_cobertura ?? []).join(", ")}
                    </span>
                  )}
                  {(p.cidades_cobertura?.length ?? 0) > 0 && (
                    <span className="mt-1 block text-sm text-zinc-300">
                      Cidades: {(p.cidades_cobertura ?? []).join(", ")}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-zinc-500">
                  Parceiro cadastrado na plataforma. Destacado por aderência às recomendações ou às áreas de foco.
                </p>
              )}

              {p.site_url && (
                <p className="pt-1">
                  <a
                    href={p.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 ${featured ? "text-base" : "text-sm"}`}
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
