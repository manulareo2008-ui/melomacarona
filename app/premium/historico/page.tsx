import Link from "next/link";
import { PremiumHistoryClient } from "@/components/PremiumHistoryClient";

export default function PremiumHistoryPage() {
  return (
    <main className="new-ui-shell min-h-screen px-4 py-10 sm:px-8">
      <div className="new-container mb-8 flex w-full items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-100 sm:text-3xl">Área Premium</h1>
        <Link
          href="/recomendacoes"
          className="new-btn new-btn-ghost"
        >
          Nova recomendação
        </Link>
      </div>
      <div className="new-container w-full">
        <PremiumHistoryClient />
      </div>
    </main>
  );
}
