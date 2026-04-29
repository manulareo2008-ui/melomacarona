import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

function LoginFallback() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-sm text-zinc-500">
      Carregando...
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
