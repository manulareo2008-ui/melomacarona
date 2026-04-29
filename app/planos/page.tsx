import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustNav } from "@/components/TrustNav";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Compare o acesso gratuito e o Premium Melomacarona — recomendações, histórico e conteúdos para sua jornada.",
};

export default function PlanosPage() {
  return (
    <main className="meloma-landing min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <TrustNav />

      <section className="container py-14 pb-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            Transparência
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Planos pensados para escalar com você
          </h1>
          <p className="mt-4 text-slate-400">
            O núcleo do assistente permanece acessível; o Premium concentra histórico,
            experiências estendidas e conteúdos que exigem conta.{" "}
            <strong className="font-medium text-slate-300">
              Cobrança recorrente será integrada em breve
            </strong>{" "}
            — por ora, o login premium usa a infraestrutura de conta já disponível.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-white/10 bg-[#1e293b]/80 p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white">Grátis</h2>
            <p className="mt-2 flex-1 text-sm text-slate-400">
              Quiz completo, recomendações e acesso aos guias públicos.
            </p>
            <p className="mt-6 text-2xl font-black text-white">R$ 0</p>
            <Link
              href="/quiz"
              className="mt-6 inline-flex justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Começar grátis
            </Link>
          </article>

          <article className="relative flex flex-col rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/80 to-[#1e293b]/90 p-6 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Premium
            </span>
            <h2 className="mt-2 text-lg font-bold text-white">Assinatura</h2>
            <p className="mt-2 flex-1 text-sm text-indigo-100/85">
              Histórico de recomendações, área logada e evoluções do produto focadas em quem
              leva a decisão de carreira a sério.
            </p>
            <p className="mt-6 text-sm font-medium text-indigo-200">Valor em definição</p>
            <Link
              href="/premium/login"
              className="mt-4 inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
            >
              Entrar na área Premium
            </Link>
            <p className="mt-3 text-center text-xs text-indigo-200/70">
              Checkout com cartão será habilitado antes da virada comercial plena.
            </p>
          </article>

          <article className="flex flex-col rounded-2xl border border-white/10 bg-[#1e293b]/80 p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white">Instituições</h2>
            <p className="mt-2 flex-1 text-sm text-slate-400">
              Licenças, campanhas com marca e relatórios agregados para equipes de captação.
            </p>
            <p className="mt-6 text-sm text-slate-500">Proposta sob medida</p>
            <Link
              href="/parcerias"
              className="mt-6 inline-flex justify-center rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-900/50"
            >
              Ver parcerias
            </Link>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
