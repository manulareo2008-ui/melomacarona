import Link from "next/link";
import { PremiumAuthForm } from "@/components/PremiumAuthForm";

export default function PremiumLoginPage() {
  return (
    <main className="new-ui-shell min-h-screen px-4 py-10 sm:px-8">
      <div className="new-container mb-8 flex w-full items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-100 sm:text-3xl">Acesso Premium</h1>
        <Link
          href="/"
          className="new-btn new-btn-ghost"
        >
          Voltar
        </Link>
      </div>
      <PremiumAuthForm />
    </main>
  );
}
