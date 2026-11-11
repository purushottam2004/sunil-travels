"""Upsert the Sunil Travels catalog and upload one photo per vehicle."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from python_seeds.client import SUPABASE_URL, get_supabase_admin_client
from python_seeds.data._003_data_vehicles import (
    BUSINESS,
    VEHICLE_PHOTOS_BUCKET,
    VEHICLES,
    photo_object,
    photo_svg,
)


def seed_vehicles() -> None:
    supabase = get_supabase_admin_client()
    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    print("Upserting Sunil Travels catalog...\n")

    supabase.table("business").upsert(BUSINESS).execute()
    print(f"  business: {BUSINESS['trading_name']}")

    rows = [{key: row[key] for key in row if key != "color"} for row in VEHICLES]
    supabase.table("vehicles").upsert(rows).execute()

    bucket = supabase.storage.from_(VEHICLE_PHOTOS_BUCKET)
    for row in VEHICLES:
        object_name = photo_object(row["id"])
        bucket.upload(
            object_name,
            photo_svg(row["name"], row["color"]),
            {"content-type": "image/svg+xml", "upsert": "true"},
        )
        supabase.table("vehicle_photos").upsert(
            {
                "vehicle_id": row["id"],
                "storage_path": object_name,
                "sort_order": 0,
            },
            on_conflict="vehicle_id,storage_path",
        ).execute()
        print(f"  {row['name']} → {object_name}")

    print("\nSeeding complete!")


if __name__ == "__main__":
    seed_vehicles()
