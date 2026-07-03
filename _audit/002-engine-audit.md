# Auditoria técnica — Engine de Recomendação Atloom

## 1. Arquitetura da engine (2 camadas)

**Achado crítico antes de tudo:** existem **duas implementações de engine de recomendação** no
repositório, e apenas uma delas está de fato no caminho de execução do produto.

### 1.1 `lib/recommendation/` (scoring.ts + llm.ts + engine.ts) — código órfão

Esta é a pasta que o ticket pede para auditar e que `CLAUDE.md` descreve como "a" engine.
Tecnicamente está completa e correta, mas **não é chamada por nenhuma rota da API**. Confirmado
por busca textual: o único arquivo que importa `scoring.ts` e `llm.ts` é o próprio `engine.ts`
(`lib/recommendation/engine.ts:2-3`), e nenhum arquivo do projeto importa `engine.ts`
(`recommendCourses`) ou `courseRepository.getCoursesForRag` fora de si mesmo, exceto a rota
em 1.2, que usa só o repository, não o engine. Em outras palavras: **dead code funcional**,
não dívida técnica de UI, mas uma divergência real entre o que `CLAUDE.md` documenta e o que
roda em produção.

Ainda assim, documentando o que ela faz (pois é isso que o ticket pede e é um ativo técnico real,
mesmo que não exposto):

- **Scoring determinístico** (`lib/recommendation/scoring.ts:5-10`), pesos exatos:
  ```ts
  const WEIGHTS = { area: 0.25, niche: 0.45, price: 0.2, modality: 0.1 } as const;
  ```
  Área e modalidade são binárias (100 ou 0, `scoreArea`/`scoreModality`, linhas 63-69). Preço é
  uma curva linear inversa ao ratio preço/orçamento, zerada acima do teto (`scorePrice`,
  linhas 71-77). Nicho é overlap de tokens normalizados sobre o tamanho do conjunto de tokens do
  nicho buscado (`scoreNiche`, linhas 79-90).

- **Enriquecimento por LLM** (`lib/recommendation/llm.ts`): aqui o ticket pergunta por
  "provider primário OpenAI / fallback Gemini" — isso **não é o que este arquivo implementa**.
  `parseProvider` (linha 11-13) escolhe **um único provider** a partir da env var
  `LLM_PROVIDER` (default `"openai"` se ausente ou diferente de `"gemini"`), usando a mesma
  `LLM_API_KEY` para ambos. Não há tentativa sequencial openai→gemini aqui — é seleção estática
  por configuração, não failover entre provedores.
  Degradação graciosa real, comprovada pelo código:
  ```ts
  export async function enrichWithLlm(...): Promise<LlmEnrichment | null> {
    if (!hasLlmConfig()) return null;          // sem LLM_API_KEY → null, sem exceção
    ...
    try {
      const raw = provider === "gemini" ? await callGemini(prompt) : await callOpenAi(prompt);
      return parseLlmOutput(raw);
    } catch {
      return null;                              // qualquer falha de rede/parse → null
    }
  }
  ```
  (`lib/recommendation/llm.ts:97-112`). O chamador (`engine.ts:57-61`) trata `null` simplesmente
  mantendo o score local e o pitch padrão (`defaultPitch`, linha 13-19) — não há crash nem
  resposta vazia. Isso é degradação graciosa real, só que de "1 provider configurável" para
  "score local", não de "OpenAI" para "Gemini".

- **Expansão de sinônimos semânticos** (`scoring.ts:12-18`): dicionário estático em memória,
  sem embeddings nem chamada a LLM:
  ```ts
  const SEMANTIC_SYNONYMS: Record<string, string[]> = {
    "ia generativa": ["llm", "genai", "prompt", "transformer", "gpt"],
    "ui ux": ["interface", "prototipo", "figma", "usabilidade", "design system"],
    "financas startups": [...], dados: [...], cloud: [...],
  };
  ```
  Apenas 5 chaves cobertas; qualquer nicho fora dessas 5 categorias não recebe expansão.

