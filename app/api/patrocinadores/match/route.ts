import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cidadeRaw = searchParams.get("cidade")?.trim();
  const estadoRaw = searchParams.get("estado")?.trim().toUpperCase();
  const areaRaw = searchParams.get("area")?.trim();

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores/match] Supabase client failed", e);
    const res = NextResponse.json(
      { ok: false, error: "Serviço indisponível" },
      { status: 503 }
    );
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
    return res;
  }

  const { data, error } = await supabase
    .from("patrocinadores")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) {
    console.error("[patrocinadores/match]", error);
    const res = NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
    return res;
  }

  let rows = data ?? [];

  if (estadoRaw) {
    rows = rows.filter((r) => {
      const arr = r.estados_cobertura as string[] | null;
      if (!arr?.length) return false;
      return arr.some((e) => e.trim().toUpperCase() === estadoRaw);
    });
  }

  if (cidadeRaw) {
    const cityLower = cidadeRaw.toLowerCase();
    rows = rows.filter((r) => {
      const arr = r.cidades_cobertura as string[] | null;
      if (!arr?.length) return false;
      return arr.some((c) => c.trim().toLowerCase() === cityLower);
    });
  }

  if (areaRaw) {
    rows = rows.filter((r) => {
      const arr = r.areas_foco as string[] | null;
      if (!arr?.length) return false;
      return arr.includes(areaRaw);
    });
  }

  const res = NextResponse.json({ ok: true, patrocinadores: rows });
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  return res;
}
