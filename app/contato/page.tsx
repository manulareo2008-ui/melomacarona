import type { Metadata } from "next";
import { IconEnvelope } from "@/components/MelomaIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TrustArticleShell } from "@/components/TrustArticleShell";
import { getPublicContactEmail } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe Melomacarona — parcerias, suporte e dúvidas gerais.",
};

export default function ContatoPage() {
  const email = getPublicContactEmail();

  return (
    <TrustArticleShell
      title="Contato"
      subtitle="Canal oficial para parcerias, suporte e questões sobre privacidade e termos. Respostas em horário comercial, conforme capacidade da equipe."
    >
      <ScrollReveal>
        <div className="meloma-contact-panel flex flex-col gap-4 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <span className="text-[var(--primary-light)]" aria-hidden>
              <IconEnvelope size={32} />
            </span>
            <div>
              <p className="meloma-label-caps text-[var(--text-muted)]">E-mail</p>
              <a
                href={`mailto:${encodeURIComponent(email)}`}
                className="mt-2 inline-block text-lg font-semibold text-[var(--primary-light)] underline-offset-4 transition hover:text-[var(--primary-light)] hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <section className="meloma-contact-panel mt-10 space-y-4 p-8 md:p-10">
          <h2 className="meloma-heading-xl text-xl">Parcerias e instituições</h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Propostas comerciais para faculdades, CREPs ou produtores de conteúdo: envie
            contexto, público-alvo e modelo de colaboração desejado no primeiro contato —
            isso agiliza análise.
          </p>
        </section>
      </ScrollReveal>
    </TrustArticleShell>
  );
}
