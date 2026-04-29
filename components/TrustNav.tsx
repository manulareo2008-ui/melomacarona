import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export function TrustNav() {
  return (
    <header className="border-b border-white/[0.08] bg-[#080e1a]/90 backdrop-blur-md">
      <div className="container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-transparent bg-gradient-to-br from-[#60A5FA] to-[#A78BFA] bg-clip-text"
        >
          {SITE_NAME}
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
        >
          ← Voltar ao início
        </Link>
      </div>
    </header>
  );
}
