create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  avatar_color text default '#4f46e5'
);

create table seats (
  id serial primary key,
  room text not null default 'main',
  label text not null,
  x int not null,
  y int not null
);

create table attendance (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  seat_id int references seats(id),
  status text not null default 'at_desk'
    check (status in ('at_desk','meeting','break','focus','wfh')),
  checked_in_at timestamptz not null default now(),
  checked_out_at timestamptz
);

create unique index one_active_per_user on attendance(user_id) where checked_out_at is null;
create unique index one_active_per_seat on attendance(seat_id) where checked_out_at is null;

alter table profiles   enable row level security;
alter table seats      enable row level security;
alter table attendance enable row level security;

-- SEMENTARA untuk tahap 2: boleh dibaca tanpa login. HAPUS di tahap 3.
create policy "dev baca profiles"   on profiles   for select to anon, authenticated using (true);
create policy "dev baca seats"      on seats      for select to anon, authenticated using (true);
create policy "dev baca attendance" on attendance for select to anon, authenticated using (true);

alter publication supabase_realtime add table attendance;

insert into seats (room, label, x, y) values
  ('main','A1',200,220), ('main','A2',512,220), ('main','A3',824,220),
  ('main','B1',300,480), ('main','B2',724,480);