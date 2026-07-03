# 009 — Reparo de schema · FASE 1 (diagnóstico, somente leitura)

> Status: **FASE 1 concluída. Banco NÃO foi alterado.** Aguardando aprovação para a Fase 2.
> Método de consulta ao banco: introspecção **100% read-only** via PostgREST (`GET ...?select=col&limit=0`),
> com `SUPABASE_SERVICE_ROLE_KEY`. Nenhuma escrita, nenhum `push`, nenhum segredo impresso.

---

## 1. Migrations do projeto (`supabase/migrations/`)

Em ordem cronológica (pelo timestamp do nome):

| # | Arquivo | O que cria/altera |
|---|---------|-------------------|
| 1 | `20260428_create_marketing_leads.sql` | Cria `marketing_leads` (+índice unique em `email`, trigger `updated_at`, RLS que bloqueia tudo). |
| 2 | `20260428_create_profiles_and_recomendacoes_ia.sql` | Cria `recomendacoes_ia` (+índices, RLS própria) e faz `ALTER TABLE IF EXISTS profiles ADD COLUMN ...` (5 colunas). **Não cria `profiles`** — só altera se já existir. |
| 3 | `20260501_create_cursos_clicks_patrocinadores.sql` | Cria `patrocinadores`, `cursos`, `course_clicks` (+índices, RLS, trigger `atualizado_em`). |
| 4 | `20260503_marketing_leads_email_unique_for_upsert.sql` | **DESTRUTIVA** — normaliza emails (`UPDATE`) e **`DELETE`** de duplicados, troca índice unique. |
| 5 | `20260503100000_patrocinadores_links_por_area.sql` | `ALTER TABLE patrocinadores ADD COLUMN IF NOT EXISTS links_por_area jsonb NOT NULL DEFAULT '{}'`. Additiva. |
| 6 | `20260505_create_affiliate_clicks.sql` | Cria `affiliate_clicks` (+índices, RLS, policy service_role). Additiva. |

---

## 2. Mecanismo real de aplicação

- **Não existe `supabase/config.toml`** → o projeto **não está linkado à Supabase CLI**.
- **`package.json` não tem** nenhum script de migração (`db:push`, `migrate`, etc.). Os únicos scripts são `dev`, `build`, `start`, `lint`, `check:course-links`.
- A CLI até existe na máquina via `npx supabase` (v2.109.0), mas **não está linkada** a este projeto.
- Os próprios arquivos dizem `-- Executar no Supabase SQL Editor` / `-- Supabase Dashboard > SQL Editor`.

**Conclusão:** o mecanismo histórico é **colar SQL manualmente no SQL Editor do painel Supabase**, um arquivo por vez. Não há tabela de histórico de migrations da CLI sendo usada — é por isso que o painel mostra **"No migrations"** (a CLI nunca registrou nada; isso **não** significa que o banco está vazio).

---

## 3. Schema esperado (migrations) × real (banco hoje)

Introspecção read-only, coluna por coluna:

| Tabela | Estado no banco | Gap |
|--------|-----------------|-----|
| `marketing_leads` | ✅ existe, todas as colunas | — |
| `recomendacoes_ia` | ✅ existe, todas as colunas | — |
| `cursos` | ✅ existe, todas as 28 colunas | — |
| `course_clicks` | ✅ existe, todas as colunas | — |
| `patrocinadores` | ⚠️ existe, **faltando `links_por_area`** | **migration #5 não aplicada** |
| `affiliate_clicks` | ❌ **tabela não existe** | **migration #6 não aplicada** |
| `profiles` | ❌ **tabela não existe** | ver nota abaixo |

### Detalhe do gap

