import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_TOKEN_COOKIE_NAME,
  getExpectedAdminToken,
} from "@/lib/admin-auth";

const bodySchema = z.object({
  password: z.string().min(1).max(200),
  next: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!password || !secret) {
    return NextResponse.json(
      { ok: false, error: "Admin not configured (env)" },
      { status: 503 }
    );
  }

  const raw = (await request.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  if (parsed.data.password !== password) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const token = getExpectedAdminToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Token generation failed" },
      { status: 500 }
    );
  }

  const nextPath = parsed.data.next?.startsWith("/") ? parsed.data.next : "/admin/metricas";
  const res = NextResponse.json({ ok: true, next: nextPath });
  res.cookies.set(ADMIN_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
