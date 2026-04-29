import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const base = getAbsoluteSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/premium/historico"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
