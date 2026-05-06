import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrustNav } from "@/components/TrustNav";
import { SiteFooter } from "@/components/SiteFooter";

const guideContent: Record<
  string,
  { title: string; intro: string; bullets: string[] }
> = {
  "cursos-ia-iniciantes": {
    title: "Cursos de IA para iniciantes",
    intro:
      "Se você está começando em IA, priorize cursos com projetos práticos, suporte e boa trilha de aprendizado.",
    bullets: [
      "Comece com base: lógica, dados e prompts.",
      "Prefira cursos com exercícios aplicados ao mercado.",
      "Use o recomendador para comparar preço e afinidade.",
    ],
  },
  "melhores-cursos-ate-100": {
    title: "Melhores cursos até R$ 100",
    intro:
      "Para reduzir risco, foque em cursos de entrada com baixo investimento e foco em entrega rápida.",
    bullets: [
      "Valide interesse com curso curto antes de investir alto.",
      "Compare carga horária e nível do conteúdo.",
      "Priorize cursos com aplicação imediata no trabalho.",
    ],
  },
  "cursos-online-com-certificado": {
    title: "Cursos online com certificado",
    intro:
      "Cursos com certificado ajudam no currículo, desde que tragam conteúdo útil e prática real.",
    bullets: [
      "Certificado é importante, mas resultado prático vem primeiro.",
      "Verifique reputação da instituição e da plataforma.",
      "Escolha modalidade e preço que cabem na sua rotina.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(guideContent).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = guideContent[params.slug];
  if (!guide) {
    return {
      title: "Guia não encontrado",
    };
  }
  return {
    title: guide.title,
    description: guide.intro,
    openGraph: {
      title: guide.title,
      description: guide.intro,
      type: "article",
    },
  };
}

export default function GuideDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = guideContent[params.slug];
  if (!guide) notFound();

  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />
      <section className="container py-10">
        <article className="mx-auto max-w-3xl plan-card">
          <p className="section-eyebrow">Guia pratico</p>
          <h1 className="section-title mt-3">{guide.title}</h1>
          <p className="plan-desc mt-4">{guide.intro}</p>
          <ul className="mt-6 space-y-3 text-[var(--text-primary)]">
            {guide.bullets.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quiz" className="btn-plan btn-plan-primary text-sm no-underline">
              Fazer recomendacao agora
            </Link>
            <Link href="/guias" className="btn-plan btn-plan-ghost text-sm no-underline">
              Ver todos os guias
            </Link>
          </div>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
