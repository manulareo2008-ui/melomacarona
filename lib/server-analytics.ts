import { appendFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const EVENTS_FILE = join(DATA_DIR, "analytics-events.jsonl");

type StoredEvent = {
  event: string;
  timestamp: string;
} & Record<string, unknown>;

export async function appendServerEvent(
  line: Record<string, unknown>
): Promise<void> {
  const payload: StoredEvent = {
    ...line,
    event: String(line.event ?? "unknown"),
    timestamp:
      typeof line.timestamp === "string"
        ? line.timestamp
        : new Date().toISOString(),
  };
  const row = JSON.stringify(payload) + "\n";
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(EVENTS_FILE, row, "utf8");
}

const MAX_READ_LINES = 8000;

export async function readServerEvents(): Promise<StoredEvent[]> {
  try {
    const raw = await readFile(EVENTS_FILE, "utf8");
    const lines = raw
      .split("\n")
      .filter((l) => l.trim().length > 0)
      .slice(-MAX_READ_LINES);
    return lines.map((l) => JSON.parse(l) as StoredEvent);
  } catch (error) {
    const anyErr = error as NodeJS.ErrnoException;
    if (anyErr.code === "ENOENT") return [];
    throw error;
  }
}

export function getEventsFilePath() {
  return EVENTS_FILE;
}
