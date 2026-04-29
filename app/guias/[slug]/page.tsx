import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const guideContent: Record<
  string,
  { title: string; intro: string; bullets: string[] }
> = {
  "cursos-ia-iniciantes": {
    title: "Cursos de IA para iniciantes",
    intro:
      "Se voce esta comecando em IA, priorize cursos com projetos praticos, suporte e boa trilha de aprendizado.",
    bullets: [
      "Comece com base: logica, dados e prompts.",
      "Prefira cursos com exercicios aplicados ao mercado.",
      "Use o recomendador para comparar preco e afinidade.",
    ],
  },
  "melhores-cursos-ate-100": {
    title: "Melhores cursos ate R$ 100",
    intro:
      "Para reduzir risco, foque em cursos de entrada com baixo investimento e foco em entrega rapida.",
    bullets: [
      "Valide interesse com curso curto antes de investir alto.",
      "Compare carga horaria e nivel do conteudo.",
      "Priorize cursos com aplicacao imediata no trabalho.",
    ],
  },
  "cursos-online-com-certificado": {
    title: "Cursos online com certificado",
    intro:
      "Cursos com certificado ajudam no curriculo, desde que tragam conteudo util e pratica real.",
    bullets: [
      "Certificado e importante, mas resultado pratico vem primeiro.",
      "Verifique reputacao da instituicao e da plataforma.",
      "Escolha modalidade e preco que cabem na sua rotina.",
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
      title: "Guia nao encontrado",
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
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <article className="rounded-2xl border border-zinc-800/90 bg-zinc-950 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Guia pratico
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
          {guide.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white">
          {guide.intro}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-white">
          {guide.bullets.map((item) => (
            <li
              key={item}
              className="rounded-xl bg-zinc-900 px-3 py-2"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
          >
            Fazer recomendacao agora
          </Link>
          <Link
            href="/guias"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Ver todos os guias
          </Link>
        </div>
      </article>
    </main>
  );
}

