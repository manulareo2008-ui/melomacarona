"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const REGION_STORAGE_KEY = "atloom_user_region";
const QUIZ_MOCK_STORAGE_KEY = "atloom_quiz_vocational_mock";

const TIPO_LABELS: Record<string, string> = {
  instituicao: "Instituição parceira",
  professor: "Professor parceiro",
  plataforma: "Plataforma parceira",
};

const AREA_LABELS: Record<string, string> = {
  technology: "Tecnologia",
  health: "Saúde",
  humanities: "Humanas",
  arts_design: "Artes e Design",
  business_admin: "Negócios",
  engineering: "Engenharia",
};

const GRADIENT_BACKDROPS = [
  "from-emerald-600 to-green-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
  "from-emerald-600 to-teal-700",
  "from-teal-600 to-cyan-600",
  "from-lime-500 to-green-700",
] as const;

export type UserRegionMock = {
  estado?: string;
  regiao?: string;
};

export type QuizVocationalMock = {
  perfis?: string[];
  /** Chave de área geral (ex.: technology) como no admin */
  area?: string;
};

export type PatrocinadorPublic = {
  id: string;
  nome: string;
  tipo: string;
  logo_url: string | null;
  site_url: string | null;
  cidades_cobertura: string[] | null;
  estados_cobertura: string[] | null;
  areas_foco: string[] | null;
};

function gradientForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return GRADIENT_BACKDROPS[h % GRADIENT_BACKDROPS.length];
}

function initialsFromNome(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0];
  const b = parts[parts.length - 1][0];
  return `${a}${b}`.toUpperCase();
}

function readRegionFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(REGION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserRegionMock;
    return parsed.estado?.trim().toUpperCase() || parsed.regiao?.trim().toUpperCase() || null;
  } catch {
    return null;
  }
}

function readQuizMockFromStorage(): QuizVocationalMock | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(QUIZ_MOCK_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuizVocationalMock;
  } catch {
    return null;
  }
}

function patrocinadorCobreEstado(p: PatrocinadorPublic, uf: string | null): boolean {
  if (!uf) return false;
  const estados = p.estados_cobertura;
  if (!estados?.length) return false;
  const u = uf.toUpperCase();
  return estados.some((e) => e.trim().toUpperCase() === u);
}

function coberturaLabel(p: PatrocinadorPublic): string {
  const ufs = p.estados_cobertura?.filter(Boolean) ?? [];
  const cidades = p.cidades_cobertura?.filter(Boolean) ?? [];
  if (ufs.length && cidades.length) {
    return `${ufs.join(", ")} · ${cidades.slice(0, 3).join(", ")}${cidades.length > 3 ? "…" : ""}`;
  }
  if (ufs.length) return ufs.join(", ");
  if (cidades.length) return cidades.join(", ");
  return "Cobertura geográfica não especificada no cadastro";
}

function focusAreaLabels(p: PatrocinadorPublic): string[] {
  const raw = p.areas_foco ?? [];
  return raw.map((a) => AREA_LABELS[a] ?? a);
}

function buildSummary(p: PatrocinadorPublic): string {
  const tipo = TIPO_LABELS[p.tipo] ?? "Parceiro";
  const areas = focusAreaLabels(p);
  const areaPart =
    areas.length > 0
      ? ` Áreas declaradas no cadastro: ${areas.join(", ")}.`
      : " Áreas de foco podem ser complementadas no painel administrativo.";
  return `${tipo} na plataforma Atloom.${areaPart} Use os links oficiais quando disponíveis para conhecer programas e matrículas.`;
}

function quizMatchesAreas(p: PatrocinadorPublic, quiz: QuizVocationalMock | null): string[] {
  const areas = p.areas_foco ?? [];
  if (!quiz?.area?.trim()) return [];
  const key = quiz.area.trim();
  return areas.filter((a) => a === key);
}

