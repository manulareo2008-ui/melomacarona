-- PostgREST/Supabase upsert com onConflict: "email" exige UNIQUE na coluna "email".
-- A migração anterior usava UNIQUE em (lower(email)), o que gera erro 42P10 no upsert.

update public.marketing_leads
set email = lower(trim(email))
where email is not null;

delete from public.marketing_leads a
where a.id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by email
        order by created_at nulls last, id
      ) as rn
    from public.marketing_leads
  ) t
  where t.rn > 1
);

drop index if exists public.uq_marketing_leads_email_lower;

create unique index if not exists uq_marketing_leads_email
  on public.marketing_leads (email);
