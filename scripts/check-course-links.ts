import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { INTERNATIONAL_COURSES } from "../lib/coursesData";

type CheckResult = {
  id: string;
  name: string;
  url: string;
  status: number | "TIMEOUT" | "ERROR";
  ok: boolean;
  detail?: string;
};

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_CONCURRENCY = 12;
const OUTPUT_DIR = join(process.cwd(), "logs");
const OUTPUT_FILE = join(OUTPUT_DIR, "course-link-check.log");
const COURSE_DATA_FILE = join(process.cwd(), "lib", "coursesData.ts");

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function isUdemyUrl(url: string): boolean {
  return /^(https?:\/\/)?([^/]*\.)?udemy\.com\//i.test(url);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(signalMs: number): AbortSignal {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), signalMs);
  id.unref?.();
  return controller.signal;
}

async function probeUrl(
  url: string,
  timeoutMs: number
): Promise<{ ok: boolean; status: number; assumeBrowserOk?: boolean }> {
  const head = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: BROWSER_HEADERS,
    signal: withTimeout(timeoutMs),
  });
  if (isUdemyUrl(url) && head.status === 403) {
    return { ok: true, status: 403, assumeBrowserOk: true };
  }
  if (head.status === 405 || head.status === 403) {
    const get = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: BROWSER_HEADERS,
      signal: withTimeout(timeoutMs),
    });
    if (!get.ok && isUdemyUrl(url) && get.status === 403) {
      return { ok: true, status: get.status, assumeBrowserOk: true };
    }
    return { ok: get.ok, status: get.status };
  }
  return { ok: head.ok, status: head.status };
}

async function checkCourse(
  course: (typeof INTERNATIONAL_COURSES)[number],
  timeoutMs: number
): Promise<CheckResult> {
  const url = (course.registrationUrl ?? "").trim();
  if (!url) {
    return {
      id: course.id,
      name: course.name,
      url,
      status: "ERROR",
      ok: false,
      detail: "URL vazia",
    };
  }
  if (!/^https?:\/\//i.test(url)) {
    return {
      id: course.id,
      name: course.name,
      url,
      status: "ERROR",
      ok: false,
      detail: "URL malformada (esperado http/https)",
    };
  }

  const attempts = 2;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await probeUrl(url, timeoutMs);
      const detail = response.assumeBrowserOk
        ? "OK (Udemy bloqueia verificacao automatica; costuma abrir no navegador)"
        : response.ok
          ? "OK"
          : "HTTP não-2xx";
      return {
        id: course.id,
        name: course.name,
        url,
        status: response.status,
        ok: response.ok,
        detail:
          attempt > 0 && response.ok
            ? `${detail} (ok apos nova tentativa)`
            : detail,
      };
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      if (isAbort && attempt < attempts - 1) {
        await delay(800);
        continue;
      }
      return {
        id: course.id,
        name: course.name,
        url,
        status: isAbort ? "TIMEOUT" : "ERROR",
        ok: false,
        detail: isAbort ? `Timeout > ${timeoutMs}ms` : String(error),
      };
    }
  }
  return {
    id: course.id,
    name: course.name,
    url,
    status: "ERROR",
    ok: false,
    detail: "Falha inesperada no checker",
  };
}

async function runInBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const out: R[] = [];
  let idx = 0;
  while (idx < items.length) {
    const batch = items.slice(idx, idx + concurrency);
    const results = await Promise.all(batch.map(worker));
    out.push(...results);
    idx += concurrency;
  }
  return out;
}

function toLogLine(item: CheckResult): string {
  const status = typeof item.status === "number" ? String(item.status) : item.status;
  return `[${item.ok ? "OK" : "BROKEN"}] (${status}) ${item.name} | ${item.url} | ${item.detail ?? ""}`;
}

