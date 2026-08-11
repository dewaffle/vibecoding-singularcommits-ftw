import React, { useEffect, useState } from 'react';
import { Compass, Check, Sparkles, MapPin, Calendar, Users, Sun, Moon, Navigation, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TripSetupData } from '../types';
import { SAUDI_DESTINATIONS } from '../data/destinations';

interface LoadingScreenProps {
  setupData?: TripSetupData | null;
  destinationName?: string;
  onComplete: () => void;
}

const ANALYSIS_TASKS = [
  'تحليل توقعات الطقس',
  'مراجعة أوقات الصلاة',
  'تحليل الازدحام المروري',
  'اختيار أفضل ترتيب للوجهات',
  'تحسين أوقات التنقل',
  'اقتراح الأنشطة المناسبة',
  'بناء خطة مخصصة لك',
];

const STATUS_MESSAGES = [
  'نحلل أفضل أوقات الزيارة...',
  'نرتب الوجهات لتقليل وقت التنقل...',
  'نراجع الخيارات الأنسب حسب تفضيلاتك...',
  'نبني خطة متوازنة تناسب رحلتك...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ setupData, destinationName, onComplete }) => {
  const [completedTasksCount, setCompletedTasksCount] = useState<number>(0);
  const [statusMessageIndex, setStatusMessageIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'analyzing' | 'summary' | 'complete'>('analyzing');

  // Resolve destination name in Arabic
  const resolvedDestinationName =
    destinationName ||
    SAUDI_DESTINATIONS.find(d => d.id === setupData?.destination)?.nameAr ||
    'الرياض';

  // Duration text
  const durationDays = setupData?.duration || 3;

  // Traveler type text
  const getTravelersText = () => {
    if (!setupData) return 'عائلية';
    switch (setupData.travelersType) {
      case 'family':
        return 'عائلية';
      case 'accessible':
        return 'كبار السن / ميسرة';
      case 'friends':
        return 'أصدقاء';
      case 'solo':
        return 'فردية';
      default:
        return 'عائلية';
    }
  };

  // Reveal tasks sequentially (one task every 450ms)
  useEffect(() => {
    const taskInterval = setInterval(() => {
      setCompletedTasksCount(prev => {
        if (prev < ANALYSIS_TASKS.length) {
          return prev + 1;
        }
        clearInterval(taskInterval);
        return prev;
      });
    }, 450);

    return () => clearInterval(taskInterval);
  }, []);

  // Smoothly rotate dynamic status messages every 750ms
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusMessageIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 750);

    return () => clearInterval(statusInterval);
  }, []);

  // Phase controller and auto navigation
  useEffect(() => {
    // Reveal summary at 3300ms
    const summaryTimer = setTimeout(() => {
      setPhase('summary');
    }, 3300);

    // Show completion state at 4000ms
    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, 4000);

    // Transition to itinerary page at 4600ms (500ms after complete state)
    const navigateTimer = setTimeout(() => {
      onComplete();
    }, 4600);

    return () => {
      clearTimeout(summaryTimer);
      clearTimeout(completeTimer);
      clearTimeout(navigateTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-6 sm:space-y-8 my-auto py-8">
        
        {/* Prominent Rahhal Brand Logo & Radar Animation */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
          
          {/* External Pulsing Rings */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.08, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20"
          />

          <motion.div 
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
            className="absolute inset-2 rounded-full bg-emerald-600/25 dark:bg-emerald-500/25"
          />

          {/* Logo Center Card */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/20"
          >
            <Compass className="w-10 h-10 sm:w-11 sm:h-11 animate-spin" style={{ animationDuration: '10s' }} />
          </motion.div>
        </div>

        {/* Main Titles */}
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>رحّال يخطط رحلتك...</span>
          </motion.h1>
          
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
            نحلل تفضيلاتك ونبني أفضل خطة تناسب رحلتك.
          </p>
        </div>

        {/* Dynamic Status Messages Carousel */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={statusMessageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
              <span>{STATUS_MESSAGES[statusMessageIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Analysis Tasks List */}
        <div className="bg-white dark:bg-[#1B1B1B] p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs space-y-2.5 text-right">
          {ANALYSIS_TASKS.map((taskLabel, idx) => {
            const isCompleted = idx < completedTasksCount;
            const isCurrent = idx === completedTasksCount;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`p-2.5 sm:p-3 rounded-2xl transition-all flex items-center gap-3 text-xs font-bold ${
                  isCompleted 
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/50' 
                    : isCurrent
                    ? 'bg-gray-50 dark:bg-[#222222] text-gray-900 dark:text-white border border-gray-200 dark:border-[#333333] shadow-2xs'
                    : 'text-gray-400 dark:text-gray-600 border border-transparent'
                }`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700" />
                  )}
                </div>
                <span className="flex-1">{taskLabel}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Personalized Summary Card */}
        <AnimatePresence>
          {(phase === 'summary' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-emerald-900 text-white dark:bg-[#1E2E28] p-5 sm:p-6 rounded-3xl border border-emerald-700/60 dark:border-emerald-600/40 shadow-md text-right space-y-3"
            >
              <div className="flex items-center justify-between border-b border-emerald-800 dark:border-emerald-700/60 pb-2.5">
                <span className="text-xs font-extrabold text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  ملخص رحلتك المخصصة
                </span>
                <span className="text-[10px] bg-emerald-800 dark:bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-100 font-bold">
                  تخطيط ذكي
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-bold pt-1">
                <div className="flex items-center gap-2 text-emerald-50">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>الوجهة: <span className="text-white font-black">{resolvedDestinationName}</span></span>
                </div>

                <div className="flex items-center gap-2 text-emerald-50">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>المدة: <span className="text-white font-black">{durationDays} {durationDays === 1 ? 'يوم' : 'أيام'}</span></span>
                </div>

                <div className="flex items-center gap-2 text-emerald-50">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>نوع الرحلة: <span className="text-white font-black">{getTravelersText()}</span></span>
                </div>

                {(setupData?.preferences.weather ?? true) && (
                  <div className="flex items-center gap-2 text-emerald-50">
                    <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>تمت مراعاة الطقس</span>
                  </div>
                )}

                {(setupData?.preferences.prayer ?? true) && (
                  <div className="flex items-center gap-2 text-emerald-50">
                    <Moon className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>تمت مراعاة أوقات الصلاة</span>
                  </div>
                )}

                {(setupData?.preferences.traffic ?? true) && (
                  <div className="flex items-center gap-2 text-emerald-50">
                    <Navigation className="w-4 h-4 text-blue-300 shrink-0" />
                    <span>تم تحسين المسار</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Banner */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="bg-emerald-600 dark:bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-right"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">✨ تم إعداد خطتك بنجاح</h3>
                  <p className="text-xs text-emerald-100 font-bold">🚀 رحلتك جاهزة</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-lg">جاري التحويل...</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
