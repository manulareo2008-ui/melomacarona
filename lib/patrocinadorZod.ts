import { z } from "zod";
import { GENERAL_AREAS } from "@/lib/domain";

const GENERAL_AREA_SET = new Set<string>(GENERAL_AREAS);

/** Mapa área (GeneralArea) → URL absoluta da seção no site do parceiro. */
export const linksPorAreaFieldSchema = z
  .record(z.string(), z.union([z.literal(""), z.string().url()]))
  .optional()
  .transform((rec) => {
    if (!rec) return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(rec)) {
      if (!GENERAL_AREA_SET.has(k)) continue;
      const t = typeof v === "string" ? v.trim() : "";
      if (t) out[k] = t;
    }
    return Object.keys(out).length > 0 ? out : null;
  });
