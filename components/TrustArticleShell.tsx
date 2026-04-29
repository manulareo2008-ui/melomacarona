import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustNav } from "@/components/TrustNav";

type Props = {
  title: string;
  children: ReactNode;
};

export function TrustArticleShell({ title, children }: Props) {
  return (
    <main className="meloma-landing min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <TrustNav />
      <article className="container max-w-3xl py-14 pb-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">{title}</h1>
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
