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
};

const matchBadge: Record<
  CourseMatchKind,
  { label: string; className: string }
> = {
  exact: {
    label: "Exato",
    className:
      "inline-flex w-fit rounded-full border border-emerald-400/45 bg-emerald-500/12 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-200",
  },
  similar: {
    label: "Similar",
    className:
      "inline-flex w-fit rounded-full border border-amber-400/45 bg-amber-500/12 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-200",
  },
};

const articleShell: Record<CourseMatchKind, string> = {
  exact:
    "group flex flex-col rounded-3xl border border-slate-500/35 border-l-4 border-l-blue-400/80 bg-slate-900/65 p-6 pl-5 shadow-[0_16px_40px_-18px_rgba(37,99,235,0.35)] backdrop-blur-sm transition duration-300",
  similar:
    "group flex flex-col rounded-3xl border border-slate-500/30 border-l-4 border-l-violet-400/75 bg-slate-900/50 p-6 pl-5 shadow-[0_12px_34px_-18px_rgba(0,0,0,0.5)] backdrop-blur-sm transition duration-300",
};

export function CourseResultCard({
  course: c,
  match,
  detailsButtonClassName,
  onOpenDetails,
}: CourseResultCardProps) {
  const { t, i18n } = useTranslation();
  const badge = matchBadge[match];
  const modalityLabel = t(`modalities.${c.modality}`, { defaultValue: c.modality });
  const language = (i18n.language || "pt-BR") as SupportedLanguage;
  const shortDescription = translateCourseMockTextByCourseId(
    c.id,
    "shortDescription",
    c.shortDescription,
    language
  );
  const translatedName = translateCourseMockTextByCourseId(
    c.id,
    "name",
    c.name,
    language
  );
  const translatedInstitution = translateCourseMockTextByCourseId(
    c.id,
    "institution",
    c.institution,
    language
  );
  const translatedArea = t(`categories.${c.area}.label`, {
    defaultValue: c.area,
  });
  const translatedSubArea = t(`categories.${c.area}.subareas.${c.subArea}.label`, {
    defaultValue: c.subArea,
  });
  const shouldNormalizeCatalogText = (value: string) =>
    language !== "pt-BR" &&
    /[ãõáéíóúâêôç]|curso|formaç|trilha|aprendizado|orçamento|introduç|gestão|matriz/i.test(
      value
    );
  const displayName = shouldNormalizeCatalogText(translatedName)
    ? t("catalog.normalizedCourseTitle", {
        subArea: shouldNormalizeCatalogText(translatedSubArea)
          ? translatedArea
          : translatedSubArea,
        area: translatedArea,
        defaultValue: `${translatedArea} course`,
      })
    : translatedName;
  const displayInstitution = shouldNormalizeCatalogText(translatedInstitution)
    ? t("catalog.normalizedInstitution", {
        platform: c.platform,
        defaultValue: `${c.platform} catalog`,
      })
    : translatedInstitution;

  return (
    <article
      className={`${articleShell[match]} motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_18px_50px_-20px_rgba(30,64,175,0.5)] motion-safe:hover:border-slate-300/30`}
    >
      <span className={`mb-2 ${badge.className}`}>
        {t(`results.badges.${match}`, { defaultValue: badge.label })}
      </span>
      <h4 className="text-lg font-bold leading-snug tracking-tight text-slate-50 sm:text-xl">
        {displayName}
      </h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-100">
        {shortDescription}
      </p>
      <p className="mt-2.5 text-sm text-slate-400">
        {displayInstitution}
      </p>
      <p className="mt-2 text-base font-bold tabular-nums text-emerald-300">
        {c.priceDisplay}
      </p>
      <div className="mt-3">
        <span className="inline-block rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-slate-500/40">
          {modalityLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onOpenDetails(c.id)}
        className={detailsButtonClassName}
      >
        {t("results.viewDetails", { defaultValue: "Ver oferta" })}
      </button>
    </article>
  );
}
