-- Fase 1: base para recomendacoes premium orientadas por IA

create extension if not exists "pgcrypto";

create table if not exists public.recomendacoes_ia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  nome text not null,
  idade integer not null check (idade >= 12 and idade <= 120),
  area text not null,
  nicho text not null,
  modalidade text not null,
  budget numeric(10,2) not null,
  nivel_conhecimento text not null,
  objetivos text not null,
  provider text not null,
  input_payload jsonb not null default '{}'::jsonb,
  recommendations_payload jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_recomendacoes_ia_user_created_at
  on public.recomendacoes_ia(user_id, created_at desc);

create index if not exists idx_recomendacoes_ia_created_at
  on public.recomendacoes_ia(created_at desc);

alter table if exists public.profiles
  add column if not exists idade integer,
  add column if not exists area_interesse text,
  add column if not exists nivel_conhecimento text,
  add column if not exists budget_preferido numeric(10,2),
  add column if not exists objetivos text;

alter table public.recomendacoes_ia enable row level security;

drop policy if exists "recomendacoes_ia_select_own" on public.recomendacoes_ia;
create policy "recomendacoes_ia_select_own"
  on public.recomendacoes_ia
  for select
  using (auth.uid() = user_id);

drop policy if exists "recomendacoes_ia_insert_own" on public.recomendacoes_ia;
create policy "recomendacoes_ia_insert_own"
  on public.recomendacoes_ia
  for insert
  with check (auth.uid() = user_id or user_id is null);
