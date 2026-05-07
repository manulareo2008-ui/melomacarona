import type { Metadata } from "next";
import Link from "next/link";
import { TrustNav } from "@/components/TrustNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Parcerias Institucionais | Melomacarona",
  description:
    "Conecte sua instituicao a milhares de alunos qualificados pelo nosso recomendador de IA. Saiba como se tornar parceiro do Melomacarona.",
};

/* ── Dados estaticos de prova social ─────────────────────────────────────── */
const stats = [
  { value: "48+", label: "cursos no catalogo" },
  { value: "9", label: "areas cobertas" },
  { value: "100%", label: "alunos qualificados por IA" },
  { value: "0", label: "cliques desperdicados" },
];

const benefits = [
  {
    icon: IconTarget,
    title: "Audiencia qualificada por IA",
    body: "Seu curso e recomendado somente para alunos cujo perfil, orcamento e objetivo batem com o que voce oferece. Nao e banner para todo mundo — e indicacao cirurgica.",
  },
  {
    icon: IconChart,
    title: "Dashboard de performance",
    body: "Acesse em tempo real: impressoes do seu card, cliques gerados, taxa de conversao por area e comparativo com a media da plataforma. ROI visivel, renovacao facil de justificar.",
  },
  {
    icon: IconBadge,
    title: "Presenca editorial de marca",
    body: "Pagina de perfil propria com logo, historia da instituicao, catalogo de cursos e CTA direto. Voce nao e so um link — e uma marca com voz dentro do Melomacarona.",
  },
  {
    icon: IconSpotlight,
    title: "Spotlight no momento de decisao",
    body: "Parceiros premium aparecem no interstitial entre o quiz e os resultados — o momento de maior intencao de compra do aluno. Maxima visibilidade, audiencia ja filtrada.",
  },
  {
    icon: IconGlobe,
    title: "SEO organico incluso",
    body: "Sua instituicao aparece nos guias editoriais do Melomacarona, indexados no Google. Presenca organica permanente alem do destaque pago nos resultados do quiz.",
  },
  {
    icon: IconLock,
    title: "Sem conflito de interesse",
    body: "Somos transparentes com os alunos: cursos patrocinados sao sinalizados. Isso aumenta a confianca na plataforma — e na sua marca, por estar associada a ela.",
  },
];

const plans = [
  {
    name: "Parceiro",
    price: "Sob consulta",
    period: "",
    highlight: false,
    description: "Para instituicoes que querem presenca qualificada na plataforma.",
    features: [
      "Card com badge Parceiro Destaque nos resultados do quiz",
      "Pagina de perfil institucional propria",
      "Aparicao nos guias SEO da area",
      "Dashboard de metricas basico (impressoes e cliques)",
      "Suporte por email",
    ],
    cta: "Quero ser parceiro",
    ctaHref: "/contato?origem=parceria-basica",
  },
  {
    name: "Parceiro Premium",
    price: "Sob consulta",
    period: "",
    highlight: true,
    description: "Para instituicoes que querem maxima visibilidade e leads qualificados.",
    features: [
      "Tudo do plano Parceiro",
      "Spotlight garantido entre quiz e resultados",
      "Prioridade no algoritmo de recomendacao por IA",
      "Dashboard avancado com CTR, conversao e benchmarks",
      "Relatorio mensal de performance",
      "Gerente de conta dedicado",
      "Co-marketing em newsletters e redes sociais",
    ],
    cta: "Quero o Premium",
    ctaHref: "/contato?origem=parceria-premium",
  },
];

