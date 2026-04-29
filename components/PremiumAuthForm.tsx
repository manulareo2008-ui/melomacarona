"use client";

import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export function PremiumAuthForm() {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, []);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!supabase) {
        throw new Error(
          "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local."
        );
      }
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (signUpError) throw signUpError;
        setMessage(
          "Cadastro realizado. Verifique seu e-mail para confirmar a conta (se a confirmação estiver ativa)."
        );
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        const accessToken = signInData.session?.access_token;
        if (!accessToken) {
          throw new Error("Sessão inválida após login. Tente novamente.");
        }
        await fetch("/api/premium/session", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        router.push("/premium/historico");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="new-card-rise mx-auto w-full max-w-md rounded-3xl border border-slate-500/35 bg-slate-950/80 p-6 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.45)]">
      <div className="mb-5 flex rounded-full border border-slate-500/35 bg-slate-900/70 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
              : "text-slate-300 hover:text-slate-100"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${
            mode === "signup"
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
              : "text-slate-300 hover:text-slate-100"
          }`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-100">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-500/35 bg-slate-900/65 px-3 py-2.5 text-slate-100 outline-none ring-blue-500/60 transition focus:ring-2"
              placeholder="Seu nome"
              required
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-100">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-500/35 bg-slate-900/65 px-3 py-2.5 text-slate-100 outline-none ring-blue-500/60 transition focus:ring-2"
            placeholder="voce@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-100">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-500/35 bg-slate-900/65 px-3 py-2.5 text-slate-100 outline-none ring-blue-500/60 transition focus:ring-2"
            placeholder="********"
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 ${
            loading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {loading
            ? "Processando..."
            : mode === "login"
              ? "Entrar na área premium"
              : "Criar conta premium"}
        </button>
      </form>
    </section>
  );
}
