import Link from "next/link";
import { PremiumAuthForm } from "@/components/PremiumAuthForm";
import { TrustNav } from "@/components/TrustNav";

export default function PremiumLoginPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />
      <section className="meloma-premium-login-shell">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8">
          <div className="text-center">
            <p className="section-eyebrow">Area premium</p>
            <h1 className="section-title mt-2">Acesse sua conta</h1>
            <p className="section-subtitle mt-3">
              Continue sua jornada com historico de recomendacoes e conteudos exclusivos.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[440px]">
            <PremiumAuthForm />
          </div>
          <div className="text-center">
            <Link href="/" className="meloma-premium-back-link">
              ← Voltar para a home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
