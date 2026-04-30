import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export function TrustNav() {
  return (
    <header className="meloma-trust-nav sticky top-0 z-50">
      <div className="container meloma-trust-nav-inner">
        <Link href="/" className="meloma-trust-logo">
          {SITE_NAME}
        </Link>
        <Link href="/" className="meloma-trust-back">
          ← Voltar ao início
        </Link>
      </div>
    </header>
  );
}
