import type { GeneralArea } from "@/lib/domain";

export type AreaLinksMap = Record<string, string>;

/**
 * URL do parceiro direcionada à área do aluno.
 * Usa `links_por_area[area]` quando for uma URL válida; caso contrário, acrescenta `?meloma_area=` na `site_url`.
 */
export function partnerSiteUrlForArea(
  siteUrl: string | null | undefined,
  linksPorArea: AreaLinksMap | null | undefined,
  userArea: GeneralArea | ""
): string | null {
  const base = siteUrl?.trim();
  if (!base) return null;
  const key = (userArea || "").trim();
  const mapped = key && linksPorArea && typeof linksPorArea[key] === "string" ? linksPorArea[key].trim() : "";
  if (mapped) {
    try {
      // eslint-disable-next-line no-new -- validação
      new URL(mapped);
      return mapped;
    } catch {
      /* continua para fallback */
    }
  }
  try {
    const u = new URL(base);
    if (key) u.searchParams.set("meloma_area", key);
    return u.toString();
  } catch {
    return base;
  }
}
