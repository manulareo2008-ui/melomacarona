/**
 * Classes utilitárias do assistente — Design System v2
 * Paleta: Lima #C8FF4D + Teal #4DFFC8 sobre #080B10
 */

export const WIZARD_SHELL =
  "min-h-screen text-[#F0F2F5] antialiased selection:bg-[rgba(200,255,77,0.2)] selection:text-[#F0F2F5]";

export const WIZARD_INNER =
  "mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-8 sm:py-12";

export const panelClass =
  "w-full max-w-3xl rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[#0D1117] p-6 shadow-[0_20px_60px_-24px_rgba(200,255,77,0.15),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md sm:p-10";

export const panelClassQuiz =
  "meloma-quiz-ref-panel w-full max-w-3xl rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(13,17,23,0.80)] p-6 shadow-[0_24px_56px_rgba(4,6,8,0.6)] backdrop-blur-xl sm:p-10";

export const primaryBtn =
  "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C8FF4D] px-8 py-3.5 text-[15px] font-semibold text-[#080B10] shadow-[0_0_24px_rgba(200,255,77,0.25)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#d4ff6a] hover:shadow-[0_0_36px_rgba(200,255,77,0.40)] active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF4D]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B10] sm:w-auto sm:min-w-[220px]";

export const secondaryBtn =
  "inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-6 py-2.5 text-sm font-medium text-[#8A96A8] shadow-sm transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(255,255,255,0.16)] hover:text-[#F0F2F5] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.3)]";

export const detailsCtaBtn =
  "w-full rounded-full bg-[#C8FF4D] py-3.5 text-center text-[15px] font-semibold text-[#080B10] shadow-[0_0_24px_rgba(200,255,77,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d4ff6a] hover:shadow-[0_0_36px_rgba(200,255,77,0.40)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF4D]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B10] active:scale-[0.99]";

const cardCtaBase =
  "mt-4 inline-flex w-full items-center justify-center rounded-full border-0 py-3 text-[14px] font-bold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B10] active:scale-[0.99]";
export const cardDetailsBtn = `${cardCtaBase} bg-[#C8FF4D] text-[#080B10] shadow-[0_0_20px_rgba(200,255,77,0.20)] hover:-translate-y-0.5 hover:bg-[#d4ff6a] hover:shadow-[0_0_28px_rgba(200,255,77,0.35)] focus-visible:ring-[#C8FF4D]/60`;

const fieldInputBase =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D1117] px-4 py-3.5 text-[15px] text-[#F0F2F5] shadow-sm transition duration-200 placeholder:text-[#55606F] focus:outline-none focus:ring-2 [color-scheme:dark]";
const fieldInputOk = `${fieldInputBase} focus:border-[rgba(200,255,77,0.35)] focus:ring-[rgba(200,255,77,0.15)]`;
const fieldInputErr = `${fieldInputBase} border-rose-500 focus:border-rose-500 focus:ring-rose-500/20`;

export function fieldClass(error: boolean): string {
  return error ? fieldInputErr : fieldInputOk;
}

export const labelClass =
  "mb-2 block text-sm font-semibold tracking-tight text-[#F0F2F5]";

export const kickerText =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55606F]";

export const heading1 =
  "text-center text-4xl font-extrabold leading-[1.08] tracking-tight text-[#F0F2F5] sm:text-5xl";

export const heading2 =
  "text-center text-3xl font-extrabold leading-tight tracking-tight text-[#F0F2F5] sm:text-4xl";

export const bodyLead =
  "text-center text-base leading-relaxed text-[#8A96A8]";

export const subOptionBase =
  "min-h-[4.5rem] rounded-2xl border p-4 text-start text-sm font-medium leading-snug transition duration-200";
export const subOptionActive =
  "border-[rgba(200,255,77,0.40)] bg-[rgba(200,255,77,0.06)] text-[#F0F2F5] shadow-md ring-1 ring-[rgba(200,255,77,0.20)]";
export const subOptionIdle =
  "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#8A96A8] hover:-translate-y-px hover:border-[rgba(255,255,255,0.14)] hover:text-[#F0F2F5]";

export const segmentActive =
  "ring-2 ring-[rgba(200,255,77,0.60)] bg-[rgba(200,255,77,0.08)] text-[#C8FF4D]";
export const segmentIdle =
  "bg-[rgba(255,255,255,0.04)] text-[#8A96A8] ring-1 ring-[rgba(255,255,255,0.08)] hover:ring-[rgba(255,255,255,0.14)] hover:text-[#F0F2F5]";
export const priceCardActive =
  "border-[rgba(200,255,77,0.40)] bg-[rgba(200,255,77,0.06)] font-medium text-[#F0F2F5] ring-1 ring-[rgba(200,255,77,0.20)]";
export const priceCardIdle =
  "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#8A96A8] hover:-translate-y-px hover:border-[rgba(255,255,255,0.14)] hover:text-[#F0F2F5]";

export const languageTrigger =
  "inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs font-medium text-[#8A96A8] shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-px hover:text-[#F0F2F5] hover:border-[rgba(255,255,255,0.14)]";

export const languageMenu =
  "absolute end-0 z-[95] mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(8,11,16,0.96)] py-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md";

export const languageMenuItem =
  "block w-full px-4 py-2.5 text-start text-sm transition duration-150";
export const languageMenuItemActive = `${languageMenuItem} bg-[rgba(200,255,77,0.08)] font-semibold text-[#C8FF4D]`;
export const languageMenuItemIdle = `${languageMenuItem} text-[#8A96A8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F0F2F5]`;

export const progressTrack =
  "mx-auto mt-4 flex h-1.5 max-w-[12rem] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]";
export const progressFill =
  "h-full rounded-full bg-gradient-to-r from-[#C8FF4D] to-[#4DFFC8] transition-[width] duration-500 ease-out";

export const mainMotion =
  "wizard-step-fade flex flex-1 flex-col items-center justify-center";
