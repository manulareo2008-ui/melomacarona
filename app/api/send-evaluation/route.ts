import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type EvaluationPayload = {
  name: string;
  age: number;
  area: string;
  niche: string;
  rating: number;
};

const ADMIN_EMAIL = "manulareo2008@gmail.com";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parsePayload(body: unknown): EvaluationPayload | null {
  if (!body || typeof body !== "object") return null;

  const raw = body as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const area = typeof raw.area === "string" ? raw.area.trim() : "";
  const niche = typeof raw.niche === "string" ? raw.niche.trim() : "";
  const age = typeof raw.age === "number" ? raw.age : Number.NaN;
  const rating = typeof raw.rating === "number" ? raw.rating : Number.NaN;

  if (!name || !area || !niche) return null;
  if (!Number.isFinite(age) || age < 12 || age > 120) return null;
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;

  return {
    name,
    age: Math.trunc(age),
    area,
    niche,
    rating: Math.trunc(rating),
  };
}

export async function POST(request: Request) {
  const payload = parsePayload(await request.json().catch(() => null));
  if (!payload) {
    console.error("[send-evaluation] Payload inválido recebido");
    return NextResponse.json(
      { ok: false, message: "Payload inválido." },
      { status: 400 }
    );
  }

  // IMPORTANTE: configure estas variáveis no arquivo `.env.local` (nunca no frontend):
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  const host = process.env.SMTP_HOST;
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from || !Number.isFinite(port)) {
    console.error("[send-evaluation] Configuração SMTP ausente ou inválida", {
      hasHost: Boolean(host),
      hasUser: Boolean(user),
      hasPass: Boolean(pass),
      hasFrom: Boolean(from),
      port,
    });
    return NextResponse.json(
      { ok: false, message: "Configuração SMTP ausente." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const subject =
    "[Nova Avaliação] Um aluno concluiu a jornada de busca de cursos!";

  const text = `Olá, administrador. Você recebeu um novo feedback de usuário:
- Nome: ${payload.name}
- Idade: ${payload.age} anos
- Interesse: ${payload.area} > ${payload.niche}
- Avaliação do Site: ${payload.rating} / 5 estrelas`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <p>Olá, administrador. Você recebeu um novo feedback de usuário:</p>
      <ul style="padding-left:18px;margin:8px 0">
        <li><strong>Nome:</strong> ${escapeHtml(payload.name)}</li>
        <li><strong>Idade:</strong> ${payload.age} anos</li>
        <li><strong>Interesse:</strong> ${escapeHtml(payload.area)} &gt; ${escapeHtml(payload.niche)}</li>
        <li><strong>Avaliação do Site:</strong> ${payload.rating} / 5 estrelas</li>
      </ul>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to: ADMIN_EMAIL,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[send-evaluation] Falha no transporte SMTP", {
      error,
      to: ADMIN_EMAIL,
      from,
      host,
      port,
    });
    return NextResponse.json(
      { ok: false, message: "Falha no envio do e-mail." },
      { status: 502 }
    );
  }
}
