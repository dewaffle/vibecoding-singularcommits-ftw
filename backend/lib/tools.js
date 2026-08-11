const fetch = require('node-fetch');
const sitesData = require('../data/sites.json');

const FORCE_MOCK = process.env.FORCE_MOCK === 'true';

// ---------- 1. Prayer Times ----------
async function getPrayerTimes({ city = 'Jeddah', date }) {
  const targetDate = date || new Date().toISOString().split('T')[0];

  if (!FORCE_MOCK) {
    try {
      const [d, m, y] = formatDateForAladhan(targetDate);
      const url = `https://api.aladhan.com/v1/timingsByCity/${d}-${m}-${y}?city=${encodeURIComponent(city)}&country=SaudiArabia&method=4`;
      const res = await fetch(url, { timeout: 5000 });
      const data = await res.json();
      if (data.code === 200) {
        const t = data.data.timings;
        return {
          source: 'live',
          date: targetDate,
          fajr: t.Fajr,
          dhuhr: t.Dhuhr,
          asr: t.Asr,
          maghrib: t.Maghrib,
          isha: t.Isha
        };
      }
    } catch (err) {
      console.warn('[getPrayerTimes] live call failed, falling back to mock:', err.message);
    }
  }

  // Mock fallback — realistic Jeddah times
  return {
    source: 'mock',
    date: targetDate,
    fajr: '04:45',
    dhuhr: '12:20',
    asr: '15:45',
    maghrib: '18:55',
    isha: '20:25'
  };
}

function formatDateForAladhan(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return [d, m, y];
}

// ---------- 2. Weather ----------
async function getWeather({ lat = 21.4858, lon = 39.1925, date }) {
  if (!FORCE_MOCK) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Riyadh`;
      const res = await fetch(url, { timeout: 5000 });
      const data = await res.json();
      if (data.daily) {
        return {
          source: 'live',
          date: data.daily.time[0],
          temp_max_c: data.daily.temperature_2m_max[0],
          temp_min_c: data.daily.temperature_2m_min[0],
          peak_heat_hours: '12:00-16:00'
        };
      }
    } catch (err) {
      console.warn('[getWeather] live call failed, falling back to mock:', err.message);
    }
  }

  // Mock fallback — realistic Jeddah summer temps
  return {
    source: 'mock',
    date: date || new Date().toISOString().split('T')[0],
    temp_max_c: 41,
    temp_min_c: 31,
    peak_heat_hours: '12:00-16:00'
  };
}

// ---------- 3. Traffic / ETA between two sites ----------
async function getTrafficEta({ origin_id, destination_id, depart_time }) {
  // Mocked by default — Google Distance Matrix requires billing enabled,
  // so this is intentionally mock-first even when a key exists, unless FORCE_MOCK=false
  // AND you've wired in a real call below.
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!FORCE_MOCK && apiKey) {
    try {
      const origin = findSite(origin_id);
      const dest = findSite(destination_id);
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${dest.lat},${dest.lon}&mode=walking&key=${apiKey}`;
      const res = await fetch(url, { timeout: 5000 });
      const data = await res.json();
      const el = data.rows?.[0]?.elements?.[0];
      if (el && el.status === 'OK') {
        return {
          source: 'live',
          mode: 'walking',
          duration_minutes: Math.ceil(el.duration.value / 60),
          distance_meters: el.distance.value
        };
      }
    } catch (err) {
      console.warn('[getTrafficEta] live call failed, falling back to mock:', err.message);
    }
  }

  // Mock fallback — estimate based on straight-line distance between known sites
  const origin = findSite(origin_id);
  const dest = findSite(destination_id);
  const distance_meters = origin && dest ? haversineMeters(origin, dest) : 400;
  const duration_minutes = Math.max(3, Math.round(distance_meters / 80)); // ~80m/min walking pace

  return {
    source: 'mock',
    mode: 'walking',
    duration_minutes,
    distance_meters: Math.round(distance_meters)
  };
}

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------- 4. Site Accessibility ----------
function getSiteAccessibility({ site_id }) {
  const site = findSite(site_id);
  if (!site) {
    return { source: 'mock', error: `Unknown site_id: ${site_id}` };
  }
  return {
    source: 'data',
    site_id: site.id,
    name: site.name,
    wheelchair_accessible: site.accessibility.wheelchair_accessible,
    notes: site.accessibility.notes,
    walk_from_nearest_parking_m: site.accessibility.walk_from_nearest_parking_m,
    indoor: site.indoor,
    avg_visit_minutes: site.avg_visit_minutes
  };
}

function findSite(id) {
  return sitesData.sites.find((s) => s.id === id);
}

function listSites() {
  return sitesData.sites.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    lat: s.lat,
    lon: s.lon
  }));
}

module.exports = {
  getPrayerTimes,
  getWeather,
  getTrafficEta,
  getSiteAccessibility,
  listSites
};
