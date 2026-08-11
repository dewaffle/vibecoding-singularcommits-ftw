require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateTripPlan } = require('./lib/gemini');
const { listSites } = require('./lib/tools');
const sitesData = require('./data/sites.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the built frontend (npm run build in frontend/ produces frontend/dist)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Destinations we have real curated site data for. Any destinationCode not
// listed here gets a clear 501 so the frontend can fall back to its own
// local mock generator instead of erroring out.
const SUPPORTED_DESTINATIONS = {
  jeddah: {
    nameAr: 'جدة التاريخية (البلد)',
    city: sitesData.city
  }
};

// GET /api/sites — list available sites (used by any future site-picker UI)
app.get('/api/sites', (req, res) => {
  res.json({ city: sitesData.city, sites: listSites() });
});

// GET /api/destinations/supported — lets the frontend check ahead of time
// which destinations can hit the real AI backend vs. its local mocks.
app.get('/api/destinations/supported', (req, res) => {
  res.json({ destinationCodes: Object.keys(SUPPORTED_DESTINATIONS) });
});

// POST /api/plan — builds a full multi-day Arabic TripPlan
app.post('/api/plan', async (req, res) => {
  try {
    const { destinationCode, startDate, duration, travelersType, travelersCount, preferences } = req.body;

    if (!destinationCode || !startDate || !duration) {
      return res.status(400).json({ error: 'destinationCode, startDate, and duration are required.' });
    }

    const destination = SUPPORTED_DESTINATIONS[destinationCode];
    if (!destination) {
      return res.status(501).json({
        error: `لا تتوفر بيانات حقيقية لوجهة "${destinationCode}" بعد.`,
        unsupported: true
      });
    }

    const sites = sitesData.sites.map((s) => ({
      id: s.id,
      name: s.name,
      name_ar: s.name_ar,
      category: s.category,
      lat: s.lat,
      lon: s.lon
    }));

    const tripPlan = await generateTripPlan({
      destinationCode,
      destinationNameAr: destination.nameAr,
      startDate,
      duration: Math.max(1, Math.min(7, Number(duration) || 1)),
      travelersType: travelersType || 'solo',
      travelersCount: travelersCount || 1,
      preferences: preferences || {},
      sites
    });

    res.json(tripPlan);
  } catch (err) {
    console.error('[/api/plan] error:', err);
    res.status(500).json({ error: 'Failed to generate trip plan', details: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    gemini_key_set: Boolean(process.env.GEMINI_API_KEY),
    maps_key_set: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    supported_destinations: Object.keys(SUPPORTED_DESTINATIONS)
  });
});

// Let the React app's client-side routing (if any is added later) handle
// unmatched non-API GET requests.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`رحّال backend running on http://localhost:${PORT}`);
  console.log(`Gemini key set: ${Boolean(process.env.GEMINI_API_KEY)} (mock mode active if false)`);
  console.log(`Supported live destinations: ${Object.keys(SUPPORTED_DESTINATIONS).join(', ')}`);
});
