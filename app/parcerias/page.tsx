import type { Metadata } from "next";
import Link from "next/link";
import { IconListCheck } from "@/components/MelomaIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TrustArticleShell } from "@/components/TrustArticleShell";

export const metadata: Metadata = {
  title: "Parcerias",
  description:
    "Instituições e educadores: colabore com o Melomacarona para alcançar estudantes com perfil alinhado.",
};

const offerings = [
  "Presença em fluxos de recomendação com critérios transparentes.",
  "Materiais de divulgação e mensuração agregada de interesse (sem violar LGPD).",
  "Possibilidade de modelos por campanha, licença ou indicadores acordados.",
];

export default function ParceriasPage() {
  return (
    <TrustArticleShell
      eyebrow="Parcerias"
      title="Parcerias institucionais e educadores"
      subtitle="Tráfego qualificado e narrativa clara da sua oferta no momento da decisão — conectamos intenção de estudo a trilhas alinhadas ao perfil."
    >
      <ScrollReveal>
        <section className="space-y-5">
          <h2 className="meloma-heading-xl text-xl text-[var(--text-primary)]">
            O que oferecemos (roadmap)
          </h2>
          <ul className="space-y-4">
            {offerings.map((text) => (
              <li key={text} className="meloma-partners-check-row">
                <IconListCheck size={22} aria-hidden />
                <span className="text-[var(--text-muted)] leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Integrações comerciais e contratos formais entram após alinhamento jurídico e
            técnico — veja abaixo o que precisamos do parceiro para avançar.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <section className="meloma-card-surface mt-8 space-y-4 p-8">
          <h2 className="meloma-heading-xl text-xl">Próximo passo</h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Envie uma mensagem pela página{" "}
            <Link
              href="/contato"
              className="font-semibold text-[var(--primary-light)] underline-offset-2 hover:underline"
            >
              Contato
            </Link>{" "}
            com: nome da instituição ou marca, site, público-alvo e tipo de parceria desejada
            (destaque no catálogo, campanha regional, afiliados, etc.).
          </p>
          <Link href="/contato" className="meloma-btn-primary mt-2 inline-flex text-sm no-underline">
            Ir para contato
          </Link>
        </section>
      </ScrollReveal>
    </TrustArticleShell>
  );
}