### 1.2 `app/api/recommend-courses/route.ts` — a engine que está de fato no ar

Esta é a rota chamada pelo wizard (`lib/courseRecommendationApi.ts` → `CourseWizard.tsx`).
Implementa, na prática, exatamente o padrão "primário / fallback / degradação local" que o
ticket descreve, só que em outro arquivo e usando `OPENAI_API_KEY`/`GEMINI_API_KEY` diretamente
(não `LLM_API_KEY`):

```ts
const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
const hasGemini = Boolean(process.env.GEMINI_API_KEY);

if (hasOpenAi) {
  try {
    return buildTextStreamResponse(await openAiChatCompletionStream(...), "openai", ...);
  } catch (openAiError) {
    console.warn("OpenAI falhou, tentando Gemini fallback...", openAiError);
  }
}
if (hasGemini) {
  try {
    return buildTextStreamResponse(await geminiContentStream(...), "gemini", ...);
  } catch (geminiError) {
    console.warn("Gemini falhou, usando fallback local...", geminiError);
  }
}
const local = localFallbackRecommendations({ area, nicho, budget, modalidade, texto_livre }, courses);
return buildTextStreamResponse(stringAsChunkedStream(JSON.stringify({ recomendacoes: local.recomendacoes })), "local", courses.length);
```
(`app/api/recommend-courses/route.ts:274-301`). Cadeia real: OpenAI → Gemini → scoring local
em memória (`localScore`, linhas 166-186, pesos: área 30, modalidade 20, orçamento até 20,
overlap semântico até 30 — pesos diferentes dos de `scoring.ts`, sem relação entre os dois
arquivos). Se ambos os provedores falharem, **não quebra**: cai no fallback local e ainda
retorna 200 com `X-Recommendation-Provider: local` no header — degradação graciosa real e
comprovada nesta rota, que é a que efetivamente atende o usuário.

A IA aqui também escolhe os 3 cursos via prompt estruturado (`SYSTEM_PROMPT`, linhas 14-19),
streaming de resposta token a token (`ReadableStream`), e não usa o `computeAffinityScore`/
`computePillarScores` de `scoring.ts` em nenhum momento.

---

## 2. Sponsor-matching

Arquivo real: `app/api/patrocinadores/match/route.ts` (não havia subpasta `match/` separada —
é uma única `route.ts`). Lógica:

1. A rota busca **todos** os patrocinadores `ativo = true` na tabela `patrocinadores`,
   ordenados alfabeticamente por `nome` (`.order("nome", { ascending: true })`,
   `route.ts:26-30`) — sem nenhum critério de relevância no banco.
2. Filtros opcionais por query string (`estado`, `cidade`, `area`) são aplicados **em memória**
   sobre o array já carregado (linhas 47-70), checando se o patrocinador cobre aquele
   estado/cidade (`estados_cobertura`/`cidades_cobertura`) ou foca naquela área
   (`areas_foco`).
3. No cliente, `lib/wizardSponsorFilter.ts` refina de novo: `filterPatrocinadoresForWizard`
   (linhas 116-134) retorna todo patrocinador cuja região bate com o usuário OU cujo
   `areas_foco`/keywords tenha overlap de tokens com os cursos recomendados
   (`patrocinadorMatchesRecommendedCourses`, linhas 92-114).
4. **Não existe leilão nem ranking por prioridade/pagamento.** A exibição final usa
   literalmente o primeiro item do array filtrado:
   ```ts
   const primary = patrocinadores[0];
   ```
   (`components/WizardPatrocinadorSpotlight.tsx:44`). Como o array chega ordenado
   alfabeticamente por `nome` da query Supabase e os filtros downstream preservam a ordem, o
   patrocinador exibido é, na prática, **o primeiro em ordem alfabética entre os que
   casam com a região/área do usuário** — não o "melhor", não um leilão.

