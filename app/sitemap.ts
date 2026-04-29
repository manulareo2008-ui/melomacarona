import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/lib/site-config";

/** Mantido alinhado a `app/guias/[slug]/page.tsx` (guideContent). */
const GUIDE_SLUGS = [
  "cursos-ia-iniciantes",
  "melhores-cursos-ate-100",
  "cursos-online-com-certificado",
] as const;

const PUBLIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] =
  [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/quiz", priority: 0.95, changeFrequency: "weekly" },
    { path: "/recomendacoes", priority: 0.9, changeFrequency: "weekly" },
    { path: "/guias", priority: 0.85, changeFrequency: "weekly" },
    { path: "/planos", priority: 0.85, changeFrequency: "monthly" },
    { path: "/parcerias", priority: 0.75, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.75, changeFrequency: "monthly" },
    { path: "/privacidade", priority: 0.5, changeFrequency: "yearly" },
    { path: "/termos", priority: 0.5, changeFrequency: "yearly" },
    { path: "/premium/login", priority: 0.6, changeFrequency: "monthly" },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAbsoluteSiteUrl();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = PUBLIC_PATHS.map((item) => ({
    url: `${base}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  for (const slug of GUIDE_SLUGS) {
    entries.push({
      url: `${base}/guias/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return entries;
}
