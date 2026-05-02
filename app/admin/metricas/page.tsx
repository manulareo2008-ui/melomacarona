import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogoutButton } from "./AdminLogoutButton";

export default async function AdminMetricsPage() {
  if (!(await isAdminSessionValid())) {
    redirect(
      "/admin/login?next=" + encodeURIComponent("/admin/metricas")
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-950 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Dashboard administrativo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
            Painel de métricas
          </h1>
          <p className="mt-3 text-sm text-white">
            Métricas em tempo real do catálogo, quizzes e cliques. Dados atualizados
            a cada 30 segundos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
          >
            Site público
          </Link>
          <AdminLogoutButton />
        </div>
      </header>

      <AdminDashboard />
    </main>
  );
}
