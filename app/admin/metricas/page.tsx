import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { AdminLogoutButton } from "./AdminLogoutButton";

export default async function AdminMetricsPage() {
  if (!(await isAdminSessionValid())) {
    redirect(
      "/admin/login?next=" + encodeURIComponent("/admin/metricas")
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-950 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Operacao do funil
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
            Painel de metricas
          </h1>
          <p className="mt-3 text-sm text-white">
            Dados agregados a partir de todos os acessos que enviaram eventos para o
            servidor. Defina{" "}
            <code className="rounded bg-zinc-900 px-1 text-xs">
              ADMIN_DASHBOARD_PASSWORD
            </code>{" "}
            e{" "}
            <code className="rounded bg-zinc-900 px-1 text-xs">
              ADMIN_TOKEN_SECRET
            </code>{" "}
            no deploy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
          >
            Site publico
          </Link>
          <AdminLogoutButton />
        </div>
      </header>

      <AnalyticsPanel dataSource="server" />
    </main>
  );
}
