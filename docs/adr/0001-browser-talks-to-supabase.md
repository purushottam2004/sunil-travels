# The browser talks to Supabase

The site is a production sales catalog with no booking engine, so the React app reads and writes Supabase directly. The FastAPI backend and the Android app stay unused. A separate API would only pay off once confirmation, pricing, or availability rules are too heavy to live in the database.
