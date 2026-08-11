# رحّال (Rahhal) — Merged Project

Frontend (رحال — polished Arabic React UI, built by your teammate) + backend (Gemini-powered
trip planning engine) merged into one project.

## How it fits together

- `frontend/` — React + TypeScript + Vite + Tailwind v4. All UI, fully Arabic/RTL.
- `backend/` — Express + Gemini Interactions API. Generates real, grounded (prayer times,
  weather, accessibility, walking ETAs) multi-day trip plans **in Arabic**, shaped to match
  `frontend/src/types.ts` exactly.

The frontend always tries the real backend first (`src/utils/apiClient.ts`). If the backend
returns a 501 (destination not supported yet) or is unreachable, it transparently falls back
to the original local mock generator (`src/utils/planGenerator.ts`) — so every destination
stays demoable even before the backend has real data for it.

## Current scope

**Only Jeddah (Al-Balad) is backed by real AI generation right now.** The other 6 destinations
(Riyadh, AlUla, Diriyah, Abha, NEOM, Madinah) automatically fall back to the existing rich
mock plans. To add real generation for another city, add its sites to
`backend/data/sites.json` (same shape as the Jeddah entries) and register it in
`SUPPORTED_DESTINATIONS` in `backend/server.js`.

## Known gaps from this merge pass

- **Missing image**: `destinations.ts` references `riyadh.jpg` as Riyadh's hero image, but
  that file isn't in the original upload — Riyadh's card will show a broken image until
  someone adds `frontend/public/riyadh.jpg`.
- **No map view**: the old vanilla-JS prototype had a Leaflet route map; `TimelineItem` in
  this app's types don't currently carry lat/lon, so there's no map here yet. Worth adding
  later if wanted.
- **"Regenerate with different constraints" button**: also not ported over — this UI doesn't
  have an equivalent yet, though `TripSetupScreen` retains its values on `onBack`.
- **Alternative plan flow**: `AlternativePlanModal` is untouched and still uses whatever mock
  alternative data ships with each plan; it isn't wired to a real "conditions changed"
  detection yet.

## Running locally

Two terminals:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env    # then fill in GEMINI_API_KEY (and GOOGLE_MAPS_API_KEY if you have one)
npm start                # http://localhost:3001

# Terminal 2 — frontend (dev mode, hot reload)
cd frontend
npm install
npm run dev               # http://localhost:5173 — proxies /api to :3001 automatically
```

## Production build (single process, same as before)

```bash
cd frontend && npm run build   # outputs frontend/dist
cd ../backend && npm start      # serves frontend/dist AND the API from one process
```
