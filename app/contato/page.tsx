import type { Metadata } from "next";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import { getPublicContactEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe Melomacarona — parcerias, suporte e dúvidas gerais.",
};

export default function ContatoPage() {
  const email = getPublicContactEmail();

  return (
    <TrustArticleShell title="Contato">
      <p>
        Para parcerias institucionais, suporte a usuários ou questões sobre privacidade e
        termos, utilize o canal oficial abaixo. Respostas em horário comercial, conforme
        capacidade da equipe.
      </p>

      {email ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">E-mail</p>
          <a
            href={`mailto:${encodeURIComponent(email)}`}
            className="mt-1 block text-lg font-semibold text-indigo-300 hover:text-indigo-200 hover:underline"
          >
            {email}
          </a>
        </div>
      ) : (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-300">
          O e-mail público ainda não foi configurado. Defina{" "}
          <code className="text-indigo-300">NEXT_PUBLIC_CONTACT_EMAIL</code> em{" "}
          <code className="text-indigo-300">.env.local</code> antes de divulgar o site.
        </p>
      )}

      <section className="space-y-2 pt-4">
        <h2 className="text-lg font-semibold text-white">Parcerias e instituições</h2>
        <p>
          Propostas comerciais para faculdades, CREPs ou produtores de conteúdo: envie
          contexto, público-alvo e modelo de colaboração desejado no primeiro contato — isso
          agiliza análise.
        </p>
      </section>
    </TrustArticleShell>
  );
}
