const DEFAULT_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6h

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

type ProbeResult = {
  ok: boolean;
  status: number | "ERROR" | "TIMEOUT";
  finalUrl?: string;
};

type CacheEntry = ProbeResult & {
  checkedAt: number;
};

const probeCache = new Map<string, CacheEntry>();

function withTimeout(ms: number): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  timer.unref?.();
  return controller.signal;
}

function isUdemyUrl(url: string): boolean {
  return /^(https?:\/\/)?([^/]*\.)?udemy\.com\//i.test(url);
}

function isCacheFresh(entry: CacheEntry | undefined): entry is CacheEntry {
  if (!entry) return false;
  return Date.now() - entry.checkedAt < CACHE_TTL_MS;
}

export function normalizeExternalUrl(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (/^www\./i.test(value)) return `https://${value}`;
  return null;
}

export async function probeExternalUrl(url: string): Promise<ProbeResult> {
  const cached = probeCache.get(url);
  if (isCacheFresh(cached)) {
    return {
      ok: cached.ok,
      status: cached.status,
      finalUrl: cached.finalUrl,
    };
  }

  let result: ProbeResult = { ok: false, status: "ERROR" };
  try {
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: BROWSER_HEADERS,
      signal: withTimeout(DEFAULT_TIMEOUT_MS),
    });

    // Udemy often blocks automated probes with 403 but still works in browser.
    if (isUdemyUrl(url) && head.status === 403) {
      result = { ok: true, status: 403, finalUrl: head.url || url };
    } else if (head.status === 405 || head.status === 403) {
      const get = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: BROWSER_HEADERS,
        signal: withTimeout(DEFAULT_TIMEOUT_MS),
      });
      if (isUdemyUrl(url) && get.status === 403) {
        result = { ok: true, status: 403, finalUrl: get.url || url };
      } else {
        result = { ok: get.ok, status: get.status, finalUrl: get.url || url };
      }
    } else {
      result = { ok: head.ok, status: head.status, finalUrl: head.url || url };
    }
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    result = { ok: false, status: isAbort ? "TIMEOUT" : "ERROR" };
  }

  probeCache.set(url, { ...result, checkedAt: Date.now() });
  return result;
}

function tokenizeCourseName(courseName: string): string[] {
  return courseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4)
    .slice(0, 6);
}

function isUrlRelevantForCourse(url: string, courseName: string | null): boolean {
  if (!courseName?.trim()) return true;
  const tokens = tokenizeCourseName(courseName);
  if (tokens.length === 0) return true;
  const normalizedUrl = decodeURIComponent(url.toLowerCase());

  // Require at least one strong token from the chosen course name.
  return tokens.some((token) => normalizedUrl.includes(token));
}

export type ResolveDestinationFailureReason =
  | "no_url"
  | "strict_rejected"
  | "network";

export type ResolveDestinationResult =
  | { ok: true; url: string }
  | { ok: false; reason: ResolveDestinationFailureReason };

/**
 * Picks target vs fallback using HTTP probes and optional relevance checks.
 * When `courseNameRaw` is non-empty ("strict" mode), never returns an irrelevant URL;
 * if both direct link and fallback fail relevance or probes fail, returns an error.
 */
export async function resolveCourseDestination(
  targetRaw: string | null,
  fallbackRaw: string | null,
  courseNameRaw: string | null = null
): Promise<ResolveDestinationResult> {
  const strict = Boolean(courseNameRaw?.trim());
  const target = normalizeExternalUrl(targetRaw);
  const fallback = normalizeExternalUrl(fallbackRaw);
  const courseName = courseNameRaw?.trim() || null;

  if (!target && !fallback) {
    return { ok: false, reason: "no_url" };
  }

  if (target && !fallback) {
    if (!strict) {
      return { ok: true, url: target };
    }
    const probe = await probeExternalUrl(target);
    if (!probe.ok) {
      return { ok: false, reason: "network" };
    }
    if (!isUrlRelevantForCourse(probe.finalUrl ?? target, courseName)) {
      return { ok: false, reason: "strict_rejected" };
    }
    return { ok: true, url: target };
  }

  if (!target && fallback) {
    if (!strict) {
      return { ok: true, url: fallback };
    }
    const probe = await probeExternalUrl(fallback);
    if (!probe.ok) {
      return { ok: false, reason: "network" };
    }
    if (!isUrlRelevantForCourse(probe.finalUrl ?? fallback, courseName)) {
      return { ok: false, reason: "strict_rejected" };
    }
    return { ok: true, url: fallback };
  }

  const targetProbe = await probeExternalUrl(target!);
  const targetOk =
    targetProbe.ok &&
    isUrlRelevantForCourse(targetProbe.finalUrl ?? target!, courseName);

  if (targetOk) {
    return { ok: true, url: target! };
  }

  const fallbackProbe = await probeExternalUrl(fallback!);
  const fallbackOk =
    fallbackProbe.ok &&
    isUrlRelevantForCourse(fallbackProbe.finalUrl ?? fallback!, courseName);

  if (fallbackOk) {
    return { ok: true, url: fallback! };
  }

  if (!strict) {
    return { ok: true, url: fallback! };
  }

  if (!targetProbe.ok && !fallbackProbe.ok) {
    return { ok: false, reason: "network" };
  }
  return { ok: false, reason: "strict_rejected" };
}