**Schema relevante** (migrations, ver seção 3): tabela `patrocinadores` tem `areas_foco text[]`,
`estados_cobertura text[]`, `cidades_cobertura text[]`, `ativo boolean`, e desde
`20260503100000_patrocinadores_links_por_area.sql`, `links_por_area jsonb` para deep-link por
área.

---

## 3. Migrations do Supabase (patrocinadores / recomendação)

| Arquivo | O que adiciona |
|---|---|
| `20260428_create_profiles_and_recomendacoes_ia.sql` | (não lido em detalhe — fora do par direto patrocinador/match, mas no escopo de "recomendação"; tabelas de perfis e histórico de recomendações de IA) |
| `20260428_create_marketing_leads.sql` | tabela de leads de marketing capturados no wizard |
| `20260501_create_cursos_clicks_patrocinadores.sql` | cria `patrocinadores`, `cursos`, `course_clicks`, RLS (`select` público em `patrocinadores`/`cursos`; `course_clicks` aceita insert anônimo mas bloqueia select — `for select using (false)`), índices em `cursos(area)`, `cursos(area, modalidade)`, `cursos(ativo)`, `cursos(patrocinador_id)`, e trigger `set_cursos_atualizado_em` para auto-atualizar `atualizado_em` |
| `20260503100000_patrocinadores_links_por_area.sql` | adiciona coluna `links_por_area jsonb default '{}'::jsonb` em `patrocinadores`, para mapear área → URL profunda no site do parceiro |
| `20260503_marketing_leads_email_unique_for_upsert.sql` | constraint de unicidade de e-mail em `marketing_leads` (suporte a upsert) |
| `20260505_create_affiliate_clicks.sql` | tabela `affiliate_clicks` (tracking de clique em link de afiliado), RLS restrita a `service_role` para qualquer operação (`auth.role() = 'service_role'`) |

Não executei nenhuma migration — apenas leitura dos arquivos `.sql`.

---

## 3. CourseWizard.tsx — avaliação honesta

Confirmado o nome do arquivo (`components/CourseWizard.tsx`) — não houve mudança de nome.
**2.420 linhas.**

Responsabilidades distintas identificadas por estrutura de imports e hooks (não é lista
exaustiva, é o que dá pra afirmar com confiança a partir do código lido):

- Estado de formulário do wizard (área, nicho, modalidade, orçamento, localização, público-alvo)
  — mais de 25 `useState` distintos só nos primeiros ~280 blocos de linha.
- Orquestração de **3 sistemas externos diferentes**: chamada à API de recomendação
  (`fetchCourseRecommendations`, via `lib/courseRecommendationApi.ts`), busca de patrocinadores
  (`fetch("/api/patrocinadores/match")`, linha 961), envio de lead
  (`fetch("/api/marketing/lead")`, linha 507) e envio de avaliação por e-mail em background
  (`fetch("/api/send-evaluation")`, linha 678).
- Teste vocacional RIASEC completo embutido (import de `lib/vocational-test.ts`: cálculo de
  score, perfis dominantes, mapeamento para área, priorização de nichos).
- Lógica de pool de cursos e filtragem de patrocinador (`buildWizardCoursePool`,
  `filterPatrocinadoresForWizard`, importados de `lib/wizardSponsorFilter.ts`, mas orquestrados
  aqui).
- i18n e RTL: troca de idioma (`changeLanguage`, linha 1144) e aplicação de `dir="rtl"/"ltr"` no
  `<html>` via `useEffect` (linhas 878-882).
- Analytics: chamadas diretas a `trackEvent` espalhadas pelo componente.
- UI de feedback pós-recomendação (rating, modal, estado de envio, mensagem de agradecimento) —
  pelo menos 7 `useState` dedicados só a isso (linhas 188-197).
- Renderização condicional de múltiplos passos do wizard (área → nicho → orçamento →
  modalidade → resultados → quiz vocacional → detalhe de curso), tudo dentro do mesmo
  componente.
- Pelo menos **15 `useEffect`** distintos coordenando esses subsistemas.

