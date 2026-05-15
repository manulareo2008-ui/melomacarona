import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InternalHeader } from "@/components/InternalHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { guidesData } from "@/lib/guidesData";

export const metadata: Metadata = {
  title: "Guias de Cursos | Melomacarona",
  description:
    "Guias editoriais para escolher cursos profissionalizantes por área, objetivo e orçamento. Conteúdo real, sem patrocínio oculto.",
};

export default function GuidesPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <InternalHeader />

      <section className="container py-10 md:py-14">
        <ScrollReveal>
          <header className="text-center">
            <p className="section-eyebrow">Guias editoriais</p>
            <h1 className="section-title mt-3">
              Conteúdo para escolher melhor, sem chute
            </h1>
            <p className="section-subtitle mt-4">
              Guias por área com critérios reais para comparar cursos antes de investir tempo e dinheiro.
            </p>
          </header>
        </ScrollReveal>

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guidesData.map((guide, index) => (
            <ScrollReveal key={guide.slug} delayMs={index * 60}>
              <article className="plan-card flex h-full flex-col">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent-secondary)]">
                  {guide.eyebrow}
                </p>
                <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)] leading-snug">
                  {guide.title}
                </h2>
                <p className="plan-desc mt-3 flex-1 text-sm">
                  {guide.metaDescription}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/guias/${guide.slug}`}
                    className="btn-plan btn-plan-primary text-sm no-underline"
                  >
                    Ler guia
                  </Link>
                  <Link
                    href="/quiz"
                    className="btn-plan btn-plan-ghost text-sm no-underline"
                  >
                    Testar recomendador
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </section>

        <ScrollReveal delayMs={guidesData.length * 60 + 60}>
          <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
            <p className="section-eyebrow">Não sabe por onde começar?</p>
            <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)]">
              O recomendador analisa seu perfil em minutos
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Responda algumas perguntas sobre seus objetivos e orçamento. O Melomacarona indica os cursos com maior chance de resultado para você.
            </p>
            <div className="mt-6">
              <Link href="/quiz" className="btn-plan btn-plan-primary text-sm no-underline">
                Começar recomendação gratuita
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  );
}