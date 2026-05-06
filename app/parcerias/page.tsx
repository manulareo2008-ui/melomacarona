import type { Metadata } from "next";
import Link from "next/link";
import { ParceriasContatoForm } from "@/components/parcerias/ParceriasContatoForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";

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

const sectionShell = "container py-16";
const cardBase = "feature-card";

export default function ParceriasPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <section className={`${sectionShell} pb-20 pt-12`}>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">Parcerias institucionais</p>
            <h1 className="section-title">
              Coloque sua instituicao na frente dos alunos certos
            </h1>
            <p className="section-subtitle">
              O Melomacarona conecta estudantes e profissionais aos melhores cursos do
              mercado. Apareca para quem ja esta buscando formacao na sua area e regiao.
            </p>
            <div className="mt-10">
              <a href="#contato-parceria" className="btn-hero">
                Quero ser parceiro
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={`${sectionShell}`}>
        <ScrollReveal>
          <h2 className="section-title text-center">Como funciona a parceria</h2>
        </ScrollReveal>
        <div className="features-grid mt-12">
          <div className={cardBase}>
            <IconSearch className="mb-4 h-8 w-8 text-[var(--primary-light)]" />
            <h3 className="feature-title text-lg">Aluno busca formacao</h3>
            <p className="feature-desc">
              Milhares de estudantes e profissionais usam nosso quiz inteligente para
              encontrar o curso ideal para seus objetivos.
            </p>
          </div>
          <div className={cardBase}>
            <IconTarget className="mb-4 h-8 w-8 text-[var(--primary-light)]" />
            <h3 className="feature-title text-lg">Exibicao segmentada</h3>
            <p className="feature-desc">
              Sua instituicao aparece em destaque para usuarios da sua regiao e area de
              atuacao. Sem desperdicio - so publico qualificado.
            </p>
          </div>
          <div className={cardBase}>
            <IconChart className="mb-4 h-8 w-8 text-[var(--primary-light)]" />
            <h3 className="feature-title text-lg">Resultados mensuraveis</h3>
            <p className="feature-desc">
              Acompanhe cliques, visualizacoes e interesse por area no painel exclusivo.
              Dados reais, sem achismo.
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionShell}`}>
        <h2 className="section-title text-center">Por que anunciar no Melomacarona</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className={cardBase}>
            <h3 className="feature-title text-lg">Publico qualificado</h3>
            <p className="feature-desc">
              Nossos usuarios ja estao decididos a estudar. Nao e trafego frio - e
              intencao real de matricula.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="feature-title text-lg">Segmentacao geografica</h3>
            <p className="feature-desc">
              Mostramos sua instituicao apenas para usuarios da sua cidade e estado.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="feature-title text-lg">Segmentacao por area</h3>
            <p className="feature-desc">
              Se sua instituicao foca em engenharia, aparece so para quem busca
              engenharia. Sem ruido.
            </p>
          </div>
          <div className={cardBase}>
            <h3 className="feature-title text-lg">Dados transparentes</h3>
            <p className="feature-desc">
              Compartilhamos relatorios de performance com cada parceiro:
              impressoes, cliques e perfil do publico.
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionShell}`}>
        <h2 className="section-title text-center">Modelos flexiveis</h2>
        <p className="section-subtitle mt-4">
          Valores e condicoes sao definidos caso a caso com sua equipe - focamos em
          alinhamento de objetivos, nao em pacotes genericos na vitrine.
        </p>
        <div className="pricing-grid mt-12">
          <div className="plan-card featured relative">
            <span className="plan-badge">Mais popular</span>
            <h3 className="feature-title text-xl">Institucional</h3>
            <p className="plan-name mt-4">Para quem e</p>
            <p className="plan-desc">Universidades, faculdades, escolas tecnicas</p>
            <p className="plan-name mt-4">Inclui</p>
            <div className="plan-features">
              <p className="plan-feature"><span className="check">✓</span>Logo em destaque na experiencia do aluno.</p>
              <p className="plan-feature"><span className="check">✓</span>Link direto para matricula ou pagina oficial.</p>
              <p className="plan-feature"><span className="check">✓</span>Exibicao regional alinhada a sua cobertura.</p>
              <p className="plan-feature"><span className="check">✓</span>Relatorios mensais de performance.</p>
            </div>
          </div>
          <div className="plan-card">
            <h3 className="feature-title text-xl">Professor / Criador</h3>
            <p className="plan-name mt-4">Para quem e</p>
            <p className="plan-desc">Professores independentes, criadores de curso</p>
            <p className="plan-name mt-4">Inclui</p>
            <div className="plan-features">
              <p className="plan-feature"><span className="check">✓</span>Card personalizado com sua identidade.</p>
              <p className="plan-feature"><span className="check">✓</span>Link para sua plataforma ou pagina de vendas.</p>
              <p className="plan-feature"><span className="check">✓</span>Segmentacao por nicho e especialidade.</p>
            </div>
          </div>
          <div className="plan-card">
            <h3 className="feature-title text-xl">Plataforma</h3>
            <p className="plan-name mt-4">Para quem e</p>
            <p className="plan-desc">Hotmart, Udemy, Coursera e ecossistemas similares</p>
            <p className="plan-name mt-4">Inclui</p>
            <div className="plan-features">
              <p className="plan-feature"><span className="check">✓</span>Integracao orientada ao seu catalogo.</p>
              <p className="plan-feature"><span className="check">✓</span>Destaque por area e perfil de busca.</p>
              <p className="plan-feature"><span className="check">✓</span>Volume de exposicao negociavel por vertical.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contato-parceria" className={`${sectionShell} scroll-mt-24`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Vamos conversar</h2>
          <p className="section-subtitle mt-3">
            Preencha o formulario e nossa equipe entra em contato em ate 48 horas.
          </p>
        </div>
        <div className="mt-10 feature-card">
          <ParceriasContatoForm />
        </div>
      </section>

      <div className="px-4 pb-10 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          Dúvidas? Entre em contato pelo e-mail{" "}
          <a
            href="mailto:manulareo2008@gmail.com"
            className="font-medium text-[var(--primary-light)] underline-offset-2 hover:underline"
          >
            manulareo2008@gmail.com
          </a>
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--text-muted)] underline-offset-2 hover:underline"
          >
            Voltar para a página inicial
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
