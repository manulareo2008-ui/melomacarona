import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrustNav } from "@/components/TrustNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/guidesData";

// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return { title: "Guia nao encontrado" };

  return {
    title: `${guide.title} | Melomacarona`,
    description: guide.metaDescription,
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      type: "article",
      siteName: "Melomacarona",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.metaDescription,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuideDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  // Schema.org JSON-LD para rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.metaDescription,
        publisher: {
          "@type": "Organization",
          name: "Melomacarona",
          url: "https://melomacarona.vercel.app",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: "https://melomacarona.vercel.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guias",
            item: "https://melomacarona.vercel.app/guias",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: `https://melomacarona.vercel.app/guias/${guide.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        <TrustNav />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/guias" className="hover:text-[var(--accent-primary)] transition-colors">
                Guias
              </Link>
              <span>/</span>
              <span className="text-[var(--text-secondary)] line-clamp-1">{guide.title}</span>
            </nav>

            <p className="section-eyebrow">{guide.eyebrow}</p>
            <h1 className="section-title mt-3">{guide.title}</h1>

            {/* Intro paragraphs */}
            <div className="mt-6 space-y-4">
              {guide.intro.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA primario — topo */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quiz" className="btn-plan btn-plan-primary text-sm no-underline">
                Encontrar meu curso ideal
              </Link>
              <Link href="/guias" className="btn-plan btn-plan-ghost text-sm no-underline">
                Ver todos os guias
              </Link>
            </div>
          </div>
        </section>

        {/* ── Separador ────────────────────────────────────────────────────── */}
        <div className="border-t border-[var(--border)]" />

        {/* ── Conteudo editorial ───────────────────────────────────────────── */}
        <section className="container py-12">
          <div className="mx-auto max-w-3xl space-y-12">
            {guide.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Cursos recomendados ───────────────────────────────────────────── */}
        {guide.courses.length > 0 && (
          <>
            <div className="border-t border-[var(--border)]" />
            <section className="container py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                  Cursos recomendados nesta area
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Selecao editorial baseada em qualidade de conteudo, atualizacao e reputacao de mercado.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {guide.courses.map((course) => (
                    <div
                      key={course.name}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-colors hover:border-[var(--accent-primary)]/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                          {course.name}
                        </h3>
                        <span className="shrink-0 rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                          {course.level}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--accent-secondary)] font-medium">
                        {course.institution}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                        {course.highlight}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    href="/quiz"
                    className="btn-plan btn-plan-primary text-sm no-underline"
                  >
                    Ver recomendacao personalizada
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {guide.faq.length > 0 && (
          <>
            <div className="border-t border-[var(--border)]" />
            <section className="container py-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                  Perguntas frequentes
                </h2>

                <div className="mt-6 space-y-4">
                  {guide.faq.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5"
                    >
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── CTA final ────────────────────────────────────────────────────── */}
        <section className="container pb-16">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[var(--accent-primary)]/20 bg-[var(--bg-surface)] p-8 text-center">
              <p className="section-eyebrow">Proximo passo</p>
              <h2 className="mt-3 text-xl font-bold text-[var(--text-primary)] md:text-2xl">
                Encontre o curso certo para o seu perfil
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                O recomendador do Melomacarona analisa seu objetivo, nivel atual e orcamento para indicar o curso com maior chance de resultado para voce.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/quiz" className="btn-plan btn-plan-primary text-sm no-underline">
                  Fazer recomendacao gratuita
                </Link>
                <Link href="/guias" className="btn-plan btn-plan-ghost text-sm no-underline">
                  Ver outros guias
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
