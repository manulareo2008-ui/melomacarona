import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { GENERAL_AREAS } from "@/lib/domain";
import { linksPorAreaFieldSchema } from "@/lib/patrocinadorZod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const GENERAL_AREA_SET = new Set<string>(GENERAL_AREAS);

const optionalUrl = z
  .union([z.literal(""), z.string().url()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : v));

const patrocinadorCreateSchema = z.object({
  nome: z.string().trim().min(2).max(200),
  tipo: z.enum(["instituicao", "professor", "plataforma"]).default("instituicao"),
  logo_url: optionalUrl,
  site_url: optionalUrl,
  cidades_cobertura: z.array(z.string().trim().min(1)).optional().default([]),
  estados_cobertura: z.array(z.string().trim().min(1)).optional().default([]),
  areas_foco: z
    .array(z.string())
    .optional()
    .default([])
    .superRefine((arr, ctx) => {
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
  contato_email: z.union([z.literal(""), z.string().email()]).optional(),
  ativo: z.boolean().optional().default(true),
  links_por_area: linksPorAreaFieldSchema.optional(),
});

function jsonUnauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function normalizeEmail(v: string | undefined): string | null | undefined {
  if (v === undefined) return undefined;
  const t = v.trim();
  return t === "" ? null : t;
}

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return jsonUnauthorized();
  }

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores GET] Supabase client failed", e);
    return NextResponse.json(
      { ok: false, error: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("patrocinadores")
    .select("*")
    .eq("ativo", true)
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("[patrocinadores GET]", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, patrocinadores: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAdminSessionValid())) {
    return jsonUnauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = patrocinadorCreateSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Payload inválido";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const input = parsed.data;
  const row = {
    nome: input.nome,
    tipo: input.tipo,
    logo_url: input.logo_url ?? null,
    site_url: input.site_url ?? null,
    cidades_cobertura: input.cidades_cobertura.length ? input.cidades_cobertura : null,
    estados_cobertura: input.estados_cobertura.length ? input.estados_cobertura : null,
    areas_foco: input.areas_foco.length ? input.areas_foco : null,
    contato_nome: input.contato_nome?.trim() || null,
    contato_email: normalizeEmail(input.contato_email) ?? null,
    ativo: input.ativo,
    links_por_area: input.links_por_area ?? {},
  };

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[patrocinadores POST] Supabase client failed", e);
    return NextResponse.json(
      { ok: false, error: "Configuração do servidor incompleta." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase.from("patrocinadores").insert(row).select().single();

  if (error) {
    console.error("[patrocinadores POST]", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, patrocinador: data }, { status: 201 });
}
