import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PREMIUM_SESSION_COOKIE } from "@/lib/premium-auth";

function parseJwtExpFromToken(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded) as { exp?: number };
    return typeof parsed.exp === "number" ? parsed.exp : null;
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, clearCookie = false) {
  const loginUrl = new URL("/premium/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  if (clearCookie) {
    response.cookies.set({
      name: PREMIUM_SESSION_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const isPremiumHistoryPath =
    request.nextUrl.pathname === "/premium/historico" ||
    request.nextUrl.pathname.startsWith("/premium/historico/");

  if (!isPremiumHistoryPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(PREMIUM_SESSION_COOKIE)?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  const exp = parseJwtExpFromToken(token);
  const now = Math.floor(Date.now() / 1000);
  if (!exp || exp <= now) {
    return redirectToLogin(request, true);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectToLogin(request, true);
  }

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!authResponse.ok) {
      return redirectToLogin(request, true);
    }
  } catch {
    return redirectToLogin(request, true);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/premium/historico/:path*"],
};
