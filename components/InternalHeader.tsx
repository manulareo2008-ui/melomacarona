"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function InternalHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#080B10]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Esquerda: botão voltar */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>

        {/* Centro: logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-lg font-extrabold tracking-tight text-white transition-opacity hover:opacity-80"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          melomacarona
        </Link>

        {/* Direita: CTA institucional */}
        <Link
          href="/parcerias?origem=header-internal"
          className="inline-flex items-center rounded-full border border-[#C8FF4D]/40 px-3.5 py-2 text-xs font-medium text-[#C8FF4D] transition-all hover:border-[#C8FF4D] hover:bg-[#C8FF4D]/5 sm:px-4 sm:text-sm"
        >
          <span className="sm:hidden">Instituições</span>
          <span className="max-sm:hidden">Sou instituição</span>
        </Link>
      </div>
    </header>
  );
}