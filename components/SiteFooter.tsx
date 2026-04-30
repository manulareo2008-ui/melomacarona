import Link from "next/link";
import { getPublicContactEmail, SITE_NAME } from "@/lib/site-config";

export function SiteFooter() {
  const email = getPublicContactEmail();

  return (
    <footer className="meloma-site-footer">
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
            <div className="footer-col-title">Produto</div>
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
            <div className="footer-col-title">Institucional</div>
            <div className="footer-links">
              <Link href="/parcerias" className="footer-link">
                Parcerias
              </Link>
              <Link href="/contato" className="footer-link">
                Contato
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
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
          </p>
          <div className="footer-legal">
            <a href={`mailto:${encodeURIComponent(email)}`}>{email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