**É dívida técnica real, não exagero.** Não é "componente grande que funciona" — são pelo menos
8 responsabilidades de domínios diferentes (formulário, 4 integrações de rede distintas, teste
vocacional, i18n/RTL, analytics, feedback) coexistindo num único arquivo de 2.420 linhas, sem
separação em hooks customizados ou subcomponentes para a maior parte dessa lógica (a exceção é
`CourseResultCard` e `WizardPatrocinadorSpotlight`, que já foram extraídos). Isso não significa
que está quebrado — o build passa e a aplicação funciona — mas qualquer alteração em uma dessas
responsabilidades (ex.: mudar o teste vocacional) exige carregar mentalmente o resto do arquivo
para não quebrar estado compartilhado. Não infli: não vi duplicação de lógica nem bugs óbvios
nessa leitura — o problema é puramente de coesão/tamanho, não de corretude.

---

## 4. Segurança do admin (HMAC)

Fluxo (`lib/admin-auth.ts`, 26 linhas):

1. O token esperado é derivado deterministicamente de `ADMIN_TOKEN_SECRET` via
   `HMAC-SHA256(secret, "admin-granted")`, codificado em `base64url`
   (`getExpectedAdminToken`, linhas 6-10) — não há senha do usuário codificada no hash, é uma
   string fixa assinada pelo segredo do servidor.
2. No login (`app/api/admin/login`, não lido em detalhe nesta auditoria, mas referenciado por
   `AdminLoginForm.tsx`), a senha enviada é validada server-side e, se correta, o cookie
   `cursos_admin_token` recebe esse HMAC fixo como valor.
3. Toda requisição subsequente a `/admin/*` chama `isAdminSessionValid()`
   (linhas 12-23): lê o cookie via `next/headers`, recalcula o HMAC esperado e compara com
   `timingSafeEqual` (comparação em tempo constante, evita timing attack).
4. Qualquer erro (cookie ausente, tamanho de buffer diferente) cai no `catch` e retorna `false`
   — nunca lança exceção não tratada.
5. Sem `ADMIN_TOKEN_SECRET` configurado, `getExpectedAdminToken()` retorna string vazia e a
   sessão é sempre inválida (linha 13) — fail-closed, não fail-open.

---

## 5. Analytics dual-track

Confirmado: dual-track real.

- **Client-side** (`lib/analytics.ts`, função `trackEvent`): grava em
  `localStorage["course-wizard-analytics-events-v1"]` (mantendo só os últimos 500 eventos,
  linha 23), dispara `CustomEvent("analytics:tracked")` para quem quiser ouvir, e **também**
  envia o mesmo payload ao servidor de forma não bloqueante: `navigator.sendBeacon` se
  disponível, com fallback para `fetch(..., { keepalive: true })` ignorando erros
  (linhas 33-46). Cada chamada de `trackEvent(eventName, data)` no `CourseWizard.tsx` dispara
  ambos os lados ao mesmo tempo — não é dois sistemas separados, é uma função única com dois
  destinos.
- **Server-side** (`app/api/analytics/ingest/route.ts` + `lib/server-analytics.ts`): a rota
  valida o payload com Zod (`event` string ≤200 chars, body ≤12.000 bytes), e
  `appendServerEvent` faz `appendFile` em `data/analytics-events.jsonl` (NDJSON), criando o
  diretório se preciso. Leitura (`readServerEvents`, usada pelo dashboard) limita-se às últimas
  8.000 linhas do arquivo.

---

## 6. GitHub Action de validação de links

Workflow: `.github/workflows/daily-course-link-maintenance.yml`.

- **Cron:** `"0 9 * * *"` — diário, às 09:00 UTC. Também disparável manualmente
  (`workflow_dispatch`).
