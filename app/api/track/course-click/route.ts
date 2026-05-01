import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const trackCourseClickSchema = z.object({
  curso_id: z.string().min(1, "curso_id é obrigatório"),
  pagina_origem: z.string().optional().default("acessando-curso"),
  area: z.string().optional(),
  modalidade: z.string().optional(),
  cidade_usuario: z.string().optional(),
  estado_usuario: z.string().optional(),
  sucesso: z.boolean().optional().default(true),
  anon_id: z.string().optional(),
});

function jsonWithCors(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

async function resolveUserIdFromAuthHeader(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
    const token = authHeader.slice("bearer ".length).trim();
    if (!token) return null;

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

export async function OPTIONS() {
  return jsonWithCors({ ok: true }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = trackCourseClickSchema.safeParse(body);

    if (!parsed.success) {
      return jsonWithCors(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Payload inválido" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const userId = await resolveUserIdFromAuthHeader(request);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("course_clicks").insert({
      curso_id: input.curso_id,
      user_id: userId,
      anon_id: input.anon_id ?? null,
      pagina_origem: input.pagina_origem,
      area: input.area ?? null,
      modalidade: input.modalidade ?? null,
      cidade_usuario: input.cidade_usuario ?? null,
      estado_usuario: input.estado_usuario ?? null,
      sucesso: input.sucesso,
    });

    if (error) {
      return jsonWithCors(
        { ok: false, error: error.message || "Falha ao registrar clique" },
        { status: 500 }
      );
    }

    return jsonWithCors({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar tracking";
    return jsonWithCors({ ok: false, error: message }, { status: 500 });
  }
}
