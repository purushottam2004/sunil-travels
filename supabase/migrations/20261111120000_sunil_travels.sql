--IDEMPOTENT
-- Catalog, photos, and enquiries for the Sunil Travels shop window.

do $$ begin
  create type public.hire_kind as enum ('self_drive', 'airport', 'local', 'outstation');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.handover as enum ('collection', 'delivery');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.airport_direction as enum ('to_airport', 'from_airport');
exception when duplicate_object then null;
end $$;

create table if not exists public.business (
  id integer primary key check (id = 1),
  trading_name text not null,
  phone_display text not null,
  whatsapp_digits text not null,
  yard_label text not null,
  yard_address text not null,
  about text not null
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text not null default '',
  day_rate_inr integer,
  transfer_rate_inr integer,
  day_package_inr integer,
  kilometre_rate_inr integer,
  sort_order integer not null default 0,
  constraint vehicles_day_rate_nonnegative check (day_rate_inr is null or day_rate_inr >= 0),
  constraint vehicles_transfer_rate_nonnegative check (transfer_rate_inr is null or transfer_rate_inr >= 0),
  constraint vehicles_day_package_nonnegative check (day_package_inr is null or day_package_inr >= 0),
  constraint vehicles_kilometre_rate_nonnegative check (kilometre_rate_inr is null or kilometre_rate_inr >= 0)
);

create table if not exists public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  unique (vehicle_id, storage_path)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid references auth.users (id) on delete set null,
  vehicle_id uuid not null references public.vehicles (id),
  vehicle_name text not null,
  hire_kind public.hire_kind not null,
  visitor_name text not null,
  callback_phone text not null,
  note text,
  pickup_at timestamptz,
  return_at timestamptz,
  handover public.handover,
  delivery_address text,
  meetup_address text,
  airport_direction public.airport_direction,
  trip_at timestamptz,
  day_package_count integer,
  destination text,
  start_on date,
  return_on date,
  shown_rate_inr integer not null,
  shown_rate_label text not null,
  created_at timestamptz not null default now(),
  constraint enquiries_name_present check (char_length(btrim(visitor_name)) > 0),
  constraint enquiries_phone_present check (char_length(btrim(callback_phone)) > 0),
  constraint enquiries_rate_nonnegative check (shown_rate_inr >= 0)
);

alter table public.enquiries drop constraint if exists enquiries_shape;
alter table public.enquiries add constraint enquiries_shape check (
  (
    hire_kind = 'self_drive'
    and pickup_at is not null
    and return_at is not null
    and return_at > pickup_at
    and handover is not null
    and (handover = 'collection' or char_length(btrim(delivery_address)) > 0)
  )
  or (
    hire_kind = 'airport'
    and airport_direction is not null
    and meetup_address is not null
    and char_length(btrim(meetup_address)) > 0
    and trip_at is not null
  )
  or (
    hire_kind = 'local'
    and meetup_address is not null
    and char_length(btrim(meetup_address)) > 0
    and trip_at is not null
    and day_package_count is not null
    and day_package_count >= 1
  )
  or (
    hire_kind = 'outstation'
    and meetup_address is not null
    and char_length(btrim(meetup_address)) > 0
    and destination is not null
    and char_length(btrim(destination)) > 0
    and start_on is not null
    and return_on is not null
    and return_on >= start_on
  )
);

create index if not exists enquiries_visitor_id_idx on public.enquiries (visitor_id);

alter table public.business enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_photos enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "Anyone can read the business" on public.business;
create policy "Anyone can read the business"
  on public.business
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can read vehicles" on public.vehicles;
create policy "Anyone can read vehicles"
  on public.vehicles
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can read vehicle photos" on public.vehicle_photos;
create policy "Anyone can read vehicle photos"
  on public.vehicle_photos
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    (visitor_id is null and auth.uid() is null)
    or visitor_id = auth.uid()
  );

drop policy if exists "Visitors read enquiries they sent while signed in" on public.enquiries;
create policy "Visitors read enquiries they sent while signed in"
  on public.enquiries
  for select
  to authenticated
  using (visitor_id = auth.uid());

revoke all on table public.business from anon, authenticated;
revoke all on table public.vehicles from anon, authenticated;
revoke all on table public.vehicle_photos from anon, authenticated;
revoke all on table public.enquiries from anon, authenticated;

grant select on table public.business to anon, authenticated;
grant select on table public.vehicles to anon, authenticated;
grant select on table public.vehicle_photos to anon, authenticated;
grant select, insert on table public.enquiries to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle_photos',
  'vehicle_photos',
  true,
  5242880,
  array['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read vehicle_photos" on storage.objects;
create policy "Public read vehicle_photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'vehicle_photos');
