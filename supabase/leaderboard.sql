-- Classement en ligne de MetroRush.
-- À exécuter une fois dans Supabase (SQL Editor), ou via le serveur MCP Supabase.
-- Lecture et ajout publics (clé « anon » du jeu) ; ni modification ni suppression depuis le jeu.

create table if not exists public.leaderboard (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  player text not null check (char_length(btrim(player)) between 1 and 16 and player !~ '[[:cntrl:]]'),
  city text not null check (city ~ '^[a-z]{2,20}$'),
  level text not null check (level in ('facile', 'moyen', 'difficile')),
  score integer not null check (score between 1 and 2000)
);

create index if not exists leaderboard_rank_idx on public.leaderboard (city, level, score desc);

alter table public.leaderboard enable row level security;

drop policy if exists "Lecture publique du classement" on public.leaderboard;
create policy "Lecture publique du classement" on public.leaderboard
  for select to anon, authenticated using (true);

drop policy if exists "Ajout de scores" on public.leaderboard;
create policy "Ajout de scores" on public.leaderboard
  for insert to anon, authenticated with check (true);

grant select, insert on public.leaderboard to anon, authenticated;

-- Meilleur score de chaque joueur, par ville et par niveau (un joueur n'apparaît qu'une fois)
create or replace view public.leaderboard_best with (security_invoker = true) as
  select distinct on (city, level, lower(btrim(player)))
    btrim(player) as player, city, level, score, created_at
  from public.leaderboard
  order by city, level, lower(btrim(player)), score desc, created_at asc;

grant select on public.leaderboard_best to anon, authenticated;
