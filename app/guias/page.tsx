import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Guias de cursos",
  description:
    "Guias práticos para comparar cursos por objetivo, preço, certificado e área — antes de escolher onde estudar.",
};

const guides: {
  slug: string;
  title: ReactNode;
  description: string;
}[] = [
  {
    slug: "cursos-ia-iniciantes",
    title: (
      <>
        Cursos de <span className="meloma-accent-inline">IA</span> para iniciantes
      </>
    ),
    description:
      "Veja uma seleção direta de cursos para entrar em IA, com foco em aplicação prática e custo acessível.",
  },
  {
    slug: "melhores-cursos-ate-100",
    title: (
      <>
        Melhores cursos <span className="meloma-accent-inline">até</span> R$ 100
      </>
    ),
    description:
      "Comparativo rápido para quem quer aprender com investimento baixo e retorno mais rápido.",
  },
  {
    slug: "cursos-online-com-certificado",
    title: (
      <>
        Cursos online com{" "}
        <span className="meloma-accent-inline">certificado</span>
      </>
    ),
    description:
      "Lista de cursos online que ajudam no currículo e aceleram sua entrada no mercado.",
  },
];

export default function GuidesPage() {
  return (
    <main className="meloma-guides-page px-4 py-10 sm:px-6">
      <ScrollReveal>
        <header className="meloma-guides-header">
          <p className="meloma-badge-pill meloma-plan-header-badge">
            Guias de cursos
          </p>
          <h1 className="meloma-heading-xl mt-4 text-3xl sm:text-4xl">
            Conteúdos para escolher melhor e comprar com segurança
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
            Explore guias prontos para comparar cursos por objetivo, preço e formato.
          </p>
        </header>
      </ScrollReveal>

      <section className="meloma-guides-grid grid gap-5">
        {guides.map((guide, index) => (
          <ScrollReveal key={guide.slug} delayMs={index * 70}>
            <article className="meloma-guide-card">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {guide.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                {guide.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/guias/${guide.slug}`}
                  className="meloma-btn-primary text-sm no-underline"
                >
                  Ler guia
                </Link>
                <Link
                  href="/quiz"
                  className="meloma-btn-secondary text-sm no-underline"
                >
                  Testar recomendador
                </Link>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </section>
    </main>
  );
}
