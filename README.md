# The Planner — AI Tourism Daily Planner (MVP)

Smart daily itinerary planner for Al-Balad, Jeddah. Considers accessibility, prayer
times, heat, and travel time between stops. Uses Gemini function calling to
orchestrate the planning logic.

## Quick start (works right now, no API keys needed)

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Open **http://localhost:3001** in your browser. That's it — the whole app (frontend
+ backend) is served from one process.

With no keys set, everything runs in **mock mode**: prayer times, weather, and
travel estimates use realistic hardcoded/calculated values instead of live APIs,
and the itinerary logic runs locally instead of calling Gemini. This means the
app is fully demoable today.

## Adding real data / keys later

**1. Replace the site data (highest priority — you said this is ready)**
Swap `backend/data/sites.json` with your real curated Al-Balad dataset. Keep the
same field names (`id`, `name`, `lat`, `lon`, `accessibility`, etc.) or update
`backend/lib/tools.js` to match your schema.

**2. Add a Gemini API key**
Get a free key at https://aistudio.google.com/apikey, put it in `backend/.env`
as `GEMINI_API_KEY=...`. Once set, `/api/plan` will call real Gemini with
function calling instead of the mock planner — no other code changes needed.

**3. Add a Google Maps key (optional)**
Put it in `.env` as `GOOGLE_MAPS_API_KEY=...`. Without it, travel time between
sites is estimated from straight-line distance at walking pace, which is
usually close enough for a demo.

**4. Prayer times and weather already hit live free APIs**
(Aladhan for prayer times, Open-Meteo for weather) — no key required for either.
They'll automatically switch from mock to live once network access works in
your deployment environment.

Set `FORCE_MOCK=true` in `.env` any time you want to guarantee mock mode for a
demo (e.g. if a venue's wifi is unreliable and you don't want a live API call
failing on stage).

## Architecture

```
backend/
  server.js          — Express server, serves frontend + API routes
  lib/gemini.js       — Gemini function-calling orchestration + tool schemas
  lib/tools.js        — Tool implementations (prayer/weather/traffic/accessibility)
  data/sites.json     — Curated site data (REPLACE with your real data)
frontend/
  index.html          — Single page, no build step
  css/style.css
  js/app.js            — Talks to /api/sites and /api/plan
```

### How the Gemini integration works

`POST /api/plan` sends Gemini a system prompt plus the trip details and lets it
call four tools as needed: `get_prayer_times`, `get_weather`, `get_traffic_eta`,
`get_site_accessibility`. Gemini reasons about ordering, prayer-time buffers,
heat exposure, and accessibility, then returns a structured JSON itinerary that
the frontend renders directly. This satisfies the function-calling requirement
from the brief.

If the Gemini call fails for any reason (no key, network issue, bad JSON), the
app automatically falls back to a simpler local algorithm (`mockItinerary` in
`lib/gemini.js`) so the demo never shows a blank error screen.

## Known MVP limitations (intentional, for a 3-day build)

- Only one city (Al-Balad, Jeddah)
- Site list is small and curated by hand, not sourced live
- No user accounts / saved trips
- No real-time traffic (walking-pace estimate only, unless you add a Maps key)

## Next steps if you have extra time

- Swap in real site data
- Add a simple map view (Leaflet.js is a fast, no-key option) to visualize the route
- Add a "regenerate with different constraints" button
- Deploy: frontend can stay served by the same Express app; deploy the whole
  `backend/` folder to Render, Railway, or similar
