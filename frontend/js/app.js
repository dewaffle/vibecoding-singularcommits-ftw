const API_BASE = ''; // same origin — backend serves this frontend directly

const form = document.getElementById('plan-form');
const sitesListEl = document.getElementById('sites-list');
const resultSection = document.getElementById('result-section');
const loadingSection = document.getElementById('loading-section');
const errorSection = document.getElementById('error-section');
const errorText = document.getElementById('error-text');
const submitBtn = document.getElementById('submit-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const formSection = document.getElementById('form-section');
const needsInput = document.getElementById('needs');

let cityName = 'Al-Balad, Jeddah';
let allSites = []; // populated from /api/sites, used to look up lat/lon for the map
let map = null;
let routeLayerGroup = null;

// Default the date input to today
document.getElementById('date').valueAsDate = new Date();

async function loadSites() {
  try {
    const res = await fetch(`${API_BASE}/api/sites`);
    const data = await res.json();
    cityName = data.city;
    allSites = data.sites;
    renderSiteCheckboxes(data.sites);
  } catch (err) {
    sitesListEl.textContent = 'Could not load sites. Is the backend running?';
  }
}

function renderSiteCheckboxes(sites) {
  sitesListEl.innerHTML = '';
  sites.forEach((site, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'site-checkbox';
    wrapper.innerHTML = `
      <input type="checkbox" id="site-${site.id}" value="${site.id}" ${i < 3 ? 'checked' : ''} />
      <label for="site-${site.id}" style="margin:0;color:var(--text);font-size:0.95rem;">${site.name} <span style="color:var(--text-muted);font-size:0.8rem;">(${site.category})</span></label>
    `;
    sitesListEl.appendChild(wrapper);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const duration_hours = Number(document.getElementById('duration').value);
  const needs = document.getElementById('needs').value;
  const site_ids = Array.from(sitesListEl.querySelectorAll('input[type=checkbox]:checked')).map((el) => el.value);

  if (site_ids.length === 0) {
    showError('Select at least one site to visit.');
    return;
  }

  showLoading();

  try {
    const res = await fetch(`${API_BASE}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName, date, duration_hours, site_ids, needs })
    });

    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(errBody.error || 'Failed to generate itinerary');
    }

    const itinerary = await res.json();
    renderItinerary(itinerary);
  } catch (err) {
    showError(err.message);
  }
});

regenerateBtn.addEventListener('click', () => {
  // Bring the form back into view — its fields (date, duration, sites,
  // needs) already hold the previous values, so this is an edit, not a reset.
  formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Wait for the scroll to roughly finish before focusing, otherwise the
  // browser fights the smooth-scroll with focus-driven scroll jumps.
  setTimeout(() => {
    needsInput.focus();
    needsInput.select();
    needsInput.classList.add('field-highlight');
    setTimeout(() => needsInput.classList.remove('field-highlight'), 1500);
  }, 450);
});

function renderItinerary(data) {
  hideAll();
  resultSection.classList.remove('hidden');

  const metaEl = document.getElementById('meta-info');
  metaEl.innerHTML = `
    <span class="meta-pill">📅 ${data.date}</span>
    <span class="meta-pill">🌡️ Max ${data.weather?.temp_max_c ?? '—'}°C</span>
    <span class="meta-pill">🕌 Dhuhr ${data.prayer_times?.dhuhr ?? '—'} · Asr ${data.prayer_times?.asr ?? '—'} · Maghrib ${data.prayer_times?.maghrib ?? '—'}</span>
  `;

  const listEl = document.getElementById('itinerary-list');
  listEl.innerHTML = '';

  data.itinerary.forEach((stop) => {
    const el = document.createElement('div');
    el.className = 'stop-card';
    const warnings = (stop.warnings || []).map((w) => `<div class="warning">⚠ ${w}</div>`).join('');
    const travel = stop.travel_to_next_minutes
      ? `<div class="travel-note">→ ${stop.travel_to_next_minutes} min to next stop</div>`
      : '';

    el.innerHTML = `
      <div class="stop-header">
        <span class="stop-name">${stop.name}</span>
        <span class="stop-time">${stop.arrival_time} – ${stop.departure_time}</span>
      </div>
      ${warnings}
      ${travel}
    `;
    listEl.appendChild(el);
  });

  if (data.notes) {
    const notesEl = document.createElement('p');
    notesEl.className = 'travel-note';
    notesEl.style.marginTop = '1rem';
    notesEl.textContent = data.notes;
    listEl.appendChild(notesEl);
  }

  renderMap(data.itinerary);
}

function numberedIcon(n) {
  return L.divIcon({
    className: 'stop-marker',
    html: `<div class="stop-marker-inner">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
}

function renderMap(stops) {
  const mapEl = document.getElementById('map');

  // Match each stop to its lat/lon from the sites already loaded for the form
  const points = stops
    .map((stop) => {
      const site = allSites.find((s) => s.id === stop.site_id);
      return site ? { ...stop, lat: site.lat, lon: site.lon } : null;
    })
    .filter(Boolean);

  if (points.length === 0) {
    mapEl.classList.add('hidden');
    return;
  }
  mapEl.classList.remove('hidden');

  if (!map) {
    map = L.map('map');
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map);
  }

  if (routeLayerGroup) {
    routeLayerGroup.remove();
  }
  routeLayerGroup = L.layerGroup().addTo(map);

  const latLngs = points.map((p) => [p.lat, p.lon]);

  points.forEach((p, i) => {
    L.marker([p.lat, p.lon], { icon: numberedIcon(i + 1) })
      .bindPopup(`<b>${p.name}</b><br>${p.arrival_time} – ${p.departure_time}`)
      .addTo(routeLayerGroup);
  });

  // Leaflet needs a literal color, not a CSS variable — keep this in sync with --accent in style.css
  L.polyline(latLngs, { color: '#e3453d', weight: 3, opacity: 0.8, dashArray: '6 6' }).addTo(routeLayerGroup);

  map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });

  // The map container was just unhidden, so Leaflet needs a nudge to
  // recalculate its size after layout settles.
  requestAnimationFrame(() => map.invalidateSize());
}

function showLoading() {
  hideAll();
  loadingSection.classList.remove('hidden');
  submitBtn.disabled = true;
}

function showError(msg) {
  hideAll();
  errorText.textContent = msg;
  errorSection.classList.remove('hidden');
  submitBtn.disabled = false;
}

function hideAll() {
  resultSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  submitBtn.disabled = false;
}

loadSites();
