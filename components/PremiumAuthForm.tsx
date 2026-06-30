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
    <section className="meloma-premium-auth-card">
      <div className="meloma-premium-tabs" role="tablist" aria-label="Modo de acesso">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          onClick={() => setMode("login")}
          className={`meloma-premium-tab ${mode === "login" ? "is-active" : ""}`}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => setMode("signup")}
          className={`meloma-premium-tab ${mode === "signup" ? "is-active" : ""}`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "signup" && (
          <div>
            <label htmlFor="premium-name" className="meloma-premium-field-label">
              Nome
            </label>
            <input
              id="premium-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="meloma-premium-input"
              placeholder="Seu nome"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="premium-email" className="meloma-premium-field-label">
            E-mail
          </label>
          <input
            id="premium-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="meloma-premium-input"
            placeholder="voce@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="premium-password" className="meloma-premium-field-label">
            Senha
          </label>
          <input
            id="premium-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="meloma-premium-input"
            placeholder="********"
            minLength={6}
            required
          />
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className={`meloma-premium-submit ${loading ? "opacity-60" : ""}`}
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
