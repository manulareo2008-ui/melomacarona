"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin/metricas";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, next }),
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        next?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Nao foi possivel entrar");
        return;
      }
      const target =
        typeof data.next === "string" && data.next.startsWith("/")
          ? data.next
          : "/admin/metricas";
      router.push(target);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-100">
        Acesso ao painel
      </h1>
      <p className="mt-2 text-sm text-white">
        Metricas agregadas a partir do envio de eventos (ingest) no servidor. O publico
        nao enxerga estes numeros.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-white">
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            required
          />
        </label>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 disabled:opacity-60"
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link href="/" className="text-white underline">
          Voltar ao site
        </Link>
      </p>
    </main>
  );
}
