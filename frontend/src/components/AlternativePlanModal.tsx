import React from 'react';
import { TripPlan, DailyPlan } from '../types';
import { Sparkles, ArrowLeft, Sun, Navigation, CheckCircle, Clock, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlternativePlanModalProps {
  isOpen: boolean;
  tripPlan: TripPlan;
  onApplyAlternative: () => void;
  onClose: () => void;
}

export const AlternativePlanModal: React.FC<AlternativePlanModalProps> = ({
  isOpen,
  tripPlan,
  onApplyAlternative,
  onClose
}) => {
  if (!isOpen) return null;

  const altDailyPlans = tripPlan.alternativePlans || tripPlan.dailyPlans;
  const currentAltDay = altDailyPlans[0];
  const originalDay = tripPlan.dailyPlans[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto transition-colors">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#1B1B1B] w-full max-w-3xl rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-2xl overflow-hidden my-8 text-right text-gray-900 dark:text-gray-100 transition-colors"
        >
          {/* Top Banner */}
          <div className="bg-emerald-900 dark:bg-emerald-950 text-white p-6 sm:p-8 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>التكيف الميداني الذكي</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold">
              تم العثور على خطة أفضل.
            </h2>
            
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed max-w-2xl">
              {tripPlan.alternativeReason || 'تم رصد ارتفاع حرارة الظهيرة وازدحام مروري، وقام رحّال باستبدال الجولة الخارجية بمتحف مكيف ونقل الجولة للغروب.'}
            </p>
          </div>

          {/* Comparison Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2A2A2A] pb-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                مقارنة بين الخطة الحالية والخطة البديلة المحسنة:
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                تحسين الراحة ٩٥٪
              </span>
            </div>

            {/* Changes Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Original Plan Preview */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#333333] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span>الخطة السابقة (قبل التعديل)</span>
                  <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md text-[10px]">
                    حرارة عالية / مرور
                  </span>
                </div>

                {originalDay?.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#1B1B1B] border border-gray-100 dark:border-[#2A2A2A] text-xs space-y-1">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{item.time}</span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{item.locationName}</p>
                  </div>
                ))}
              </div>

              {/* Alternative Optimized Plan */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    الخطة البديلة الموصى بها
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    مكيّفة وسلسة
                  </span>
                </div>

                {currentAltDay?.items.slice(0, 3).map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl bg-white dark:bg-[#1B1B1B] border text-xs space-y-1 ${
                      item.isModifiedInAlternative 
                        ? 'border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500/20' 
                        : 'border-gray-100 dark:border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">{item.time}</span>
                      {item.isModifiedInAlternative && (
                        <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold">
                          تم التعديل الذكي
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-1">{item.subtitle || item.description}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Benefit Highlights */}
            <div className="bg-gray-50 dark:bg-[#222222] p-4 rounded-2xl border border-gray-100 dark:border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">تجنب درجات الحرارة فوق ٣٨°م</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">توفير ٣٥ دقيقة زحام مروري</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">تطابق تام مع مواعيد الصلاة</span>
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div className="p-6 bg-gray-50 dark:bg-[#222222] border-t border-gray-100 dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 dark:border-[#333333] text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282828] transition-all"
            >
              الاحتفاظ بالخطة الحالية
            </button>

            <button
              onClick={onApplyAlternative}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>اعتماد الخطة البديلة الآن</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
