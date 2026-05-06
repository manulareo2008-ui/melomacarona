import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TrustNav } from "@/components/TrustNav";
import { SiteFooter } from "@/components/SiteFooter";

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
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />
      <section className="container py-10">
        <ScrollReveal>
          <header className="text-center">
            <p className="section-eyebrow">Guias de cursos</p>
            <h1 className="section-title mt-3">
              Conteudos para escolher melhor e comprar com seguranca
            </h1>
            <p className="section-subtitle mt-4">
              Explore guias prontos para comparar cursos por objetivo, preco e formato.
            </p>
          </header>
        </ScrollReveal>

        <section className="mt-12 grid gap-5">
          {guides.map((guide, index) => (
            <ScrollReveal key={guide.slug} delayMs={index * 70}>
              <article className="plan-card">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {guide.title}
                </h2>
                <p className="plan-desc mt-3">{guide.description}</p>
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
      </section>
      <SiteFooter />
    </main>
  );
}
