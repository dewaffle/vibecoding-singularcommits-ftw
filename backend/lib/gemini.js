const fetch = require('node-fetch');
const tools = require('./tools');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';


const TOOL_DECLARATIONS = [
  {
    type: 'function',
    name: 'get_prayer_times',
    description: 'Get prayer times for a city and date in Saudi Arabia',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name, e.g. Jeddah' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' }
      },
      required: ['city', 'date']
    }
  },
  {
    type: 'function',
    name: 'get_weather',
    description: 'Get expected max/min temperature for a location and date',
    parameters: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' }
      },
      required: ['lat', 'lon']
    }
  },
  {
    type: 'function',
    name: 'get_traffic_eta',
    description: 'Get estimated walking/travel time and distance between two sites by their site_id',
    parameters: {
      type: 'object',
      properties: {
        origin_id: { type: 'string' },
        destination_id: { type: 'string' },
        depart_time: { type: 'string', description: 'HH:MM 24hr format' }
      },
      required: ['origin_id', 'destination_id']
    }
  },
  {
    type: 'function',
    name: 'get_site_accessibility',
    description: 'Get accessibility info (wheelchair access, walk distance from parking, indoor/outdoor, avg visit duration) for a specific site',
    parameters: {
      type: 'object',
      properties: {
        site_id: { type: 'string' }
      },
      required: ['site_id']
    }
  }
];

const TOOL_IMPL = {
  get_prayer_times: tools.getPrayerTimes,
  get_weather: tools.getWeather,
  get_traffic_eta: tools.getTrafficEta,
  get_site_accessibility: (args) => tools.getSiteAccessibility(args)
};

const SYSTEM_INSTRUCTION = `You are the planning engine for "The Planner," a Saudi tourism daily itinerary app.

You will be given: a city, a visit date, a trip duration in hours, a list of candidate sites (with id, name, category, lat/lon), and the visitor's needs (e.g. wheelchair access, avoid peak heat, etc).

Your job:
1. Call get_prayer_times and get_weather first to understand constraints for the day.
2. Decide a sensible order of sites to visit, considering: avoid scheduling visits during Dhuhr/Asr/Maghrib prayer windows (add a 20-30 min buffer around each), avoid outdoor sites during peak heat hours from the weather tool, respect the visitor's accessibility needs using get_site_accessibility, and keep travel between consecutive sites reasonable.
3. Call get_traffic_eta between consecutive stops you're considering to validate timing.
4. Call get_site_accessibility for any site if the visitor has accessibility needs, and exclude or reorder sites that don't meet those needs.
5. Return ONLY a valid JSON object (no markdown, no prose, no code fences) matching this exact shape:

{
  "city": string,
  "date": string,
  "prayer_times": { "fajr": string, "dhuhr": string, "asr": string, "maghrib": string, "isha": string },
  "weather": { "temp_max_c": number, "peak_heat_hours": string },
  "itinerary": [
    {
      "site_id": string,
      "name": string,
      "arrival_time": string,
      "departure_time": string,
      "travel_to_next_minutes": number,
      "warnings": [string]
    }
  ],
  "notes": string
}

"warnings" should flag things like "falls near Asr prayer time" or "peak heat — consider indoor alternative". Keep "notes" to one or two sentences summarizing the plan's reasoning.`;

