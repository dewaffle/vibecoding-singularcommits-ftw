import { TripPlan, TripSetupData } from '../types';
import { generateSmartTripPlan } from './planGenerator';

// Same-origin in production (Express serves the built frontend).
// In dev, Vite's server.proxy (see vite.config.ts) forwards /api to the backend.
const API_BASE = '';

/**
 * Tries to generate a real, AI-powered trip plan from the backend.
 * Falls back to the local hardcoded mock generator if:
 *  - the backend doesn't have real data for this destination yet (501),
 *  - the backend is unreachable (dev server not running, network error), or
 *  - any other unexpected failure occurs.
 * This keeps every destination demoable even before the backend covers all of them.
 */
export async function fetchOrGenerateTripPlan(setupData: TripSetupData): Promise<TripPlan> {
  try {
    const res = await fetch(`${API_BASE}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationCode: setupData.destination,
        startDate: setupData.startDate,
        duration: setupData.duration,
        travelersType: setupData.travelersType,
        travelersCount: setupData.travelersCount,
        preferences: setupData.preferences
      })
    });

    if (res.status === 501) {
      // Destination not covered by real data yet — this is expected, not an error.
      return generateSmartTripPlan(setupData);
    }

    if (!res.ok) {
      throw new Error(`Trip plan API returned ${res.status}`);
    }

    return (await res.json()) as TripPlan;
  } catch (err) {
    console.warn('[fetchOrGenerateTripPlan] backend unavailable, using local mock plan:', err);
    return generateSmartTripPlan(setupData);
  }
}
