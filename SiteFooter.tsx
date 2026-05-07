import Link from "next/link";
import { getPublicContactEmail, SITE_NAME } from "@/lib/site-config";

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.94 6.5a2.44 2.44 0 1 0 0-4.88 2.44 2.44 0 0 0 0 4.88ZM3.25 20.25h7.38V9H3.25v11.25ZM17.94 9.13c-2.07 0-3.44 1.13-4 2.07V9h-7v11.25h7.13v-6.38c0-1.88 1.13-2.63 2.75-2.63 1.5 0 2.38 1 2.38 2.88v6.13H24v-7.13c0-4.13-2.25-6.12-6.06-6.12Z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm6.25-3.75a.88.88 0 1 1 0 1.75.88.88 0 0 1 0-1.75ZM7.25 12A4.75 4.75 0 1 0 17 12a4.75 4.75 0 0 0-9.75 0Z" />
    </svg>
  );
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M21.8 8.001s-.2-1.42-.8-2.05c-.77-.8-1.63-.81-2.03-.85C16.47 4.75 12 4.75 12 4.75h-.01s-4.47 0-7.97.251c-.4.04-1.26.05-2.03.85-.6.63-.8 2.05-.8 2.05S1 9.681 1 11.411v1.178c0 1.73.2 3.41.2 3.41s.2 1.42.8 2.05c.77.8 1.78.77 2.23.85 1.62.16 6.77.25 6.77.25s4.47-.01 7.97-.26c.4-.04 1.26-.05 2.03-.85.6-.63.8-2.05.8-2.05s.2-1.73.2-3.41v-1.18c0-1.73-.2-3.41-.2-3.41ZM10 14.596v-5.62l5.75 2.82L10 14.596Z" />
    </svg>
  );
}

export function SiteFooter() {
  const email = getPublicContactEmail();

  return (
    <footer className="meloma-site-footer meloma-site-footer--ref">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">{SITE_NAME}</div>
            <p className="footer-brand-desc">
              Assistente para explorar cursos alinhados ao seu perfil. Conteúdo informativo —
              decisões de matrícula permanecem sob sua responsabilidade.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Plataforma</div>
            <div className="footer-links">
              <Link href="/quiz" className="footer-link">
                Quiz
              </Link>
              <Link href="/guias" className="footer-link">
                Guias
              </Link>
              <Link href="/planos" className="footer-link">
                Planos
              </Link>
              <Link href="/premium/login" className="footer-link">
                Área Premium
              </Link>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Legal</div>
            <div className="footer-links">
              <Link href="/privacidade" className="footer-link">
                Privacidade
              </Link>
              <Link href="/termos" className="footer-link">
                Termos de uso
              </Link>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Conecte-se</div>
            <div className="footer-links">
              <Link href="/parcerias" className="footer-link">
                Parcerias
              </Link>
              <Link href="/contato" className="footer-link">
                Contato
              </Link>
              <a
                href={`mailto:${encodeURIComponent(email)}`}
                className="footer-link"
              >
                {email}
              </a>
            </div>
            <div className="footer-social" aria-label="Redes sociais">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn cursor-pointer"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn cursor-pointer"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn cursor-pointer"
                aria-label="YouTube"
              >
                <IconYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
          </p>
          <p className="footer-made-in">Feito no Brasil</p>
        </div>
      </div>
    </footer>
  );
}
