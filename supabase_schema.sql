-- =============================================
-- SmartLearn AI — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. PROFILES (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  avatar text default '🎓',
  education_level text check (education_level in ('school', 'university')),
  xp integer default 0,
  level integer default 1,
  badges jsonb default '[]'::jsonb,
  streak_current integer default 0,
  streak_longest integer default 0,
  streak_last_active text,
  streak_active_days text[] default '{}',
  completed_topics text[] default '{}',
  created_at timestamptz default now()
);

-- 2. COURSES
create table if not exists courses (
  id serial primary key,
  cid text unique not null,
  name text not null,
  subject text not null,
  icon text default '📖',
  color text default '#4f7df7',
  description text default '',
  level text check (level in ('school', 'university')) not null,
  topics jsonb default '[]'::jsonb
);

-- 3. QUESTIONS
create table if not exists questions (
  id serial primary key,
  topic_id text not null,
  course_id text default '',
  question text not null,
  options text[] not null,
  correct integer not null,
  explanation text default '',
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium'
);

create index if not exists idx_questions_topic on questions(topic_id);
create index if not exists idx_questions_diff on questions(topic_id, difficulty);

-- 4. QUIZ RESULTS
create table if not exists quiz_results (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  course_id text not null,
  topic_id text default '',
  subject text default '',
  score integer not null,
  total integer not null,
  difficulty text default 'medium',
  answers jsonb default '[]'::jsonb,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_quiz_user on quiz_results(user_id);
create index if not exists idx_quiz_topic on quiz_results(user_id, topic_id);

-- 5. ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table courses enable row level security;
alter table questions enable row level security;
alter table quiz_results enable row level security;

-- Profiles: users can read/update own, anyone can read for leaderboard
create policy "Users can view own profile" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Courses: everyone can read
create policy "Anyone can read courses" on courses for select using (true);

-- Questions: everyone can read
create policy "Anyone can read questions" on questions for select using (true);

-- Quiz results: users can CRUD own
create policy "Users can view own results" on quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on quiz_results for insert with check (auth.uid() = user_id);
create policy "Users can view all for leaderboard" on quiz_results for select using (true);

-- 6. AUTO-CREATE PROFILE ON SIGNUP (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
