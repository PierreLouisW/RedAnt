-- =========================================================
-- A executer une seule fois dans Supabase : SQL Editor > New query
-- =========================================================

-- Table qui stocke toutes les donnees de l'app (une seule ligne partagee par l'equipe)
create table if not exists app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  rev bigint not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Ligne initiale (l'app la remplira au premier lancement)
insert into app_state (id, data, rev)
values ('main', '{}'::jsonb, 0)
on conflict (id) do nothing;

-- Securite : seules les personnes connectees (comptes crees par vous) peuvent lire/ecrire
alter table app_state enable row level security;

create policy "equipe_lecture" on app_state
  for select
  to authenticated
  using (true);

create policy "equipe_ecriture" on app_state
  for update
  to authenticated
  using (true)
  with check (true);

create policy "equipe_creation" on app_state
  for insert
  to authenticated
  with check (true);
