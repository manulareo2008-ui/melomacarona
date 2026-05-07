import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TrustNav } from "@/components/TrustNav";
import { SiteFooter } from "@/components/SiteFooter";
import { guidesData } from "@/lib/guidesData";

export const metadata: Metadata = {
  title: "Guias de Cursos | Melomacarona",
  description:
    "Guias editoriais para escolher cursos profissionalizantes por area, objetivo e orcamento. Conteudo real, sem patrocinio oculto.",
};

// Mapeamento de area -> descricao curta para o card
const guideDescriptions: Record<string, string> = {
  "cursos-ia-iniciantes":
    "Como comecar em IA sem se perder: trilhas por perfil, o que o mercado pede de verdade e como avaliar um curso antes de comprar.",
  "melhores-cursos-ate-100":
    "As melhores areas e plataformas para quem quer resultado sem investimento alto. Com criterios reais para nao errar na compra.",
  "cursos-online-com-certificado":
    "A hierarquia real dos certificados no mercado brasileiro e quais valem a pena incluir no curriculo e no LinkedIn.",
  "programacao-e-desenvolvimento":
    "Qual linguagem comecar, trilhas por objetivo de carreira e como montar um portfolio que gera entrevistas reais.",
  "design-e-ux":
    "As diferentes trilhas de design, por que Figma domina o mercado e como construir portfolio sem experiencia comercial.",
  "marketing-digital":
    "SEO, trafego pago, analytics e conteudo: o que o mercado realmente paga e como escolher a especializacao certa.",
  "dados-e-inteligencia-artificial":
    "Data Analyst, Data Scientist, ML Engineer: diferencas reais, trilhas por nivel e o que o mercado brasileiro esta contratando.",
  "negocios-e-gestao":
    "MBA vale a pena em 2025? O que gestao realmente envolve e quais habilidades de lideranca tem maior demanda.",
  idiomas:
    "Por que adultos nao aprendem ingles com cursos tradicionais e quais metodos e plataformas realmente funcionam.",
};

export default function GuidesPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />

      <section className="container py-10 md:py-14">
        {/* Header */}
        <ScrollReveal>
          <header className="text-center">
            <p className="section-eyebrow">Guias editoriais</p>
            <h1 className="section-title mt-3">
              Conteudo para escolher melhor, sem chute
            </h1>
            <p className="section-subtitle mt-4">
              Guias por area com criterios reais para comparar cursos antes de investir tempo e dinheiro.
            </p>
          </header>
        </ScrollReveal>

        {/* Grid de guias */}
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
                  {guideDescriptions[guide.slug] ?? guide.metaDescription}
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

        {/* CTA base */}
        <ScrollReveal delayMs={guidesData.length * 60 + 60}>
          <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
            <p className="section-eyebrow">Nao sabe por onde comecar?</p>
            <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)]">
              O recomendador analisa seu perfil em minutos
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Responda algumas perguntas sobre seus objetivos e orcamento. O Melomacarona indica os cursos com maior chance de resultado para voce.
            </p>
            <div className="mt-6">
              <Link href="/quiz" className="btn-plan btn-plan-primary text-sm no-underline">
                Comecar recomendacao gratuita
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  );
}