function readArg(name: string): string | null {
  const token = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!token) return null;
  return token.slice(name.length + 1);
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function parsePositiveInt(raw: string | null, fallback: number): number {
  const value = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildPlatformSearchUrl(course: (typeof INTERNATIONAL_COURSES)[number]): string {
  const query = encodeURIComponent(course.name.trim());
  const platform = course.platform.toLowerCase();
  if (platform.includes("coursera")) return `https://www.coursera.org/search?query=${query}`;
  if (platform.includes("edx")) return `https://www.edx.org/search?q=${query}`;
  if (platform.includes("udemy")) return `https://www.udemy.com/courses/search/?q=${query}`;
  if (platform.includes("harvard")) return `https://pll.harvard.edu/catalog?keywords=${query}`;
  if (platform.includes("mit")) return `https://www.edx.org/school/mitx`;
  return `https://www.google.com/search?q=${query}+curso`;
}

async function autoFixBrokenRegistrationUrls(
  broken: CheckResult[]
): Promise<{ fixedCount: number; unresolvedIds: string[] }> {
  if (broken.length === 0) return { fixedCount: 0, unresolvedIds: [] };

  const byId = new Map(INTERNATIONAL_COURSES.map((c) => [c.id, c]));
  let source = await readFile(COURSE_DATA_FILE, "utf8");
  let fixedCount = 0;
  const unresolvedIds: string[] = [];

  for (const item of broken) {
    const course = byId.get(item.id);
    if (!course) {
      unresolvedIds.push(item.id);
      continue;
    }
    const replacement = buildPlatformSearchUrl(course);
    const escapedId = item.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockRegex = new RegExp(
      `("${escapedId}"\\s*:\\s*\\{[\\s\\S]*?registrationUrl\\s*:\\s*")([^"]+)(")`,
      "m"
    );

    if (!blockRegex.test(source)) {
      unresolvedIds.push(item.id);
      continue;
    }
    source = source.replace(blockRegex, `$1${replacement}$3`);
    fixedCount += 1;
  }

  if (fixedCount > 0) {
    await writeFile(COURSE_DATA_FILE, source, "utf8");
  }
  return { fixedCount, unresolvedIds };
}

async function main() {
  const timeoutMs = parsePositiveInt(readArg("--timeout"), DEFAULT_TIMEOUT_MS);
  const concurrency = parsePositiveInt(readArg("--concurrency"), DEFAULT_CONCURRENCY);
  const limit = parsePositiveInt(readArg("--limit"), INTERNATIONAL_COURSES.length);
  const autoFix = hasFlag("--autofix");
  const list = INTERNATIONAL_COURSES.slice(0, Math.min(limit, INTERNATIONAL_COURSES.length));

  console.log(
    `Verificando ${list.length} cursos (timeout=${timeoutMs}ms, concorrencia=${concurrency})...`
  );
  const checked = await runInBatches(
    list,
    (course) => checkCourse(course, timeoutMs),
    concurrency
  );
  const broken = checked.filter((item) => !item.ok);
  const ok = checked.length - broken.length;

  await mkdir(OUTPUT_DIR, { recursive: true });
  const report = [
    "# Course Link Check Report",
    `Total: ${checked.length}`,
    `Validos (2xx): ${ok}`,
    `Quebrados/indisponiveis: ${broken.length}`,
    "",
    "## Quebrados",
    ...broken.map(toLogLine),
    "",
    "## Todos os resultados",
    ...checked.map(toLogLine),
    "",
  ].join("\n");

  await writeFile(OUTPUT_FILE, report, "utf8");

  console.log(`\nValidos: ${ok}`);
  console.log(`Quebrados: ${broken.length}`);
  console.log(`Relatorio: ${OUTPUT_FILE}`);

  let unresolvedAfterAutofix = broken;
  if (autoFix && broken.length > 0) {
    const { fixedCount, unresolvedIds } = await autoFixBrokenRegistrationUrls(broken);
    console.log(`\nAutofix aplicado em ${fixedCount} curso(s).`);
    if (unresolvedIds.length > 0) {
      console.log(`Sem autofix para: ${unresolvedIds.join(", ")}`);
    }
    unresolvedAfterAutofix = broken.filter((item) => unresolvedIds.includes(item.id));
  }

  if (broken.length > 0) {
    console.log("\nLinks com problema:");
    for (const item of broken) {
      console.log(`- (${item.status}) ${item.name} -> ${item.url}`);
    }
    if (!autoFix || unresolvedAfterAutofix.length > 0) {
      process.exitCode = 1;
    }
  }
}

void main();
