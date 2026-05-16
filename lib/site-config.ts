/**
 * Valores públicos (prefixo NEXT_PUBLIC_). Opcionais: fallback seguro na UI.
 */
export const SITE_NAME = "Atloom";

/** URL absoluta do site (sitemap, OG, metadataBase). Prioridade: env → Vercel → localhost. */
export function getAbsoluteSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}

/** E-mail público exibido no site quando `NEXT_PUBLIC_CONTACT_EMAIL` não está definido. */
const FALLBACK_PUBLIC_CONTACT_EMAIL = "manulareo2008@gmail.com";

export function getPublicContactEmail(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw || FALLBACK_PUBLIC_CONTACT_EMAIL;
}

export function getSiteOperatorLabel(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_OPERATOR_NAME?.trim() ||
    "o responsável pelo tratamento dos dados neste site"
  );
}