- **O que valida:** o step roda `npm run check:course-links:autofix`.
- **Achado crítico:** esse script **não existe**. `package.json` só define
  `"check:course-links": "tsx scripts/check-course-links.ts"` (sem variante `:autofix`). Além
  disso, lendo `scripts/check-course-links.ts` inteiro, ele só faz `fetch` HEAD/GET para cada
  `registrationUrl` em `INTERNATIONAL_COURSES`, registra resultado e escreve em
  `logs/course-link-check.log` — **não existe nenhuma lógica de auto-correção de URL no
  arquivo** (sem flag `--fix`, sem `writeFile` em `coursesData.ts`, confirmado por busca textual
  por `autofix`/`--fix`/escrita em `coursesData`).
- **Conclusão:** como está configurado hoje, este step do workflow **vai falhar** (`npm error
  Missing script: "check:course-links:autofix"`), e mesmo que o nome do script fosse corrigido
  para `check:course-links`, o script não corrige nada sozinho — só relata. O passo seguinte do
  workflow (`Create PR when URLs were corrected`, `peter-evans/create-pull-request@v6`) nunca
  teria diffs para commitar, porque nada no repo escreve de volta em `coursesData.ts`.
  **"Self-healing" não é o termo certo para usar no case.** O termo correto é "verificação diária
  agendada com relatório" — a parte de correção automática está documentada na intenção do
  workflow (nome do step, mensagem de commit pré-escrita) mas não está implementada no código.

---

## 7. i18n

- **9 idiomas de fato implementados** (com arquivo `.json` de tradução carregado em
  `lib/i18n.ts`, linhas 5-13 e 31-40): `pt-BR` (default), `en-US`, `es-ES`, `de`, `fr`, `it`,
  `ar`, `ru`, `sv`. Confirmado pela existência dos 9 arquivos em `locales/` e pelo array
  `SUPPORTED_LANGUAGES` que lista exatamente esses 9 — sem idioma "planejado mas não carregado".
- **RTL do árabe:** `RTL_LANGUAGES = ["ar"]` (`lib/i18n.ts:27`). O tratamento não é via CSS
  condicional/media query — é JS imperativo: `CourseWizard.tsx:878-882` roda em `useEffect`
  sempre que `currentLanguage` muda:
  ```ts
  const isRtl = RTL_LANGUAGES.includes(currentLanguage);
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", currentLanguage);
  ```
  Ou seja, o `dir="rtl"` é setado direto no `<html>`, deixando o navegador/CSS nativo (`dir`
  attribute selectors do Tailwind/browser) cuidar do espelhamento — não encontrei regras `[dir=rtl]`
  customizadas em CSS do projeto (busquei em `*.css`, sem resultado), então o RTL depende
  inteiramente do comportamento padrão do navegador para esse atributo, não de estilos
  específicos escritos pelo time.

---

## 8. Observações fora de escopo (problemas notados, não corrigidos)

- `lib/recommendation/` (scoring + LLM + engine) é código morto — não está no caminho de
  execução de nenhuma rota. Isso é uma decisão de arquitetura para alguém revisar, não algo que
  toquei.
- `CLAUDE.md` describe `engine.ts` como o orquestrador chamado por
  `/api/recommend-courses`, mas a rota real não o importa — a documentação do projeto está
  desatualizada nesse ponto específico.
- O workflow de GitHub Actions chama um script npm inexistente
  (`check:course-links:autofix`) — vai falhar na primeira execução agendada, se ainda não falhou.
- Dois sistemas de scoring local coexistem com pesos diferentes e zero relação entre si
  (`lib/recommendation/scoring.ts` vs. `localScore` dentro de
  `app/api/recommend-courses/route.ts`) — potencial fonte de confusão futura sobre "qual é o
  peso real do nicho", já que um diz 45% e o outro usa uma escala de pontos fixos (30 max) sem
  conversão percentual direta.
- Não verifiquei `app/api/admin/login/route.ts` em detalhe (fora do escopo explícito do
  ticket, que pediu o middleware/handler de validação, não o de emissão do cookie) — se quiser
  cobertura completa do fluxo de login, é um arquivo a mais para ler depois.
