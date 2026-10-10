import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { getAbsoluteSiteUrl, SITE_NAME } from "@/lib/site-config";
import "./globals.css";

/* design-system.md §2: Fraunces (display, variável com optical sizing e o eixo SOFT, usado em
   atloom-landing.css para serifas mais macias) + Hanken Grotesk (corpo). */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  variable: "--font-display",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const siteUrl = getAbsoluteSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Descubra o seu caminho | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Assistente em etapas para explorar cursos profissionalizantes com base em interesses, formato e investimento — quiz, recomendações e guias.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `Descubra o seu caminho | ${SITE_NAME}`,
    description:
      "Assistente em etapas para explorar cursos com base em interesses, formato e investimento.",
  },
  twitter: {
    card: "summary",
    title: `Descubra o seu caminho | ${SITE_NAME}`,
    description:
      "Assistente em etapas para explorar cursos com base em interesses, formato e investimento.",
  },
  verification: {
    google: "OsAnU90IZZrHkGExxhhv-8nBVjtFIaZzZN3Axj-akbw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${hankenGrotesk.variable}`}>
      <body className={`${hankenGrotesk.className} antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
