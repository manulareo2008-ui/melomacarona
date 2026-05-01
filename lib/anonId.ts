const ANON_ID_KEY = "meloma_anon_id";

function createAnonId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateAnonId(): string {
  const generated = createAnonId();
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return generated;
  }

  try {
    const existing = localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;
    localStorage.setItem(ANON_ID_KEY, generated);
    return generated;
  } catch {
    return generated;
  }
}

export function getAnonId(): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(ANON_ID_KEY);
  } catch {
    return null;
  }
}
