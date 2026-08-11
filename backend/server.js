require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateItinerary } = require('./lib/gemini');
const { listSites } = require('./lib/tools');
const sitesData = require('./data/sites.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the frontend (plain HTML/CSS/JS, no build step)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// GET /api/sites — list available sites for the city (used to populate frontend checkboxes)cd
app.get('/api/sites', (req, res) => {
  res.json({ city: sitesData.city, sites: listSites() });
});

// POST /api/plan — main endpoint, builds the itinerary
app.post('/api/plan', async (req, res) => {
  try {
    const { city, date, duration_hours, site_ids, needs } = req.body;

    if (!city || !date || !site_ids || !Array.isArray(site_ids) || site_ids.length === 0) {
      return res.status(400).json({ error: 'city, date, and a non-empty site_ids array are required.' });
    }

    const allSites = sitesData.sites;
    const selectedSites = site_ids
      .map((id) => allSites.find((s) => s.id === id))
      .filter(Boolean)
      .map((s) => ({ id: s.id, name: s.name, category: s.category, lat: s.lat, lon: s.lon }));

    if (selectedSites.length === 0) {
      return res.status(400).json({ error: 'None of the provided site_ids were found.' });
    }

    const itinerary = await generateItinerary({
      city,
      date,
      duration_hours: duration_hours || 6,
      sites: selectedSites,
      needs
    });

    res.json(itinerary);
  } catch (err) {
    console.error('[/api/plan] error:', err);
    res.status(500).json({ error: 'Failed to generate itinerary', details: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    gemini_key_set: Boolean(process.env.GEMINI_API_KEY),
    maps_key_set: Boolean(process.env.GOOGLE_MAPS_API_KEY)
  });
});

app.listen(PORT, () => {
  console.log(`The Planner backend running on http://localhost:${PORT}`);
  console.log(`Gemini key set: ${Boolean(process.env.GEMINI_API_KEY)} (mock mode active if false)`);
});
