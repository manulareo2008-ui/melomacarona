import { NextResponse } from "next/server";
import {
  getAllActiveCourses,
  getCourseById,
  getCoursesByFilter,
  getCoursesByIds,
} from "@/lib/supabase/courses";

function withCache(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  return response;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const idsParam = searchParams.get("ids");
    const area = searchParams.get("area") ?? undefined;
    const modalidade = searchParams.get("modalidade") ?? undefined;
    const publicoAlvo = searchParams.get("publicoAlvo") ?? undefined;
    const maxPriceRaw = searchParams.get("maxPrice");
    const maxPrice =
      maxPriceRaw !== null && maxPriceRaw.trim() !== "" && !Number.isNaN(Number(maxPriceRaw))
        ? Number(maxPriceRaw)
        : undefined;

    if (id) {
      const course = await getCourseById(id);
      return withCache(NextResponse.json({ ok: true, course }));
    }

    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      const courses = await getCoursesByIds(ids);
      return withCache(NextResponse.json({ ok: true, courses }));
    }

    const hasFilters =
      area !== undefined ||
      modalidade !== undefined ||
      publicoAlvo !== undefined ||
      maxPrice !== undefined;

    if (hasFilters) {
      const courses = await getCoursesByFilter({
        area,
        modalidade,
        publicoAlvo,
        maxPrice,
      });
      return withCache(NextResponse.json({ ok: true, courses }));
    }

    const courses = await getAllActiveCourses();
    return withCache(NextResponse.json({ ok: true, courses }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado em /api/courses";
    return withCache(NextResponse.json({ ok: false, error: message }, { status: 500 }));
  }
}
