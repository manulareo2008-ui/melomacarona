import Link from "next/link";
import { PremiumAuthForm } from "@/components/PremiumAuthForm";

export default function PremiumLoginPage() {
  return (
    <main className="meloma-premium-login-shell">
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="meloma-premium-login-heading">Acesso Premium</h1>
          <Link href="/" className="meloma-premium-back-link">
            ← Voltar
          </Link>
        </div>
        <PremiumAuthForm />
      </div>
    </main>
  );
}
