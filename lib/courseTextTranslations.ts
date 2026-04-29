import type { SupportedLanguage } from "@/lib/i18n";

type CourseField =
  | "name"
  | "institution"
  | "about"
  | "duration"
  | "level"
  | "prerequisite"
  | "shortDescription";

type ByIdDictionary = Partial<
  Record<
    string,
    Partial<
      Record<CourseField, Partial<Record<SupportedLanguage, string | string[]>>>
    >
  >
>;

const PT_BR_BASE: Record<CourseField, Record<string, Partial<Record<SupportedLanguage, string>>>> = {
  name: {},
  institution: {},
  about: {
    "Entrada sintética para manter o mínimo de três resultados exatos nesta combinação de filtros.": {
      "en-US":
        "Synthetic entry to ensure at least three exact results for this filter combination.",
      "es-ES":
        "Entrada sintética para mantener al menos tres resultados exactos en esta combinación de filtros.",
      de: "Synthetischer Eintrag, um mindestens drei exakte Ergebnisse für diese Filterkombination sicherzustellen.",
      fr: "Entrée synthétique pour garantir au moins trois résultats exacts pour cette combinaison de filtres.",
      it: "Voce sintetica per garantire almeno tre risultati esatti per questa combinazione di filtri.",
      ar: "إدخال تجريبي لضمان وجود ثلاثة نتائج مطابقة على الأقل لهذه المجموعة من الفلاتر.",
      ru: "Синтетическая запись для обеспечения минимум трёх точных результатов при этой комбинации фильтров.",
      sv: "Syntetisk post för att säkerställa minst tre exakta resultat för denna filterkombination."
    }
  },
  duration: {
    "3 semanas": {
      "en-US": "3 weeks",
      "es-ES": "3 semanas",
      de: "3 Wochen",
      fr: "3 semaines",
      it: "3 settimane",
      ar: "3 أسابيع",
      ru: "3 недели",
      sv: "3 veckor"
    }
  },
  level: {
    Iniciante: {
      "en-US": "Beginner",
      "es-ES": "Inicial",
      de: "Anfänger",
      fr: "Débutant",
      it: "Principiante",
      ar: "مبتدئ",
      ru: "Начальный",
      sv: "Nybörjare"
    }
  },
  prerequisite: {
    "Nenhum pré-requisito obrigatório": {
      "en-US": "No mandatory prerequisites",
      "es-ES": "Sin prerrequisitos obligatorios",
      de: "Keine verpflichtenden Voraussetzungen",
      fr: "Aucun prérequis obligatoire",
      it: "Nessun prerequisito obbligatorio",
      ar: "لا توجد متطلبات إلزامية",
      ru: "Обязательных требований нет",
      sv: "Inga obligatoriska förkunskaper"
    }
  },
  shortDescription: {}
};

/**
 * Camada por ID (mais robusta para escala): permite sobrescrever textos
 * específicos de cursos sem depender do conteúdo literal em pt-BR.
 * - Chave exata de id (ex.: "coursera-google-ux")
 * - Prefixos sintéticos: "cov-" e "fill-"
 */
const COURSE_TEXT_BY_ID: ByIdDictionary = {
  "cov-": {
    about: {
      "en-US":
        "Synthetic course generated to ensure at least three exact matches for each area, niche, modality and price combination.",
      "es-ES":
        "Curso sintético generado para garantizar al menos tres coincidencias exactas por combinación de área, nicho, modalidad y precio.",
      de: "Synthetischer Kurs zur Sicherstellung von mindestens drei exakten Treffern pro Kombination aus Bereich, Nische, Modalität und Preis.",
      fr: "Cours synthétique généré pour garantir au moins trois correspondances exactes par combinaison de domaine, niche, modalité et prix.",
      it: "Corso sintetico generato per garantire almeno tre corrispondenze esatte per combinazione di area, nicchia, modalità e prezzo.",
      ar: "دورة تجريبية مُنشأة لضمان ثلاث مطابقات دقيقة على الأقل لكل تركيبة من المجال والتخصص والنمط والسعر.",
      ru: "Синтетический курс, созданный для обеспечения как минимум трёх точных совпадений по каждой комбинации области, ниши, формата и цены.",
      sv: "Syntetisk kurs för att säkerställa minst tre exakta träffar per kombination av område, nisch, format och pris."
    },
    duration: {
      "en-US": "4 weeks (estimated)",
      "es-ES": "4 semanas (estimado)",
      de: "4 Wochen (geschätzt)",
      fr: "4 semaines (estimé)",
      it: "4 settimane (stimato)",
      ar: "4 أسابيع (تقديري)",
      ru: "4 недели (оценочно)",
      sv: "4 veckor (uppskattat)"
    },
    shortDescription: {
      "en-US":
        "Project-based learning in this niche, with hands-on deliverables and practical outcomes.",
      "es-ES":
        "Aprendizaje orientado a proyectos en este nicho, con entregables prácticos.",
      de: "Projektorientiertes Lernen in dieser Nische mit praxisnahen Ergebnissen.",
      fr: "Apprentissage orienté projet dans cette niche avec livrables pratiques.",
      it: "Apprendimento basato su progetti in questa nicchia con risultati pratici.",
      ar: "تعلم قائم على المشاريع في هذا التخصص مع مخرجات عملية.",
      ru: "Проектно-ориентированное обучение в этой нише с практическими результатами.",
      sv: "Projektbaserat lärande i denna nisch med praktiska resultat."
    }
  },
  "fill-": {
    about: {
      "en-US":
        "Synthetic entry to maintain the minimum of three exact results for this filter combination.",
      "es-ES":
        "Entrada sintética para mantener el mínimo de tres resultados exactos para esta combinación de filtros.",
      de: "Synthetischer Eintrag zur Aufrechterhaltung von mindestens drei exakten Ergebnissen für diese Filterkombination.",
      fr: "Entrée synthétique pour maintenir un minimum de trois résultats exacts pour cette combinaison de filtres.",
      it: "Voce sintetica per mantenere almeno tre risultati esatti per questa combinazione di filtri.",
      ar: "إدخال تجريبي للحفاظ على حد أدنى من ثلاث نتائج مطابقة لهذه المجموعة من الفلاتر.",
      ru: "Синтетическая запись для поддержания минимум трёх точных результатов для этой комбинации фильтров.",
      sv: "Syntetisk post för att bibehålla minst tre exakta resultat för denna filterkombination."
    },
    duration: {
      "en-US": "3 weeks",
      "es-ES": "3 semanas",
      de: "3 Wochen",
      fr: "3 semaines",
      it: "3 settimane",
      ar: "3 أسابيع",
      ru: "3 недели",
      sv: "3 veckor"
    },
    shortDescription: {
      "en-US":
        "Practical course focused on immediate skill application and portfolio-ready tasks.",
      "es-ES":
        "Curso práctico centrado en aplicación inmediata y actividades para portafolio.",
      de: "Praxiskurs mit direkter Anwendbarkeit und portfoliofähigen Aufgaben.",
      fr: "Cours pratique axé sur l'application immédiate et des livrables de portfolio.",
      it: "Corso pratico con applicazione immediata e attività utili al portfolio.",
      ar: "دورة عملية تركّز على التطبيق الفوري ومهام مناسبة لبناء معرض الأعمال.",
      ru: "Практический курс с упором на немедленное применение навыков и задания для портфолио.",
      sv: "Praktisk kurs med fokus på omedelbar tillämpning och portföljvänliga uppgifter."
    }
  }
};

