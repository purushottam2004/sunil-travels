-- Catalog rows for db reset. Photo files are uploaded by python_seeds/_003_seed_vehicles.py.
-- Keep these ids and rates aligned with python_seeds/data/_003_data_vehicles.py.

insert into public.business (
  id,
  trading_name,
  phone_display,
  whatsapp_digits,
  yard_label,
  yard_address,
  about
)
values (
  1,
  'Sunil Travels',
  '98000 00000',
  '919800000000',
  'Pune yard',
  'Pune yard — address to be added',
  'Sunil Travels hires cars in Pune. Drive one yourself, or sit with a driver for the airport, a day in the city, or a trip out of town. The rate on the page is a starting rate. A person confirms the car and the price with you directly.'
)
on conflict (id) do update
set
  trading_name = excluded.trading_name,
  phone_display = excluded.phone_display,
  whatsapp_digits = excluded.whatsapp_digits,
  yard_label = excluded.yard_label,
  yard_address = excluded.yard_address,
  about = excluded.about;

insert into public.vehicles (
  id, name, blurb, day_rate_inr, transfer_rate_inr, day_package_inr, kilometre_rate_inr, sort_order
)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'Maruti Swift',
    'A small hatchback for city days and short highway runs.',
    1800, 900, 2200, 13, 1
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Maruti Dzire',
    'A compact sedan with room for a small family.',
    2000, 1000, 2400, 14, 2
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Hyundai Creta',
    'A taller car for airport runs and the highway out of Pune.',
    3200, 1400, 3800, 18, 3
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Maruti Ertiga',
    'Three rows, for a family day in the city or a longer road.',
    2800, 1300, 3400, 16, 4
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'Toyota Innova',
    'The large people-mover, with or without a driver.',
    4500, 1800, 5200, 22, 5
  ),
  (
    '11111111-1111-4111-8111-111111111106',
    'Maruti WagonR',
    'A self-drive hatchback. It is not offered with a driver.',
    1600, null, null, null, 6
  )
on conflict (id) do update
set
  name = excluded.name,
  blurb = excluded.blurb,
  day_rate_inr = excluded.day_rate_inr,
  transfer_rate_inr = excluded.transfer_rate_inr,
  day_package_inr = excluded.day_package_inr,
  kilometre_rate_inr = excluded.kilometre_rate_inr,
  sort_order = excluded.sort_order;
