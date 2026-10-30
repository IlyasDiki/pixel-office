-- Profil otomatis dibuat setiap ada user baru
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', initcap(split_part(new.email,'@',1))))
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Hapus policy sementara
drop policy if exists "dev baca profiles"   on profiles;
drop policy if exists "dev baca seats"      on seats;
drop policy if exists "dev baca attendance" on attendance;

-- Aturan sebenarnya: hanya yang sudah login
create policy "baca profiles"   on profiles   for select to authenticated using (true);
create policy "baca seats"      on seats      for select to authenticated using (true);
create policy "baca attendance" on attendance for select to authenticated using (true);

create policy "check-in sendiri" on attendance for insert to authenticated
  with check (user_id = auth.uid() and (auth.jwt() ->> 'email') like '%@perusahaan.com');

create policy "update milik sendiri" on attendance for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());