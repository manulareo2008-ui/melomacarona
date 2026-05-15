import type { Metadata } from "next";
import Link from "next/link";
import {
  IconPlanFree,
  IconPlanInstitution,
} from "@/components/MelomaIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import InternalHeader from "@/components/InternalHeader";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Como o Melomacarona funciona — gratuito para alunos, sustentado por instituições parceiras que valorizam alcance qualificado.",
};

export default function PlanosPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <InternalHeader />

      <section className="container py-14 pb-10">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Transparência</p>
            <h1 className="section-title mt-3">
              Gratuito para alunos. Sempre.
            </h1>
            <p className="section-subtitle mt-5 text-[var(--text-muted)] leading-relaxed">
              O Melomacarona não cobra de quem está procurando curso. Nossa receita vem
              de instituições de ensino que querem alcance qualificado e relevante —
              não banner para todo mundo, mas presença para alunos com perfil real de
              compra.{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                Sem paywall, sem cadastro obrigatório, sem dado vendido.
              </strong>
            </p>
          </div>
        </ScrollReveal>

        <div className="pricing-grid mx-auto mt-14 max-w-4xl">
          <ScrollReveal delayMs={0}>
            <article className="plan-card relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanFree />
              </div>
              <h2 className="feature-title text-lg">Para alunos</h2>
              <p className="plan-desc">
                Quiz completo, recomendações personalizadas por afinidade e acesso
                a todos os guias editoriais — sem nenhuma cobrança, agora ou no futuro.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Recomendação em menos de 2 minutos</li>
                <li>• 9 áreas de conhecimento cobertas</li>
                <li>• Guias editoriais sem patrocínio oculto</li>
                <li>• Sem cadastro para usar</li>
              </ul>
              <p className="plan-price-val mt-8">R$ 0</p>
              <Link
                href="/quiz"
                className="btn-plan btn-plan-primary mt-6 inline-flex justify-center text-sm no-underline"
              >
                Começar agora
              </Link>
            </article>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <article className="plan-card featured relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanInstitution />
              </div>
              <h2 className="feature-title text-lg">Para instituições</h2>
              <p className="plan-desc mt-3 text-[var(--primary-light)] opacity-95">
                Coloque seus cursos na frente de alunos com perfil real e afinidade
                comprovada. Dois modelos de parceria, valores definidos em conversa
                conforme volume e objetivo.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Parceiro Destaque: badge visual e página própria</li>
                <li>• Spotlight Garantido: exibição no momento de decisão</li>
                <li>• Dashboard de impressões, cliques e CTR</li>
                <li>• Página institucional /parcerias/sua-marca</li>
              </ul>
              <p className="plan-price-val mt-8 text-xl">Proposta sob medida</p>
              <Link
                href="/parcerias"
                className="btn-plan btn-plan-primary mt-6 inline-flex justify-center text-sm no-underline"
              >
                Conhecer planos institucionais
              </Link>
              <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                Cadastro em formulário próprio — retorno em até 48 horas úteis.
              </p>
            </article>
          </ScrollReveal>
        </div>

        <ScrollReveal delayMs={240}>
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <p className="section-eyebrow">Por que assim</p>
            <h2 className="feature-title text-lg mt-3">
              Modelo alinhado, não conflitante
            </h2>
            <p className="section-subtitle mt-5 text-[var(--text-muted)] leading-relaxed">
              Plataformas que cobram do aluno têm incentivo a empurrar venda. Plataformas
              de afiliado puro têm incentivo a vender qualquer curso. O Melomacarona
              só ganha quando uma instituição parceira ganha um aluno realmente
              alinhado — e o aluno ganha quando encontra o curso certo. Os três
              interesses caminham juntos.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  );
}
