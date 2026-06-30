import Link from "next/link";
import { PremiumHistoryClient } from "@/components/PremiumHistoryClient";
import { TrustNav } from "@/components/TrustNav";

export default function PremiumHistoryPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TrustNav />
      <div className="container py-10">
        <div className="mb-8 flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-eyebrow">Area premium</p>
            <h1 className="section-title mt-2">Historico de recomendacoes IA</h1>
          </div>
          <Link href="/recomendacoes" className="btn-plan btn-plan-primary">
            Nova recomendacao
          </Link>
        </div>
        <PremiumHistoryClient />
      </div>
    </main>
  );
}
