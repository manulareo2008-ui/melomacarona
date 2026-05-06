import type { Metadata } from "next";
import Link from "next/link";
import {
  IconPlanFree,
  IconPlanInstitution,
  IconPlanPremium,
} from "@/components/MelomaIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustNav } from "@/components/TrustNav";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Compare o acesso gratuito e o Premium Melomacarona — recomendações, histórico e conteúdos para sua jornada.",
};

export default function PlanosPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />

      <section className="container py-14 pb-10">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Transparencia</p>
            <h1 className="section-title mt-3">
              Planos pensados para escalar com voce
            </h1>
            <p className="section-subtitle mt-5 text-[var(--text-muted)] leading-relaxed">
              O nucleo do assistente permanece acessivel; o Premium concentra historico,
              experiencias estendidas e conteudos que exigem conta.{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                Cobranca recorrente sera integrada em breve
              </strong>{" "}
              - por ora, o login premium usa a infraestrutura de conta ja disponivel.
            </p>
          </div>
        </ScrollReveal>

        <div className="pricing-grid mx-auto mt-14 max-w-5xl">
          <ScrollReveal delayMs={0}>
            <article className="plan-card relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanFree />
              </div>
              <h2 className="feature-title text-lg">Gratis</h2>
              <p className="plan-desc">
                Quiz completo, recomendacoes e acesso aos guias publicos.
              </p>
              <p className="plan-price-val mt-8">R$ 0</p>
              <Link
                href="/quiz"
                className="btn-plan btn-plan-primary mt-8 inline-flex justify-center text-sm no-underline"
              >
                Comecar gratis
              </Link>
            </article>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <article className="plan-card featured relative pt-8">
              <span className="plan-badge">Em breve</span>
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanPremium />
              </div>
              <h2 className="feature-title text-lg">Premium</h2>
              <p className="plan-desc mt-3 text-[var(--primary-light)] opacity-95">
                Historico de recomendacoes, area logada e evolucoes do produto focadas em quem
                leva a decisao de carreira a serio.
              </p>
              <p className="plan-price-val mt-8 text-xl">Valor em definicao</p>
              <Link
                href="/premium/login"
                className="btn-plan btn-plan-primary mt-6 inline-flex justify-center text-sm no-underline"
              >
                Entrar na área Premium
              </Link>
              <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                Checkout com cartao sera habilitado antes da virada comercial plena.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delayMs={160}>
            <article className="plan-card relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanInstitution />
              </div>
              <h2 className="feature-title text-lg">Instituicoes</h2>
              <p className="plan-desc">
                Licencas, campanhas com marca e relatorios agregados para equipes de captacao.
              </p>
              <p className="plan-name mt-8">Proposta sob medida</p>
              <Link
                href="/parcerias"
                className="btn-plan btn-plan-ghost mt-8 inline-flex justify-center text-sm no-underline"
              >
                Ver parcerias
              </Link>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