const faqs = [
  {
    q: "Como minha instituicao aparece para os alunos?",
    a: "Seus cursos entram no catalogo do Melomacarona e sao recomendados pelo nosso algoritmo de IA quando o perfil do aluno — area de interesse, orcamento, modalidade e nivel — bate com o que voce oferece. Parceiros recebem badge de destaque visual e, no plano Premium, aparecem no Spotlight antes dos resultados.",
  },
  {
    q: "Qual e o publico da plataforma?",
    a: "Profissionais brasileiros em transicao de carreira ou em busca de especializacao, com intencao ativa de matricula. Todos passam pelo nosso quiz antes de ver qualquer resultado — o que significa que chegam ao seu curso ja segmentados por area, orcamento e modalidade.",
  },
  {
    q: "Como funciona o faturamento?",
    a: "Trabalhamos com mensalidade fixa por plano, sem custo por clique. O investimento e previsivel e o ROI e mensuravel pelo dashboard. Valores sao definidos em conversa comercial de acordo com o volume de cursos e areas de atuacao.",
  },
  {
    q: "Posso testar antes de fechar contrato?",
    a: "Sim. Oferecemos um periodo de avaliacao para instituicoes interessadas. Entre em contato pelo formulario e nossa equipe comercial te explica os detalhes.",
  },
  {
    q: "Que tipos de instituicoes podem ser parceiras?",
    a: "Plataformas de cursos online, escolas tecnicas, faculdades, bootcamps, institutos de certificacao e qualquer instituicao com oferta educacional profissionalizante. Se voce tem cursos e quer alunos qualificados, faz sentido conversar.",
  },
];

/* ── Icons ───────────────────────────────────────────────────────────────── */
function IconTarget({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 20h18M5 20V12M9 20V8M13 20V4M17 20v-6" />
    </svg>
  );
}

function IconBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2l2.4 4.8L20 7.7l-4 3.9 1 5.5L12 14.5l-5 2.6 1-5.5L4 7.7l5.6-.9z" />
    </svg>
  );
}

