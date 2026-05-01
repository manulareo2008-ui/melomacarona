-- Fase 1.2: tabelas de cursos, tracking de cliques e patrocinadores
-- Executar no Supabase SQL Editor em produção

-- ============================================================
-- TABELA: patrocinadores
-- ============================================================
create table if not exists public.patrocinadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'instituicao',
  logo_url text,
  site_url text,
  cidades_cobertura text[],
  estados_cobertura text[],
  areas_foco text[],
  contato_nome text,
  contato_email text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

alter table public.patrocinadores enable row level security;

drop policy if exists "patrocinadores_select_public" on public.patrocinadores;
create policy "patrocinadores_select_public" on public.patrocinadores
  for select using (true);

-- ============================================================
-- TABELA: cursos
-- ============================================================
create table if not exists public.cursos (
  id text primary key,
  nome text not null,
  descricao_curta text,
  descricao_completa text,
  instituicao text not null,
  plataforma text not null,
  area text not null,
  sub_area text,
  nivel text not null default 'Iniciante',
  modalidade text not null,
  publico_alvo text not null default 'ambos',
  preco_brl numeric(10,2) default 0,
  preco_display text,
  duracao text,
  prerequisitos text[],
  url_destino text not null,
  url_status text default 'active',
  url_verificado_em timestamptz,
  tags text[],
  internacional boolean default false,
  pais_origem text default 'Brasil',
  cidade text,
  estado text,
  patrocinador_id uuid references public.patrocinadores(id) on delete set null,
  fonte text default 'manual',
  ativo boolean default true,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

alter table public.cursos enable row level security;

drop policy if exists "cursos_select_public" on public.cursos;
create policy "cursos_select_public" on public.cursos
  for select using (true);

create index if not exists idx_cursos_area on public.cursos(area);
create index if not exists idx_cursos_area_modalidade on public.cursos(area, modalidade);
create index if not exists idx_cursos_ativo on public.cursos(ativo) where ativo = true;
create index if not exists idx_cursos_patrocinador on public.cursos(patrocinador_id)
  where patrocinador_id is not null;

-- ============================================================
-- TABELA: course_clicks
-- ============================================================
create table if not exists public.course_clicks (
  id uuid primary key default gen_random_uuid(),
  curso_id text references public.cursos(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  anon_id text,
  pagina_origem text,
  area text,
  modalidade text,
  cidade_usuario text,
  estado_usuario text,
  sucesso boolean default true,
  criado_em timestamptz default now()
);

alter table public.course_clicks enable row level security;

drop policy if exists "clicks_insert_anon" on public.course_clicks;
create policy "clicks_insert_anon" on public.course_clicks
  for insert with check (true);

drop policy if exists "clicks_select_admin_only" on public.course_clicks;
create policy "clicks_select_admin_only" on public.course_clicks
  for select using (false);

create index if not exists idx_clicks_curso on public.course_clicks(curso_id);
create index if not exists idx_clicks_criado on public.course_clicks(criado_em desc);
create index if not exists idx_clicks_cidade on public.course_clicks(cidade_usuario)
  where cidade_usuario is not null;

-- ============================================================
-- TRIGGER: atualizado_em automático na tabela cursos
-- ============================================================
create or replace function public.set_cursos_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_cursos_atualizado_em on public.cursos;
create trigger trg_cursos_atualizado_em
before update on public.cursos
for each row
execute function public.set_cursos_atualizado_em();
