"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IconCheckPurple,
  IconFeatureAdmin,
  IconFeatureBrain,
  IconFeatureCart,
  IconFeatureGraduation,
  IconFeatureQuiz,
  IconFeatureShield,
  IconSparkleBadge,
  IconStepAI,
  IconStepLink,
  IconStepProfile,
} from "@/components/MelomaIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { MelomaVideoHero } from "@/components/MelomaVideoHero";
import { SponsorsSection } from "@/components/SponsorsSection";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question:
      "Como utilizar o teste para orientar a escolha profissional com maior segurança?",
    answer:
      "O assistente integra os seus interesses, nível de conhecimento, objetivos de carreira e disponibilidade para indicar áreas e formações com maior aderência ao seu perfil. O objetivo é reduzir incerteza e oferecer uma base objetiva para a decisão, sem substituir o acompanhamento individualizado com educadores ou especialistas quando necessário.",
  },
  {
    id: "faq-2",
    question: "Qual o momento mais adequado para realizar o teste vocacional?",
    answer:
      "Recomenda-se utilizar o teste sempre que houver dúvidas sobre direção de carreira, mudança de área ou revisão de metas. Poderá refazer o fluxo sempre que seus objetivos ou contexto profissional evoluírem, obtendo recomendações atualizadas conforme o novo perfil informado.",
  },
  {
    id: "faq-3",
    question:
      "Existem formações que permitem ingressar mais rapidamente no mercado de trabalho?",
    answer:
      "O tempo até a atuação profissional depende da área escolhida, da sua bagagem prévia e da intensidade da formação. Em linhas gerais, trilhas com forte componente prático e construção de portfólio tendem a acelerar a empregabilidade. A plataforma prioriza cursos cuja aplicação esteja alinhada ao perfil e às metas declaradas por você.",
  },
  {
    id: "faq-4",
    question:
      "Quais segmentos costumam apresentar maior potencial de remuneração?",
    answer:
      "Áreas como tecnologia, análise de dados, engenharia e funções estratégicas em negócios frequentemente exibem faixas salariais elevadas; contudo, a remuneração efetiva depende de mercado regional, senioridade e especialização. Recomenda-se ponderar potencial financeiro em conjunto com motivação e aptidão, critérios que o assistente considera ao montar sugestões.",
  },
  {
    id: "faq-5",
    question:
      "Quais tendências de mercado a plataforma considera ao recomendar trilhas?",
    answer:
      "Demandas ligadas a inteligência artificial aplicada, dados, segurança da informação, energia sustentável, produtos digitais e serviços de saúde e bem-estar permanecem em expansão. O motor de recomendação incorpora essas tendências como referência ao cruzar o seu perfil com oportunidades disponíveis no catálogo.",
  },
  {
    id: "faq-6",
    question:
      "É obrigatório possuir diploma universitário para aproveitar as recomendações?",
    answer:
      "Não. Você poderá iniciar por cursos livres e certificações profissionalizantes para consolidar competências e demonstrar resultado prático. Quando alinhado aos seus objetivos, a progressão para graduação, pós-graduação ou certificações avançadas poderá ser avaliada de forma complementar.",
  },
  {
    id: "faq-7",
    question: "Qual a extensão do questionário e o tempo estimado de conclusão?",
    answer:
      "O questionário foi estruturado em etapas objetivas, com tempo estimado de poucos minutos para conclusão. São coletadas apenas as informações necessárias para personalizar recomendações, preservando clareza e agilidade na experiência.",
  },
] as const;

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<(typeof FAQ_ITEMS)[number]["id"]>(
    FAQ_ITEMS[0].id
  );
  const navToggleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobileMenu = () => {
    if (navToggleRef.current) navToggleRef.current.checked = false;
  };

  return (
    <main className="meloma-landing">
      <input
        ref={navToggleRef}
        type="checkbox"
        id="nav-toggle"
        className="sr-only"
        aria-label="Abrir menu de navegação"
      />

      <nav id="navbar" className={navScrolled ? "scrolled" : ""}>
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">
            Melomacarona
          </Link>

          <div className="nav-links">
            <a href="#como-funciona" className="nav-link">
              Como funciona
            </a>
            <Link href="/quiz" className="nav-link">
              Quiz
            </Link>
            <a href="#guias" className="nav-link">
              Guias
            </a>
            <a href="#parceiros" className="nav-link">
              Parceiros
            </a>
            <a href="#duvidas" className="nav-link">
              Dúvidas
            </a>
            <Link href="/planos" className="nav-link">
              Planos
            </Link>
            <Link href="/premium/login" className="nav-btn nav-btn-ghost">
              Entrar
            </Link>
            <Link href="/quiz" className="nav-btn nav-btn-primary">
              Começar
            </Link>
          </div>

          <label htmlFor="nav-toggle" className="nav-hamburger">
            <span />
            <span />
            <span />
          </label>
        </div>
      </nav>

      <div className="nav-mobile" id="nav-mobile">
        <a
          href="#como-funciona"
          className="nav-link"
          onClick={closeMobileMenu}
        >
          Como funciona
        </a>
        <Link href="/quiz" className="nav-link" onClick={closeMobileMenu}>
          Quiz
        </Link>
        <a href="#guias" className="nav-link" onClick={closeMobileMenu}>
          Guias
        </a>
        <a href="#parceiros" className="nav-link" onClick={closeMobileMenu}>
          Parceiros
        </a>
        <a href="#duvidas" className="nav-link" onClick={closeMobileMenu}>
          Dúvidas
        </a>
        <Link href="/planos" className="nav-link" onClick={closeMobileMenu}>
          Planos
        </Link>
        <Link
          href="/premium/login"
          className="nav-btn nav-btn-ghost"
          onClick={closeMobileMenu}
        >
          Entrar
        </Link>
        <Link
          href="/quiz"
          className="nav-btn nav-btn-primary"
          onClick={closeMobileMenu}
        >
          Começar agora →
        </Link>
      </div>

      <div id="section-home">
        <MelomaVideoHero />

        <ScrollReveal className="section-scroll-wrap">
          <section className="section" id="como-funciona">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Como funciona</div>
                <h2 className="section-title">
                  Três passos até o <span className="gradient-text">curso certo</span>
                </h2>
                <p className="section-subtitle">
                  Nossa IA faz o trabalho pesado — você só precisa aprender.
                </p>
              </div>

              <div className="steps-grid meloma-home-steps">
                <div className="step-card">
                  <div className="step-number step-number-1">1</div>
                  <div className="step-icon meloma-step-icon-svg" aria-hidden>
                    <IconStepProfile size={32} />
                  </div>
                  <div className="step-title">Responda seu perfil</div>
                  <p className="step-desc">
                    Objetivos, área, nível e formato preferido — o mesmo fluxo
                    completo que você já usa hoje.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number step-number-2">2</div>
                  <div className="step-icon meloma-step-icon-svg" aria-hidden>
                    <IconStepAI size={32} />
                  </div>
                  <div className="step-title">IA recomenda</div>
                  <p className="step-desc">
                    Compatibilidade com nichos e cursos reais da base, com
                    resultados alinhados ao seu perfil.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-number step-number-3">3</div>
                  <div className="step-icon meloma-step-icon-svg" aria-hidden>
                    <IconStepLink size={32} />
                  </div>
                  <div className="step-title">Acesse sem fricção</div>
                  <p className="step-desc">
                    Redirecionamento para URL válida com fallback de segurança.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section section-alt">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Diferenciais</div>
                <h2 className="section-title">
                  Por que a <span className="gradient-text">Melomacarona</span>?
                </h2>
                <p className="section-subtitle">
                  Uma plataforma construída para você encontrar, não para você
                  procurar.
                </p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-blue meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureBrain size={28} />
                  </div>
                  <div className="feature-title">IA de Recomendação</div>
                  <p className="feature-desc">
                    Nosso modelo analisa seu perfil e recomenda cursos
                    personalizados — sem você precisar saber exatamente o que
                    quer.
                  </p>
                </div>
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-purple meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureGraduation size={28} />
                  </div>
                  <div className="feature-title">Trilhas e conteúdo</div>
                  <p className="feature-desc">
                    Guias e recursos premium permanecem disponíveis na área
                    logada, com o mesmo acesso que você já conhece.
                  </p>
                </div>
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-green meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureCart size={28} />
                  </div>
                  <div className="feature-title">Matrícula clara</div>
                  <p className="feature-desc">
                    Fluxo de matrícula e redirecionamento pensado para reduzir
                    cliques e dúvidas no caminho até o curso.
                  </p>
                </div>
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-orange meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureQuiz size={28} />
                  </div>
                  <div className="feature-title">Teste e quiz</div>
                  <p className="feature-desc">
                    Quiz de perfil e recomendações conectados à base real de
                    cursos e nichos.
                  </p>
                </div>
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-pink meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureAdmin size={28} />
                  </div>
                  <div className="feature-title">Admin e histórico</div>
                  <p className="feature-desc">
                    Área administrativa e histórico seguem ativos para gestão e
                    acompanhamento.
                  </p>
                </div>
                <div className="feature-card">
                  <div
                    className="feature-icon-wrap fi-yellow meloma-feature-icon-wrap"
                    aria-hidden
                  >
                    <IconFeatureShield size={28} />
                  </div>
                  <div className="feature-title">Segurança no acesso</div>
                  <p className="feature-desc">
                    Fallback de segurança nas URLs e fluxo validado para você
                    confiar no próximo passo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <SponsorsSection />
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section vocational-section meloma-voc-bg" id="quiz">
            <div className="container">
              <div className="vocational-inner">
                <div className="vocational-left">
                  <div className="badge badge-purple flex items-center gap-2" style={{ marginBottom: 20 }}>
                    <IconSparkleBadge size={14} />
                    Quiz e recomendação
                  </div>
                  <h2 className="vocational-title">
                    Pronto para o
                    <br />
                    <span className="gradient-text">teste guiado</span>?
                  </h2>
                  <p className="vocational-desc">
                    O mesmo assistente em etapas: interesses, formato e
                    investimento, com recomendações alinhadas à sua realidade.
                  </p>
                  <div className="vocational-benefits">
                    <div className="vocational-benefit">
                      <div className="vb-icon" aria-hidden>
                        <IconCheckPurple size={14} />
                      </div>
                      Perfil e preferências em poucos minutos
                    </div>
                    <div className="vocational-benefit">
                      <div className="vb-icon" aria-hidden>
                        <IconCheckPurple size={14} />
                      </div>
                      Sugestões compatíveis com a base de cursos
                    </div>
                    <div className="vocational-benefit">
                      <div className="vb-icon" aria-hidden>
                        <IconCheckPurple size={14} />
                      </div>
                      Continuidade até matrícula com URLs seguras
                    </div>
                  </div>
                  <Link href="/quiz" className="btn-purple inline-flex items-center gap-2" onClick={closeMobileMenu}>
                    <IconFeatureQuiz size={22} />
                    Abrir questionário completo
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section" id="duvidas">
            <div className="container">
              <div className="faq-layout">
              <div>
                <div className="section-header" style={{ marginBottom: 24 }}>
                  <h2 className="section-title">Principais dúvidas</h2>
                </div>
                <div className="faq-list" role="list">
                  {FAQ_ITEMS.map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <article key={item.id} className="faq-item" role="listitem">
                        <button
                          type="button"
                          className={`faq-question ${isOpen ? "is-open" : ""}`}
                          onClick={() => setOpenFaqId(item.id)}
                          aria-expanded={isOpen}
                          aria-controls={`${item.id}-content`}
                          id={`${item.id}-button`}
                        >
                          <span>{item.question}</span>
                          <span className="faq-icon" aria-hidden>
                            <span className="faq-chevron" />
                          </span>
                        </button>
                        <div
                          className={`faq-answer-panel ${isOpen ? "is-open" : ""}`}
                          aria-hidden={!isOpen}
                        >
                          <div className="faq-answer-inner">
                            <div
                              id={`${item.id}-content`}
                              className="faq-answer"
                              role="region"
                              aria-labelledby={`${item.id}-button`}
                            >
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <aside className="faq-cta-card">
                <h3>Deseja uma orientação objetiva para o próximo passo?</h3>
                <p>
                  Inicie o teste vocacional gratuito e receba sugestões de
                  cursos alinhados ao seu perfil em poucos minutos — com a mesma
                  qualidade de recomendação que valorizamos em toda a
                  plataforma.
                </p>
                <Link href="/quiz?mode=vocacional" className="btn-purple">
                  Iniciar teste vocacional
                </Link>
              </aside>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
        <section id="guias" className="section section-alt">
          <div className="container">
            <div className="section-header text-center">
              <div className="section-eyebrow">Premium &amp; gestão</div>
              <h2 className="section-title">
                Conteúdo, guias e <span className="gradient-text">admin</span>
              </h2>
              <p className="section-subtitle">
                Guias estratégicos, histórico e área administrativa permanecem
                ativos.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="feature-card meloma-premium-block-card flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="feature-title text-lg">
                    Conteúdo e trilhas premium
                  </h3>
                  <p className="feature-desc mt-2">
                    Guias estratégicos, histórico e área administrativa
                    permanecem ativos.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/guias"
                    className="btn-outline"
                    onClick={closeMobileMenu}
                  >
                    Ver guias →
                  </Link>
                  <Link
                    href="/admin/login"
                    className="btn-outline"
                    onClick={closeMobileMenu}
                  >
                    Admin →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>
      </div>

      <SiteFooter />
    </main>
  );
}
