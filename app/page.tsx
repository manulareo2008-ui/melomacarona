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
    title: "Afinidade Calculada",
    description:
      "Nosso sistema combina seu perfil com cursos avaliados manualmente, encontrando alinhamento real entre o que você busca e o que cada curso entrega.",
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
  { name: "Programação", slug: "programacao", Icon: IconFeatureBrain, iconClass: "fi-blue" },
  { name: "Design", slug: "design", Icon: IconFeatureGraduation, iconClass: "fi-purple" },
  { name: "Dados & IA", slug: "dados", Icon: IconFeatureQuiz, iconClass: "fi-green" },
  { name: "Negócios", slug: "negocios", Icon: IconFeatureCart, iconClass: "fi-orange" },
  { name: "Marketing", slug: "marketing", Icon: IconFeatureAdmin, iconClass: "fi-pink" },
  { name: "Produto", slug: "produto", Icon: IconFeatureShield, iconClass: "fi-yellow" },
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
              <IconRocketSmall size={20} />
            </span>
            Melomacarona
          </Link>

          <div className="nav-links">
            <Link href="/#top" className="nav-link">Início</Link>
            <a href="#como-funciona" className="nav-link">Descobrir</a>
            <Link href="/parcerias" className="nav-link">Parcerias</Link>
            <Link href="/contato" className="nav-link">Contato</Link>
          </div>

          <label htmlFor="nav-toggle" className="nav-hamburger" aria-label="Menu">
            <span /><span /><span />
          </label>
        </div>
      </nav>

      <div className="nav-mobile" id="nav-mobile">
        <Link href="/#top" className="nav-link" onClick={closeMobileMenu}>Início</Link>
        <a href="#como-funciona" className="nav-link" onClick={closeMobileMenu}>Descobrir</a>
        <Link href="/parcerias" className="nav-link" onClick={closeMobileMenu}>Parcerias</Link>
        <Link href="/contato" className="nav-link" onClick={closeMobileMenu}>Contato</Link>
      </div>

      <div id="section-home">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="hero meloma-hero-v2">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-grid" />
          <ConstellationStarfield className="meloma-starfield" />

          <div className="container">
            <div className="hero-content">
              <div className="hero-badge meloma-hero-reveal meloma-hero-reveal--1">
                <span className="hero-badge-icon" aria-hidden>
                  <IconSparkleBadge size={13} />
                </span>
                Curadoria humana de cursos profissionalizantes
              </div>

              <h1 className="hero-title meloma-hero-reveal meloma-hero-reveal--2">
                Encontre seu{" "}
                <span className="hero-highlight-caminho">próximo passo</span>
                {" "}na carreira
              </h1>

              <p className="hero-subtitle meloma-hero-reveal meloma-hero-reveal--3">
                Responda 5 perguntas e receba recomendações de cursos com justificativas
                claras e links diretos para matrícula.
              </p>

              <div className="hero-cta-wrap meloma-hero-reveal meloma-hero-reveal--4">
                <Link href="/quiz" className="btn-hero" onClick={closeMobileMenu}>
                  Iniciar quiz gratuito
                  <IconPlusBold size={20} />
                </Link>
                <Link href="/parcerias" className="hero-secondary-link" onClick={closeMobileMenu}>
                  <IconStarOutline size={16} />
                  <span>Sou uma instituição</span>
                </Link>
              </div>

              <div className="hero-stats meloma-hero-reveal meloma-hero-reveal--5">
                <div className="hero-stat">
                  <div className="hero-stat-value">48</div>
                  <div className="hero-stat-label">Cursos curados manualmente</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">9</div>
                  <div className="hero-stat-label">Áreas de conhecimento</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">2 min</div>
                  <div className="hero-stat-label">Para descobrir o ideal</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">100%</div>
                  <div className="hero-stat-label">Gratuito para alunos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMO FUNCIONA ─────────────────────────────────── */}
        <ScrollReveal className="section-scroll-wrap">
          <section className="section" id="como-funciona">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Como funciona</div>
                <h2 className="section-title">
                  Três etapas para mapear seu caminho
                </h2>
                <p className="section-subtitle">
                  Um processo simples e direto para encontrar as melhores opções para você.
                </p>
              </div>

              <div className="steps-grid meloma-steps-ref">
                {HOW_IT_WORKS.map((item, index) => {
                  const StepIcon = item.Icon;
                  return (
                    <div key={item.step} className="step-card meloma-step-card-ref">
                      <span className="step-watermark">{item.step}</span>
                      <div className={`step-row-icon step-icon-tone-${index}`} aria-hidden>
                        <StepIcon size={26} />
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

        {/* ── CATEGORIAS ────────────────────────────────────── */}
        <ScrollReveal className="section-scroll-wrap">
          <section className="section section-alt" id="categorias">
            <div className="container">
              <div className="section-header text-center">
                <div className="section-eyebrow">Explore por área</div>
                <h2 className="section-title">Onde você quer chegar?</h2>
                <p className="section-subtitle">
                  Clique em uma área para iniciar o quiz já filtrado pelo seu interesse.
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
                      <div className={`feature-icon-wrap ${category.iconClass} meloma-feature-icon-wrap`}>
                        <CatIcon size={24} />
                      </div>
                      <div className="feature-title">{category.name}</div>
                      <span className="meloma-cat-arrow" aria-hidden>
                        <IconArrowUpRight size={16} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── CTA FINAL ─────────────────────────────────────── */}
        <ScrollReveal className="section-scroll-wrap">
          <section className="section vocational-section meloma-voc-bg" id="quiz">
            <div className="container">
              <div className="vocational-inner">
                <div className="vocational-left">
                  <div className="badge badge-purple" style={{ marginBottom: 20 }}>
                    Pronto para começar?
                  </div>
                  <h2 className="vocational-title">
                    Leva menos de 2 minutos.
                    <br />E pode mudar a direção da sua carreira.
                  </h2>
                  <Link href="/quiz" className="btn-purple" onClick={closeMobileMenu}>
                    Criar minha trilha gratuita
                    <IconRocketSmall size={18} />
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