function IconSpotlight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v3M8 20h8M9 20l-1-5 4-4 4 4-1 5" />
      <path d="M6 10c-2 2-2 5 0 7M18 10c2 2 2 5 0 7" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3C12 3 8 7 8 12s4 9 4 9M12 3c0 0 4 4 4 9s-4 9-4 9M3 12h18" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 7l3.5 3.5L12 3" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function ParceriasPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Grade decorativa de fundo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,255,77,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,77,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow central */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(200,255,77,0.06)] blur-[120px]" />

        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-[rgba(200,255,77,0.25)] bg-[rgba(200,255,77,0.08)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8FF4D]">
              Para instituicoes
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#F0F2F5] sm:text-5xl md:text-6xl">
              Seus cursos para quem
              <br />
              <span className="text-[#C8FF4D]">ja decidiu aprender.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#8A96A8] md:text-xl">
              O Melomacarona qualifica cada aluno por area, orcamento e objetivo antes de recomendar qualquer curso.
              Quando seu nome aparece, e para a pessoa certa — no momento certo.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contato?origem=parceria-hero"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#C8FF4D] px-6 py-3.5 text-sm font-bold text-[#080B10] transition duration-200 hover:bg-[#d4ff6a] hover:shadow-[0_0_30px_rgba(200,255,77,0.25)]"
              >
                Quero ser parceiro
                <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-6 py-3.5 text-sm font-medium text-[#C8CDD6] transition duration-200 hover:border-[rgba(255,255,255,0.18)] hover:text-white"
              >
                Como funciona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold tabular-nums text-[#C8FF4D] md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[13px] text-[#55606F]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Como funciona</p>
          <h2 className="section-title mt-3">
            Da intencao do aluno ao clique na sua pagina
          </h2>
          <p className="section-subtitle mt-4">
            O aluno nao chega ao seu curso por acaso. Ele passa por um processo de qualificacao antes de ver qualquer resultado.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          {[
            {
              step: "01",
              title: "Aluno responde o quiz",
              body: "Nome, idade, area de interesse, nivel de conhecimento, objetivo profissional, modalidade preferida e orcamento. Tudo antes de ver qualquer curso.",
              accent: "#C8FF4D",
            },
            {
              step: "02",
              title: "IA processa o perfil",
              body: "Nosso algoritmo analisa o perfil e calcula um score de afinidade para cada curso do catalogo. Apenas os mais relevantes sao exibidos.",
              accent: "#4DFFC8",
            },
            {
              step: "03",
              title: "Parceiros aparecem em destaque",
              body: "Cursos de parceiros recebem tratamento visual premium e aparecem no topo dos resultados quando o perfil do aluno e compativel. Parceiros Premium aparecem no Spotlight antes dos resultados.",
              accent: "#C8FF4D",
            },
            {
              step: "04",
              title: "Aluno clica e vai direto para voce",
              body: "Um clique leva o aluno direto para a pagina de matricula da sua instituicao. Sem intermediarios, sem fricao. Voce fecha a venda.",
              accent: "#4DFFC8",
            },
          ].map((item, i) => (
            <div key={item.step} className="flex gap-6">
              {/* Linha vertical */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold"
                  style={{
                    borderColor: `${item.accent}40`,
                    backgroundColor: `${item.accent}10`,
                    color: item.accent,
                  }}
                >
                  {item.step}
                </div>
                {i < 3 && (
                  <div className="mt-2 w-px flex-1 bg-gradient-to-b from-[rgba(255,255,255,0.10)] to-transparent" style={{ minHeight: "40px" }} />
                )}
              </div>

              {/* Conteudo */}
              <div className="pb-10">
                <h3 className="text-[16px] font-bold text-[#F0F2F5]">{item.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#6B7585]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────────────── */}
      <section className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)]">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Por que o Melomacarona</p>
            <h2 className="section-title mt-3">
              Nao e publicidade. E recomendacao.
            </h2>
            <p className="section-subtitle mt-4">
              Banner para todo mundo tem CTR de 0.1%. Recomendacao para o perfil certo tem resultado diferente. Essa e a diferenca do nosso modelo.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(13,17,23,0.60)] p-6 transition duration-300 hover:border-[rgba(200,255,77,0.15)] hover:bg-[rgba(13,17,23,0.80)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(200,255,77,0.20)] bg-[rgba(200,255,77,0.08)]">
                  <b.icon className="h-5 w-5 text-[#C8FF4D]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#EEF0F3]">{b.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6B7585]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ────────────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Planos</p>
          <h2 className="section-title mt-3">Escolha o nivel de visibilidade</h2>
          <p className="section-subtitle mt-4">
            Valores sob consulta — definidos de acordo com o porte da instituicao, numero de cursos e areas de atuacao.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                plan.highlight
                  ? "border-[rgba(200,255,77,0.30)] bg-[rgba(200,255,77,0.04)] shadow-[0_0_60px_rgba(200,255,77,0.06)]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(13,17,23,0.60)]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[rgba(200,255,77,0.35)] bg-[rgba(200,255,77,0.12)] px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C8FF4D]">
                  Mais escolhido
                </span>
              )}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#55606F]">
                  {plan.name}
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#F0F2F5]">{plan.price}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6B7585]">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(200,255,77,0.15)]">
                      <IconCheck className="h-2.5 w-2.5 text-[#C8FF4D]" />
                    </span>
                    <span className="text-[13px] leading-snug text-[#8A96A8]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`group mt-8 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-200 ${
                  plan.highlight
                    ? "bg-[#C8FF4D] text-[#080B10] hover:bg-[#d4ff6a] hover:shadow-[0_0_24px_rgba(200,255,77,0.20)]"
                    : "border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-[#C8CDD6] hover:border-[rgba(255,255,255,0.20)] hover:text-white"
                }`}
              >
                {plan.cta}
                <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)]">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Duvidas frequentes</p>
            <h2 className="section-title mt-3">Perguntas de quem considera parceria</h2>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(13,17,23,0.60)] p-6"
              >
                <h3 className="text-[15px] font-semibold text-[#EEF0F3]">{faq.q}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6B7585]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(200,255,77,0.20)] bg-[rgba(200,255,77,0.04)] p-10 text-center">
            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(200,255,77,0.08)] blur-[80px]" />

            <p className="relative section-eyebrow">Pronto para comecar?</p>
            <h2 className="relative mt-3 text-2xl font-extrabold text-[#F0F2F5] md:text-3xl">
              Fale com nossa equipe comercial
            </h2>
            <p className="relative mt-4 text-[15px] leading-relaxed text-[#8A96A8]">
              Sem compromisso. Explicamos como funciona, mostramos metricas da plataforma e propomos um plano alinhado ao seu objetivo.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contato?origem=parceria-cta-final"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#C8FF4D] px-7 py-3.5 text-sm font-bold text-[#080B10] transition duration-200 hover:bg-[#d4ff6a] hover:shadow-[0_0_30px_rgba(200,255,77,0.25)]"
              >
                Entrar em contato
                <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="mailto:manulareo2008@gmail.com?subject=Parceria Melomacarona"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-7 py-3.5 text-sm font-medium text-[#C8CDD6] transition duration-200 hover:border-[rgba(255,255,255,0.18)] hover:text-white"
              >
                Enviar email direto
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
