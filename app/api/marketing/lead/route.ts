import { NextResponse } from "next/server";
import { z } from "zod";
import { GENERAL_AREAS } from "@/lib/domain";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().trim().email(),
  nome: z.string().trim().min(1).max(120).optional(),
  area_interesse: z.enum(GENERAL_AREAS).optional(),
  origem: z.string().trim().min(1).max(40).optional().default("wizard"),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload invalido.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let supabase;
    try {
      supabase = createServerSupabaseClient();
    } catch (envError) {
      console.warn("marketing lead skipped: supabase env missing", envError);
      // Não bloqueia o fluxo principal do usuário quando o backend de leads não está configurado.
      return NextResponse.json(
        { ok: true, skipped: "supabase-env-missing" },
        { status: 202 }
      );
    }
    const { error } = await supabase.from("marketing_leads").upsert(
      {
        email: data.email.toLowerCase(),
        nome: data.nome ?? null,
        area_interesse: data.area_interesse ?? null,
        origem: data.origem,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );

    if (error) {
      console.error("marketing lead upsert error", error);
      return NextResponse.json({ error: "Falha ao salvar lead." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("marketing lead route error", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
