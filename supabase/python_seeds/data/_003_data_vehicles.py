"""Catalog rows and stand-in photos. Keep ids aligned with seeds/001_sunil_travels.sql."""

VEHICLE_PHOTOS_BUCKET = "vehicle_photos"

BUSINESS = {
    "id": 1,
    "trading_name": "Sunil Travels",
    "phone_display": "98000 00000",
    "whatsapp_digits": "919800000000",
    "yard_label": "Pune yard",
    "yard_address": "Pune yard — address to be added",
    "about": (
        "Sunil Travels hires cars in Pune. Drive one yourself, or sit with a driver "
        "for the airport, a day in the city, or a trip out of town. The rate on the "
        "page is a starting rate. A person confirms the car and the price with you directly."
    ),
}

# id, name, blurb, day, transfer, day package, per km, sort, svg fill
VEHICLES: list[dict] = [
    {
        "id": "11111111-1111-4111-8111-111111111101",
        "name": "Maruti Swift",
        "blurb": "A small hatchback for city days and short highway runs.",
        "day_rate_inr": 1800,
        "transfer_rate_inr": 900,
        "day_package_inr": 2200,
        "kilometre_rate_inr": 13,
        "sort_order": 1,
        "color": "#1d4ed8",
    },
    {
        "id": "11111111-1111-4111-8111-111111111102",
        "name": "Maruti Dzire",
        "blurb": "A compact sedan with room for a small family.",
        "day_rate_inr": 2000,
        "transfer_rate_inr": 1000,
        "day_package_inr": 2400,
        "kilometre_rate_inr": 14,
        "sort_order": 2,
        "color": "#0f766e",
    },
    {
        "id": "11111111-1111-4111-8111-111111111103",
        "name": "Hyundai Creta",
        "blurb": "A taller car for airport runs and the highway out of Pune.",
        "day_rate_inr": 3200,
        "transfer_rate_inr": 1400,
        "day_package_inr": 3800,
        "kilometre_rate_inr": 18,
        "sort_order": 3,
        "color": "#9a3412",
    },
    {
        "id": "11111111-1111-4111-8111-111111111104",
        "name": "Maruti Ertiga",
        "blurb": "Three rows, for a family day in the city or a longer road.",
        "day_rate_inr": 2800,
        "transfer_rate_inr": 1300,
        "day_package_inr": 3400,
        "kilometre_rate_inr": 16,
        "sort_order": 4,
        "color": "#365314",
    },
    {
        "id": "11111111-1111-4111-8111-111111111105",
        "name": "Toyota Innova",
        "blurb": "The large people-mover, with or without a driver.",
        "day_rate_inr": 4500,
        "transfer_rate_inr": 1800,
        "day_package_inr": 5200,
        "kilometre_rate_inr": 22,
        "sort_order": 5,
        "color": "#1e1b4b",
    },
    {
        "id": "11111111-1111-4111-8111-111111111106",
        "name": "Maruti WagonR",
        "blurb": "A self-drive hatchback. It is not offered with a driver.",
        "day_rate_inr": 1600,
        "transfer_rate_inr": None,
        "day_package_inr": None,
        "kilometre_rate_inr": None,
        "sort_order": 6,
        "color": "#7c2d12",
    },
]


def photo_object(vehicle_id: str) -> str:
    return f"{vehicle_id}.svg"


def photo_svg(name: str, color: str) -> bytes:
    safe = name.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">'
        f'<rect width="800" height="500" fill="{color}"/>'
        '<text x="48" y="430" font-family="sans-serif" font-size="52" fill="#ffffff">'
        f"{safe}</text></svg>"
    ).encode()
