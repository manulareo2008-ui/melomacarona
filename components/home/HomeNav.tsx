"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { spring } from "@/lib/motion";
import { HERO_CTA_ID } from "./ids";
import { PressLink } from "./PressLink";

const LINKS = [
  { href: "/#top", label: "Início" },
  { href: "#como-funciona", label: "Descobrir" },
  { href: "/parcerias", label: "Parcerias" },
  { href: "/contato", label: "Contato" },
] as const;

/** A nav existe uma vez por página: id fixo (o useId divergia no dev por causa dos nós de devtools do Next). */
const MENU_ID = "atl-nav-menu";

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const heroCta = document.getElementById(HERO_CTA_ID);
    if (!heroCta) return;
    const observer = new IntersectionObserver(([entry]) => {
      setCtaVisible(!entry.isIntersecting);
    });
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    // layoutRoot: a nav é fixa, então o deslize dos links se mede relativo a ela, não à rolagem.
    <motion.header layoutRoot className="atl-nav" data-scrolled={scrolled || menuOpen}>
      <div className="atl-container atl-nav-inner">
        <Link href="/#top" className="atl-nav-logo" onClick={closeMenu}>
          Atloom
        </Link>

        {/* O CTA entra e sai do fluxo de uma vez; os links deslizam por mola em vez de pular. */}
        <motion.nav layout="position" transition={spring.snappy} className="atl-nav-links" aria-label="Principal">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="atl-nav-link">
              {link.label}
            </Link>
          ))}
        </motion.nav>

        <div className="atl-nav-actions">
          <AnimatePresence initial={false} mode="popLayout">
            {ctaVisible && (
              <motion.div
                key="nav-cta"
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={spring.snappy}
              >
                <PressLink href="/quiz" className="atl-btn atl-btn--sm" onClick={closeMenu} lift>
                  Fazer o teste
                </PressLink>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={toggleRef}
            type="button"
            className="atl-nav-toggle"
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id={MENU_ID}
            className="atl-nav-menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring.snappy}
          >
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="atl-nav-menu-link" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
