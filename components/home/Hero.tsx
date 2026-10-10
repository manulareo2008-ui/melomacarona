import Link from "next/link";
import { HERO_CTA_ID } from "./ids";
import { HeroTrails } from "./HeroTrails";
import { PressLink } from "./PressLink";

/** Entrada do texto em CSS: roda antes da hidratação e não segura o LCP. */
export function Hero() {
  return (
    <section className="atl-hero" aria-labelledby="hero-title">
      <div className="atl-container">
        <div className="atl-hero-copy">
          <h1 id="hero-title" className="atl-display atl-rise">
            Encontre seu próximo passo na carreira
          </h1>
          <p className="atl-lede atl-rise atl-rise--2">
            Responda 5 perguntas e receba recomendações de cursos com justificativas claras e
            links diretos para matrícula.
          </p>
          <div className="atl-hero-actions atl-rise atl-rise--3">
            <PressLink id={HERO_CTA_ID} href="/quiz" className="atl-btn" lift>
              Fazer o teste
            </PressLink>
            <Link href="/parcerias" className="atl-link-quiet">
              Sou uma instituição
            </Link>
          </div>
          <p className="atl-hero-note atl-rise atl-rise--3">O teste é gratuito e leva menos de 2 minutos.</p>
        </div>
      </div>
      <HeroTrails />
    </section>
  );
}