export function SponsorsSection() {
  const titleId = useId();
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [quizMock, setQuizMock] = useState<QuizVocationalMock | null>(null);
  const [sponsors, setSponsors] = useState<PatrocinadorPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const refreshFromStorage = useCallback(() => {
    setUserRegion(readRegionFromStorage());
    setQuizMock(readQuizMockFromStorage());
  }, []);

  const loadPatrocinadores = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/patrocinadores/match");
      const data = (await res.json()) as {
        ok?: boolean;
        patrocinadores?: PatrocinadorPublic[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Não foi possível carregar os parceiros.");
      }
      setSponsors(Array.isArray(data.patrocinadores) ? data.patrocinadores : []);
    } catch (e) {
      console.error("[SponsorsSection]", e);
      setFetchError(e instanceof Error ? e.message : "Erro ao carregar parceiros.");
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromStorage();
    void loadPatrocinadores();
    const onStorage = (e: StorageEvent) => {
      if (e.key === REGION_STORAGE_KEY || e.key === QUIZ_MOCK_STORAGE_KEY) {
        refreshFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshFromStorage, loadPatrocinadores]);

  const selected = selectedId ? sponsors.find((s) => s.id === selectedId) ?? null : null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const highlighted = sponsors.filter((s) => patrocinadorCobreEstado(s, userRegion));
  const others = sponsors.filter((s) => !patrocinadorCobreEstado(s, userRegion));
  const ordered = userRegion ? [...highlighted, ...others] : sponsors;

  const alignedAreas =
    selected && quizMock ? quizMatchesAreas(selected, quizMock) : [];

  if (!loading && !fetchError && sponsors.length === 0) {
    return null;
  }

  return (
    <section
      id="parceiros"
      className="relative border-y border-white/10 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950/80 py-16 md:py-20"
      aria-labelledby={titleId}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
            Rede credenciada
          </p>
          <h2 id={titleId} className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Instituições <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">parceiras</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Parceiros ativos cadastrados na área administrativa. Toque no logo para ver áreas de foco, cobertura e sugestões alinhadas ao seu quiz.
          </p>

          <div className="mx-auto mt-4 flex max-w-xl flex-col items-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left text-xs text-slate-400 md:flex-row md:justify-between md:text-sm">
            <div>
              <span className="font-medium text-slate-300">Sua região (opcional): </span>
              {userRegion ? (
                <span className="text-emerald-200">{userRegion}</span>
              ) : (
                <span className="italic text-slate-500">
                  não definida — todos aparecem com o mesmo destaque visual
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                refreshFromStorage();
                void loadPatrocinadores();
              }}
              className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
            >
              Atualizar
            </button>
          </div>
        </div>

        {fetchError && (
          <p className="mb-6 rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-center text-sm text-rose-200">
            {fetchError}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center gap-4 py-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-36 shrink-0 animate-pulse rounded-2xl border border-white/10 bg-slate-800/60"
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-slate-950 to-transparent md:w-12" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-slate-950 to-transparent md:w-12" />

            <div
              className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 px-1 md:gap-6"
              style={{ scrollbarGutter: "stable" }}
            >
              {ordered.map((sponsor, index) => {
                const inRegion = userRegion ? patrocinadorCobreEstado(sponsor, userRegion) : true;
                const tagline = TIPO_LABELS[sponsor.tipo] ?? "Parceiro";
                const grad = gradientForId(sponsor.id);
                return (
                  <motion.button
                    key={sponsor.id}
                    type="button"
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedId(sponsor.id)}
                    className={`group relative flex min-w-[140px] max-w-[160px] shrink-0 snap-center flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-colors md:min-w-[168px] md:max-w-[180px] md:p-5 ${
                      inRegion
                        ? "border-emerald-400/40 bg-gradient-to-b from-emerald-950/45 to-slate-900/80 shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-400/30"
                        : "border-white/10 bg-slate-900/40 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Abrir detalhes de ${sponsor.nome}`}
                  >
                    {!inRegion && userRegion && (
                      <span className="absolute -top-1 right-1 rounded-full bg-slate-700 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-300">
                        Outra região
                      </span>
                    )}
                    {inRegion && userRegion && (
                      <span className="absolute -top-1 right-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                        Na sua área
                      </span>
                    )}
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-lg font-black text-white shadow-inner md:h-[4.5rem] md:w-[4.5rem] md:text-xl ${sponsor.logo_url ? "" : grad}`}
                    >
                      {sponsor.logo_url ? (
                        <img
                          src={sponsor.logo_url}
                          alt={`Logo ${sponsor.nome}`}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        initialsFromNome(sponsor.nome)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-xs font-semibold leading-snug text-white md:text-sm">
                        {sponsor.nome}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-tight text-slate-400 md:text-xs">
                        {tagline}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            role="presentation"
            className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              aria-label="Fechar"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${titleId}-modal-title`}
              className="relative z-[201] flex max-h-[min(92vh,900px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-slate-900 shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-slate-900/95 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-sm font-bold text-white ${selected.logo_url ? "" : gradientForId(selected.id)}`}
                  >
                    {selected.logo_url ? (
                      <img
                        src={selected.logo_url}
                        alt={`Logo ${selected.nome}`}
                        className="h-full w-full object-contain p-0.5"
                      />
                    ) : (
                      initialsFromNome(selected.nome)
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 id={`${titleId}-modal-title`} className="text-lg font-bold leading-tight text-white">
                      {selected.nome}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {TIPO_LABELS[selected.tipo] ?? selected.tipo}
                    </p>
                  </div>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Fechar
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain px-5 py-4">
                <section className="mb-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Sobre o parceiro
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">{buildSummary(selected)}</p>
                </section>

                <section className="mb-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Áreas de foco (cadastro)
                  </h4>
                  {focusAreaLabels(selected).length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {focusAreaLabels(selected).map((area) => (
                        <li
                          key={area}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">Nenhuma área de foco cadastrada.</p>
                  )}
                  <p className="mt-2 text-[11px] text-slate-500">Cobertura: {coberturaLabel(selected)}</p>
                </section>

                <section className="mb-6 flex flex-wrap gap-3">
                  {selected.site_url ? (
                    <>
                      <a
                        href={selected.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:from-emerald-500 hover:to-green-500"
                      >
                        Site oficial →
                      </a>
                      <a
                        href={selected.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-950/40 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-900/50"
                      >
                        Abrir em nova aba
                      </a>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">URL do site não foi informada no cadastro do administrador.</p>
                  )}
                </section>

                <section className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4">
                  <h4 className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Alinhamento com seu quiz vocacional
                  </h4>
                  <p className="mb-3 text-[11px] leading-relaxed text-slate-400">
                    Cruzamos as áreas de foco do parceiro com o resultado simulado em{" "}
                    <code className="rounded bg-black/30 px-1 text-emerald-200/90">{QUIZ_MOCK_STORAGE_KEY}</code> (ou
                    integração futura com o quiz real).
                  </p>
                  {!quizMock?.area?.trim() ? (
                    <div className="rounded-lg border border-dashed border-white/15 bg-slate-950/50 p-3 text-xs text-slate-400">
                      Para ver correspondência por área, conclua o quiz ou defina no armazenamento local, por exemplo:{" "}
                      <code className="mt-2 block whitespace-pre-wrap break-all rounded bg-black/40 p-2 text-[10px] text-slate-300">
                        {`localStorage.setItem("${QUIZ_MOCK_STORAGE_KEY}", JSON.stringify({ area: "technology" }))`}
                      </code>
                      <span className="mt-2 block">
                        <Link href="/quiz?mode=vocacional" className="font-medium text-emerald-300 underline-offset-2 hover:underline">
                          Abrir teste vocacional
                        </Link>
                      </span>
                    </div>
                  ) : (
                    <p className="mb-3 text-[11px] text-emerald-200/90">
                      Área de interesse no mock: <code className="text-emerald-100">{quizMock.area}</code>
                      {quizMock.perfis?.length ? ` · Perfis: ${quizMock.perfis.join(", ")}` : ""}
                    </p>
                  )}
                  {quizMock?.area?.trim() && (
                    <ul className="space-y-3">
                      {alignedAreas.length > 0 ? (
                        alignedAreas.map((areaKey) => (
                          <li
                            key={areaKey}
                            className="rounded-lg border border-emerald-500/30 bg-slate-900/60 px-3 py-2.5"
                          >
                            <p className="text-sm font-semibold text-white">
                              {AREA_LABELS[areaKey] ?? areaKey}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                              Este parceiro declara foco nesta área — compatível com o resultado do seu quiz.
                            </p>
                            <span className="mt-2 inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                              Combina com seu perfil
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-xs text-slate-400">
                          Nenhuma área de foco deste parceiro coincide com a área do mock. Explore o site do parceiro
                          para outras opções.
                        </li>
                      )}
                    </ul>
                  )}
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
