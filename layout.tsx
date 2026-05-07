import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { getAbsoluteSiteUrl, SITE_NAME } from "@/lib/site-config";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter", // mantém alias --font-inter para não quebrar nada
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
