-- Links profundos por área geral (technology, health, …) para redirecionar alunos ao trecho correto do site do parceiro.
alter table public.patrocinadores
  add column if not exists links_por_area jsonb not null default '{}'::jsonb;

comment on column public.patrocinadores.links_por_area is
  'Mapa opcional: chave = GeneralArea (ex. technology), valor = URL absoluta da seção correspondente no site do parceiro.';