async function callInteractions(body) {
  const res = await fetch(INTERACTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Gemini Interactions API error (${res.status}): ${JSON.stringify(data)}`);
  }
  if (data.status === 'failed') {
    throw new Error(`Gemini interaction failed: ${JSON.stringify(data)}`);
  }

  return data;
}

function extractFinalText(interaction) {
  const modelOutputSteps = (interaction.steps || []).filter((s) => s.type === 'model_output');
  let text = '';
  for (const step of modelOutputSteps) {
    for (const block of step.content || []) {
      if (block.type === 'text' && block.text) text += block.text;
    }
  }
  return text;
}

async function generateItinerary({ city, date, duration_hours, sites, needs }) {
  if (!GEMINI_API_KEY) {
    return mockItinerary({ city, date, sites });
  }

  try {
    const userPrompt = `City: ${city}
Date: ${date}
Trip duration: ${duration_hours} hours
Visitor needs: ${needs || 'none specified'}
Candidate sites: ${JSON.stringify(sites)}

Build the daily itinerary now.`;

    let interaction = await callInteractions({
      model: GEMINI_MODEL,
      input: userPrompt,
      system_instruction: SYSTEM_INSTRUCTION,
      tools: TOOL_DECLARATIONS
    });

    let finalText = null;

    // Allow up to 6 tool-call round trips before giving up
    for (let turn = 0; turn < 6; turn++) {
      const functionCallSteps = (interaction.steps || []).filter((s) => s.type === 'function_call');

      if (functionCallSteps.length === 0) {
        finalText = extractFinalText(interaction);
        break;
      }

      // Execute every requested tool call (there can be more than one per turn)
      const functionResults = [];
      for (const step of functionCallSteps) {
        const impl = TOOL_IMPL[step.name];
        const result = impl ? await impl(step.arguments) : { error: `Unknown tool ${step.name}` };
        functionResults.push({
          type: 'function_result',
          call_id: step.id,
          name: step.name,
          result: [{ type: 'text', text: JSON.stringify(result) }]
        });
      }

      // tools/system_instruction are interaction-scoped, so they must be
      // resent on every turn even though previous_interaction_id carries
      // the conversation history forward.
      interaction = await callInteractions({
        model: GEMINI_MODEL,
        previous_interaction_id: interaction.id,
        input: functionResults,
        system_instruction: SYSTEM_INSTRUCTION,
        tools: TOOL_DECLARATIONS
      });
    }

    if (!finalText) throw new Error('Gemini did not return final text within turn limit');

    const cleaned = finalText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('[generateItinerary] live Gemini call failed, falling back to mock:', err.message);
    return mockItinerary({ city, date, sites });
  }
}

// ---------- Mock itinerary (no API key needed) ----------
async function mockItinerary({ city, date, sites }) {
  const prayer = await tools.getPrayerTimes({ city, date });
  const first = sites[0] || { lat: 21.4858, lon: 39.1925 };
  const weather = await tools.getWeather({ lat: first.lat, lon: first.lon, date });

  let clock = 9 * 60; // start at 09:00 in minutes
  const itinerary = [];
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    const access = tools.getSiteAccessibility({ site_id: site.id });
    const visitMinutes = access.avg_visit_minutes || 40;
    const arrival = minutesToClock(clock);
    clock += visitMinutes;
    const departure = minutesToClock(clock);

    let travelToNext = 0;
    const warnings = [];
    if (!access.indoor && weather.peak_heat_hours) {
      const [peakStart] = weather.peak_heat_hours.split('-');
      if (clock >= toMinutes(peakStart)) {
        warnings.push('Falls in peak heat hours — consider an indoor alternative or earlier slot.');
      }
    }
    if (access.wheelchair_accessible === false) {
      warnings.push('Not wheelchair accessible — stairs/uneven terrain.');
    }

    if (i < sites.length - 1) {
      const eta = await tools.getTrafficEta({ origin_id: site.id, destination_id: sites[i + 1].id });
      travelToNext = eta.duration_minutes;
      clock += travelToNext;
    }

    itinerary.push({
      site_id: site.id,
      name: site.name,
      arrival_time: arrival,
      departure_time: departure,
      travel_to_next_minutes: travelToNext,
      warnings
    });
  }

  return {
    city,
    date,
    prayer_times: {
      fajr: prayer.fajr,
      dhuhr: prayer.dhuhr,
      asr: prayer.asr,
      maghrib: prayer.maghrib,
      isha: prayer.isha
    },
    weather: { temp_max_c: weather.temp_max_c, peak_heat_hours: weather.peak_heat_hours },
    itinerary,
    notes: 'Generated in mock mode (no GEMINI_API_KEY set). Ordering follows the input site order with basic heat and prayer-time flags.'
  };
}

function minutesToClock(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function toMinutes(clockStr) {
  const [h, m] = clockStr.split(':').map(Number);
  return h * 60 + m;
}

module.exports = { generateItinerary };
