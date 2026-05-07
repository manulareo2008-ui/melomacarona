import type { InternationalCourse } from "@/lib/courseData";
import type { SupportedLanguage } from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { translateCourseMockTextByCourseId } from "@/lib/courseTextTranslations";

export type CourseMatchKind = "exact" | "similar";

type CourseResultCardProps = {
  course: InternationalCourse;
  match: CourseMatchKind;
  detailsButtonClassName: string;
  onOpenDetails: (courseId: string) => void;
  isSponsored?: boolean;
  affinityScore?: number;
  affinityPitch?: string;
};

/* ── Icons ─────────────────────────────────────────────── */
function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 1l1.2 2.4L10 3.9l-2 1.95.47 2.74L6 7.4l-2.47 1.24L4 5.85 2 3.9l2.8-.5z" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <circle cx="7" cy="7" r="5.5" />
      <path d="M7 1.5S5 3.5 5 7s2 5.5 2 5.5M7 1.5S9 3.5 9 7 7 12.5 7 12.5M1.5 7h11" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

/* ── Score bar ──────────────────────────────────────────── */
function AffinityBar({ score }: { score: number }) {
  const pct = Math.round((score / 10) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
        <div
          className="h-full rounded-full bg-[#C8FF4D] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums text-[#C8FF4D]">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Badge ──────────────────────────────────────────────── */
function Badge({
  variant,
  children,
}: {
  variant: "sponsored" | "exact" | "similar" | "intl";
  children: React.ReactNode;
}) {
  const styles = {
    sponsored:
      "border-[rgba(200,255,77,0.35)] bg-[rgba(200,255,77,0.10)] text-[#C8FF4D]",
    exact:
      "border-[rgba(77,255,200,0.30)] bg-[rgba(77,255,200,0.08)] text-[#4DFFC8]",
    similar:
      "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] text-[#8A96A8]",
    intl: "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#55606F]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

/* ── Main Card ──────────────────────────────────────────── */
export function CourseResultCard({
  course: c,
  match,
  detailsButtonClassName,
  onOpenDetails,
  isSponsored = false,
  affinityScore,
  affinityPitch,
}: CourseResultCardProps) {
  const { t, i18n } = useTranslation();
  const language = (i18n.language || "pt-BR") as SupportedLanguage;

  const shortDescription = translateCourseMockTextByCourseId(c.id, "shortDescription", c.shortDescription, language);
  const translatedName = translateCourseMockTextByCourseId(c.id, "name", c.name, language);
  const translatedInstitution = translateCourseMockTextByCourseId(c.id, "institution", c.institution, language);
  const translatedArea = t(`categories.${c.area}.label`, { defaultValue: c.area });
  const translatedSubArea = t(`categories.${c.area}.subareas.${c.subArea}.label`, { defaultValue: c.subArea });

  const shouldNormalize = (value: string) =>
    language !== "pt-BR" &&
    /[ãõáéíóúâêôç]|curso|formaç|trilha|aprendizado|orçamento|introduç|gestão|matriz/i.test(value);

  const displayName = shouldNormalize(translatedName)
    ? t("catalog.normalizedCourseTitle", {
        subArea: shouldNormalize(translatedSubArea) ? translatedArea : translatedSubArea,
        area: translatedArea,
        defaultValue: `${translatedArea} course`,
      })
    : translatedName;

  const displayInstitution = shouldNormalize(translatedInstitution)
    ? t("catalog.normalizedInstitution", { platform: c.platform, defaultValue: `${c.platform} catalog` })
    : translatedInstitution;

  const modalityLabel = t(`modalities.${c.modality}`, { defaultValue: c.modality });

  /* ── Layout: sponsored = card premium full-width com barra lateral
         exact = card padrão com acento teal
         similar = card muted compacto ──────────────────── */

  if (isSponsored) {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-[rgba(200,255,77,0.20)] bg-[rgba(10,13,8,0.95)] transition duration-300 hover:border-[rgba(200,255,77,0.40)] hover:shadow-[0_0_40px_rgba(200,255,77,0.08)]">
        {/* Barra lateral lima */}
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#C8FF4D] via-[#C8FF4D]/60 to-transparent" />

        {/* Linha superior sutil */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,255,77,0.30)] to-transparent" />

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-6">
          {/* Coluna esquerda — identidade */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="sponsored">
                <IconStar className="h-2.5 w-2.5" />
                Parceiro destaque
              </Badge>
              {c.isInternational && (
                <Badge variant="intl">
                  <IconGlobe className="h-2.5 w-2.5" />
                  {c.originCountry}
                </Badge>
              )}
            </div>

            <h4 className="text-[17px] font-bold leading-snug tracking-tight text-[#F0F2F5] sm:text-[18px]">
              {displayName}
            </h4>
            <p className="mt-1 text-[13px] text-[#8A96A8]">
              {displayInstitution} · {c.platform}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6B7585]">
              {shortDescription}
            </p>

            {affinityPitch && (
              <p className="mt-3 text-[13px] leading-relaxed text-[#C8FF4D]/80 italic">
                {affinityPitch}
              </p>
            )}
          </div>

          {/* Coluna direita — preço + ação */}
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end sm:min-w-[160px]">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-[#55606F]">investimento</p>
              <p className="text-[22px] font-bold tabular-nums leading-none text-[#C8FF4D]">
                {c.priceDisplay}
              </p>
            </div>

            {affinityScore !== undefined && (
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] uppercase tracking-widest text-[#55606F]">afinidade</p>
                <AffinityBar score={affinityScore} />
              </div>
            )}

            <span className="inline-block rounded-full border border-[rgba(200,255,77,0.15)] bg-[rgba(200,255,77,0.06)] px-3 py-1 text-[11px] font-medium text-[#8A96A8]">
              {modalityLabel}
            </span>

            <button
              type="button"
              onClick={() => onOpenDetails(c.id)}
              className="group/btn mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(200,255,77,0.30)] bg-[rgba(200,255,77,0.08)] px-4 py-2.5 text-[13px] font-semibold text-[#C8FF4D] transition duration-200 hover:border-[rgba(200,255,77,0.55)] hover:bg-[rgba(200,255,77,0.14)] sm:w-auto"
            >
              {t("results.viewDetails", { defaultValue: "Ver oferta" })}
              <IconArrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (match === "exact") {
    return (
      <article className="group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(13,17,23,0.80)] transition duration-300 hover:border-[rgba(77,255,200,0.20)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Barra lateral teal fina */}
        <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#4DFFC8]/70 via-[#4DFFC8]/30 to-transparent" />

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:gap-5 sm:px-5">
          {/* Esquerda */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="exact">
                <IconCheck className="h-2.5 w-2.5" />
                {t("results.badges.exact", { defaultValue: "Recomendado" })}
              </Badge>
              {c.isInternational && (
                <Badge variant="intl">
                  <IconGlobe className="h-2.5 w-2.5" />
                  {c.originCountry}
                </Badge>
              )}
            </div>

            <h4 className="text-[15px] font-bold leading-snug tracking-tight text-[#EEF0F3]">
              {displayName}
            </h4>
            <p className="mt-1 text-[12px] text-[#55606F]">
              {displayInstitution} · {c.platform}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7585] line-clamp-2">
              {shortDescription}
            </p>
            {affinityPitch && (
              <p className="mt-2 text-[12px] leading-relaxed text-[#4DFFC8]/70 italic line-clamp-2">
                {affinityPitch}
              </p>
            )}
          </div>

          {/* Direita */}
          <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end sm:min-w-[130px]">
            <div className="flex-1 sm:flex-none sm:text-right">
              <p className="text-[18px] font-bold tabular-nums leading-none text-[#4DFFC8]">
                {c.priceDisplay}
              </p>
              <p className="mt-0.5 text-[10px] text-[#55606F]">{modalityLabel}</p>
            </div>

            {affinityScore !== undefined && (
              <div className="hidden sm:flex flex-col items-end gap-1">
                <AffinityBar score={affinityScore} />
              </div>
            )}

            <button
              type="button"
              onClick={() => onOpenDetails(c.id)}
              className="group/btn flex items-center gap-1.5 rounded-lg border border-[rgba(77,255,200,0.20)] bg-[rgba(77,255,200,0.06)] px-3 py-2 text-[12px] font-semibold text-[#4DFFC8] transition duration-200 hover:border-[rgba(77,255,200,0.40)] hover:bg-[rgba(77,255,200,0.10)]"
            >
              {t("results.viewDetails", { defaultValue: "Ver oferta" })}
              <IconArrow className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* Similar — layout compacto horizontal */
  return (
    <article className="group flex items-center gap-4 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(13,17,23,0.50)] px-4 py-3 transition duration-200 hover:border-[rgba(255,255,255,0.10)] hover:bg-[rgba(13,17,23,0.65)]">
      {/* Dot indicador */}
      <div className="shrink-0 h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.20)]" />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-[13px] font-semibold leading-snug text-[#C8CDD6] truncate">
            {displayName}
          </h4>
          <Badge variant="similar">
            {t("results.badges.similar", { defaultValue: "Similar" })}
          </Badge>
        </div>
        <p className="mt-0.5 text-[11px] text-[#455060] truncate">
          {displayInstitution} · {modalityLabel}
        </p>
      </div>

      {/* Preço + CTA */}
      <div className="shrink-0 flex items-center gap-3">
        <span className="text-[13px] font-bold tabular-nums text-[#8A96A8]">
          {c.priceDisplay}
        </span>
        <button
          type="button"
          onClick={() => onOpenDetails(c.id)}
          className="group/btn flex items-center gap-1 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1.5 text-[11px] font-medium text-[#8A96A8] transition duration-200 hover:border-[rgba(255,255,255,0.14)] hover:text-[#C8CDD6]"
        >
          Ver
          <IconArrow className="h-2.5 w-2.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}
