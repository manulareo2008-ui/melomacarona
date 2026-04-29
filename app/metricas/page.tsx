import { redirect } from "next/navigation";

/**
 * Rota publica legada: redireciona para login do painel agregado.
 */
export default function LegacyMetricasPage() {
  redirect("/admin/login?next=" + encodeURIComponent("/admin/metricas"));
}
