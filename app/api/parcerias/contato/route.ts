import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const parceriaContatoSchema = z.object({
  nome_instituicao: z.string().trim().min(2),
  nome_responsavel: z.string().trim().min(2),
  email: z.string().trim().email(),
  telefone: z.string().trim().optional(),
  tipo_parceria: z.enum(["institucional", "professor", "plataforma"]),
  mensagem: z.string().trim().max(2000).optional(),
});

const NOTIFY_EMAIL = "manulareo2008@gmail.com";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido." },
      { status: 400 }
    );
  }

  const parsed = parceriaContatoSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const data = parsed.data;
  const emailLower = data.email.toLowerCase();

  let supabase: ReturnType<typeof createServerSupabaseClient>;
  try {
    supabase = createServerSupabaseClient();
  } catch (e) {
    console.error("[parcerias/contato] Supabase indisponível", e);
    return NextResponse.json(
      { ok: false, error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("marketing_leads").upsert(
    {
      email: emailLower,
      nome: data.nome_responsavel,
      area_interesse: data.tipo_parceria,
      origem: "pagina-parcerias",
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("[parcerias/contato] Erro ao salvar lead", error);
    return NextResponse.json(
      { ok: false, error: "Não foi possível registrar sua solicitação." },
      { status: 500 }
    );
  }

  const host = process.env.SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (host && user && pass && from && Number.isFinite(port)) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const telefone = data.telefone?.trim() || "—";
      const mensagem = data.mensagem?.trim() || "—";
      const tipoLabel: Record<string, string> = {
        institucional: "Institucional",
        professor: "Professor / Criador",
        plataforma: "Plataforma",
      };

      const subject = `[Parcerias] Novo contato: ${data.nome_instituicao}`;

      const text = `Novo lead da página de parcerias

Instituição: ${data.nome_instituicao}
Responsável: ${data.nome_responsavel}
E-mail: ${data.email}
Telefone/WhatsApp: ${telefone}
Tipo: ${tipoLabel[data.tipo_parceria] ?? data.tipo_parceria}

Mensagem:
${mensagem}
`;

      const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="font-size:18px">Novo lead — página de parcerias</h2>
      <ul style="padding-left:18px;margin:8px 0">
        <li><strong>Instituição:</strong> ${escapeHtml(data.nome_instituicao)}</li>
        <li><strong>Responsável:</strong> ${escapeHtml(data.nome_responsavel)}</li>
        <li><strong>E-mail:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>Telefone/WhatsApp:</strong> ${escapeHtml(telefone)}</li>
        <li><strong>Tipo:</strong> ${escapeHtml(tipoLabel[data.tipo_parceria] ?? data.tipo_parceria)}</li>
      </ul>
      <p><strong>Mensagem</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(mensagem)}</p>
    </div>
  `;

      await transporter.sendMail({
        from,
        to: NOTIFY_EMAIL,
        replyTo: data.email,
        subject,
        text,
        html,
      });
    } catch (err) {
      console.error("[parcerias/contato] Falha no envio de e-mail (lead já salvo)", err);
    }
  } else {
    console.log(
      "[parcerias/contato] SMTP não configurado; lead processado sem e-mail de notificação."
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
