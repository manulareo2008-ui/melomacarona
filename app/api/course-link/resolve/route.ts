import { NextResponse } from "next/server";
import { resolveCourseDestination, normalizeExternalUrl } from "@/lib/courseLinkResolver";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function trackAffiliateClick(
  courseId: string | null,
  affiliateLink: string,
  request: Request
): Promise<void> {
  try {
    const supabase = createServerSupabaseClient();
    let userId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.toLowerCase().startsWith("bearer ")) {
      const token = authHeader.slice("bearer ".length).trim();
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id ?? null;
    }
    await supabase.from("affiliate_clicks").insert({
      curso_id: courseId ?? "unknown",
      affiliate_link: affiliateLink,
      user_id: userId,
      pagina_origem: request.headers.get("referer") ?? "acessando-curso",
    });
  } catch {
    // fire-and-forget — tracking failure must never block navigation
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const affiliateLinkRaw = searchParams.get("affiliateLink");
  const courseId = searchParams.get("courseId");
  const target = searchParams.get("target");
  const fallback = searchParams.get("fallback");
  const course = searchParams.get("course");

  const affiliateLink = normalizeExternalUrl(affiliateLinkRaw);
  if (affiliateLink) {
    void trackAffiliateClick(courseId, affiliateLink, request);
    return NextResponse.json({ ok: true, resolvedUrl: affiliateLink, isAffiliate: true });
  }

  const result = await resolveCourseDestination(target, fallback, course);
  if (!result.ok) {
    const status =
      result.reason === "no_url"
        ? 400
        : result.reason === "network"
          ? 503
          : 422;
    return NextResponse.json(
      { ok: false, reason: result.reason },
      { status }
    );
  }

  return NextResponse.json({ ok: true, resolvedUrl: result.url, isAffiliate: false });
}
