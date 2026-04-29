import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.slice("bearer ".length).trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const userResult = await supabase.auth.getUser(token);
    if (userResult.error || !userResult.data.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const userId = userResult.data.user.id;
    const { data, error } = await supabase
      .from("recomendacoes_ia")
      .select(
        "id, created_at, area, nicho, modalidade, budget, nivel_conhecimento, objetivos, provider, recommendations_payload"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: "Failed to load history." }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error("recommendations-history error", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
