"use client";

import { useState } from "react";

const btnClass =
  "inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:w-auto";
const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-emerald-500/40 focus:ring-2";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-300";

export function ParceriasContatoForm() {
  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoParceria, setTipoParceria] = useState<
    "institucional" | "professor" | "plataforma"
  >("institucional");
  const [mensagem, setMensagem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/parcerias/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome_instituicao: nomeInstituicao.trim(),
          nome_responsavel: nomeResponsavel.trim(),
          email: email.trim(),
          telefone: telefone.trim() || undefined,
          tipo_parceria: tipoParceria,
          mensagem: mensagem.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Não foi possível enviar. Tente novamente.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Falha de rede. Verifique sua conexão e tente de novo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <p className="rounded-2xl border border-emerald-500/35 bg-emerald-950/40 px-5 py-4 text-center text-sm leading-relaxed text-emerald-200">
        Solicitação enviada com sucesso! Entraremos em contato em breve.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
      <div>
        <label htmlFor="pf-inst" className={labelClass}>
          Nome da instituição
        </label>
        <input
          id="pf-inst"
          name="nome_instituicao"
          type="text"
          required
          minLength={2}
          autoComplete="organization"
          value={nomeInstituicao}
          onChange={(e) => setNomeInstituicao(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="pf-resp" className={labelClass}>
          Nome do responsável
        </label>
        <input
          id="pf-resp"
          name="nome_responsavel"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          value={nomeResponsavel}
          onChange={(e) => setNomeResponsavel(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="pf-email" className={labelClass}>
          E-mail
        </label>
        <input
          id="pf-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="pf-tel" className={labelClass}>
          Telefone/WhatsApp <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="pf-tel"
          name="telefone"
          type="text"
          autoComplete="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="pf-tipo" className={labelClass}>
          Tipo de parceria
        </label>
        <select
          id="pf-tipo"
          name="tipo_parceria"
          required
          value={tipoParceria}
          onChange={(e) =>
            setTipoParceria(e.target.value as typeof tipoParceria)
          }
          className={`${inputClass} cursor-pointer`}
        >
          <option value="institucional">Institucional</option>
          <option value="professor">Professor</option>
          <option value="plataforma">Plataforma</option>
        </select>
      </div>
      <div>
        <label htmlFor="pf-msg" className={labelClass}>
          Mensagem{" "}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <textarea
          id="pf-msg"
          name="mensagem"
          rows={4}
          maxLength={2000}
          placeholder="Conte-nos sobre sua instituição e objetivos"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-y`}
        />
      </div>
      {error && (
        <p className="text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className={`${btnClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {submitting ? "Enviando…" : "Enviar solicitação"}
        </button>
      </div>
    </form>
  );
}
