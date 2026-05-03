# Publicar o Melomacarona (cursos-app)

Este projeto é **Next.js full-stack**: interface e rotas de API (`app/api`) sobem **no mesmo deploy**. Por isso o fluxo natural é **um repositório Git + um host (recomendado: Vercel)** — **não** é obrigatório usar Render para “back-end” como no tutorial genérico.

Use Render/Separate backend **só se no futuro** você extrair uma API Node/Python para outro servidor.

---

## O que mudou em relação ao guia “Vercel + Render + Mongo”

| Tutorial genérico | Este projeto |
|-------------------|--------------|
| Repositório separado front / back | **Um repo** (`cursos-app`) |
| Front aponta para URL do Render | Chamadas vão para **`/api/...` no mesmo domínio** (sem CORS entre front e API no mesmo site) |
| MongoDB Atlas ou similar obrigatório | **Supabase** já cobre auth/banco na nuvem; Mongo só faria sentido se você adicionar esse stack |
| Ajustar Base URL no Axios | Rotas relativas (`fetch("/api/...")`) já funcionam em produção no mesmo host |

---

## Pré-requisitos

1. Conta no **GitHub** (ou GitLab/Bitbucket compatível com o host escolhido).
2. `.gitignore` já deve ignorar `.env*` local — **nunca** commitar `.env.local`.
3. **`npm run build`** passando localmente antes do primeiro deploy.

---

## Dia 1 — Git + Supabase (equivalente ao “banco na nuvem”)

### 1) Subir o código

- Crie um repositório e envie o pasta **`cursos-app`** (não precisa separar front/back).
- Confirme que **`.env.local` não está no repositório**.

### 2) Supabase em produção

1. No painel do projeto Supabase: **Authentication → URL configuration**.
2. Em **Site URL**, use a URL final do site (depois do deploy), por exemplo `https://seudominio.vercel.app` ou `https://seudominio.com.br`.
3. Em **Redirect URLs**, inclua as mesmas URLs de callback que você usa em dev, mais a de produção (ex.: `https://seudominio.com.br/**` conforme a doc do Supabase).

Sem isso, login Premium pode falhar só em produção.

### 2b) Migrações SQL (`supabase/migrations/`)

O app grava leads em `marketing_leads` via `upsert` com `onConflict: "email"`, o que exige um **índice UNIQUE na coluna `email`**. Se o projeto Supabase foi criado com a migração antiga (único só em `lower(email)`), as rotas **`POST /api/parcerias/contato`** e **`POST /api/marketing/lead`** podem falhar com erro Postgres **42P10**. Nesse caso, no Supabase abra **SQL Editor**, cole e execute o conteúdo de **`supabase/migrations/20260503_marketing_leads_email_unique_for_upsert.sql`**, depois confirme com um envio de teste na página Parcerias.

Repositórios novos ou que reapliquem todas as migrações na ordem já recebem o índice correto na migração inicial atualizada.

### 3) Variáveis que espelham o “.env na nuvem”

Copie do seu `.env.local` para o painel do host (Vercel → Settings → Environment Variables) os valores necessários. Lista completa em **`.env.example`**.

Prioridade para o site “respirar” em produção:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (só servidor; não exponha no cliente)
- `NEXT_PUBLIC_SITE_URL` (domínio final — sitemap e Open Graph)
- `ADMIN_*` se usar `/admin`
- Chaves de LLM/API **somente** se você quiser recomendações avançadas online (senão algumas rotas podem usar fallback/local).

SMTP (`SMTP_*`): só se envio de e-mail estiver em uso no fluxo.

---

## Dia 2 — Deploy na Vercel (front + API juntos)

1. Acesse [vercel.com](https://vercel.com), importe o **mesmo** repositório do app.
2. **Framework Preset:** Next.js (detecção automática).
3. **Root Directory:** se o repo tiver só `cursos-app` dentro de uma pasta, aponte para essa pasta.
4. **Build Command:** `npm run build` (ou deixe o default se já usar `next build`; este projeto usa script próprio no `package.json`).
5. **Install Command:** `npm install` (padrão).
6. Cole todas as variáveis de ambiente (Production). Faça **Redeploy** após salvar envs.

Primeiro deploy gera algo como `https://projeto.vercel.app`. Use essa URL temporariamente no Supabase (Site URL / Redirect URLs), depois atualize quando tiver domínio customizado.

### Por que não Render aqui?

Render faz sentido para um **servidor sempre ligado** separado. As rotas `app/api` do Next rodam **nas mesmas funções serverless** da Vercel no seu plano. Um segundo backend gerenciaria CORS, segunda pipeline de deploy e custo — só vale se você extrair APIs para fora do Next.

---

## Dia 3 — Domínio, DNS e testes

1. **Domínio customizado:** na Vercel → Domains; configure DNS conforme instruções (geralmente CNAME/A).
2. Atualize **`NEXT_PUBLIC_SITE_URL`** para `https://seudominio.com.br` e **Supabase** Site URL / redirects.
3. Teste: home → quiz → recomendações → login premium → `/admin` se aplicável; veja **Network** no navegador se alguma rota `/api` falhar (401/500).
4. Confira `/sitemap.xml` e `/robots.txt` no domínio final.

---

## Netlify em vez de Vercel

Possível para Next, porém a experiência oficial do Next.js costuma ser melhor na **Vercel** (mesma empresa por trás do framework). Se usar Netlify, confira a documentação de **Next.js runtime** deles e os mesmos envs.

---

## Checklist rápido antes de divulgar

- [ ] `npm run build` local OK  
- [ ] Variáveis de produção na Vercel = equivalentes ao `.env.local` necessário  
- [ ] Supabase com URL de produção e redirects  
- [ ] `NEXT_PUBLIC_SITE_URL` = URL pública final  
- [ ] Smoke test dos fluxos principais no domínio real  

---

## Quando o tutorial original (Render + Mongo) voltaria a fazer sentido

- Você criar um **API Gateway** separado (Express/FastAPI) e o Next só consumir `https://api.seudominio.com`.
- Ou precisar de **WebSocket/long-running** que não caiba bem em serverless (aí há trade-offs e outros hosts).

Até lá: **um repo + Vercel + Supabase** é o caminho mais simples e alinhado ao código atual.
