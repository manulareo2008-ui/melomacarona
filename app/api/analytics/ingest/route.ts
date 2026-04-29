import { appendServerEvent } from "@/lib/server-analytics";
import { z } from "zod";
import { NextResponse } from "next/server";

const bodySchema = z
  .object({
    event: z.string().max(200),
    timestamp: z.string().max(64).optional(),
  })
  .passthrough();

const MAX_BYTES = 12_000;

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Body too large" }, { status: 413 });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const result = bodySchema.safeParse(parsed);
  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
  try {
    await appendServerEvent({
      ...result.data,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ingest] persist failed", error);
    return NextResponse.json(
      { ok: false, error: "Storage error" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
