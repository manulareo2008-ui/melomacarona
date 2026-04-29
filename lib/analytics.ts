type TrackPayload = Record<string, unknown>;
const ANALYTICS_STORAGE_KEY = "course-wizard-analytics-events-v1";

export type AnalyticsEvent = {
  event: string;
  timestamp: string;
} & TrackPayload;

export const trackEvent = (eventName: string, eventData: TrackPayload = {}) => {
  const payload: AnalyticsEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...eventData,
  };

  // Mantido em console para facilitar plug-in futuro em GA/Mixpanel.
  console.log("[analytics]", payload);

  if (typeof window === "undefined") return;
  try {
    const current = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const list = current ? (JSON.parse(current) as AnalyticsEvent[]) : [];
    const next = [...list.slice(-499), payload];
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("analytics:tracked", { detail: payload })
    );
  } catch (error) {
    console.error("Falha ao persistir evento de analytics", error);
  }

  // Envio nao-bloqueante para agregacao no servidor (admin); localStorage fica no browser.
  const body = JSON.stringify(payload);
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const sent = navigator.sendBeacon(
      "/api/analytics/ingest",
      new Blob([body], { type: "application/json" })
    );
    if (sent) return;
  }
  void fetch("/api/analytics/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
};

export const getTrackedEvents = (): AnalyticsEvent[] => {
  if (typeof window === "undefined") return [];
  try {
    const current = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return current ? (JSON.parse(current) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
};

export const getAnalyticsStorageKey = () => ANALYTICS_STORAGE_KEY;

