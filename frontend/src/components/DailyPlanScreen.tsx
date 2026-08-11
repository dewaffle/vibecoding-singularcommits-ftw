import React, { useState } from 'react';
import { TripPlan, TimelineItem, DailyPlan } from '../types';
import { 
  Clock, MapPin, Navigation, Sun, Moon, Accessibility, Sparkles, 
  Share2, Printer, CheckCircle, ChevronDown, ChevronUp, AlertCircle, 
  Utensils, Landmark, ShoppingBag, Info, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyPlanScreenProps {
  tripPlan: TripPlan;
  onShowAlternative: () => void;
  onModifyPlan?: () => void;
  isAlternativeApplied?: boolean;
}

export const DailyPlanScreen: React.FC<DailyPlanScreenProps> = ({
  tripPlan,
  onShowAlternative,
  onModifyPlan,
  isAlternativeApplied = false
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [selectedItemDetail, setSelectedItemDetail] = useState<TimelineItem | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeDailyPlan: DailyPlan = tripPlan.dailyPlans[activeDayIndex] || tripPlan.dailyPlans[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 pb-20 pt-6 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Soft Notification Bar for Screen 5 Trigger */}
        {tripPlan.hasAlternativePlan && !isAlternativeApplied && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400 animate-pulse" />
              </div>
              <div className="text-right">
                <h3 className="font-extrabold text-sm text-amber-950 dark:text-amber-200">
                  تم العثور على خطة أفضل.
                </h3>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5">
                  رصد رحّال ارتفاعاً بفرص الازدحام المروري والحرارة، واقترح تعديلاً مريحاً لجداولك.
                </p>
              </div>
            </div>

            <button
              onClick={onShowAlternative}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <span>عرض الخطة البديلة</span>
            </button>
          </motion.div>
        )}

        {/* Alternative Applied Success Toast */}
        {isAlternativeApplied && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200 font-bold"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>تم اعتماد الخطة البديلة المحسنة بنجاح!</span>
            </div>
            <span className="text-[11px] font-normal text-emerald-800 dark:text-emerald-300">
              جدولك الآن يتفادى أوقات الحرارة والازدحام
            </span>
          </motion.div>
        )}

        {/* Plan Header Overview */}
        <div className="bg-white dark:bg-[#1B1B1B] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-[#2A2A2A] shadow-xs space-y-6 text-right transition-colors">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2A2A2A] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/40">
                  {tripPlan.durationDays} أيام مخصصة
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  • {tripPlan.travelersText}
                </span>
              </div>
              
              <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                جدول رحلة {tripPlan.destinationName}
              </h1>
            </div>

            {/* Print & Share Actions */}
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-[#333333] transition-all flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopied ? 'تم نسخ الرابط' : 'مشاركة'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-[#333333] transition-all flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة / PDF</span>
              </button>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
            {tripPlan.dailyPlans.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 text-right ${
                  activeDayIndex === idx
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-[#222222] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] border border-gray-100 dark:border-[#2A2A2A]'
                }`}
              >
                <div className="text-sm">اليوم {day.dayNumber}</div>
                <div className={`text-[10px] font-normal mt-0.5 opacity-80`}>
                  {day.theme.substring(0, 22)}...
                </div>
              </button>
            ))}
          </div>

          {/* Active Day Meta Summary */}
          <div className="bg-gray-50/80 dark:bg-[#222222] p-4 rounded-2xl border border-gray-100 dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                {activeDailyPlan.date}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                {activeDailyPlan.theme}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1B1B1B] border border-gray-200/80 dark:border-[#333333] text-amber-900 dark:text-amber-200 font-semibold">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>الطقس المتوقع: {activeDailyPlan.weatherSummary.tempRange}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Timeline Layout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              المسار الزمني المباشر لليوم
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              مرتب زمنيًا مع استراحات الصلاة ومؤشرات المرور
            </span>
          </div>

          {/* Timeline Items List */}
          <div className="relative pl-0 sm:pr-8 space-y-6 before:hidden sm:before:block before:absolute before:right-[15px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-200 dark:before:bg-[#2A2A2A]">
            
            {activeDailyPlan.items.map((item: TimelineItem, index: number) => {
              const isPrayer = item.type === 'prayer';
              const isMeal = item.type === 'meal';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="relative group"
                >
                  {/* Timeline Dot Indicator */}
                  <div className={`hidden sm:flex absolute -right-[39px] top-6 w-8 h-8 rounded-full border-2 items-center justify-center text-xs font-bold z-10 transition-transform group-hover:scale-110 ${
                    isPrayer 
                      ? 'bg-emerald-700 border-emerald-800 text-white shadow-xs' 
                      : isMeal 
                      ? 'bg-amber-600 border-amber-700 text-white' 
                      : 'bg-white dark:bg-[#1B1B1B] border-gray-300 dark:border-[#333333] text-gray-700 dark:text-gray-200'
                  }`}>
                    {isPrayer ? (
                      <Moon className="w-4 h-4" />
                    ) : isMeal ? (
                      <Utensils className="w-4 h-4" />
                    ) : (
                      <span className="text-[11px]">{index + 1}</span>
                    )}
                  </div>

                  {/* Card Container */}
                  <div 
                    onClick={() => setSelectedItemDetail(item)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer text-right ${
                      isPrayer
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/90 dark:border-emerald-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 shadow-xs'
                        : isMeal
                        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50 hover:bg-amber-50/80 dark:hover:bg-amber-900/40'
                        : item.isModifiedInAlternative
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 shadow-xs ring-1 ring-emerald-500/10'
                        : 'bg-white dark:bg-[#1B1B1B] border-gray-100 dark:border-[#2A2A2A] hover:border-gray-200 dark:hover:border-[#333333] hover:shadow-md'
                    }`}
                  >
                    
                    {/* Top Time & Tags Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      
                      {/* Time Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#222222] text-gray-900 dark:text-gray-100 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <span>{item.time}</span>
                      </div>

                      {/* Transport Badge */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <Navigation className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        <span>الوسيلة والمدة: {item.transport}</span>
                      </div>

                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* Image if available */}
                      {item.imageUrl && (
                        <div className="h-32 md:h-auto rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 md:col-span-1">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Text details */}
                      <div className={`space-y-2 ${item.imageUrl ? 'md:col-span-3' : 'md:col-span-4'}`}>
                        
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-extrabold text-lg text-gray-950 dark:text-white leading-snug">
                              {item.title}
                            </h3>
                            {item.subtitle && (
                              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          {item.category && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-300 shrink-0">
                              {item.category}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium pt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>الموقع: {item.locationName} ({item.locationArea})</span>
                        </div>

                      </div>

                    </div>

                    {/* Indicators Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100/80 dark:border-[#2A2A2A] flex flex-wrap items-center gap-3 text-xs">
                      
                      {/* Prayer Indicator */}
                      {item.prayerInfo && (
                        <div className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                          <span>{item.prayerInfo.name} - {item.prayerInfo.mosqueName}</span>
                        </div>
                      )}

                      {/* Weather Badge */}
                      {item.weatherInfo && (
                        <div className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-medium border border-amber-200/60 dark:border-amber-800/50 flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>الطقس: {item.weatherInfo.temp} • {item.weatherInfo.condition}</span>
                        </div>
                      )}

                      {/* Traffic Status */}
                      {item.trafficInfo && (
                        <div className={`px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 ${
                          item.trafficInfo.status === 'smooth'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50'
                            : item.trafficInfo.status === 'moderate'
                            ? 'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-200/60 dark:border-yellow-800/50'
                            : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200/60 dark:border-red-800/50'
                        }`}>
                          <Navigation className="w-3.5 h-3.5" />
                          <span>المرور: {item.trafficInfo.label}</span>
                        </div>
                      )}

                      {/* Accessibility Note */}
                      {item.accessibilityInfo && (
                        <div className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-medium border border-purple-200/60 dark:border-purple-800/50 flex items-center gap-1.5">
                          <Accessibility className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                          <span>{item.accessibilityInfo.notes}</span>
                        </div>
                      )}

                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>
        </div>

        {/* Venue Detail Modal */}
        {selectedItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#1B1B1B] max-w-lg w-full rounded-3xl border border-gray-100 dark:border-[#2A2A2A] p-6 sm:p-8 space-y-5 text-right shadow-2xl relative text-gray-900 dark:text-gray-100"
            >
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-300 transition-colors"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  {selectedItemDetail.time} • {selectedItemDetail.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedItemDetail.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedItemDetail.locationName}
                </p>
              </div>

              {selectedItemDetail.imageUrl && (
                <div className="h-44 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={selectedItemDetail.imageUrl} 
                    alt={selectedItemDetail.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedItemDetail.description}
              </p>

              {selectedItemDetail.tips && selectedItemDetail.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                  <span className="font-bold block">💡 نصائح رحّال للزيارة:</span>
                  <ul className="list-disc list-inside space-y-0.5 opacity-90">
                    {selectedItemDetail.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setSelectedItemDetail(null)}
                  className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                >
                  إغلاق التفاصيل
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
