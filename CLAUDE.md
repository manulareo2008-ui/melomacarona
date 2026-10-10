# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server with Turbopack at http://localhost:3000
npm run build        # Production build (Turbopack)
npm run start        # Serve production build
npm run lint         # ESLint (eslint-config-next)
npm run check:course-links  # Validate external course URLs in coursesData.ts
```

Environment: copy `.env.example` to `.env.local` and fill in credentials before running.

## Architecture

**Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, React 19, i18next.

### Core flow

The app is a multi-step course recommendation wizard. The entry point is `app/page.tsx`, which renders `components/CourseWizard.tsx` — a large single-component wizard that drives all user-facing steps (area → niche → budget → modality → results).

### Recommendation pipeline (`lib/recommendation/`)

Two-layer system:

1. **Local scoring** (`scoring.ts`): filters by budget hard cap, then scores each course across four pillars (area 25%, niche 45%, price 20%, modality 10%). Niche scoring uses token overlap with semantic synonym expansion (`SEMANTIC_SYNONYMS`).
2. **LLM enrichment** (`llm.ts`): optionally called for the top-5 results when `LLM_API_KEY` is set. Supports `openai` or `gemini` provider via `LLM_PROVIDER` env var. Returns a score adjustment (−15 to +15) and a personalized pitch. Gracefully degrades to local scoring on failure.

`engine.ts` orchestrates both layers. `courseRepository.ts` is a thin wrapper for the catalog.

### Data

- `lib/coursesData.ts` — static catalog of international courses (`INTERNATIONAL_COURSES`). The primary source of truth; `priceBrl`, `area`, `modality`, `tags`, and `subArea` fields drive scoring.
- `lib/domain.ts` — enums/constants: `GENERAL_AREAS`, `SUB_AREAS`, `PRICE_OPTIONS`, `Modality`.
- `lib/courseTextTranslations.ts` — translated course names and descriptions for the UI.

### API routes (`app/api/`)

| Route | Purpose |
|---|---|
| `/api/recommend-courses` | Main recommendation endpoint; calls `engine.ts` |
| `/api/send-evaluation` | Sends email via nodemailer (SMTP credentials in env) when user completes the wizard |
| `/api/analytics/ingest` | Receives `POST` events from the client and appends to `data/analytics-events.jsonl` |
| `/api/admin` | Admin session management |

### Analytics

Dual-track: events are written to `localStorage` on the client (`lib/analytics.ts`) and also sent non-blocking to `/api/analytics/ingest` via `navigator.sendBeacon` or `fetch`. Server side, `lib/server-analytics.ts` appends newline-delimited JSON to `data/analytics-events.jsonl` (max 8 000 lines read back).

### Admin dashboard (`app/admin/`)

Protected by HMAC-SHA256 cookie (`lib/admin-auth.ts`). Requires `ADMIN_DASHBOARD_PASSWORD` and `ADMIN_TOKEN_SECRET` in env. Metrics are served at `/admin/metricas`.

### i18n

9 languages (default `pt-BR`) via i18next + react-i18next. Translation files live in `locales/*.json`. Arabic (`ar`) is RTL and handled via `RTL_LANGUAGES` in `lib/i18n.ts`. All UI strings must go through `useTranslation` — do not hard-code Portuguese strings in components.

### Styling

Tailwind CSS v4. Shared UI constants (class strings for buttons, panels, typography) are exported from `lib/wizard-ui.ts` — use these instead of duplicating class lists in components.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_DASHBOARD_PASSWORD` | Yes (admin) | Admin login |
| `ADMIN_TOKEN_SECRET` | Yes (admin) | Cookie signing |
| `SMTP_HOST/PORT/USER/PASS/FROM` | Yes (email) | Evaluation emails |
| `LLM_PROVIDER` / `LLM_API_KEY` / `LLM_MODEL` | No | LLM pitch enrichment |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | No | RAG recommend-courses route |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | No | Gemini fallback |

`next.config.ts` allows `192.168.1.10` as a dev origin (local network access).

## Estado do rebuild visual da home

**Feito (Pass 1–3, reskin editorial completo):**
- Guiado por `design-system.md` (raiz), a fonte de verdade visual; referências em `refs/`. Skills usadas: `apple-design` e `emil-design-eng` (`.claude/skills/`).
- `app/page.tsx` agora é a landing (componentes em `components/home/`); o wizard roda em `/quiz`. O "Core flow" acima está desatualizado nesse ponto.
- Fontes Fraunces (display, eixos `opsz` + `SOFT`) + Hanken Grotesk via `next/font` em `app/layout.tsx`.
- Tokens escopados em `.atl` (`app/globals.css`); pele da home na parte 1 de `app/atloom-landing.css` (a parte 2 é o legado das outras páginas). Molas em `lib/motion.ts`.
- Cena scrolly "o teste se monta" (`TestAssemblyScene.tsx`): sticky sem travar o scroll, com números reais do `scoring.ts`. Áreas e prova leem o catálogo no servidor (`catalogFacts.ts`).

**Convenções:**
- Respeitar a lista PROIBIDO do `design-system.md` (§7) em todo build.
- Tokens só em `.atl`, nunca em `:root`: o quiz e as páginas legadas dependem do `:root`/body escuros.
- Textos da home em português direto no código, por decisão (sem refatorar i18n agora).
- Nada commitado ainda.

**Feito (Pass 4):**
- Faixa de prova sem nomes de marcas (só a contagem de instituições, do catálogo); hover/prévia das áreas intactos.
- E-mail público padrão: `contato@atloom.com` (fallback em `lib/site-config.ts`; rodapé e /contato).
- Scroll que salta: não reproduzido no Chrome via DevTools MCP (1440/1024/900/375, subindo e descendo). O único layout-shift era a nav: os links pulavam quando o CTA da nav entrava/saía; agora deslizam por mola (`layout="position"` + `layoutRoot` no header fixo + `popLayout`).

**Pendente:**
- Teste em mobile real (toque, momentum, movimento reduzido do sistema) e commit.
