"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "melomacarona_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Uso de cookies e dados"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0f172a]/95 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-300">
          Utilizamos dados necessários ao funcionamento do site e, quando aplicável,
          medições agregadas para melhorar a experiência. Ao continuar, você concorda com
          nossa{" "}
          <Link href="/privacidade" className="font-medium text-emerald-300 underline-offset-2 hover:text-emerald-200 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Aceitar e continuar
          </button>
        </div>
      </div>
    </div>
  );
}
