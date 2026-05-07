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
};

/* ── SVG Icons ──────────────────────────────────────────── */
function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
    </svg>
  );
}

function IconBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M8 1l1.545 3.13L13 4.635l-2.5 2.435.59 3.43L8 8.9l-3.09 1.6.59-3.43L3 4.635l3.455-.505z" />
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
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5M1.5 8h13" />
    </svg>
  );
}

/* ── Card shells por tipo ──────────────────────────────── */
const sponsoredShell =
  "group relative flex flex-col rounded-2xl border border-[rgba(200,255,77,0.25)] bg-[linear-gradient(135deg,rgba(200,255,77,0.06)_0%,rgba(77,255,200,0.03)_100%)] p-5 shadow-[0_0_0_1px_rgba(200,255,77,0.10),0_12px_40px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(200,255,77,0.40)] hover:shadow-[0_0_0_1px_rgba(200,255,77,0.18),0_16px_48px_rgba(0,0,0,0.5)]";

const exactShell =
  "group flex flex-col rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(13,17,23,0.80)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(200,255,77,0.18)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]";

const similarShell =
  "group flex flex-col rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(13,17,23,0.60)] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.10)]";

export function CourseResultCard({
  course: c,
  match,
  detailsButtonClassName,
  onOpenDetails,
  isSponsored = false,
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

  const shell = isSponsored ? sponsoredShell : match === "exact" ? exactShell : similarShell;

  return (
    <article className={shell}>

      {/* ── Header badges ── */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {isSponsored && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(200,255,77,0.30)] bg-[rgba(200,255,77,0.10)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#C8FF4D]">
            <IconStar className="h-2.5 w-2.5" />
            Parceiro destaque
          </span>
        )}
        {!isSponsored && match === "exact" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(77,255,200,0.30)] bg-[rgba(77,255,200,0.08)] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#4DFFC8]">
            <IconBadge className="h-2.5 w-2.5" />
            {t("results.badges.exact", { defaultValue: "Recomendado" })}
          </span>
        )}
        {!isSponsored && match === "similar" && (
          <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.05)] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[#8A96A8]">
            {t("results.badges.similar", { defaultValue: "Similar" })}
          </span>
        )}
        {c.isInternational && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-2 py-0.5 text-[11px] text-[#55606F]">
            <IconGlobe className="h-2.5 w-2.5" />
            {c.originCountry}
          </span>
        )}
      </div>

      {/* ── Title & institution ── */}
      <h4 className={`text-[16px] font-bold leading-snug tracking-tight ${isSponsored ? "text-[#F0F2F5]" : "text-[#F0F2F5]"} sm:text-[17px]`}>
        {displayName}
      </h4>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A96A8]">
        {shortDescription}
      </p>
      <p className="mt-2 text-[13px] font-medium text-[#55606F]">
        {displayInstitution} · {c.platform}
      </p>

      {/* ── Price ── */}
      <p className={`mt-3 text-[15px] font-bold tabular-nums ${isSponsored ? "text-[#C8FF4D]" : "text-[#4DFFC8]"}`}>
        {c.priceDisplay}
      </p>

      {/* ── Modality tag ── */}
      <div className="mt-3">
        <span className="inline-block rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] font-medium text-[#8A96A8]">
          {modalityLabel}
        </span>
      </div>

      {/* ── CTA ── */}
      <button
        type="button"
        onClick={() => onOpenDetails(c.id)}
        className={`${detailsButtonClassName} group/btn flex items-center justify-center gap-2`}
      >
        {t("results.viewDetails", { defaultValue: "Ver oferta" })}
        <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
      </button>
    </article>
  );
}
