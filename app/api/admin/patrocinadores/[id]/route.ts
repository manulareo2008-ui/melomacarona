import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { GENERAL_AREAS } from "@/lib/domain";
import { linksPorAreaFieldSchema } from "@/lib/patrocinadorZod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const GENERAL_AREA_SET = new Set<string>(GENERAL_AREAS);

const optionalUrlNullable = z
  .union([z.literal(""), z.null(), z.string().url()])
  .optional();

const patrocinadorPatchSchema = z
  .object({
    nome: z.string().trim().min(2).max(200).optional(),
    tipo: z.enum(["instituicao", "professor", "plataforma"]).optional(),
    logo_url: optionalUrlNullable,
    site_url: optionalUrlNullable,
    cidades_cobertura: z.array(z.string().trim().min(1)).optional(),
    estados_cobertura: z.array(z.string().trim().min(1)).optional(),
    areas_foco: z
      .array(z.string())
      .optional()
      .superRefine((arr, ctx) => {
        if (!arr) return;
        for (const a of arr) {
          if (!GENERAL_AREA_SET.has(a)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Área inválida: ${a}`,
            });
          }
        }
      }),
    contato_nome: z.string().trim().optional(),
    contato_email: z
      .union([z.literal(""), z.null(), z.string().email()])
      .optional(),
    ativo: z.boolean().optional(),
    links_por_area: linksPorAreaFieldSchema.optional(),
  })
  .strict();

function jsonUnauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

type RouteContext = { params: Promise<{ id: string }> };

function normalizeEmailPatch(
  v: string | undefined | null
): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAdminSessionValid())) {
    return jsonUnauthorized();
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores GET id] Supabase client failed", e);
    return NextResponse.json(
      { ok: false, error: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("patrocinadores")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[patrocinadores GET id]", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, patrocinador: data });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminSessionValid())) {
    return jsonUnauthorized();
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patrocinadorPatchSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Payload inválido";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const p = parsed.data;
  const updates: Record<string, unknown> = {};

  if (p.nome !== undefined) updates.nome = p.nome;
  if (p.tipo !== undefined) updates.tipo = p.tipo;
  if (p.logo_url !== undefined) {
    updates.logo_url =
      p.logo_url === null || p.logo_url === "" ? null : p.logo_url;
  }
  if (p.site_url !== undefined) {
    updates.site_url =
      p.site_url === null || p.site_url === "" ? null : p.site_url;
  }
  if (p.cidades_cobertura !== undefined) {
    updates.cidades_cobertura = p.cidades_cobertura.length ? p.cidades_cobertura : null;
  }
  if (p.estados_cobertura !== undefined) {
    updates.estados_cobertura = p.estados_cobertura.length ? p.estados_cobertura : null;
  }
  if (p.areas_foco !== undefined) {
    updates.areas_foco = p.areas_foco.length ? p.areas_foco : null;
  }
  if (p.contato_nome !== undefined) {
    updates.contato_nome = p.contato_nome.trim() === "" ? null : p.contato_nome.trim();
  }
  if (p.contato_email !== undefined) {
    updates.contato_email = normalizeEmailPatch(p.contato_email) ?? null;
  }
  if (p.ativo !== undefined) updates.ativo = p.ativo;
  if (p.links_por_area !== undefined) {
    updates.links_por_area = p.links_por_area ?? {};
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores PATCH] Supabase client failed", e);
    return NextResponse.json(
      { ok: false, error: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("patrocinadores")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[patrocinadores PATCH]", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, patrocinador: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminSessionValid())) {
    return jsonUnauthorized();
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores DELETE] Supabase client failed", e);
    return NextResponse.json(
      { ok: false, error: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("patrocinadores")
    .update({ ativo: false })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[patrocinadores DELETE]", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
