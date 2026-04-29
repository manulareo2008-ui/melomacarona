import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guias de cursos",
  description:
    "Guias práticos para comparar cursos por objetivo, preço, certificado e área — antes de escolher onde estudar.",
};

const guides = [
  {
    slug: "cursos-ia-iniciantes",
    title: "Cursos de IA para iniciantes",
    description:
      "Veja uma selecao direta de cursos para entrar em IA, com foco em aplicacao pratica e custo acessivel.",
  },
  {
    slug: "melhores-cursos-ate-100",
    title: "Melhores cursos ate R$ 100",
    description:
      "Comparativo rapido para quem quer aprender com investimento baixo e retorno mais rapido.",
  },
  {
    slug: "cursos-online-com-certificado",
    title: "Cursos online com certificado",
    description:
      "Lista de cursos online que ajudam no curriculo e aceleram sua entrada no mercado.",
  },
];

export default function GuidesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 rounded-2xl border border-zinc-800/90 bg-zinc-950 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Guias de cursos
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
          Conteudos para escolher melhor e comprar com seguranca
        </h1>
        <p className="mt-3 text-sm text-white">
          Explore guias prontos para comparar cursos por objetivo, preco e formato.
        </p>
      </header>

      <section className="grid gap-4">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="rounded-2xl border border-zinc-800/90 bg-zinc-950 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-zinc-100">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-white">
              {guide.description}
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href={`/guias/${guide.slug}`}
                className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Ler guia
              </Link>
              <Link
                href="/"
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
              >
                Testar recomendador
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

