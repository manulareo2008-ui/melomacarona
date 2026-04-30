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
            <p className="meloma-badge-pill meloma-plan-header-badge">Transparência</p>
            <h1 className="meloma-heading-xl mt-5 text-3xl sm:text-4xl">
              Planos pensados para escalar com você
            </h1>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed">
              O núcleo do assistente permanece acessível; o Premium concentra histórico,
              experiências estendidas e conteúdos que exigem conta.{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                Cobrança recorrente será integrada em breve
              </strong>{" "}
              — por ora, o login premium usa a infraestrutura de conta já disponível.
            </p>
          </div>
        </ScrollReveal>

        <div className="meloma-plan-grid mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          <ScrollReveal delayMs={0}>
            <article className="meloma-plan-card relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanFree />
              </div>
              <h2 className="text-lg font-bold">Grátis</h2>
              <p className="mt-3 flex-1 text-sm text-[var(--text-muted)] leading-relaxed">
                Quiz completo, recomendações e acesso aos guias públicos.
              </p>
              <p className="meloma-plan-price mt-8">R$ 0</p>
              <Link
                href="/quiz"
                className="meloma-btn-primary mt-8 inline-flex justify-center text-sm no-underline"
              >
                Começar grátis
              </Link>
            </article>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <article className="meloma-plan-card meloma-plan-card--premium relative pt-8">
              <span className="meloma-plan-ribbon">Em breve</span>
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanPremium />
              </div>
              <h2 className="text-lg font-bold">Premium</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--primary-light)] opacity-95">
                Histórico de recomendações, área logada e evoluções do produto focadas em quem
                leva a decisão de carreira a sério.
              </p>
              <p className="meloma-plan-price mt-8 text-xl">Valor em definição</p>
              <Link
                href="/premium/login"
                className="meloma-btn-primary mt-6 inline-flex justify-center text-sm no-underline"
              >
                Entrar na área Premium
              </Link>
              <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                Checkout com cartão será habilitado antes da virada comercial plena.
              </p>
            </article>
          </ScrollReveal>

          <ScrollReveal delayMs={160}>
            <article className="meloma-plan-card relative">
              <div className="mb-4 text-[var(--primary-light)]" aria-hidden>
                <IconPlanInstitution />
              </div>
              <h2 className="text-lg font-bold">Instituições</h2>
              <p className="mt-3 flex-1 text-sm text-[var(--text-muted)] leading-relaxed">
                Licenças, campanhas com marca e relatórios agregados para equipes de captação.
              </p>
              <p className="mt-8 text-sm font-semibold text-[var(--text-muted)]">
                Proposta sob medida
              </p>
              <Link
                href="/parcerias"
                className="meloma-btn-secondary mt-8 inline-flex justify-center text-sm no-underline"
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
