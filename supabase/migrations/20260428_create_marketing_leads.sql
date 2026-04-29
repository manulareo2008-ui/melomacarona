-- Leads de marketing para campanhas futuras de recomendacao/ofertas

create extension if not exists "pgcrypto";

create table if not exists public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nome text null,
  area_interesse text null,
  origem text not null default 'wizard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create unique index if not exists uq_marketing_leads_email_lower
  on public.marketing_leads ((lower(email)));

create or replace function public.set_marketing_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_marketing_leads_updated_at on public.marketing_leads;
create trigger trg_marketing_leads_updated_at
before update on public.marketing_leads
for each row
execute function public.set_marketing_leads_updated_at();

alter table public.marketing_leads enable row level security;

drop policy if exists "marketing_leads_block_all_select" on public.marketing_leads;
create policy "marketing_leads_block_all_select"
  on public.marketing_leads
  for select
  using (false);

drop policy if exists "marketing_leads_block_all_insert" on public.marketing_leads;
create policy "marketing_leads_block_all_insert"
  on public.marketing_leads
  for insert
  with check (false);

drop policy if exists "marketing_leads_block_all_update" on public.marketing_leads;
create policy "marketing_leads_block_all_update"
  on public.marketing_leads
  for update
  using (false)
  with check (false);
