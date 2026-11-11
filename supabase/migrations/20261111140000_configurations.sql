--IDEMPOTENT
-- Site-wide settings. Values are edited in the database, not in the app.

create table if not exists public.configurations (
  key text primary key,
  value text not null
);

alter table public.configurations enable row level security;

drop policy if exists "Anyone can read configurations" on public.configurations;
create policy "Anyone can read configurations"
  on public.configurations
  for select
  to anon, authenticated
  using (true);

revoke all on table public.configurations from anon, authenticated;
grant select on table public.configurations to anon, authenticated;

insert into public.configurations (key, value)
values
  ('whatsapp_phone', '919800000000'),
  ('phone_display', '98000 00000')
on conflict (key) do nothing;