- **`patrocinadores.links_por_area`** — confirmado ausente pelo próprio Postgres (erro `42703 column does not exist`, não apenas cache). **É exatamente o sintoma do ticket.** Falta a migration #5.
- **`affiliate_clicks`** — tabela inexistente (`PGRST205`). Falta a migration #6. Impacto real: `app/api/course-link/resolve/route.ts` faz `insert` nessa tabela ao resolver links de afiliado → esse tracking está quebrado.
- **`profiles`** — tabela inexistente. **Nenhuma migration do repo cria `profiles`** (a #2 só faz `ALTER ... IF EXISTS`, que é no-op quando a tabela não existe). Além disso, **`profiles` não é referenciada em nenhum código do app** (busca em todo o repositório: só aparece na migration e em docs de auditoria). → **Baixo/nenhum impacto**; aplicar as migrations faltantes **não** vai criar `profiles`, e o app não depende dela. Não faz parte do reparo necessário.

---

## 4. Avaliação de risco

**As duas migrations que faltam para fechar o gap são 100% ADITIVAS e seguras:**

- #5 `...links_por_area.sql` → `ADD COLUMN IF NOT EXISTS` com `DEFAULT '{}'`. Em linhas existentes o default é aplicado; **nenhuma linha é apagada ou alterada destrutivamente.**
- #6 `...affiliate_clicks.sql` → `CREATE TABLE IF NOT EXISTS` + índices + RLS. **Só cria o que falta.** Idempotente.

**🔴 ALERTA — migration DESTRUTIVA no repositório (NÃO incluir na Fase 2):**

- #4 `20260503_marketing_leads_email_unique_for_upsert.sql` contém **`DELETE FROM public.marketing_leads`** (remove duplicados) e `UPDATE`. Essa migration **já foi aplicada** (a tabela `marketing_leads` já está completa e com o índice unique). **NÃO deve ser re-executada** no reparo, e não é necessária. Está marcada aqui só para garantir que a Fase 2 não a toque.

> ⚠️ Por isso, a Fase 2 **não** deve usar `supabase db push` de forma cega: como o histórico remoto está "No migrations", um `push` tentaria aplicar **todas as 6**, incluindo a #4 destrutiva. O caminho seguro é aplicar **apenas** #5 e #6, manualmente.

---

## RESPOSTA DIRETA: é seguro aplicar as migrations faltantes sem perder dados?

**SIM.** As únicas duas migrations necessárias (#5 `links_por_area` e #6 `affiliate_clicks`) são puramente aditivas (`ADD COLUMN IF NOT EXISTS` / `CREATE TABLE IF NOT EXISTS`) — não há `DROP`, `TRUNCATE` nem recriação de tabela, e nenhum dado existente é tocado. **Desde que** a Fase 2 aplique somente essas duas e **não** re-rode a migration #4 (que tem `DELETE`).

---

## PLANO PROPOSTO — FASE 2 (aguardando "aprovado, roda a Fase 2")

**Mecanismo:** SQL Editor do painel Supabase (coerente com o histórico do projeto; sem CLI/`db push`).

**Antes de aplicar (recomendado):**
- Fazer um snapshot/backup no painel Supabase (ou export manual das tabelas com dado: `patrocinadores`, `marketing_leads`, `cursos`, `course_clicks`, `recomendacoes_ia`). Mesmo no free tier, vale o export.

**Passo 1 — colar no SQL Editor o conteúdo de:**
`supabase/migrations/20260503100000_patrocinadores_links_por_area.sql`
(adiciona `patrocinadores.links_por_area` — resolve o sintoma do cadastro de patrocinador.)

**Passo 2 — colar no SQL Editor o conteúdo de:**
`supabase/migrations/20260505_create_affiliate_clicks.sql`
(cria `affiliate_clicks` — restaura o tracking de afiliados.)

**Passo 3 — recarregar o schema cache do PostgREST** (o painel costuma fazer sozinho; se necessário, Settings → API → Reload schema, ou `NOTIFY pgrst, 'reload schema';`).

**NÃO incluído:** migration #4 (destrutiva, já aplicada) e nada sobre `profiles` (não usada, sem migration que a crie).

**Verificação pós-aplicação:**
1. `patrocinadores` passa a ter `links_por_area`.
2. Cadastro de patrocinador em `/admin/metricas` funciona sem o erro `Could not find the 'links_por_area' column`.
3. Resolver um link de curso passa a gravar em `affiliate_clicks` sem erro.

> **PARADA OBRIGATÓRIA.** Nada da Fase 2 será executado sem aprovação explícita do fundador.
