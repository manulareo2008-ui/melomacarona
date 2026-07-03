# Auditoria 008 — Cadastro de patrocinador: fluxo real e validação da demo

> Status: **Fase 1 concluída (somente leitura)**. Fase 2 abaixo está **preparada, não executada**.
> Nenhum código alterado, nenhum insert feito, nenhum commit. Quem executa o insert de teste é o fundador.

---

## Resposta direta (TL;DR)

- **Existe tela de admin pra patrocinador? → SIM.** Há um CRUD completo (criar, editar, "remover")
  embutido na página `/admin/metricas`, renderizado pelo componente
  `components/AdminPatrocinadores.tsx`, apoiado pelas rotas
  `app/api/admin/patrocinadores/route.ts` (GET/POST) e
  `app/api/admin/patrocinadores/[id]/route.ts` (GET/PATCH/DELETE).
- **Caminho mais simples pro fundador cadastrar um patrocinador real → a própria tela de admin.**
  Logar em `/admin/login`, ir a `/admin/metricas`, rolar até a seção **"Patrocinadores"**,
  clicar **"Adicionar patrocinador"**, preencher o formulário e salvar. Não precisa mexer em
  SQL nem no painel do Supabase.

---

## FASE 1 — Investigação

### 1. Existe tela de admin para cadastrar patrocinador? → SIM

- **Onde fica:** seção "Patrocinadores" no fim da página **`/admin/metricas`**
  (`app/admin/metricas/page.tsx:43-45` renderiza `<AdminPatrocinadores />`).
- **Como se acessa:** a página é protegida por sessão admin (`isAdminSessionValid()`).
  Sem sessão válida, redireciona para `/admin/login?next=/admin/metricas`
  (`app/admin/metricas/page.tsx:8-13`). O login exige `ADMIN_DASHBOARD_PASSWORD`
  (e `ADMIN_TOKEN_SECRET` para assinar o cookie) — ver CLAUDE.md.
- **Componente:** `components/AdminPatrocinadores.tsx` — lista os ativos e abre um formulário
  ao clicar em **"Adicionar patrocinador"** (`openCreate`, linha 150) ou **"Editar"** (linha 590).
- **Campos do formulário** (`components/AdminPatrocinadores.tsx:342-484`):

  | Campo no form | Estado / payload | Obrigatório no form? |
  |---|---|---|
  | Nome da instituição | `nome` | **Sim** (botão Salvar desabilitado se vazio; API exige min 2 chars) |
  | Tipo | `tipo` (`instituicao` \| `professor` \| `plataforma`) | Default `instituicao` |
  | Site oficial | `site_url` (URL) | Não |
  | Logo URL | `logo_url` (URL) | Não |
  | Cidades de cobertura | `cidades_cobertura` (lista separada por vírgula) | Não |
  | Estados de cobertura | `estados_cobertura` (lista separada por vírgula, ex. `SC, PR`) | Não |
  | Links por área no site | `links_por_area` (JSON opcional, chaves = GeneralArea) | Não |
  | Áreas de foco | `areas_foco` (checkboxes das 6 áreas) | Não (mas crítico p/ aparecer — ver item 4) |
  | Nome do contato | `contato_nome` | Não |
  | E-mail do contato | `contato_email` | Não |

- **Persistência:** o POST grava via `createServerSupabaseClient()`
  (`app/api/admin/patrocinadores/route.ts:126`). Esse client usa a
  `SUPABASE_SERVICE_ROLE_KEY` (`lib/supabase/server.ts:11`), que **ignora a RLS** — por isso
  o insert funciona mesmo a policy da tabela só permitindo `SELECT` público.

### 2. Caminho real de cadastro hoje

Existe **(a) tela de admin** (a opção canônica, ver item 1) e, como alternativa de banco,
**inserir linha direto no Supabase** (painel web ou SQL Editor) usando a service role.

