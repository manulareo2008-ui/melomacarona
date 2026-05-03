import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { getAbsoluteSiteUrl, SITE_NAME } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
    <html lang="pt-BR" className={inter.variable}>
      <body
        className={`${inter.className} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
