import { NextResponse } from "next/server";
import { resolveCourseDestination } from "@/lib/courseLinkResolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");
  const fallback = searchParams.get("fallback");
  const course = searchParams.get("course");

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

  return NextResponse.json({ ok: true, resolvedUrl: result.url });
}
