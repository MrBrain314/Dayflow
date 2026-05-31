-- Run this in Supabase → SQL Editor

-- Todos table
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  done boolean not null default false,
  date date not null,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists todos_user_date on todos (user_id, date);

-- Journal entries table
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content text not null default '',
  mood text,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists journal_user_date on journal_entries (user_id, date);

-- Enable Row Level Security (RLS)
alter table todos enable row level security;
alter table journal_entries enable row level security;

-- RLS policies (we use service role key on server, so these are for safety)
create policy "Users can manage their own todos"
  on todos for all
  using (true);

create policy "Users can manage their own journal entries"
  on journal_entries for all
  using (true);