function resolveCourseTextById(
  courseId: string,
  field: CourseField,
  language: SupportedLanguage
): string | string[] | undefined {
  const exact = COURSE_TEXT_BY_ID[courseId]?.[field]?.[language];
  if (exact !== undefined) return exact;

  const prefixKey = Object.keys(COURSE_TEXT_BY_ID).find(
    (k) => k.endsWith("-") && courseId.startsWith(k)
  );
  if (!prefixKey) return undefined;

  return COURSE_TEXT_BY_ID[prefixKey]?.[field]?.[language];
}

export function translateCourseMockText(
  field: CourseField,
  value: string,
  language: SupportedLanguage
): string {
  if (language === "pt-BR") return value;
  const translated = PT_BR_BASE[field][value]?.[language];
  return translated ?? value;
}

export function translateCourseMockTextByCourseId(
  courseId: string,
  field: CourseField,
  value: string,
  language: SupportedLanguage
): string {
  if (language === "pt-BR") return value;

  // Cursos sintéticos ("cov-" / "fill-") podem nascer com textos em pt-BR.
  // Forçamos um texto neutro traduzido por idioma para evitar UI mista.
  if (field === "name") {
    if (courseId.startsWith("cov-")) {
      const byLang: Partial<Record<SupportedLanguage, string>> = {
        "en-US": "Recommended learning track",
        "es-ES": "Ruta de aprendizaje recomendada",
        de: "Empfohlene Lernroute",
        fr: "Parcours d'apprentissage recommandé",
        it: "Percorso di apprendimento consigliato",
        ar: "مسار تعلم موصى به",
        ru: "Рекомендуемая учебная траектория",
        sv: "Rekommenderad inlärningsväg",
      };
      return byLang[language] ?? value;
    }
    if (courseId.startsWith("fill-")) {
      const byLang: Partial<Record<SupportedLanguage, string>> = {
        "en-US": "Personalized recommended course",
        "es-ES": "Curso recomendado personalizado",
        de: "Personalisierter Empfehlungskurs",
        fr: "Cours recommandé personnalisé",
        it: "Corso consigliato personalizzato",
        ar: "دورة موصى بها مخصصة",
        ru: "Персональный рекомендуемый курс",
        sv: "Personligt rekommenderad kurs",
      };
      return byLang[language] ?? value;
    }
  }

  if (field === "institution") {
    if (courseId.startsWith("cov-")) {
      const byLang: Partial<Record<SupportedLanguage, string>> = {
        "en-US": "Coverage matrix (demo)",
        "es-ES": "Matriz de cobertura (demostración)",
        de: "Abdeckungsmatrix (Demo)",
        fr: "Matrice de couverture (démo)",
        it: "Matrice di copertura (demo)",
        ar: "مصفوفة التغطية (عرض تجريبي)",
        ru: "Матрица покрытия (демо)",
        sv: "Täckningsmatris (demo)",
      };
      return byLang[language] ?? value;
    }
    if (courseId.startsWith("fill-")) {
      const byLang: Partial<Record<SupportedLanguage, string>> = {
        "en-US": "Complementary catalog (prototype)",
        "es-ES": "Catálogo complementario (prototipo)",
        de: "Ergänzender Katalog (Prototyp)",
        fr: "Catalogue complémentaire (prototype)",
        it: "Catalogo complementare (prototipo)",
        ar: "كتالوج تكميلي (نموذج أولي)",
        ru: "Дополнительный каталог (прототип)",
        sv: "Kompletterande katalog (prototyp)",
      };
      return byLang[language] ?? value;
    }
  }

  const byId = resolveCourseTextById(courseId, field, language);
  if (typeof byId === "string") return byId;

  return translateCourseMockText(field, value, language);
}
