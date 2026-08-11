import React, { useState } from 'react';
import { TripSetupData, TravelerType, Preferences } from '../types';
import { SAUDI_DESTINATIONS } from '../data/destinations';
import { 
  Calendar, Clock, Users, Sun, Moon, Navigation, Accessibility, 
  Utensils, Landmark, ShoppingBag, Trees, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface TripSetupScreenProps {
  initialDestinationId?: string;
  onGeneratePlan: (data: TripSetupData) => void;
  onBack: () => void;
}

export const TripSetupScreen: React.FC<TripSetupScreenProps> = ({
  initialDestinationId = 'riyadh',
  onGeneratePlan,
  onBack
}) => {
  const [destination, setDestination] = useState<string>(initialDestinationId);
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [duration, setDuration] = useState<number>(3);
  const [travelersType, setTravelersType] = useState<TravelerType>('family');
  const [travelersCount, setTravelersCount] = useState<number>(4);

  const [preferences, setPreferences] = useState<Preferences>({
    weather: true,
    prayer: true,
    traffic: true,
    accessibility: true,
    restaurants: true,
    touristAttractions: true,
    shopping: true,
    nature: false,
    pace: 'balanced'
  });

  const togglePref = (key: keyof Preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan({
      destination,
      startDate,
      duration,
      travelersType,
      travelersCount,
      preferences
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3 text-right">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            إعداد تفاصيل رحلتك الذكية
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            حدد وجهتك ورغباتك ليقوم رحّال بضبط أفضل مسار زمني مراعياً جميع المتغيرات.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Choose Destination */}
          <div className="bg-white dark:bg-[#1B1B1B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                ١. اختر الوجهة السياحية
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">خطوة ١ من ٣</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SAUDI_DESTINATIONS.map(dest => {
                const isSelected = destination === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setDestination(dest.id)}
                    className={`p-4 rounded-2xl border text-right transition-all relative overflow-hidden flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'border-emerald-700 dark:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-700/20 shadow-xs'
                        : 'border-gray-100 dark:border-[#2A2A2A] bg-gray-50/50 dark:bg-[#222222] hover:bg-gray-100/80 dark:hover:bg-[#282828] text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-bold text-base">
                        {dest.nameAr}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {dest.tagline}
                      </p>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md w-fit">
                      {dest.weatherAvg}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dates, Duration & Travelers */}
          <div className="bg-white dark:bg-[#1B1B1B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                ٢. تاريخ الرحلة وعدد المسافرين
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">خطوة ٢ من ٣</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  تاريخ بداية الرحلة
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#333333] text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  مدة الرحلة (بالأيام)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDuration(days)}
                      className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${
                        duration === days
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-gray-50 dark:bg-[#222222] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#282828]'
                      }`}
                    >
                      {days} {days === 1 ? 'يوم' : 'أيام'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  طبيعة المسافرين
                </label>
                <select
                  value={travelersType}
                  onChange={e => setTravelersType(e.target.value as TravelerType)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#333333] text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="family" className="dark:bg-[#1B1B1B]">عائلة (مع أطفال)</option>
                  <option value="accessible" className="dark:bg-[#1B1B1B]">كبار السن / متطلبات ميسرة</option>
                  <option value="friends" className="dark:bg-[#1B1B1B]">مجموعة أصدقاء</option>
                  <option value="solo" className="dark:bg-[#1B1B1B]">مسافر بمفردي</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 3: Smart Preferences */}
          <div className="bg-white dark:bg-[#1B1B1B] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  ٣. معايير التخطيط الذكي وتفضيلاتك
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  قم بضبط الخوارزمية حسب أولوياتك أثناء التنقل
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">خطوة ٣ من ٣</span>
            </div>

            {/* Core Smart Parameters */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                المعايير الميدانية الذكية
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Weather Toggle */}
                <div 
                  onClick={() => togglePref('weather')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    preferences.weather
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
                      : 'bg-gray-50 dark:bg-[#222222] border-gray-100 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${preferences.weather ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">مراعاة الطقس والحرارة</h4>
                      <p className="text-[11px] opacity-80">تجنب المشي الخارجي في ساعات الحرارة العالية</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${preferences.weather ? 'bg-amber-700 border-amber-700 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                    {preferences.weather && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Prayer Toggle */}
                <div 
                  onClick={() => togglePref('prayer')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    preferences.prayer
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                      : 'bg-gray-50 dark:bg-[#222222] border-gray-100 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${preferences.prayer ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">استراحات أوقات الصلاة</h4>
                      <p className="text-[11px] opacity-80">إدراج استراحات الصلاة في المساجد القريبة</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${preferences.prayer ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                    {preferences.prayer && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Traffic Toggle */}
                <div 
                  onClick={() => togglePref('traffic')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    preferences.traffic
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200'
                      : 'bg-gray-50 dark:bg-[#222222] border-gray-100 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${preferences.traffic ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">تفادي الازدحام المروري</h4>
                      <p className="text-[11px] opacity-80">ترتيب التنقل في أوقات الحركة المرورية السلسة</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${preferences.traffic ? 'bg-blue-700 border-blue-700 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                    {preferences.traffic && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Accessibility Toggle */}
                <div 
                  onClick={() => togglePref('accessibility')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    preferences.accessibility
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-200'
                      : 'bg-gray-50 dark:bg-[#222222] border-gray-100 dark:border-[#2A2A2A] text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${preferences.accessibility ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                      <Accessibility className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">سهولة الوصول والتنقل</h4>
                      <p className="text-[11px] opacity-80">اختيار أماكن مجهزة بالكامل للكراسي المتحركة</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${preferences.accessibility ? 'bg-purple-700 border-purple-700 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                    {preferences.accessibility && <Check className="w-3 h-3" />}
                  </div>
                </div>

              </div>
            </div>

            {/* Interest Categories */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                أنواع الأنشطة المفضلة
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <button
                  type="button"
                  onClick={() => togglePref('restaurants')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 justify-center ${
                    preferences.restaurants
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828]'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>المطاعم والمقاهي</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePref('touristAttractions')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 justify-center ${
                    preferences.touristAttractions
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828]'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>المعالم والتراث</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePref('shopping')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 justify-center ${
                    preferences.shopping
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>التسوق والأسواق</span>
                </button>

                <button
                  type="button"
                  onClick={() => togglePref('nature')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 justify-center ${
                    preferences.nature
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828]'
                  }`}
                >
                  <Trees className="w-4 h-4" />
                  <span>الطبيعة والحدائق</span>
                </button>

              </div>
            </div>

          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-98"
            >
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>إنشاء الخطة الذكية</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
