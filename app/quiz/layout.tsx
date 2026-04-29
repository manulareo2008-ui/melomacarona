import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz e recomendações",
  description:
    "Questionário guiado e recomendações de cursos alinhadas ao seu perfil, objetivos e investimento.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
