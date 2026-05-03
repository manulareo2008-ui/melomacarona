import type { Metadata } from "next";
import Link from "next/link";
import { ParceriasContatoForm } from "@/components/parcerias/ParceriasContatoForm";

export const metadata: Metadata = {
  title: "Parcerias institucionais | Melomacarona",
  description:
    "Coloque sua instituição na frente de estudantes e profissionais que já buscam formação na sua área e região. Parcerias para universidades, educadores e plataformas.",
};

function IconSearch(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

function IconTarget(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconChart(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M3 3v18h18" />
      <path d="M7 14v4" />
      <path d="M12 10v8" />
      <path d="M17 6v12" />
    </svg>
  );
}

const sectionShell = "max-w-6xl mx-auto px-4 py-16";
const cardBase =
  "rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 transition-colors hover:border-zinc-700/90";

export default function ParceriasPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-zinc-100">
      <section
        className={`${sectionShell} border-b border-zinc-800/50 bg-gradient-to-b from-violet-950/25 via-[#0A0A0F] to-[#0A0A0F] pb-20 pt-12`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex rounded-full border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
            Parcerias institucionais
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Coloque sua instituição na frente dos alunos certos
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
            O Melomacarona conecta estudantes e profissionais aos melhores cursos do
            mercado. Apareça para quem já está buscando formação na sua área e região.
          </p>
          <div className="mt-10">
            <a
              href="#contato-parceria"
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500"
            >
              Quero ser parceiro
            </a>
          </div>
        </div>
      </section>

      <section className={`${sectionShell} border-t border-zinc-800/50`}>
        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-100">
          Como funciona a parceria
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className={cardBase}>
            <IconSearch className="mb-4 h-8 w-8 text-violet-400" />
            <h3 className="text-lg font-semibold text-zinc-100">
              Aluno busca formação
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Milhares de estudantes e profissionais usam nosso quiz inteligente para
              encontrar o curso ideal para seus objetivos.
            </p>
          </div>
          <div className={cardBase}>
            <IconTarget className="mb-4 h-8 w-8 text-violet-400" />
            <h3 className="text-lg font-semibold text-zinc-100">
              Exibição segmentada
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Sua instituição aparece em destaque para usuários da sua região e área de
              atuação. Sem desperdício — só público qualificado.
            </p>
          </div>
          <div className={cardBase}>
            <IconChart className="mb-4 h-8 w-8 text-violet-400" />
            <h3 className="text-lg font-semibold text-zinc-100">
              Resultados mensuráveis
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Acompanhe cliques, visualizações e interesse por área no painel exclusivo.
              Dados reais, sem achismo.
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionShell} border-t border-zinc-800/50`}>
        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-100">
          Por que anunciar no Melomacarona
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className={cardBase}>
            <h3 className="text-lg font-semibold text-zinc-100">
              Público qualificado
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Nossos usuários já estão decididos a estudar. Não é tráfego frio — é
              intenção real de matrícula.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="text-lg font-semibold text-zinc-100">
              Segmentação geográfica
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Mostramos sua instituição apenas para usuários da sua cidade e estado. A
              FURB aparece para quem está em Blumenau, não para quem está em Manaus.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="text-lg font-semibold text-zinc-100">
              Segmentação por área
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Se sua instituição foca em engenharia, aparece só para quem busca
              engenharia. Sem ruído.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="text-lg font-semibold text-zinc-100">
              Dados transparentes
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Compartilhamos relatórios de performance com cada parceiro: impressões,
              cliques e perfil do público.
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionShell} border-t border-zinc-800/50`}>
        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-100">
          Modelos flexíveis
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-400">
          Valores e condições são definidos caso a caso com sua equipe — focamos em
          alinhamento de objetivos, não em pacotes genéricos na vitrine.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className={`${cardBase} relative pt-2`}>
            <span className="absolute right-4 top-4 rounded-full border border-violet-500/35 bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200">
              Mais popular
            </span>
            <h3 className="text-xl font-bold text-zinc-100">Institucional</h3>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Para quem é
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Universidades, faculdades, escolas técnicas
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Inclui
            </p>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <p>Logo em destaque na experiência do aluno.</p>
              <p>Link direto para matrícula ou página oficial.</p>
              <p>Exibição regional alinhada à sua cobertura.</p>
              <p>Relatórios mensais de performance.</p>
            </div>
          </div>
          <div className={cardBase}>
            <h3 className="text-xl font-bold text-zinc-100">Professor / Criador</h3>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Para quem é
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Professores independentes, criadores de curso
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Inclui
            </p>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <p>Card personalizado com sua identidade.</p>
              <p>Link para sua plataforma ou página de vendas.</p>
              <p>Segmentação por nicho e especialidade.</p>
            </div>
          </div>
          <div className={cardBase}>
            <h3 className="text-xl font-bold text-zinc-100">Plataforma</h3>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Para quem é
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Hotmart, Udemy, Coursera e ecossistemas similares
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Inclui
            </p>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
              <p>Integração orientada ao seu catálogo.</p>
              <p>Destaque por área e perfil de busca.</p>
              <p>Volume de exposição negociável por vertical.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contato-parceria"
        className={`${sectionShell} scroll-mt-24 border-t border-zinc-800/50`}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
            Vamos conversar
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Preencha o formulário e nossa equipe entra em contato em até 48 horas.
          </p>
        </div>
        <div className="mt-10">
          <ParceriasContatoForm />
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 px-4 py-12 text-center">
        <p className="text-sm text-zinc-400">
          Dúvidas? Entre em contato pelo e-mail{" "}
          <a
            href="mailto:manulareo2008@gmail.com"
            className="font-medium text-violet-400 underline-offset-2 hover:text-violet-300 hover:underline"
          >
            manulareo2008@gmail.com
          </a>
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
          >
            Voltar para a página inicial
          </Link>
        </p>
      </footer>
    </main>
  );
}