- **(b) Script de seed:** NÃO existe seed de patrocinadores. `scripts/seed-courses.ts` apenas
  referencia `patrocinador_id: null` em cursos (`scripts/seed-courses.ts:26,75`); não cria
  patrocinadores.
- **(c) Endpoint de API:** SIM, é exatamente o do item 1 (`/api/admin/patrocinadores`), mas
  protegido por sessão admin — é o que a própria tela usa por baixo.

**Conclusão:** o caminho mais simples e oficial é a **tela de admin**. O insert direto no
Supabase fica como plano B / para automação.

### 3. Schema completo e atual da tabela `patrocinadores`

Base: `supabase/migrations/20260501_create_cursos_clicks_patrocinadores.sql:7-20`
+ `supabase/migrations/20260503100000_patrocinadores_links_por_area.sql:2-3`.

| Coluna | Tipo | Obrigatória / default |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` → **não precisa informar** |
| `nome` | `text` | **NOT NULL** — único campo realmente obrigatório no insert |
| `tipo` | `text` | NOT NULL, **default `'instituicao'`** → opcional no insert |
| `logo_url` | `text` | nullable |
| `site_url` | `text` | nullable |
| `cidades_cobertura` | `text[]` | nullable |
| `estados_cobertura` | `text[]` | nullable |
| `areas_foco` | `text[]` | nullable |
| `contato_nome` | `text` | nullable |
| `contato_email` | `text` | nullable |
| `ativo` | `boolean` | **default `true`** → opcional (e precisa ser `true` p/ aparecer) |
| `criado_em` | `timestamptz` | default `now()` → não precisa informar |
| `links_por_area` | `jsonb` | NOT NULL, **default `'{}'`** → opcional no insert |

**Mínimo absoluto para um insert válido:** apenas **`nome`**. Todo o resto tem default ou aceita
NULL. Mas para o patrocinador **aparecer na demo** é preciso também: `ativo = true` (default já
serve), `areas_foco` contendo a área certa, e `estados_cobertura`/`cidades_cobertura` cobrindo a
região do usuário (ver itens 4 e Fase 2).

### 4. Como a área é casada (CRÍTICO)

Os valores exatos de área são definidos em **`lib/domain.ts:3-10`** (`GENERAL_AREAS`):

```
technology · health · humanities · arts_design · business_admin · engineering
```

São **slugs em inglês, minúsculos, com underscore** — NÃO é "Programação", nem "Tecnologia",
nem id numérico. O rótulo "Tecnologia" é só exibição (`AREA_LABELS`).

Cadeia do casamento na demo:

1. No wizard o usuário escolhe a área e o estado `area` guarda o slug, ex. `"technology"`
   (`components/CourseWizard.tsx:1468,1641` — `setArea(e.target.value as GeneralArea)`).
2. O wizard busca **todos** os patrocinadores ativos via `GET /api/patrocinadores/match`
   **sem query params** (`components/CourseWizard.tsx:961`).
3. A filtragem do spotlight é client-side em
   `filterPatrocinadoresForWizard` / `patrocinadorMatchesRecommendedCourses`
   (`lib/wizardSponsorFilter.ts:92-133`). O casamento por área é
   **`focus.includes(userArea)`** (linha 99) — comparação de **string exata**.
4. `WizardPatrocinadorSpotlight` renderiza `patrocinadores[0]`
   (`components/WizardPatrocinadorSpotlight.tsx:44`).

> ⚠️ Se `areas_foco` guardar `"Tecnologia"` ou `"tech"` em vez de **`"technology"`**, o
> patrocinador **não casa pela área**. (A tela de admin já evita esse erro: os checkboxes gravam
> os slugs corretos e a API valida contra `GENERAL_AREAS`, rejeitando área inválida —
> `app/api/admin/patrocinadores/route.ts:22-35`.)

Detalhe da lógica de exibição (`lib/wizardSponsorFilter.ts:126-133`): enquanto as recomendações
carregam, exige **match de região**; depois de carregadas, aparece se **região OU área/curso**
casarem. Para a demo ser à prova de falha, o patrocinador de teste deve casar **região (SC) E
área (technology)** — assim aparece em qualquer momento.

---

## FASE 2 — Validação da demo (PREPARADA, não executada)

> Execute isto manualmente quando for ensaiar a demo. O fundador faz o cadastro; este documento
> só descreve os passos.

### Patrocinador de teste fictício

| Campo | Valor |
|---|---|
| Nome | `Code Tech Escola (TESTE)` |
| Tipo | `Instituição` (instituicao) |
| Áreas de foco | **Tecnologia** → grava o slug `technology` |
| Estados de cobertura | `SC` |
| Cidades de cobertura | `Florianópolis` |
| Site oficial | `https://exemplo.com.br` (placeholder) |
| Links por área (opcional) | `{ "technology": "https://exemplo.com.br/tecnologia" }` |

