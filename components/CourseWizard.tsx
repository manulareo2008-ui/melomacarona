"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type GeneralArea,
  type InternationalCourse,
  type Modality,
  type PriceRangeId,
  GENERAL_AREAS,
  getCourseById,
  OUTRA_ESPECIFICA,
  searchCourses,
  SUB_AREAS,
  PRICE_OPTIONS,
} from "@/lib/courseData";
import { CourseResultCard } from "@/components/CourseResultCard";
import { RTL_LANGUAGES, type SupportedLanguage } from "@/lib/i18n";
import { translateCourseMockTextByCourseId } from "@/lib/courseTextTranslations";
import { trackEvent } from "@/lib/analytics";
import {
  bodyLead,
  cardDetailsBtn,
  detailsCtaBtn,
  fieldClass,
  heading1,
  heading2,
  kickerText,
  labelClass,
  languageMenu,
  languageMenuItemActive,
  languageMenuItemIdle,
  languageTrigger,
  mainMotion,
  panelClass,
  priceCardActive,
  priceCardIdle,
  primaryBtn,
  progressFill,
  progressTrack,
  secondaryBtn,
  segmentActive,
  segmentIdle,
  subOptionActive,
  subOptionBase,
  subOptionIdle,
  WIZARD_INNER,
  WIZARD_SHELL,
} from "@/lib/wizard-ui";
import {
  fetchCourseRecommendations,
  type ExternalCourseRecommendation,
} from "@/lib/courseRecommendationApi";
import {
  buildVocationalExplanation,
  calculateRiasecScores,
  getTopRiasecProfiles,
  mapRiasecToGeneralArea,
  prioritizeNichesForArea,
  VOCATIONAL_QUESTIONS,
  type RiasecType,
} from "@/lib/vocational-test";
import {
  COURSE_REDIRECT_BROADCAST,
  type CourseRedirectNotifyPayload,
} from "@/lib/courseRedirectNotify";

const MODALITIES: Modality[] = ["Presencial", "Online", "Híbrido"];

type WizardStep = 1 | 2 | 3 | 4 | 5;
type KnowledgeLevel = "iniciante" | "intermediario" | "avancado";

const LANGUAGE_OPTIONS: SupportedLanguage[] = [
  "pt-BR",
  "en-US",
  "es-ES",
  "de",
  "fr",
  "it",
  "ar",
  "ru",
  "sv",
];

const KNOWLEDGE_LEVEL_OPTIONS: Array<{ value: KnowledgeLevel; label: string }> = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const selectChevronClass =
  "cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M5.3%207.3%2010%2012l4.7-4.7%201.4%201.4L10%2014.8%203.9%208.7z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";
const errorTextClass = "mt-4 text-center text-sm text-rose-300";

type RecommendationProvider =
  | "openai"
  | "gemini"
  | "local"
  | "mock-external-api"
  | "unknown";

type AppState = {
  wizardStep: WizardStep;
  careerFlow: "known" | "discover" | "";
  name: string;
  email: string;
  age: string;
  area: GeneralArea | "";
  knowledgeLevel: KnowledgeLevel | "";
  objectives: string;
  subChoice: string;
  customNiche: string;
  modality: Modality | null;
  priceRange: PriceRangeId | null;
};

const STORAGE_KEY = "course-wizard-app-state-v2";

type CourseWizardProps = {
  vocationalFirst?: boolean;
};

