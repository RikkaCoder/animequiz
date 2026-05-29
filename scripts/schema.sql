-- ============================================================
-- Anime Quiz — Schema Supabase (beta)
-- Eseguire nell'SQL Editor di Supabase.
-- ============================================================

-- Enum difficoltà
create type difficolta as enum ('facile', 'medio', 'difficile');

-- ── FRANCHISES ──────────────────────────────────────────────
create table franchises (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  nome         text not null,
  descrizione  text,
  immagine_url text,
  attivo       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ── CHARACTERS ──────────────────────────────────────────────
create table characters (
  id             uuid primary key default gen_random_uuid(),
  franchise_id   uuid not null references franchises(id) on delete cascade,
  nome_it        text not null,
  nome_originale text,
  immagine_url   text not null,
  tipo           text,
  difficolta     difficolta not null default 'medio',
  numero_ordine  int,
  attivo         boolean not null default true
);
create index idx_characters_franchise on characters(franchise_id);

-- ── PROFILES (estende auth.users) ───────────────────────────
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nickname   text not null,
  avatar_id  text not null,
  created_at timestamptz not null default now()
);

-- ── USER_STATS ──────────────────────────────────────────────
create table user_stats (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  franchise_id      uuid not null references franchises(id) on delete cascade,
  difficolta        difficolta not null,
  partite_giocate   int not null default 0,
  risposte_corrette int not null default 0,
  record_punteggio  int not null default 0,
  updated_at        timestamptz not null default now(),
  unique (user_id, franchise_id, difficolta)
);

-- ── CHARACTER_ERRORS ────────────────────────────────────────
create table character_errors (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  volte_visto  int not null default 0,
  volte_errato int not null default 0,
  unique (user_id, character_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- franchises e characters: lettura pubblica (dati di gioco), no scrittura utente
alter table franchises enable row level security;
alter table characters  enable row level security;

create policy "franchises leggibili da tutti"
  on franchises for select using (true);
create policy "characters leggibili da tutti"
  on characters for select using (true);

-- profiles: ogni utente vede e modifica solo il proprio
alter table profiles enable row level security;
create policy "profilo proprio - select" on profiles
  for select using (auth.uid() = id);
create policy "profilo proprio - insert" on profiles
  for insert with check (auth.uid() = id);
create policy "profilo proprio - update" on profiles
  for update using (auth.uid() = id);

-- user_stats: ogni utente solo i propri record
alter table user_stats enable row level security;
create policy "stats proprie - all" on user_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- character_errors: ogni utente solo i propri record
alter table character_errors enable row level security;
create policy "errori propri - all" on character_errors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
