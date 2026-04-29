/**
 * Classes utilitárias do assistente (home / dashboard).
 * Referências: respiro e tipografia (Apple, Dropbox), CTAs sólidos (Stripe),
 * elevação e sombras suaves (Dribbble), micro-tempo (Framer).
 */

export const WIZARD_SHELL =
  "min-h-screen text-slate-100 antialiased selection:bg-blue-500/25 selection:text-slate-100";

export const WIZARD_INNER =
  "mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8 sm:py-12";

/** Painel principal — “glass” leve, sombra suave, cantos 24px+ */
export const panelClass =
  "w-full max-w-3xl rounded-[28px] border border-slate-600/35 bg-slate-900/70 p-6 shadow-[0_20px_50px_-24px_rgba(37,99,235,0.55),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md sm:p-10";

export const primaryBtn =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-blue-500/45 active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:min-w-[220px]";

export const secondaryBtn =
  "inline-flex items-center justify-center rounded-full border border-slate-500/40 bg-slate-900/65 px-6 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:border-slate-300/40 hover:bg-slate-800/80 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60";

export const detailsCtaBtn =
  "w-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 py-3.5 text-center text-[15px] font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-blue-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]";

const cardCtaBase =
  "mt-4 inline-flex w-full items-center justify-center rounded-full border-0 py-3 text-[15px] font-bold text-white transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]";
export const cardDetailsBtn = `${cardCtaBase} bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-blue-500/40 focus-visible:ring-blue-500/80`;

const fieldInputBase =
  "w-full rounded-2xl border border-slate-500/40 bg-slate-900/65 px-4 py-3.5 text-[15px] text-slate-100 shadow-sm transition duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const fieldInputOk = `${fieldInputBase} focus:border-blue-400/50 focus:ring-blue-400/15`;
const fieldInputErr = `${fieldInputBase} border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500`;

export function fieldClass(error: boolean): string {
  return error ? fieldInputErr : fieldInputOk;
}

export const labelClass =
  "mb-2 block text-sm font-semibold tracking-tight text-slate-100";

export const kickerText =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400";

export const heading1 =
  "text-center text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl";

export const heading2 =
  "text-center text-3xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl";

export const bodyLead =
  "text-center text-base leading-relaxed text-slate-200";

export const subOptionBase =
  "min-h-[4.5rem] rounded-2xl border p-4 text-start text-sm font-medium leading-snug transition duration-200";
export const subOptionActive =
  "border-blue-400/70 bg-blue-950/35 text-blue-100 shadow-md shadow-blue-500/15 ring-1 ring-blue-400/25";
export const subOptionIdle =
  "border-slate-500/40 bg-slate-900/55 text-slate-100 hover:-translate-y-px hover:border-slate-300/40 hover:shadow-sm";

export const segmentActive =
  "ring-2 ring-blue-400/80 bg-blue-950/35 text-blue-100 shadow-sm";
export const segmentIdle =
  "bg-slate-900/65 text-slate-100 ring-1 ring-slate-500/45 hover:ring-slate-300/45";
export const priceCardActive =
  "border-blue-400/70 bg-blue-950/35 font-medium text-blue-100 ring-1 ring-blue-400/30 shadow-sm";
export const priceCardIdle =
  "border-slate-500/40 bg-slate-900/55 text-slate-100 hover:-translate-y-px hover:border-slate-300/40";

export const languageTrigger =
  "inline-flex items-center gap-2 rounded-full border border-slate-500/40 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-100 shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-px hover:bg-slate-800/80 hover:shadow";

export const languageMenu =
  "absolute end-0 z-[95] mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-slate-500/40 bg-slate-950/95 py-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md";

export const languageMenuItem =
  "block w-full px-4 py-2.5 text-start text-sm transition duration-150";
export const languageMenuItemActive = `${languageMenuItem} bg-blue-950/45 font-semibold text-blue-100`;
export const languageMenuItemIdle = `${languageMenuItem} text-slate-100 hover:bg-slate-800/70`;

export const progressTrack =
  "mx-auto mt-4 flex h-1.5 max-w-[12rem] overflow-hidden rounded-full bg-slate-700/70";
export const progressFill =
  "h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-500 ease-out";

export const mainMotion =
  "wizard-step-fade flex flex-1 flex-col items-center justify-center";
