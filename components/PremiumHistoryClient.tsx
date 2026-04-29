"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type HistoryItem = {
  id: string;
  created_at: string;
  area: string;
  nicho: string;
  modalidade: string;
  budget: number;
  nivel_conhecimento: string;
  objetivos: string;
  provider: string;
  recommendations_payload: Array<{
    id: string;
    nome: string;
    score_afinidade: number;
    pitch_venda: string;
  }>;
};

export function PremiumHistoryClient() {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<HistoryItem[]>([]);

  async function syncPremiumSessionCookie(accessToken: string) {
    await fetch("/api/premium/session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  useEffect(() => {
    async function loadHistory() {
      try {
        if (!supabase) {
          throw new Error(
            "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local."
          );
        }
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          router.push("/premium/login");
          return;
        }
        await syncPremiumSessionCookie(token);

        const response = await fetch("/api/premium/recommendations-history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar o histórico premium.");
        }

        const payload = (await response.json()) as { items?: HistoryItem[] };
        setItems(payload.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, [router, supabase]);

  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") &&
        session?.access_token
      ) {
        void syncPremiumSessionCookie(session.access_token);
      }
      if (event === "SIGNED_OUT") {
        void fetch("/api/premium/session", {
          method: "DELETE",
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    if (!supabase) {
      router.push("/premium/login");
      return;
    }
    await fetch("/api/premium/session", {
      method: "DELETE",
    });
    await supabase.auth.signOut();
    router.push("/premium/login");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-300">Carregando histórico premium...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Histórico de recomendações IA</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="new-btn new-btn-ghost"
        >
          Sair
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-slate-500/35 bg-slate-950/70 p-4 text-sm text-slate-200">
          Você ainda não possui recomendações salvas.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="new-card-rise rounded-2xl border border-slate-500/35 bg-slate-950/70 p-5"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                {new Date(item.created_at).toLocaleString("pt-BR")} · {item.provider}
              </p>
              <p className="mt-2 text-sm text-slate-100">
                <span className="font-semibold">Perfil:</span> {item.area} · {item.nicho} ·{" "}
                {item.modalidade} · {item.nivel_conhecimento}
              </p>
              <p className="mt-1 text-sm text-slate-100">
                <span className="font-semibold">Objetivos:</span> {item.objetivos}
              </p>
              <p className="mt-1 text-sm text-slate-100">
                <span className="font-semibold">Orçamento:</span> R$ {item.budget}
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {item.recommendations_payload?.slice(0, 5).map((rec) => (
                  <article
                    key={`${item.id}-${rec.id}`}
                    className="rounded-xl border border-slate-500/35 bg-slate-900/65 p-3"
                  >
                    <p className="text-sm font-semibold text-slate-100">{rec.nome}</p>
                    <p className="text-xs text-blue-300">Afinidade: {rec.score_afinidade}/100</p>
                    <p className="mt-1 text-xs text-slate-100">{rec.pitch_venda}</p>
                  </article>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
