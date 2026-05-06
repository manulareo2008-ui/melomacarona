"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ConstellationStarfield } from "@/components/ConstellationStarfield";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  IconArrowUpRight,
  IconFeatureAdmin,
  IconFeatureBrain,
  IconFeatureCart,
  IconFeatureGraduation,
  IconFeatureQuiz,
  IconFeatureShield,
  IconPlusBold,
  IconRocketSmall,
  IconSparkleBadge,
  IconStarOutline,
  IconStepAI,
  IconStepLink,
  IconStepProfile,
} from "@/components/MelomaIcons";
import { SiteFooter } from "@/components/SiteFooter";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Mapeie seu Perfil",
    description:
      "Responda perguntas rápidas sobre seus objetivos, nível de experiência, disponibilidade e orçamento.",
    Icon: IconStepProfile,
  },
  {
    step: "02",
    title: "Ative o Motor",
    description:
      "Nosso algoritmo cruza cursos e trilhas para encontrar combinações alinhadas ao seu momento e preferências.",
    Icon: IconStepAI,
  },
  {
    step: "03",
    title: "Comece a Jornada",
    description:
      "Receba recomendações personalizadas com justificativas claras e links diretos para matrícula.",
    Icon: IconStepLink,
  },
] as const;

const CATEGORIES = [
  {
    name: "Programação",
    slug: "programacao",
    Icon: IconFeatureBrain,
    iconClass: "fi-blue",
  },
  {
    name: "Design",
    slug: "design",
    Icon: IconFeatureGraduation,
    iconClass: "fi-purple",
  },
  {
    name: "Dados & IA",
    slug: "dados",
    Icon: IconFeatureQuiz,
    iconClass: "fi-green",
  },
  {
    name: "Negócios",
    slug: "negocios",
    Icon: IconFeatureCart,
    iconClass: "fi-orange",
  },
  {
    name: "Marketing",
    slug: "marketing",
    Icon: IconFeatureAdmin,
    iconClass: "fi-pink",
  },
  {
    name: "Produto",
    slug: "produto",
    Icon: IconFeatureShield,
    iconClass: "fi-yellow",
  },
] as const;

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
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
    <main className="meloma-landing" id="top">
      <input
        ref={navToggleRef}
        type="checkbox"
        id="nav-toggle"
        className="sr-only"
        aria-label="Abrir menu de navegação"
      />

      <nav id="navbar" className={navScrolled ? "scrolled" : ""}>
        <div className="container nav-inner">
          <Link href="/#top" className="nav-logo">
            <span className="nav-logo-icon" aria-hidden>
              <IconRocketSmall size={22} />
            </span>
            Melomacarona
          </Link>

          <div className="nav-links">
            <Link href="/#top" className="nav-link">
              Início
            </Link>
            <a href="#como-funciona" className="nav-link">
              Descobrir
            </a>
            <Link href="/parcerias" className="nav-link">
              Parcerias
            </Link>
            <Link href="/contato" className="nav-link">
              Contato
            </Link>
            <Link href="/premium/login" className="nav-btn nav-btn-ghost">
              Entrar
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
        <Link href="/#top" className="nav-link" onClick={closeMobileMenu}>
          Início
        </Link>
        <a
          href="#como-funciona"
          className="nav-link"
          onClick={closeMobileMenu}
        >
          Descobrir
        </a>
        <Link href="/parcerias" className="nav-link" onClick={closeMobileMenu}>
          Parcerias
        </Link>
        <Link href="/contato" className="nav-link" onClick={closeMobileMenu}>
          Contato
        </Link>
        <Link
          href="/premium/login"
          className="nav-btn nav-btn-ghost"
          onClick={closeMobileMenu}
        >
          Entrar
        </Link>
      </div>

      <div id="section-home">
        <section className="hero meloma-hero-v2">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-grid" />
          <ConstellationStarfield className="meloma-starfield" />
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge meloma-hero-reveal meloma-hero-reveal--1">
                <span className="hero-badge-icon" aria-hidden>
                  <IconSparkleBadge size={14} />
                </span>
                Navegador de Constelações do Conhecimento
              </div>
              <h1 className="hero-title meloma-hero-reveal meloma-hero-reveal--2">
                Descubra seu{" "}
                <span className="hero-highlight-caminho">caminho</span> no
                universo do <span className="highlight">aprendizado</span>
              </h1>
              <p className="hero-subtitle meloma-hero-reveal meloma-hero-reveal--3">
                Responda algumas perguntas e deixe nossos algoritmos mapearem a{" "}
                <strong>constelação perfeita</strong> de cursos e trilhas para
                seus objetivos, orçamento e ritmo de vida.
              </p>
              <div className="hero-cta-wrap meloma-hero-reveal meloma-hero-reveal--4">
                <Link href="/quiz" className="btn-hero" onClick={closeMobileMenu}>
                  Iniciar Jornada
                  <IconPlusBold size={22} />
                </Link>
                <Link
                  href="/parcerias"
                  className="hero-secondary-link"
                  onClick={closeMobileMenu}
                >
                  <IconStarOutline size={18} />
                  <span>Seja um Parceiro</span>
                </Link>
              </div>
              <div className="hero-stats meloma-hero-reveal meloma-hero-reveal--5">
                <div className="hero-stat">
                  <div className="hero-stat-value">500+</div>
                  <div className="hero-stat-label">Cursos mapeados</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">12K+</div>
                  <div className="hero-stat-label">Trilhas criadas</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">45K+</div>
                  <div className="hero-stat-label">Exploradores</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">94%</div>
                  <div className="hero-stat-label">Satisfação</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section" id="como-funciona">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Como funciona</div>
                <h2 className="section-title">
                  Três passos para mapear sua constelação de aprendizado
                </h2>
                <p className="section-subtitle">
                  Um processo simples para encontrar as melhores opções para você.
                </p>
              </div>

              <div className="steps-grid meloma-steps-ref">
                {HOW_IT_WORKS.map((item, index) => {
                  const StepIcon = item.Icon;
                  return (
                    <div
                      key={item.step}
                      className="step-card meloma-step-card-ref"
                    >
                      <span className="step-watermark">{item.step}</span>
                      <div
                        className={`step-row-icon step-icon-tone-${index}`}
                        aria-hidden
                      >
                        <StepIcon size={30} />
                      </div>
                      <div className="step-title">{item.title}</div>
                      <p className="step-desc">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section section-alt" id="categorias">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Explore por categoria</div>
                <h2 className="section-title">
                  Constelações de conhecimento organizadas por área
                </h2>
                <p className="section-subtitle">
                  Conteúdos organizados para acelerar sua evolução profissional.
                </p>
              </div>

              <div className="features-grid meloma-categories-ref">
                {CATEGORIES.map((category) => {
                  const CatIcon = category.Icon;
                  return (
                    <Link
                      key={category.name}
                      href={`/quiz?tema=${category.slug}`}
                      className="feature-card meloma-category-card-ref text-center"
                    >
                      <div
                        className={`feature-icon-wrap ${category.iconClass} meloma-feature-icon-wrap`}
                      >
                        <CatIcon size={26} />
                      </div>
                      <div className="feature-title">{category.name}</div>
                      <span className="meloma-cat-arrow" aria-hidden>
                        <IconArrowUpRight size={18} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal className="section-scroll-wrap">
          <section className="section vocational-section meloma-voc-bg" id="quiz">
            <div className="container">
              <div className="vocational-inner">
                <div className="vocational-left">
                  <div className="badge badge-purple" style={{ marginBottom: 20 }}>
                    Pronto para descobrir sua constelação?
                  </div>
                  <h2 className="vocational-title">
                    Leva menos de 2 minutos.
                    <br />E pode mudar a direção da sua carreira.
                  </h2>
                  <Link href="/quiz" className="btn-purple" onClick={closeMobileMenu}>
                    Criar Minha Constelação
                    <IconRocketSmall size={20} />
                  </Link>
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
