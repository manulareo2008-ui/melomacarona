import type { Metadata } from "next";

/** Página ponte: não indexar conteúdo fino / parametrizado. */
export const metadata: Metadata = {
  title: "Abrindo curso",
  robots: { index: false, follow: true },
};

export default function AcessandoCursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