### Caminho A — Tela de admin (recomendado)

1. Subir o app: `npm run dev` (http://localhost:3000).
2. Abrir **`http://localhost:3000/admin/login`** e logar com a senha
   (`ADMIN_DASHBOARD_PASSWORD` — não imprimir o valor aqui).
3. Em **`/admin/metricas`**, rolar até a seção **"Patrocinadores"**.
4. Clicar **"Adicionar patrocinador"** e preencher:
   - Nome: `Code Tech Escola (TESTE)`
   - Tipo: `Instituição`
   - Site oficial: `https://exemplo.com.br`
   - Estados de cobertura: `SC`
   - Cidades de cobertura: `Florianópolis`
   - Áreas de foco: marcar **Tecnologia**
   - (opcional) Links por área:
     `{ "technology": "https://exemplo.com.br/tecnologia" }`
5. Clicar **"Salvar"**. O card deve passar a aparecer na lista da própria página.

### Caminho B — Insert direto no Supabase (SQL Editor) — alternativa

Usar apenas se o admin não estiver acessível. Rodar no SQL Editor do projeto Supabase:

```sql
insert into public.patrocinadores
  (nome, tipo, areas_foco, estados_cobertura, cidades_cobertura, site_url, links_por_area, ativo)
values
  ('Code Tech Escola (TESTE)',
   'instituicao',
   array['technology'],
   array['SC'],
   array['Florianópolis'],
   'https://exemplo.com.br',
   '{"technology":"https://exemplo.com.br/tecnologia"}'::jsonb,
   true);
```

### Verificação (ver o spotlight)

1. Abrir **`http://localhost:3000`**.
2. Fazer o quiz selecionando **Área = Tecnologia** e, quando pedir localização,
   informar **Estado = SC** (cidade `Florianópolis` reforça o match).
3. Concluir até o passo de resultados: antes do catálogo deve surgir o card de spotlight
   **"Parceiro na sua jornada"** com **"Code Tech Escola (TESTE)"** e o badge **Tecnologia**.
4. Se não aparecer, conferir: `ativo = true`, `areas_foco` = exatamente `technology`,
   e `estados_cobertura` contém `SC`.

### Remoção do patrocinador de teste (limpar o lixo)

> ⚠️ O botão **"Remover da lista"** da tela de admin faz **soft delete** (`ativo = false`,
> `app/api/admin/patrocinadores/[id]/route.ts:212`): some da demo, mas a linha continua no banco.
> Para apagar de verdade, use o SQL abaixo no Supabase SQL Editor:

```sql
delete from public.patrocinadores
where nome = 'Code Tech Escola (TESTE)';
```

(Se quiser apenas escondê-lo sem apagar: clicar "Remover da lista" no admin, ou
`update public.patrocinadores set ativo = false where nome = 'Code Tech Escola (TESTE)';`.)

---

## Confirmação de não-alteração

Nenhum arquivo de código foi tocado, nenhum insert/commit feito. A única mudança no working tree
é a criação de `_audit/008-cadastro-patrocinador.md` (este arquivo).
