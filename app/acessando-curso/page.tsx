"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  COURSE_REDIRECT_BROADCAST,
  type CourseRedirectNotifyPayload,
} from "@/lib/courseRedirectNotify";

function normalizeExternalUrl(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (/^www\./i.test(value)) return `https://${value}`;
  return null;
}

function AcessandoCursoContent() {
  const params = useSearchParams();
  const target = normalizeExternalUrl(params.get("target"));
  const fallback = normalizeExternalUrl(params.get("fallback"));
  const course = params.get("course")?.trim() || "curso selecionado";
  const notifyId = params.get("notify")?.trim() || null;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function postNotify(phase: "redirect" | "error") {
      if (!notifyId || typeof BroadcastChannel === "undefined") return;
      try {
        const bc = new BroadcastChannel(COURSE_REDIRECT_BROADCAST);
        const payload: CourseRedirectNotifyPayload = { notifyId, phase };
        bc.postMessage(payload);
        bc.close();
      } catch {
        // ignore
      }
    }

    async function redirectSafely() {
      const directDestination = target ?? fallback;
      if (!directDestination) {
        if (!cancelled) {
          setFailed(true);
          postNotify("error");
        }
        return;
      }

      try {
        const resolverUrl = new URL("/api/course-link/resolve", window.location.origin);
        if (target) resolverUrl.searchParams.set("target", target);
        if (fallback) resolverUrl.searchParams.set("fallback", fallback);
        if (course) resolverUrl.searchParams.set("course", course);

        const response = await fetch(resolverUrl.toString(), {
          method: "GET",
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as
          | { ok?: boolean; resolvedUrl?: string; reason?: string }
          | null;

        if (!response.ok || !data?.ok || !data?.resolvedUrl) {
          if (!cancelled) {
            setFailed(true);
            postNotify("error");
          }
          return;
        }

        const resolvedUrl =
          normalizeExternalUrl(data.resolvedUrl) ?? directDestination;

        if (!cancelled) {
          postNotify("redirect");
          window.location.replace(resolvedUrl);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          postNotify("error");
        }
      }
    }

    void redirectSafely();

    return () => {
      cancelled = true;
    };
  }, [course, fallback, target, notifyId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900">
      <section className="w-full max-w-lg rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm">
        {failed ? (
          <>
            <p className="text-sm font-semibold text-zinc-800">{course}</p>
            <h1 className="mt-2 text-xl font-bold">Curso temporariamente indisponível</h1>
            <p className="mt-2 text-sm text-zinc-700">
              Não foi possível confirmar um link válido para este curso agora. Volte às
              recomendações e escolha outra opção, ou busque o nome do curso diretamente na
              plataforma.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-zinc-800">Abrindo: {course}</p>
            <h1 className="mt-2 text-xl font-bold">Estamos carregando o curso para voce.</h1>
            <p className="mt-2 text-sm text-zinc-700">
              Aguarde — voce sera redirecionado assim que o destino estiver confirmado.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default function AcessandoCursoPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900">
          <p className="text-sm text-zinc-600">Carregando…</p>
        </main>
      }
    >
      <AcessandoCursoContent />
    </Suspense>
  );
}
