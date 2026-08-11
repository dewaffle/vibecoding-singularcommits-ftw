# Rahhal — AI Tourism Daily Planner (MVP)

Smart daily itinerary planner for Al-Balad, Jeddah. Considers accessibility, prayer
times, heat, and travel time between stops. Uses Gemini function calling to
orchestrate the planning logic.

With no keys set, everything runs in **mock mode**: prayer times, weather, and
travel estimates use realistic hardcoded/calculated values instead of live APIs,
and the itinerary logic runs locally instead of calling Gemini. This means the
app is fully demoable today.

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

## Known MVP limitations (intentional, for a 3-day build)

- Only one city (Al-Balad, Jeddah)
- Site list is small and curated by hand, not sourced live
- No user accounts / saved trips
- No real-time traffic (walking-pace estimate only, unless you add a Maps key)
