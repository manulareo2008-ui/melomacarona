import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustNav } from "@/components/TrustNav";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
};

export function TrustArticleShell({ title, subtitle, eyebrow, children }: Props) {
  return (
    <main className="meloma-trust-page meloma-landing">
      <TrustNav />
      <article className="container meloma-trust-article max-w-3xl">
        {eyebrow ? (
          <p className="meloma-badge-pill mb-4 inline-flex">{eyebrow}</p>
        ) : null}
        <h1 className="meloma-trust-title">{title}</h1>
        {subtitle ? <p className="meloma-trust-subtitle">{subtitle}</p> : null}
        <div className="meloma-trust-body space-y-6">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
