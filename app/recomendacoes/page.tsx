import type { Metadata } from "next";
import { CourseWizard } from "@/components/CourseWizard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recomendações por IA",
  description:
    "Receba sugestões de cursos personalizadas com base nas suas respostas ao questionário.",
};

export default function RecommendationsPage() {
  return (
    <div className="new-ui-shell min-h-screen">
      <section className="new-container pb-6 pt-10 sm:pt-12">
        <div className="mb-6 flex justify-end">
          <Link
            href="/premium/historico"
            className="new-btn new-btn-ghost"
          >
            Meu histórico premium
          </Link>
        </div>
        <h1 className="text-balance text-center text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          Recomendações personalizadas por IA
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-300">
          Responda ao questionário para receber 5 sugestões alinhadas ao seu perfil.
        </p>
      </section>
      <CourseWizard />
    </div>
  );
}