export function CourseWizard({ vocationalFirst = false }: CourseWizardProps = {}) {
  const { t, i18n } = useTranslation();
  const [appState, setAppState] = useState<AppState>({
    wizardStep: 1,
    careerFlow: "",
    name: "",
    email: "",
    age: "",
    area: "",
    knowledgeLevel: "",
    objectives: "",
    subChoice: "",
    customNiche: "",
    modality: null,
    priceRange: null,
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackThanks, setFeedbackThanks] = useState(false);
  const [feedbackSubmitError, setFeedbackSubmitError] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [backgroundFeedbackStatus, setBackgroundFeedbackStatus] = useState<
    "idle" | "sending" | "sent"
  >("idle");
  const [lastFeedback, setLastFeedback] = useState<{
    courseId: string;
    rating: number;
    submittedAt: string;
  } | null>(null);
  const {
    wizardStep,
    careerFlow,
    name,
    email,
    age,
    area,
    knowledgeLevel,
    objectives,
    subChoice,
    customNiche,
    modality,
    priceRange,
  } = appState;

  const setWizardStep = (nextStep: WizardStep) =>
    setAppState((prev) => ({ ...prev, wizardStep: nextStep }));
  const setCareerFlow = (nextFlow: "known" | "discover" | "") =>
    setAppState((prev) => ({ ...prev, careerFlow: nextFlow }));
  const setName = (nextName: string) =>
    setAppState((prev) => ({ ...prev, name: nextName }));
  const setEmail = (nextEmail: string) =>
    setAppState((prev) => ({ ...prev, email: nextEmail }));
  const setAge = (nextAge: string) =>
    setAppState((prev) => ({ ...prev, age: nextAge }));
  const setArea = (nextArea: GeneralArea | "") =>
    setAppState((prev) => ({ ...prev, area: nextArea }));
  const setKnowledgeLevel = (nextKnowledgeLevel: KnowledgeLevel | "") =>
    setAppState((prev) => ({ ...prev, knowledgeLevel: nextKnowledgeLevel }));
  const setObjectives = (nextObjectives: string) =>
    setAppState((prev) => ({ ...prev, objectives: nextObjectives }));
  /** Uma das 6 opções (string) ou `OUTRA_ESPECIFICA`. */
  const setSubChoice = (nextSubChoice: string) =>
    setAppState((prev) => ({ ...prev, subChoice: nextSubChoice }));
  const setCustomNiche = (nextCustomNiche: string) =>
    setAppState((prev) => ({ ...prev, customNiche: nextCustomNiche }));
  const setModality = (nextModality: Modality | null) =>
    setAppState((prev) => ({ ...prev, modality: nextModality }));
  const setPriceRange = (nextPriceRange: PriceRangeId | null) =>
    setAppState((prev) => ({ ...prev, priceRange: nextPriceRange }));
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<InternationalCourse[]>([]);
  const [externalRecommendations, setExternalRecommendations] = useState<
    ExternalCourseRecommendation[]
  >([]);
  const [recommendationInsights, setRecommendationInsights] = useState<
    Record<string, { score: number; pitch: string }>
  >({});
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [vocationalAnswers, setVocationalAnswers] = useState<Record<string, number>>({});
  const [vocationalResult, setVocationalResult] = useState<{
    area: GeneralArea;
    scores: Record<RiasecType, number>;
    topProfiles: Array<{ type: RiasecType; label: string; score: number }>;
    explanation: string;
    prioritizedNiches: string[];
  } | null>(null);
  const [recommendationError, setRecommendationError] = useState("");
  const [recommendationProvider, setRecommendationProvider] =
    useState<RecommendationProvider>("unknown");
  const [redirectingNotice, setRedirectingNotice] = useState(false);
  const courseRedirectBcRef = useRef<BroadcastChannel | null>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const exactMatches = recommendedCourses;
  const similarMatches = useMemo(() => {
    if (!area || !modality || !priceRange || !subChoice) return [];

    const localGroups =
      subChoice === OUTRA_ESPECIFICA
        ? searchCourses(area, { type: "custom", query: customNiche.trim() }, modality, priceRange)
        : searchCourses(area, { type: "preset", niche: subChoice }, modality, priceRange);

    const exactIds = new Set(exactMatches.map((course) => course.id));
    return localGroups.similar
      .filter((course) => !exactIds.has(course.id))
      .slice(0, 6);
  }, [area, customNiche, exactMatches, modality, priceRange, subChoice]);

  const comparisonGroups = useMemo(() => {
    const all = [...exactMatches, ...similarMatches];
    const topIds = [...externalRecommendations]
      .sort((a, b) => b.score_afinidade - a.score_afinidade)
      .slice(0, 3)
      .map((item) => item.id);
    const topRecommended = topIds
      .map((id) => all.find((course) => course.id === id))
      .filter((course): course is InternationalCourse => Boolean(course));

    const budgetFriendly = all
      .filter((course) => course.priceBrl <= 100)
      .slice(0, 3);

    return {
      topRecommended,
      budgetFriendly,
    };
  }, [exactMatches, similarMatches, externalRecommendations]);

  const catalogById = useMemo(() => {
    const m: Record<string, InternationalCourse> = {};
    for (const c of [...exactMatches, ...similarMatches]) {
      m[c.id] = c;
    }
    return m;
  }, [exactMatches, similarMatches]);

  const selectedCourse = selectedCourseId
    ? catalogById[selectedCourseId] ?? getCourseById(selectedCourseId)
    : undefined;

  useEffect(() => {
    if (
      detailOpen &&
      selectedCourseId &&
      !getCourseById(selectedCourseId)
    ) {
      setSelectedCourseId(null);
      setDetailOpen(false);
    }
  }, [detailOpen, selectedCourseId]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AppState>;
      setAppState((prev) => ({
        ...prev,
        ...parsed,
      }));
    } catch (error) {
      console.error("Falha ao restaurar progresso do wizard", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    trackEvent("funnel_started", { step: appState.wizardStep });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trackEvent("step_viewed", {
      step: appState.wizardStep,
      area: appState.area,
    });
  }, [appState.wizardStep, appState.area]);

  function validateStep1(): boolean {
    const trimmed = name.trim();
    const nextErrors: Record<string, string> = {};
    if (!trimmed) {
      nextErrors.name = t("errors.nameRequired");
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Digite um e-mail válido para continuar.";
    }
    const n = parseInt(age, 10);
    if (Number.isNaN(n) || n < 12 || n > 120) {
      nextErrors.age = t("errors.invalidAge");
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError(Object.values(nextErrors)[0] ?? t("errors.nameRequired"));
      return false;
    }
    setFieldErrors({});
    setFormError("");
    return true;
  }

  function validateStep2Profile(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!careerFlow) {
      nextErrors.careerFlow = "Escolha se você já sabe sua área ou quer descobrir.";
    }
    if (!area) {
      nextErrors.area = t("errors.areaRequired");
    }
    if (careerFlow === "discover" && !vocationalResult) {
      nextErrors.careerFlow =
        "Finalize o teste vocacional para receber sua sugestão de área.";
    }
    if (!knowledgeLevel) {
      nextErrors.knowledgeLevel = "Selecione seu nível de conhecimento.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError(Object.values(nextErrors)[0] ?? t("errors.nameRequired"));
      return false;
    }
    setFieldErrors({});
    setFormError("");
    return true;
  }

  function goStep2() {
    if (validateStep1()) {
      setFormError("");
      if (vocationalFirst) {
        setCareerFlow("discover");
        if (!knowledgeLevel) {
          setKnowledgeLevel("iniciante");
        }
        if (objectives.trim().length < 3) {
          setObjectives("Quero descobrir a área ideal para iniciar.");
        }
      }
      setWizardStep(2);
      trackEvent("step_advanced", { from: 1, to: 2 });
    }
  }

  function goStep3() {
    if (validateStep2Profile()) {
      if (objectives.trim().length < 3) {
        setFieldErrors((prev) => ({
          ...prev,
          objectives: "Descreva seus objetivos em pelo menos 3 caracteres.",
        }));
        setFormError("Descreva seus objetivos em pelo menos 3 caracteres.");
        return;
      }
      setSubChoice("");
      setCustomNiche("");
      setModality(null);
      setPriceRange(null);
      setRecommendedCourses([]);
      setExternalRecommendations([]);
      setRecommendationInsights({});
      setRecommendationError("");
      setRecommendationProvider("unknown");
      setWizardStep(3);
      trackEvent("step_advanced", { from: 2, to: 3, area });
      void persistLeadForFutureRecommendations();
    }
  }

  async function persistLeadForFutureRecommendations() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !area) return;

    try {
      await fetch("/api/marketing/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          nome: name.trim() || undefined,
          area_interesse: area,
          origem: "course-wizard",
        }),
        keepalive: true,
      });
    } catch (error) {
      console.warn("Falha ao salvar lead para campanhas futuras.", error);
    }
  }

  function setVocationalAnswer(questionId: string, value: number) {
    setVocationalAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  function finishVocationalTest() {
    const missing = VOCATIONAL_QUESTIONS.find((q) => !vocationalAnswers[q.id]);
    if (missing) {
      setFormError("Responda todas as perguntas do teste vocacional para continuar.");
      return;
    }
    const scores = calculateRiasecScores(vocationalAnswers);
    const suggestedArea = mapRiasecToGeneralArea(scores);
    const topProfiles = getTopRiasecProfiles(scores, 3);
    const prioritizedNiches = prioritizeNichesForArea(
      suggestedArea,
      SUB_AREAS[suggestedArea],
      topProfiles
    );
    const explanation = buildVocationalExplanation(topProfiles, suggestedArea);
    setVocationalResult({
      area: suggestedArea,
      scores,
      topProfiles,
      explanation,
      prioritizedNiches,
    });
    setArea(suggestedArea);
    setSubChoice(prioritizedNiches[0] ?? "");
    setFormError("");
  }

  function validateStep2Niche(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!subChoice) {
      nextErrors.subChoice = t("errors.subAreaRequired");
    }
    if (subChoice === OUTRA_ESPECIFICA) {
      if (customNiche.trim().length < 2) {
        nextErrors.customNiche = t("errors.customNicheTooShort");
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError(Object.values(nextErrors)[0] ?? t("errors.subAreaRequired"));
      return false;
    }
    setFieldErrors({});
    setFormError("");
    return true;
  }

  function goStep4() {
    if (validateStep2Niche()) {
      setWizardStep(4);
      trackEvent("step_advanced", { from: 3, to: 4, subChoice });
    }
  }

  function validateStep3ModalityPrice(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!modality) {
      nextErrors.modality = t("errors.modalityRequired");
    }
    if (!priceRange) {
      nextErrors.priceRange = t("errors.priceRangeRequired");
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError(Object.values(nextErrors)[0] ?? t("errors.modalityRequired"));
      return false;
    }
    setFieldErrors({});
    setFormError("");
    return true;
  }

  function goStep5Results() {
    if (validateStep3ModalityPrice()) {
      setSelectedCourseId(null);
      setDetailOpen(false);
      setRecommendationError("");
      setRecommendationProvider("unknown");
      setWizardStep(5);
      trackEvent("step_advanced", { from: 4, to: 5, modality, priceRange });
    }
  }

  function openDetails(courseId: string) {
    setSelectedCourseId(courseId);
    setDetailOpen(true);
  }

  function closeDetails() {
    setSelectedCourseId(null);
    setDetailOpen(false);
    setFeedbackOpen(false);
    setFeedbackRating(0);
    setFeedbackHover(0);
    setFeedbackSubmitError("");
    setIsSubmittingFeedback(false);
  }

  function openFeedbackGate() {
    if (!hasValidCourseUrl(detailCourse)) {
      setFeedbackSubmitError(t("details.linkUnavailableForCourse"));
      return;
    }
    setFeedbackRating(0);
    setFeedbackHover(0);
    setFeedbackOpen(true);
    setFeedbackThanks(false);
    setFeedbackSubmitError("");
  }

  async function sendEvaluationInBackground(payload: {
    name: string;
    age: number;
    area: GeneralArea | "";
    niche: string;
    rating: number;
  }) {
    try {
      setBackgroundFeedbackStatus("sending");
      const res = await fetch("/api/send-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Tenta finalizar o request mesmo durante mudanças de navegação/aba.
        keepalive: true,
      });

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        console.error("Falha ao enviar avaliação por API", {
          status: res.status,
          response: errorBody,
          payload,
        });
        setBackgroundFeedbackStatus("idle");
        return;
      }
      setBackgroundFeedbackStatus("sent");
    } catch (error) {
      console.error("Erro de rede ao enviar avaliação", {
        error,
        payload,
      });
      setBackgroundFeedbackStatus("idle");
    }
  }

  function normalizeCourseUrl(course: InternationalCourse | null): string | null {
    const raw = course?.registrationUrl?.trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("//")) return `https:${raw}`;
    if (/^www\./i.test(raw)) return `https://${raw}`;
    return null;
  }

  function buildPlatformSearchUrl(course: InternationalCourse | null): string | null {
    if (!course) return null;
    const query = encodeURIComponent(course.name.trim());
    const platform = course.platform.toLowerCase();
    if (platform.includes("coursera")) return `https://www.coursera.org/search?query=${query}`;
    if (platform.includes("edx")) return `https://www.edx.org/search?q=${query}`;
    if (platform.includes("udemy")) return `https://www.udemy.com/courses/search/?q=${query}`;
    if (platform.includes("harvard")) return `https://pll.harvard.edu/catalog?keywords=${query}`;
    if (platform.includes("mit")) return `https://www.edx.org/school/mitx`;
    return `https://www.google.com/search?q=${query}+curso`;
  }

  function resolveCourseTargetUrl(course: InternationalCourse | null): string | null {
    const direct = normalizeCourseUrl(course);
    if (direct) return direct;
    return buildPlatformSearchUrl(course);
  }

  function buildRedirectBridgeUrl(
    course: InternationalCourse,
    targetUrl: string,
    notifyId?: string
  ): string {
    const params = new URLSearchParams({
      target: targetUrl,
      fallback: buildPlatformSearchUrl(course) ?? targetUrl,
      course: course.name,
    });
    if (notifyId) {
      params.set("notify", notifyId);
    }
    return `/acessando-curso?${params.toString()}`;
  }

  function hasValidCourseUrl(course: InternationalCourse | null): boolean {
    return Boolean(resolveCourseTargetUrl(course));
  }

  function submitFeedbackAndAccess() {
    if (!detailCourse || feedbackRating < 1) return;

    setIsSubmittingFeedback(true);
    setFeedbackSubmitError("");

    const targetUrl = resolveCourseTargetUrl(detailCourse);
    if (!targetUrl) {
      setFeedbackSubmitError(t("details.linkUnavailableForCourse"));
      setIsSubmittingFeedback(false);
      return;
    }

    const notifyId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    courseRedirectBcRef.current?.close();
    courseRedirectBcRef.current = new BroadcastChannel(COURSE_REDIRECT_BROADCAST);
    courseRedirectBcRef.current.onmessage = (
      event: MessageEvent<CourseRedirectNotifyPayload>
    ) => {
      const d = event.data;
      if (
        d?.notifyId === notifyId &&
        (d.phase === "redirect" || d.phase === "error")
      ) {
        setRedirectingNotice(false);
        courseRedirectBcRef.current?.close();
        courseRedirectBcRef.current = null;
      }
    };

    const bridgeUrl = buildRedirectBridgeUrl(detailCourse, targetUrl, notifyId);
    setRedirectingNotice(true);
    // Abre uma página intermediária do próprio site, com mensagem de espera,
    // e dela redireciona para o curso selecionado.
    const newTab = window.open(bridgeUrl, "_blank", "noopener,noreferrer");
    if (newTab) {
      newTab.opener = null;
    } else {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = bridgeUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    }

    const payload = {
      name: name.trim(),
      age: Number.parseInt(age, 10),
      area,
      niche: subNicheLabel,
      rating: feedbackRating,
    };

    setLastFeedback({
      courseId: detailCourse.id,
      rating: feedbackRating,
      submittedAt: new Date().toISOString(),
    });

    setFeedbackOpen(false);
    setFeedbackRating(0);
    setFeedbackHover(0);
    setFeedbackThanks(true);
    setIsSubmittingFeedback(false);

    // Processos nao criticos rodam apos abertura da aba.
    window.setTimeout(() => {
      trackEvent("journey_completed", payload);
      trackEvent("final_cta_clicked", {
        courseId: detailCourse.id,
        courseName: detailCourse.name,
        platform: detailCourse.platform,
        priceBrl: detailCourse.priceBrl,
      });
      // Envia avaliação em segundo plano sem bloquear o acesso ao curso.
      void sendEvaluationInBackground(payload);
    }, 0);
  }

  const currentLanguage = (
    LANGUAGE_OPTIONS.includes(i18n.language as SupportedLanguage)
      ? i18n.language
      : "pt-BR"
  ) as SupportedLanguage;

  useEffect(() => {
    return () => {
      courseRedirectBcRef.current?.close();
      courseRedirectBcRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!feedbackThanks) return;
    const timer = window.setTimeout(() => setFeedbackThanks(false), 2800);
    return () => window.clearTimeout(timer);
  }, [feedbackThanks]);

  useEffect(() => {
    if (backgroundFeedbackStatus !== "sent") return;
    const timer = window.setTimeout(
      () => setBackgroundFeedbackStatus("idle"),
      1800
    );
    return () => window.clearTimeout(timer);
  }, [backgroundFeedbackStatus]);

  useEffect(() => {
    // Garante que cada nova tela/modal comece no topo visível para o usuário.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [wizardStep, detailOpen, feedbackOpen]);

  useEffect(() => {
    const isRtl = RTL_LANGUAGES.includes(currentLanguage);
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const stored = window.localStorage.getItem("preferred-language");
    if (!stored) return;
    if (!LANGUAGE_OPTIONS.includes(stored as SupportedLanguage)) return;
    if (stored === currentLanguage) return;
    void i18n.changeLanguage(stored);
  }, [currentLanguage, i18n]);

  useEffect(() => {
    if (!languageMenuOpen) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (languageMenuRef.current?.contains(target)) return;
      setLanguageMenuOpen(false);
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [languageMenuOpen]);

  const firstName = name.trim().split(/\s+/)[0] || t("common.student");
  const subOptions = useMemo(() => (area ? SUB_AREAS[area] : []), [area]);
  const orderedSubOptions = useMemo(() => {
    if (!area) return [];
    if (!vocationalResult || vocationalResult.area !== area) return subOptions;
    return prioritizeNichesForArea(area, subOptions, vocationalResult.topProfiles);
  }, [area, subOptions, vocationalResult]);
  const translatedSubOptions = orderedSubOptions.map((s) =>
    t(`categories.${area}.subareas.${s}.label`, { defaultValue: s })
  );
  const translatedGeneralAreas = GENERAL_AREAS.map((a) => ({
    value: a,
    label: t(`categories.${a}.label`, { defaultValue: a }),
  }));
  const translatedPriceOptions = PRICE_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`priceOptions.${opt.id}`, { defaultValue: opt.label }),
  }));
  const translatedModalities = MODALITIES.map((m) => ({
    value: m,
    label: t(`modalities.${m}`, { defaultValue: m }),
  }));
  const subNicheLabel =
    subChoice === OUTRA_ESPECIFICA
      ? customNiche.trim() || t("step2.freeTextFallback")
      : t(`categories.${area}.subareas.${subChoice}.label`, {
          defaultValue: subChoice,
        });

  function budgetFromPriceRange(range: PriceRangeId | null): number | null {
    if (!range) return null;
    const option = PRICE_OPTIONS.find((item) => item.id === range);
    if (!option) return null;
    return option.maxBrl ?? 100_000;
  }

  useEffect(() => {
    if (wizardStep !== 5 || !area || !modality || !priceRange || !subChoice) {
      return;
    }

    const budget = budgetFromPriceRange(priceRange);
    if (budget == null) return;
    const budgetBrl: number = budget;
    const modalityValue: Modality = modality as Modality;

    const controller = new AbortController();
    setIsLoadingRecommendations(true);
    setRecommendationError("");
    setRecommendedCourses([]);
    setExternalRecommendations([]);
    setRecommendationInsights({});
    setRecommendationProvider("unknown");

    async function fetchRecommendations() {
      try {
        const payload = await fetchCourseRecommendations({
          nome: name.trim(),
          idade: Number.parseInt(age, 10),
          area: area as GeneralArea,
          nicho: subNicheLabel,
          budget: budgetBrl,
          modalidade: modalityValue,
          nivel_conhecimento: knowledgeLevel || "iniciante",
          objetivos: objectives.trim(),
          texto_livre: subChoice === OUTRA_ESPECIFICA ? customNiche.trim() : "",
        });

        const recommendations: ExternalCourseRecommendation[] = payload.recomendacoes;
        setExternalRecommendations(recommendations);
        const resolvedCourses = recommendations
          .map((recommendation) => getCourseById(recommendation.id))
          .filter((course): course is InternationalCourse => Boolean(course));

        const insightMap: Record<string, { score: number; pitch: string }> = {};
        for (const recommendation of recommendations) {
          insightMap[recommendation.id] = {
            score: recommendation.score_afinidade,
            pitch: recommendation.pitch_venda,
          };
        }
        const providerRaw = payload.metadata?.provider?.toLowerCase();
        if (
          providerRaw === "openai" ||
          providerRaw === "gemini" ||
          providerRaw === "mock-external-api" ||
          providerRaw === "local"
        ) {
          setRecommendationProvider(providerRaw);
        } else {
          setRecommendationProvider("unknown");
        }

        setRecommendationInsights(insightMap);
        setRecommendedCourses(resolvedCourses);
        trackEvent("step_completed", {
          step: 5,
          provider: providerRaw ?? "unknown",
          recommendationCount: recommendations.length,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Falha ao carregar recomendacoes IA", error);
        setRecommendationError(t("results.noneFound"));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingRecommendations(false);
        }
      }
    }

    void fetchRecommendations();
    return () => controller.abort();
  }, [
    age,
    area,
    customNiche,
    knowledgeLevel,
    modality,
    name,
    objectives,
    priceRange,
    subChoice,
    subNicheLabel,
    t,
    wizardStep,
  ]);

  const progressStep = detailOpen ? 6 : wizardStep;
  const progressMax = 6;
  const progressRatio = progressStep / progressMax;

  const detailCourse =
    detailOpen && selectedCourse ? selectedCourse : null;
  const detailCourseHasValidUrl = hasValidCourseUrl(detailCourse);
  const shouldNormalizeCatalogText = (value: string) =>
    currentLanguage !== "pt-BR" &&
    /[ãõáéíóúâêôç]|curso|formaç|trilha|aprendizado|orçamento|introduç|gestão|matriz/i.test(
      value
    );
  const localizedCourseName = (course: InternationalCourse): string => {
    const translated = translateCourseMockTextByCourseId(
      course.id,
      "name",
      course.name,
      currentLanguage
    );
    if (!shouldNormalizeCatalogText(translated)) return translated;
    const areaLabel = t(`categories.${course.area}.label`, {
      defaultValue: course.area,
    });
    const subAreaLabel = t(`categories.${course.area}.subareas.${course.subArea}.label`, {
      defaultValue: course.subArea,
    });
    return t("catalog.normalizedCourseTitle", {
      subArea: shouldNormalizeCatalogText(subAreaLabel) ? areaLabel : subAreaLabel,
      area: areaLabel,
      defaultValue: `${areaLabel} course`,
    });
  };
  const localizedInstitution = (course: InternationalCourse): string => {
    const translated = translateCourseMockTextByCourseId(
      course.id,
      "institution",
      course.institution,
      currentLanguage
    );
    if (!shouldNormalizeCatalogText(translated)) return translated;
    return t("catalog.normalizedInstitution", {
      platform: course.platform,
      defaultValue: `${course.platform} catalog`,
    });
  };
  const detailCourseName = detailCourse
    ? localizedCourseName(detailCourse)
    : "";
  const detailCourseInstitution = detailCourse
    ? localizedInstitution(detailCourse)
    : "";
  const detailAbout = detailCourse
    ? translateCourseMockTextByCourseId(
        detailCourse.id,
        "about",
        detailCourse.about,
        currentLanguage
      )
    : "";
  const detailDuration = detailCourse
    ? translateCourseMockTextByCourseId(
        detailCourse.id,
        "duration",
        detailCourse.duration,
        currentLanguage
      )
    : "";
  const detailLevel = detailCourse
    ? translateCourseMockTextByCourseId(
        detailCourse.id,
        "level",
        detailCourse.level,
        currentLanguage
      )
    : "";
  const detailPrerequisites = detailCourse
    ? detailCourse.prerequisites.map((p) =>
        translateCourseMockTextByCourseId(
          detailCourse.id,
          "prerequisite",
          p,
          currentLanguage
        )
      )
    : [];

  async function changeLanguage(nextLanguage: SupportedLanguage) {
    await i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem("preferred-language", nextLanguage);
    setLanguageMenuOpen(false);
  }

  return (
    <div className={WIZARD_SHELL}>
      <div className={WIZARD_INNER}>
        <header className="relative mb-10 text-center sm:mb-14">
          <div
            ref={languageMenuRef}
            className="absolute end-0 top-0 z-[90]"
          >
            <button
              type="button"
              aria-label={t("language.switcherAria")}
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className={languageTrigger}
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-4 w-4 text-white dark:text-white"
              >
                <path
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm5.84 7h-2.08a12.08 12.08 0 00-1.08-4.12A6.02 6.02 0 0115.84 9zM10 3.6c.65.95 1.46 2.84 1.7 5.4H8.3c.24-2.56 1.05-4.45 1.7-5.4zM7.32 4.88A12.08 12.08 0 006.24 9H4.16a6.02 6.02 0 013.16-4.12zM3.6 10.6h2.55c.06 1.5.3 2.96.76 4.24A6.03 6.03 0 013.6 10.6zm6.4 5.8c-.65-.95-1.46-2.84-1.7-5.4h3.4c-.24 2.56-1.05 4.45-1.7 5.4zm2.68-1.56c.46-1.28.7-2.74.76-4.24h2.55a6.03 6.03 0 01-3.31 4.24z"
                  fill="currentColor"
                />
              </svg>
              <span>{t(`language.${currentLanguage}`)}</span>
            </button>
            {languageMenuOpen && (
              <div className={languageMenu}>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => void changeLanguage(lang)}
                    className={
                      currentLanguage === lang
                        ? languageMenuItemActive
                        : languageMenuItemIdle
                    }
                  >
                    {t(`language.${lang}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className={kickerText}>
            {t("progress.stepOf", { step: progressStep, total: progressMax })}
          </p>
          <div
            className={progressTrack}
            role="progressbar"
            aria-valuenow={progressStep}
            aria-valuemin={1}
            aria-valuemax={progressMax}
            aria-label={t("progress.ariaLabel")}
          >
            <div
              className={progressFill}
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </header>

        <main
          key={wizardStep}
          className={mainMotion}
        >
          {wizardStep === 1 && (
            <section
              className={panelClass}
              key="s1"
              aria-labelledby="onboarding-title"
            >
              <h1
                id="onboarding-title"
                className={heading1}
              >
                {t("onboarding.title")}
              </h1>
              <p className={`${bodyLead} mt-4`}>
                {t("onboarding.subtitle")}
              </p>

              {false && <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setCareerFlow("known");
                    setVocationalResult(null);
                    setVocationalAnswers({});
                  }}
                  className={`rounded-2xl border px-4 py-4 text-start transition ${
                    careerFlow === "known"
                      ? "border-indigo-500 bg-indigo-950/40 text-indigo-100"
                      : "border-zinc-700 bg-zinc-900/70 text-white hover:border-zinc-500"
                  }`}
                >
                  <p className="text-sm font-semibold">Já sei minha área</p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Quero ir direto para o filtro de cursos.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setCareerFlow("discover")}
                  className={`rounded-2xl border px-4 py-4 text-start transition ${
                    careerFlow === "discover"
                      ? "border-indigo-500 bg-indigo-950/40 text-indigo-100"
                      : "border-zinc-700 bg-zinc-900/70 text-white hover:border-zinc-500"
                  }`}
                >
                  <p className="text-sm font-semibold">Quero descobrir minha área</p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Fazer teste vocacional e receber sugestão de área.
                  </p>
                </button>
              </div>}

              {false && careerFlow === "discover" && !vocationalResult && (
                <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-white">
                    Teste vocacional (base RIASEC/Holland)
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Avalie de 1 (não combina) a 5 (combina muito).
                  </p>

                  <div className="mt-4 space-y-3">
                    {VOCATIONAL_QUESTIONS.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-zinc-700/80 bg-zinc-950/70 p-3"
                      >
                        <p className="text-sm text-white">{q.statement}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={`${q.id}-${score}`}
                              type="button"
                              onClick={() => setVocationalAnswer(q.id, score)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                vocationalAnswers[q.id] === score
                                  ? "bg-indigo-600 text-white"
                                  : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={finishVocationalTest} className={secondaryBtn}>
                      Finalizar teste e sugerir área
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-10 space-y-6 sm:mt-12">
                <div>
                  <label
                    htmlFor="name"
                    className={labelClass}
                  >
                    {t("onboarding.nameLabel")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="given-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("onboarding.namePlaceholder")}
                    className={fieldClass(!!fieldErrors.name)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className={labelClass}
                  >
                    {t("onboarding.ageLabel")}
                  </label>
                  <input
                    id="age"
                    type="number"
                    inputMode="numeric"
                    min={12}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t("onboarding.agePlaceholder")}
                    className={`max-w-[160px] ${fieldClass(!!fieldErrors.age)}`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className={fieldClass(!!fieldErrors.email)}
                  />
                </div>
                {false && <div>
                  <label
                    htmlFor="area"
                    className={labelClass}
                  >
                    {t("onboarding.areaLabel")}
                  </label>
                  <select
                    id="area"
                    value={area}
                    onChange={(e) =>
                      setArea(e.target.value as GeneralArea | "")
                    }
                    disabled={careerFlow === "discover" && Boolean(vocationalResult)}
                    className={`${fieldClass(!!fieldErrors.area)} cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M5.3%207.3%2010%2012l4.7-4.7%201.4%201.4L10%2014.8%203.9%208.7z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="">{t("onboarding.areaPlaceholder")}</option>
                    {translatedGeneralAreas.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>}
                {false && <div>
                  <label htmlFor="knowledge-level" className={labelClass}>
                    Nível de conhecimento
                  </label>
                  <select
                    id="knowledge-level"
                    value={knowledgeLevel}
                    onChange={(e) =>
                      setKnowledgeLevel(e.target.value as KnowledgeLevel | "")
                    }
                    className={`${fieldClass(!!fieldErrors.knowledgeLevel)} cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M5.3%207.3%2010%2012l4.7-4.7%201.4%201.4L10%2014.8%203.9%208.7z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="">Selecione</option>
                    {KNOWLEDGE_LEVEL_OPTIONS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>}
                {false && <div>
                  <label htmlFor="objectives" className={labelClass}>
                    Objetivos
                  </label>
                  <textarea
                    id="objectives"
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    placeholder="Ex.: quero conseguir meu primeiro emprego na área em até 6 meses."
                    className={`${fieldClass(!!fieldErrors.objectives)} min-h-24`}
                  />
                </div>}
              </div>

              {formError && (
                <p
                  className="mt-4 text-center text-sm text-red-600 dark:text-red-400/90"
                  role="alert"
                >
                  {formError}
                </p>
              )}

              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={goStep2} className={primaryBtn}>
                  {t("common.continue")}
                </button>
              </div>
            </section>
          )}

          {wizardStep === 2 && (
            <section className={panelClass} key="s2-profile" aria-labelledby="vocational-title">
              <h2 id="vocational-title" className={heading2}>
                {vocationalFirst ? "Teste vocacional" : "Descubra ou confirme sua direção"}
              </h2>
              <p className={`${bodyLead} mt-4`}>
                {vocationalFirst
                  ? "Responda às perguntas abaixo para receber uma sugestão de área alinhada ao seu perfil."
                  : "Escolha se você já sabe sua área ou se deseja descobrir com o teste vocacional."}
              </p>

              {!vocationalFirst && (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCareerFlow("known");
                      setVocationalResult(null);
                      setVocationalAnswers({});
                    }}
                    className={`rounded-2xl border px-4 py-4 text-start transition ${
                      careerFlow === "known"
                        ? "border-blue-400/80 bg-blue-950/35 text-blue-100 shadow-sm shadow-blue-500/20"
                        : "border-slate-500/40 bg-slate-900/60 text-slate-100 hover:border-slate-300/40"
                    }`}
                  >
                    <p className="text-sm font-semibold">Já sei minha área</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCareerFlow("discover")}
                    className={`rounded-2xl border px-4 py-4 text-start transition ${
                      careerFlow === "discover"
                        ? "border-blue-400/80 bg-blue-950/35 text-blue-100 shadow-sm shadow-blue-500/20"
                        : "border-slate-500/40 bg-slate-900/60 text-slate-100 hover:border-slate-300/40"
                    }`}
                  >
                    <p className="text-sm font-semibold">Quero descobrir minha área</p>
                  </button>
                </div>
              )}

              {careerFlow === "discover" && !vocationalResult && (
                <div className="mt-8 rounded-2xl border border-slate-500/40 bg-slate-900/55 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-slate-100">
                    Teste vocacional (base RIASEC/Holland)
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Avalie de 1 (não combina) a 5 (combina muito).
                  </p>

                  <div className="mt-4 space-y-3">
                    {VOCATIONAL_QUESTIONS.map((q, index) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-500/35 bg-slate-950/40 p-3"
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          Questão {index + 1}/{VOCATIONAL_QUESTIONS.length}
                        </p>
                        <p className="text-sm text-slate-100">{q.statement}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={`${q.id}-${score}`}
                              type="button"
                              onClick={() => setVocationalAnswer(q.id, score)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                vocationalAnswers[q.id] === score
                                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={finishVocationalTest} className={secondaryBtn}>
                      Finalizar teste e sugerir área
                    </button>
                  </div>
                </div>
              )}

              {careerFlow === "discover" && vocationalResult && (
                <div className="mt-8 rounded-2xl border border-emerald-400/45 bg-emerald-500/10 p-4">
                  <p className="text-sm font-semibold text-emerald-200">
                    Área sugerida:{" "}
                    {t(`categories.${vocationalResult.area}.label`, {
                      defaultValue: vocationalResult.area,
                    })}
                  </p>
                  <p className="mt-1 text-xs text-slate-100">{vocationalResult.explanation}</p>
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="area-step2" className={labelClass}>
                    {t("onboarding.areaLabel")}
                  </label>
                  <select
                    id="area-step2"
                    value={area}
                    onChange={(e) => setArea(e.target.value as GeneralArea | "")}
                    disabled={careerFlow === "discover" && Boolean(vocationalResult)}
                    className={`${fieldClass(!!fieldErrors.area)} ${selectChevronClass}`}
                  >
                    <option value="">{t("onboarding.areaPlaceholder")}</option>
                    {translatedGeneralAreas.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!vocationalFirst && (
                  <>
                    <div>
                      <label htmlFor="knowledge-level-step2" className={labelClass}>
                        Nível de conhecimento
                      </label>
                      <select
                        id="knowledge-level-step2"
                        value={knowledgeLevel}
                        onChange={(e) => setKnowledgeLevel(e.target.value as KnowledgeLevel | "")}
                        className={`${fieldClass(!!fieldErrors.knowledgeLevel)} ${selectChevronClass}`}
                      >
                        <option value="">Selecione</option>
                        {KNOWLEDGE_LEVEL_OPTIONS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="objectives-step2" className={labelClass}>
                        Objetivos
                      </label>
                      <textarea
                        id="objectives-step2"
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        placeholder="Ex.: quero atuar com IA aplicada a startups."
                        className={`${fieldClass(!!fieldErrors.objectives)} min-h-24`}
                      />
                    </div>
                  </>
                )}
              </div>

              {formError && <p className={errorTextClass} role="alert">{formError}</p>}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setWizardStep(1)} className={secondaryBtn}>
                  {t("common.back")}
                </button>
                <button type="button" onClick={goStep3} className={primaryBtn}>
                  {t("common.continue")}
                </button>
              </div>
            </section>
          )}

          {wizardStep === 3 && area && (
            <section
              className={panelClass}
              key="s2"
              aria-labelledby="refine-title"
            >
              <h2
                id="refine-title"
                className={heading2}
              >
                {t("step2.title", {
                  firstName,
                  area: t(`categories.${area}.label`, { defaultValue: area }),
                })}
              </h2>
              <p className={`${bodyLead} mt-4`}>
                {t("step2.subtitle", {
                  firstName,
                  area: t(`categories.${area}.label`, { defaultValue: area }),
                })}
              </p>

              {vocationalResult && vocationalResult.area === area && (
                <div className="mt-5 rounded-2xl border border-blue-400/45 bg-blue-950/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-300">
                    Nichos priorizados automaticamente
                  </p>
                  <p className="mt-1 text-xs text-slate-100">
                    Com base no seu resultado vocacional, ordenamos os nichos mais alinhados primeiro.
                  </p>
                </div>
              )}

              <div className="mt-10">
                <p className="mb-4 text-sm font-semibold text-white">
                  {t("step2.prompt", {
                    area: t(`categories.${area}.label`, { defaultValue: area }),
                  })}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {orderedSubOptions.map((s, idx) => {
                    const active = subChoice === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSubChoice(s);
                          setCustomNiche("");
                        }}
                        className={`${subOptionBase} ${
                          active ? subOptionActive : subOptionIdle
                        }`}
                      >
                        {translatedSubOptions[idx]}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSubChoice(OUTRA_ESPECIFICA)}
                    className={`${subOptionBase} border-dashed sm:col-span-2 ${
                      subChoice === OUTRA_ESPECIFICA
                        ? subOptionActive
                        : fieldErrors.subChoice
                          ? "border-rose-500 bg-rose-950/30 text-rose-200"
                          : "border-slate-500/40 bg-slate-950/45 text-slate-100 hover:border-blue-400/70"
                    }`}
                  >
                    {t("step2.otherSpecific")}
                  </button>
                </div>
                {subChoice === OUTRA_ESPECIFICA && (
                  <div className="mt-4">
                    <label
                      htmlFor="custom-niche"
                      className={labelClass}
                    >
                      {t("step2.customNicheLabel")}
                    </label>
                    <input
                      id="custom-niche"
                      type="text"
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      placeholder={t("step2.customNichePlaceholder")}
                      className={fieldClass(!!fieldErrors.customNiche)}
                    />
                  </div>
                )}
              </div>

              {formError && <p className={errorTextClass} role="alert">{formError}</p>}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setFormError("");
                    setWizardStep(3);
                  }}
                  className={secondaryBtn}
                >
                  {t("common.back")}
                </button>
                <button type="button" onClick={goStep4} className={primaryBtn}>
                  {t("common.continue")}
                </button>
              </div>
            </section>
          )}

          {wizardStep === 4 && area && (
            <section
              className={panelClass}
              key="s3-mod"
              aria-labelledby="modality-title"
            >
              <h2
                id="modality-title"
                className={heading2}
              >
                {t("step3.title", { firstName })}
              </h2>
              <p className={`${bodyLead} mt-4`}>
                {t("step3.nicheLabel")}{" "}
                <span className="font-semibold text-slate-100">
                  {subChoice === OUTRA_ESPECIFICA
                    ? subNicheLabel
                    : subNicheLabel}
                </span>
              </p>

              <div className="mt-10">
                <p className="mb-4 text-sm font-semibold text-white">
                  {t("step3.modality")}
                </p>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {translatedModalities.map((m) => {
                    const active = modality === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setModality(m.value)}
                        className={`rounded-full px-5 py-2.5 text-sm font-medium transition duration-200 ${
                          active
                            ? segmentActive
                            : fieldErrors.modality
                              ? "bg-rose-950/30 text-rose-200 ring-2 ring-rose-500/70"
                              : segmentIdle
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10">
                <p className="mb-4 text-sm font-semibold text-white">
                  {t("step3.priceRange")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {translatedPriceOptions.map((opt) => {
                    const active = priceRange === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriceRange(opt.id)}
                        className={`rounded-2xl border px-4 py-3.5 text-start text-sm transition duration-200 ${
                          active
                            ? priceCardActive
                            : fieldErrors.priceRange
                              ? "border-rose-500 bg-rose-950/30 text-rose-200 hover:border-rose-400"
                              : priceCardIdle
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && <p className={errorTextClass} role="alert">{formError}</p>}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setFormError("");
                    setWizardStep(2);
                  }}
                  className={secondaryBtn}
                >
                  {t("common.back")}
                </button>
                <button
                  type="button"
                  onClick={goStep5Results}
                  className={primaryBtn}
                >
                  {t("step3.findCourses")}
                </button>
              </div>
            </section>
          )}

          {wizardStep === 5 && (
            <section
              className="w-full max-w-5xl"
              key="s4-results"
              aria-labelledby="results-title"
            >
              <div className={`${panelClass} mb-6 max-w-2xl mx-auto`}>
                <h2
                  id="results-title"
                  className="text-center text-3xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-4xl"
                >
                  {t("results.title", { firstName })}
                </h2>
                <p className="mt-3 text-center text-sm leading-relaxed text-slate-100">
                  {t(`categories.${area}.label`, { defaultValue: area })} ·{" "}
                  {subChoice === OUTRA_ESPECIFICA
                    ? subNicheLabel
                    : subNicheLabel}{" "}
                  · {modality ? t(`modalities.${modality}`, { defaultValue: modality }) : ""} ·{" "}
                  {translatedPriceOptions.find((p) => p.id === priceRange)?.label}
                </p>
                <p className="mt-2 text-center text-xs text-emerald-300">
                  {t("results.smartRecommendationsHint")}
                </p>
                {!isLoadingRecommendations && !recommendationError && (
                  <div className="mt-3 flex justify-center">
                    <span className="inline-flex items-center rounded-full border border-slate-500/40 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-100">
                      IA:{" "}
                      {recommendationProvider === "openai"
                        ? "OpenAI"
                        : recommendationProvider === "gemini"
                          ? "Gemini"
                          : recommendationProvider === "mock-external-api"
                            ? "Mock API"
                          : recommendationProvider === "local"
                            ? "Fallback local"
                            : t("results.providerUnknown")}
                    </span>
                  </div>
                )}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className={secondaryBtn}
                  >
                    {t("common.back")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setDetailOpen(false);
                      setCareerFlow("");
                      setName("");
                      setEmail("");
                      setAge("");
                      setArea("");
                      setKnowledgeLevel("");
                      setObjectives("");
                      setSubChoice("");
                      setCustomNiche("");
                      setModality(null);
                      setPriceRange(null);
                      setRecommendedCourses([]);
                      setExternalRecommendations([]);
                      setRecommendationInsights({});
                      setRecommendationError("");
                      setRecommendationProvider("unknown");
                      setVocationalAnswers({});
                      setVocationalResult(null);
                    }}
                    className={secondaryBtn}
                  >
                    {t("common.restart")}
                  </button>
                </div>
              </div>

              {(comparisonGroups.topRecommended.length > 0 ||
                comparisonGroups.budgetFriendly.length > 0) && (
                <section className="mb-8 space-y-4">
                  <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    {t("results.quickComparisons")}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-500/35 bg-slate-950/55 p-5 shadow-[0_10px_30px_-12px_rgba(37,99,235,0.3)]">
                      <p className="text-lg font-bold leading-tight text-slate-100 sm:text-xl">
                        {t("results.topRecommendedNow")}
                      </p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        {comparisonGroups.topRecommended.map((course) => (
                          <li
                            key={`top-${course.id}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-500/35 bg-slate-900/65 px-3 py-2.5"
                          >
                            <span className="min-w-0 flex-1 truncate text-base font-semibold leading-snug text-slate-100">
                              {localizedCourseName(course)}
                            </span>
                            <button
                              type="button"
                              className="shrink-0 inline-flex min-h-[2.5rem] items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                              onClick={() => openDetails(course.id)}
                            >
                              {t("results.viewOffer")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-slate-500/35 bg-slate-950/55 p-5 shadow-[0_10px_30px_-12px_rgba(37,99,235,0.3)]">
                      <p className="text-lg font-bold leading-tight text-slate-100 sm:text-xl">
                        {t("results.opportunitiesUnder100")}
                      </p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        {comparisonGroups.budgetFriendly.map((course) => (
                          <li
                            key={`budget-${course.id}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-500/35 bg-slate-900/65 px-3 py-2.5"
                          >
                            <span className="min-w-0 flex-1 truncate text-base font-semibold leading-snug text-slate-100">
                              {localizedCourseName(course)}
                            </span>
                            <button
                              type="button"
                              className="shrink-0 inline-flex min-h-[2.5rem] items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                              onClick={() => openDetails(course.id)}
                            >
                              {t("results.viewOffer")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {isLoadingRecommendations && (
                <p className="mb-6 text-center text-sm text-zinc-400 dark:text-zinc-400">
                  {t("results.loadingRecommendations")}
                </p>
              )}

              {!isLoadingRecommendations &&
                recommendationError && (
                  <p className="mb-6 text-center text-sm text-rose-300">
                    {recommendationError}
                  </p>
                )}

              {!isLoadingRecommendations &&
                !recommendationError &&
                exactMatches.length === 0 &&
                similarMatches.length === 0 && (
                <p className="mb-6 text-center text-sm text-slate-400">
                  {t("results.noneFound")}
                </p>
              )}

              {exactMatches.length > 0 && (
                <section
                  className="mb-10 w-full"
                  aria-labelledby="section-exact"
                >
                  <h3
                    id="section-exact"
                    className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-white dark:text-white"
                  >
                    {t("results.exactSection")}
                  </h3>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {exactMatches.map((c) => (
                      <li key={c.id} className="flex flex-col gap-2">
                        {recommendationInsights[c.id] && (
                          <div className="mb-2 rounded-xl border border-blue-800/50 bg-gradient-to-br from-blue-950/45 to-zinc-950/85 p-3 text-zinc-100">
                            <p className="text-base font-extrabold tabular-nums text-blue-200 sm:text-lg">
                              {t("results.affinityScore", {
                                score: recommendationInsights[c.id].score,
                              })}
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-white">
                              {recommendationInsights[c.id].pitch}
                            </p>
                          </div>
                        )}
                        <CourseResultCard
                          course={c}
                          match="exact"
                          detailsButtonClassName={cardDetailsBtn}
                          onOpenDetails={openDetails}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {similarMatches.length > 0 && (
                <section className="w-full" aria-labelledby="section-similar">
                  <h3
                    id="section-similar"
                    className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-white dark:text-white"
                  >
                    {t("results.similarSection")}
                  </h3>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {similarMatches.map((c) => (
                      <li key={c.id} className="flex flex-col">
                        <CourseResultCard
                          course={c}
                          match="similar"
                          detailsButtonClassName={cardDetailsBtn}
                          onOpenDetails={openDetails}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </section>
          )}

          {detailOpen && detailCourse && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-3 py-6 backdrop-blur-md motion-safe:animate-[wizard-enter_0.25s_ease-out_both] sm:py-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="course-detail-title"
            >
              <div className="w-full max-w-2xl rounded-3xl border border-slate-500/35 bg-slate-950/80 p-5 shadow-[0_25px_80px_-20px_rgba(37,99,235,0.35),0_0_0_1px_rgba(255,255,255,0.05)] sm:p-8">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-[0.12em] text-slate-400">
                      {detailCourse.platform}
                    </p>
                    <h2
                      id="course-detail-title"
                      className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-slate-100"
                    >
                      {detailCourseName}
                    </h2>
                    <p className="text-[17px] text-slate-400">
                      {detailCourseInstitution}
                    </p>
                    {detailCourse.isInternational ? (
                      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/35 bg-slate-900/75 px-2.5 py-1 font-medium text-slate-100">
                          {t("details.international")}
                        </span>
                        <span>
                          {t("details.contentOrigin")}: {detailCourse.originCountry}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/35 bg-slate-900/75 px-2.5 py-1 text-xs font-medium text-slate-100">
                          {t("details.brazilFocus")}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="shrink-0 rounded-full border border-slate-500/35 bg-slate-900/70 px-3.5 py-1.5 text-sm font-medium text-slate-100 transition duration-200 hover:-translate-y-px hover:border-slate-300/35 hover:bg-slate-800/80"
                  >
                    {t("common.close")}
                  </button>
                </div>

                <div className="rounded-xl border border-slate-500/35 bg-slate-900/65 px-4 py-3">
                  <p className="text-xs font-medium tracking-[0.12em] text-slate-400">
                    {t("details.priceLabel")}
                  </p>
                  <p className="text-lg font-semibold leading-snug text-slate-100">
                    {detailCourse.priceDisplay}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={openFeedbackGate}
                    disabled={!detailCourseHasValidUrl}
                    title={
                      detailCourseHasValidUrl
                        ? undefined
                        : t("details.linkUnavailable")
                    }
                    className={`${detailsCtaBtn} ${
                      detailCourseHasValidUrl
                        ? ""
                        : "cursor-not-allowed opacity-55 hover:translate-y-0 hover:bg-indigo-600"
                    }`}
                  >
                    {t("details.accessCourse", { defaultValue: "Garantir esta oferta agora" })}
                  </button>
                  {!detailCourseHasValidUrl && (
                    <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                      {t("details.linkUnavailableForCourse")}
                    </p>
                  )}
                  {feedbackThanks && lastFeedback?.courseId === detailCourse.id && (
                    <p className="text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {t("feedback.thanks", { rating: lastFeedback.rating })}
                    </p>
                  )}
                </div>

                <section className="mt-6">
                  <h3 className="text-sm font-medium tracking-[0.12em] text-slate-400">
                    {t("details.about")}
                  </h3>
                  <p className="mt-2 leading-relaxed text-[15px] text-slate-100">
                    {detailAbout}
                  </p>
                </section>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-medium tracking-[0.12em] text-slate-400">
                      {t("details.duration")}
                    </h3>
                    <p className="mt-1 font-medium text-slate-100">
                      {detailDuration}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium tracking-[0.12em] text-slate-400">
                      {t("details.level")}
                    </h3>
                    <p className="mt-1 font-medium text-slate-100">
                      {detailLevel}
                    </p>
                  </div>
                </div>

                <section className="mt-6">
                  <h3 className="text-sm font-medium tracking-[0.12em] text-slate-400">
                    {t("details.prerequisites")}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {detailPrerequisites.map((p) => (
                      <li
                        key={p}
                        className="flex gap-2 text-[15px] text-slate-100"
                      >
                        <span
                          className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                          aria-hidden
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="mt-2" />
              </div>
            </div>
          )}
          {detailOpen && detailCourse && feedbackOpen && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm motion-safe:animate-[wizard-enter_0.25s_ease-out_both] sm:py-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-title"
            >
              <div className="mt-2 w-full max-w-lg rounded-3xl border border-slate-500/35 bg-slate-950/80 p-6 shadow-[0_25px_80px_-20px_rgba(37,99,235,0.35)] sm:mt-4 sm:p-8">
                <h3
                  id="feedback-title"
                  className="text-center text-xl font-semibold text-slate-100 sm:text-2xl"
                >
                  {t("feedback.question")}
                </h3>

                <div
                  className="mt-6 flex items-center justify-center gap-2"
                  onMouseLeave={() => setFeedbackHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (feedbackHover || feedbackRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={t("feedback.starAria", { count: star })}
                        onMouseEnter={() => setFeedbackHover(star)}
                        onFocus={() => setFeedbackHover(star)}
                        onClick={() => setFeedbackRating(star)}
                        className="rounded-md p-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          className={`h-9 w-9 transition-colors ${
                            active
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-slate-700 text-slate-100"
                          }`}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.066 3.282a1 1 0 00.95.69h3.452c.969 0 1.371 1.24.588 1.81l-2.793 2.03a1 1 0 00-.364 1.118l1.067 3.281c.299.922-.755 1.688-1.539 1.118l-2.793-2.03a1 1 0 00-1.176 0l-2.793 2.03c-.783.57-1.838-.196-1.539-1.118l1.067-3.281a1 1 0 00-.364-1.118L2.043 8.71c-.783-.57-.38-1.81.588-1.81h3.452a1 1 0 00.95-.69l1.066-3.282z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackOpen(false);
                      setFeedbackRating(0);
                      setFeedbackHover(0);
                    }}
                    className={secondaryBtn}
                  >
                    {t("common.back")}
                  </button>
                  <button
                    type="button"
                    onClick={submitFeedbackAndAccess}
                    disabled={feedbackRating < 1 || isSubmittingFeedback}
                    className={`${primaryBtn} ${
                      feedbackRating < 1 || isSubmittingFeedback
                        ? "cursor-not-allowed opacity-50 hover:translate-y-0 hover:bg-indigo-600 hover:shadow-indigo-500/30"
                        : ""
                    }`}
                  >
                    {isSubmittingFeedback
                      ? t("feedback.redirectingAuto")
                      : t("feedback.submitAndAccess")}
                  </button>
                </div>
                {feedbackSubmitError && (
                  <p className="mt-3 text-right text-xs text-amber-300">
                    {feedbackSubmitError}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>

        {backgroundFeedbackStatus !== "idle" && (
          <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-slate-500/35 bg-slate-950/90 px-4 py-2 text-xs font-medium text-slate-100 shadow-lg backdrop-blur">
            {backgroundFeedbackStatus === "sending"
              ? t("feedback.sendingBackground")
              : t("feedback.sentSuccess")}
          </div>
        )}
        {redirectingNotice && (
          <div className="pointer-events-none fixed bottom-16 left-1/2 z-[75] -translate-x-1/2 rounded-full border border-blue-500/45 bg-blue-950/85 px-4 py-2 text-xs font-medium text-blue-50 shadow-lg backdrop-blur">
            O site já está sendo carregado e logo aparecerá na tela. Aguarde alguns segundos para o redirecionamento.
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-slate-400">
          <p>{t("footer.disclaimer")}</p>
          <nav
            className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2"
            aria-label="Informações legais"
          >
            <Link
              href="/privacidade"
              className="text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
            >
              Termos
            </Link>
            <Link
              href="/contato"
              className="text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
            >
              Contato
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
