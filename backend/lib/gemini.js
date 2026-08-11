const fetch = require('node-fetch');
const tools = require('./tools');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

// ---------- Tool declarations Gemini can call ----------
const TOOL_DECLARATIONS = [
  {
    type: 'function',
    name: 'get_prayer_times',
    description: 'Get prayer times for a city and a specific date in Saudi Arabia',
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
    description: 'Get expected max/min temperature and peak heat hours for a location and date',
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

const PREFERENCE_LABELS_AR = {
  weather: 'مراعاة الطقس ودرجات الحرارة',
  prayer: 'مراعاة أوقات الصلاة والمساجد القريبة',
  traffic: 'تجنب الازدحام المروري',
  accessibility: 'سهولة حركة الكراسي المتحركة وكبار السن',
  restaurants: 'المطاعم والمقاهي',
  touristAttractions: 'المعالم السياحية والثقافية',
  shopping: 'التسوق والأسواق التراثية',
  nature: 'الطبيعة والمتنزهات'
};

const PACE_LABELS_AR = {
  calm: 'هادئة — عدد قليل من الأنشطة مع وقت راحة أطول',
  balanced: 'متوازنة — مزيج معتدل من الأنشطة والراحة',
  packed: 'مكثّفة — أكبر عدد ممكن من الأنشطة والمعالم'
};

function buildSystemInstruction() {
  return `أنت المحرك الذكي لتخطيط الرحلات في تطبيق "رحّال" — مخطط الرحلات اليومية الذكي للسياحة الداخلية في المملكة العربية السعودية.

ستُعطى: المدينة، تاريخ بداية الرحلة، عدد الأيام، قائمة المواقع المتاحة (id, name, name_ar, category, lat/lon)، نوع المسافرين وعددهم، تفضيلاتهم، ووتيرة الرحلة المفضّلة.

مهمتك:
1. لكل يوم من أيام الرحلة، استدعِ get_prayer_times و get_weather أولاً لفهم قيود ذلك اليوم بالتحديد (استخدم تاريخ اليوم الفعلي المذكور في الطلب).
2. رتّب زيارة المواقع بشكل منطقي جغرافياً وزمنياً، مع:
   - تجنّب جدولة الأنشطة أثناء أوقات صلاة الظهر والعصر والمغرب (اترك هامش ٢٠-٣٠ دقيقة قبل/بعد كل وقت صلاة)، وأضف عنصر type="prayer" في الجدول عند كل وقت صلاة رئيسي أثناء ساعات الجولة.
   - تجنّب المواقع الخارجية (غير مسقوفة) خلال ساعات الذروة الحارة إن وُجدت.
   - احترام احتياجات إتاحة الحركة إذا كان نوع المسافرين "accessible" أو تم تفعيل تفضيل "accessibility"، باستخدام get_site_accessibility، واستبعاد أو إعادة ترتيب المواقع غير المناسبة.
   - استدعاء get_traffic_eta بين المواقع المتتالية للتحقق من التوقيت الواقعي.
   - إضافة عنصر واحد أو أكثر من type="meal" يومياً (غداء/عشاء) بناءً على معرفتك العامة بمطاعم ومقاهي المنطقة، حتى لو لم تتوفر أداة مخصصة لذلك.
3. إذا كان عدد أيام الرحلة أكبر من عدد المواقع المتاحة، لا تُخطئ ولا تتوقف — وزّع الوقت بشكل أعمق على المواقع نفسها (زيارات بأوقات مختلفة من اليوم، وقت أطول لكل موقع، فترات راحة، تسوّق، طعام محلي) بدلاً من تكرار نفس الجدول اليومي حرفياً.
4. اجعل لكل يوم "theme" (عنوان قصير جذاب) يختلف عن باقي الأيام.
5. اكتب كل النصوص الظاهرة للمستخدم باللغة العربية الفصحى الواضحة والودّية (العناوين، الأوصاف، النصائح، الملاحظات). لا تستخدم الإنجليزية إطلاقاً في القيم النصية.
6. أرجع فقط كائن JSON صالح (بدون markdown أو نص إضافي أو علامات كود) بالشكل التالي بالضبط:

{
  "dailyPlans": [
    {
      "dayNumber": number,
      "date": string,
      "theme": string,
      "weatherSummary": { "tempRange": string, "condition": string, "icon": string },
      "items": [
        {
          "id": string,
          "type": "activity" | "prayer" | "meal" | "transit" | "break",
          "time": string,
          "title": string,
          "subtitle": string,
          "locationName": string,
          "locationArea": string,
          "duration": string,
          "transport": string,
          "description": string,
          "category": string,
          "weatherInfo": { "temp": string, "condition": string, "isIdeal": boolean },
          "trafficInfo": { "status": "smooth" | "moderate" | "heavy", "label": string },
          "accessibilityInfo": { "isAccessible": boolean, "notes": string },
          "prayerInfo": { "name": string, "mosqueName": string },
          "tips": [string],
          "dressCode": string,
          "ticketInfo": string
        }
      ],
      "prayerSummary": [ { "name": string, "time": string, "mosque": string } ]
    }
  ],
  "notes": string
}

ملاحظات على الحقول الاختيارية: أضف weatherInfo/trafficInfo/accessibilityInfo فقط عند وجود بيانات فعلية من الأدوات. أضف prayerInfo فقط للعناصر من نوع "prayer". اجعل "time" بصيغة نطاق مثل "٠٩:٠٠ ص - ١١:٠٠ ص". اجعل "notes" ملخصاً من جملة أو جملتين لمنطق الخطة ككل.`;
}

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

function addDays(isoDate, n) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Generates a full multi-day TripPlan (matching the frontend's TripPlan type)
 * for a destination we have real curated site data for.
 */
async function generateTripPlan({ destinationCode, destinationNameAr, startDate, duration, travelersType, travelersCount, preferences, sites }) {
  const dayDates = Array.from({ length: duration }, (_, i) => addDays(startDate, i));

  const shellPlan = (dailyPlans, notes) => ({
    id: `trip_${destinationCode}_${Date.now()}`,
    destinationName: destinationNameAr,
    destinationCode,
    durationDays: duration,
    startDate,
    dailyPlans,
    hasAlternativePlan: false,
    notes
  });

  if (!GEMINI_API_KEY) {
    return shellPlan(mockDailyPlans({ dayDates, sites }), 'تم إنشاء هذه الخطة في وضع العرض التجريبي (لا يوجد مفتاح GEMINI_API_KEY).');
  }

  try {
    const activePrefs = Object.entries(preferences || {})
      .filter(([key, val]) => PREFERENCE_LABELS_AR[key] && val === true)
      .map(([key]) => PREFERENCE_LABELS_AR[key]);

    const userPrompt = `المدينة: ${destinationNameAr} (${destinationCode})
تاريخ البداية: ${startDate}
عدد أيام الرحلة: ${duration}
تواريخ الأيام بالتفصيل: ${dayDates.map((d, i) => `اليوم ${i + 1}: ${d}`).join(' | ')}
نوع المسافرين: ${travelersType}
عدد المسافرين: ${travelersCount}
وتيرة الرحلة المطلوبة: ${PACE_LABELS_AR[preferences?.pace] || PACE_LABELS_AR.balanced}
التفضيلات المفعّلة: ${activePrefs.length ? activePrefs.join('، ') : 'لا توجد تفضيلات خاصة محددة'}
المواقع المتاحة: ${JSON.stringify(sites)}

ابنِ خطة الرحلة الكاملة الآن لكل الأيام المذكورة أعلاه.`;

    let interaction = await callInteractions({
      model: GEMINI_MODEL,
      input: userPrompt,
      system_instruction: buildSystemInstruction(),
      tools: TOOL_DECLARATIONS
    });

    let finalText = null;

    // Allow more round trips than a single-day plan needed, since the model
    // may call tools separately for each day of a multi-day trip.
    for (let turn = 0; turn < 6 + duration * 3; turn++) {
      const functionCallSteps = (interaction.steps || []).filter((s) => s.type === 'function_call');

      if (functionCallSteps.length === 0) {
        finalText = extractFinalText(interaction);
        break;
      }

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

      interaction = await callInteractions({
        model: GEMINI_MODEL,
        previous_interaction_id: interaction.id,
        input: functionResults,
        system_instruction: buildSystemInstruction(),
        tools: TOOL_DECLARATIONS
      });
    }

    if (!finalText) throw new Error('Gemini did not return final text within turn limit');

    const cleaned = finalText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return shellPlan(parsed.dailyPlans, parsed.notes);
  } catch (err) {
    console.warn('[generateTripPlan] live Gemini call failed, falling back to mock:', err.message);
    return shellPlan(mockDailyPlans({ dayDates, sites }), 'تم إنشاء هذه الخطة في وضع العرض التجريبي بسبب تعذّر الاتصال بالذكاء الاصطناعي.');
  }
}

// ---------- Mock fallback (no API key, or live call failed) ----------
function mockDailyPlans({ dayDates, sites }) {
  return dayDates.map((date, dayIdx) => {
    let clock = 9 * 60;
    const items = sites.map((site, i) => {
      const access = tools.getSiteAccessibility({ site_id: site.id });
      const visitMinutes = access.avg_visit_minutes || 40;
      const startClock = clock;
      clock += visitMinutes;
      return {
        id: `${site.id}-${dayIdx}`,
        type: 'activity',
        time: `${minutesToArabicClock(startClock)} - ${minutesToArabicClock(clock)}`,
        title: `زيارة ${site.name_ar || site.name}`,
        locationName: site.name_ar || site.name,
        locationArea: 'البلد، جدة',
        duration: `${visitMinutes} دقيقة`,
        transport: 'سيراً على الأقدام',
        description: 'زيارة تعريفية للموقع (وضع العرض التجريبي).',
        accessibilityInfo: {
          isAccessible: !!access.wheelchair_accessible,
          notes: access.notes || ''
        }
      };
    });

    return {
      dayNumber: dayIdx + 1,
      date,
      theme: `اليوم ${dayIdx + 1} — جولة في البلد التاريخية`,
      weatherSummary: { tempRange: '٢٦-٣٤°م', condition: 'مشمس', icon: 'Sun' },
      items,
      prayerSummary: [
        { name: 'الظهر', time: '١٢:٢٠ م', mosque: '—' },
        { name: 'العصر', time: '٣:٤٥ م', mosque: '—' },
        { name: 'المغرب', time: '٦:٥٥ م', mosque: '—' }
      ]
    };
  });
}

function minutesToArabicClock(totalMinutes) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 < 12 ? 'ص' : 'م';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

module.exports = { generateTripPlan };
