"use client";

import { CourseWizard } from "@/components/CourseWizard";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function QuizPageContent() {
  const searchParams = useSearchParams();
  const vocationalFirst = searchParams.get("mode") === "vocacional";
  const presetTema = searchParams.get("tema");

  return (
    <main className="meloma-quiz-page meloma-landing">
      <header className="meloma-quiz-header">
        <div className="container flex items-center justify-between">
          <Link href="/" className="meloma-quiz-back">
            ← Voltar para a home
          </Link>
          <p className="badge badge-blue hidden sm:inline-flex">
            Navegador de Constelacoes
          </p>
        </div>
      </header>

      <section className="meloma-quiz-fullscreen">
        <div className="new-container w-full">
          <CourseWizard
            vocationalFirst={vocationalFirst}
            presetTema={presetTema}
          />
        </div>
      </section>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <main className="meloma-quiz-page">
          <section className="meloma-quiz-fullscreen">
            <p>Carregando...</p>
          </section>
        </main>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
