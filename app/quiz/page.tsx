"use client";

import { CourseWizard } from "@/components/CourseWizard";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function QuizPageContent() {
  const searchParams = useSearchParams();
  const vocationalFirst = searchParams.get("mode") === "vocacional";

  return (
    <main className="meloma-quiz-page">
      <header className="meloma-quiz-header">
        <Link href="/" className="meloma-quiz-back">
          ← Voltar para a home
        </Link>
      </header>

      <section className="meloma-quiz-fullscreen">
        <CourseWizard vocationalFirst={vocationalFirst} />
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
