export type TravelerType = 'solo' | 'family' | 'friends' | 'accessible';

export type TrafficStatus = 'smooth' | 'moderate' | 'heavy';

export interface Preferences {
  weather: boolean; // مراعاة الطقس ودرجات الحرارة
  prayer: boolean; // مراعاة أوقات الصلاة والمساجد القريبة
  traffic: boolean; // تجنب الازدحام المروري
  accessibility: boolean; // سهولة حركة الكراسي المتحركة وكبار السن
  restaurants: boolean; // المطاعم والمقاهي
  touristAttractions: boolean; // المعالم السياحية والثقافية
  shopping: boolean; // التسوق والأسواق التراثية
  nature: boolean; // الطبيعة والمتنزهات
  pace: 'calm' | 'balanced' | 'packed'; // وتيرة الرحلة
}

export interface TripSetupData {
  destination: string;
  startDate: string;
  duration: number; // مدة الرحلة بالأيام
  travelersType: TravelerType;
  travelersCount: number;
  preferences: Preferences;
}

export interface TimelineItem {
  id: string;
  type: 'activity' | 'prayer' | 'meal' | 'transit' | 'break';
  time: string; // e.g. "09:00 ص - 11:30 ص"
  title: string;
  subtitle?: string;
  locationName: string;
  locationArea: string;
  duration: string; // e.g. "ساعتان"
  transport: string; // e.g. "15 دقيقة بالسيارة"
  description: string;
  imageUrl?: string;
  category?: string;
  weatherInfo?: {
    temp: string;
    condition: string;
    isIdeal: boolean;
  };
  trafficInfo?: {
    status: TrafficStatus;
    label: string;
  };
  accessibilityInfo?: {
    isAccessible: boolean;
    notes: string;
  };
  prayerInfo?: {
    name: string;
    mosqueName: string;
  };
  tips?: string[];
  dressCode?: string;
  ticketInfo?: string;
  isModifiedInAlternative?: boolean;
}

export interface PrayerSummary {
  name: string;
  time: string;
  mosque: string;
}

export interface DailyPlan {
  dayNumber: number;
  date: string;
  theme: string;
  weatherSummary: {
    tempRange: string;
    condition: string;
    icon: string;
  };
  items: TimelineItem[];
  prayerSummary: PrayerSummary[];
}

export interface AlternativeNotification {
  id: string;
  title: string;
  reason: string;
  type: 'weather' | 'traffic' | 'prayer' | 'crowd';
  affectedItemTitle: string;
  suggestedChange: string;
  newPlanItem: TimelineItem;
}

export interface TripPlan {
  id: string;
  destinationName: string;
  destinationCode: string;
  durationDays: number;
  startDate: string;
  travelersText: string;
  preferences: Preferences;
  dailyPlans: DailyPlan[];
  hasAlternativePlan: boolean;
  alternativeReason?: string;
  alternativePlans?: DailyPlan[];
}

export type ScreenState = 'welcome' | 'setup' | 'loading' | 'plan' | 'alternative';
