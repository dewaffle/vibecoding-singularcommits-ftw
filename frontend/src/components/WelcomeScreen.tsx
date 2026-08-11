import React from 'react';
import { SAUDI_DESTINATIONS, Destination } from '../data/destinations';
import { Compass, ArrowLeft, Sun, Moon, Navigation, Accessibility, Sparkles, Clock, Utensils, Landmark, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onStart: (selectedDestinationId?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-[#111111] text-gray-900 dark:text-gray-100 pb-20 pt-4 sm:pt-8 px-4 sm:px-6 transition-colors duration-200 relative overflow-hidden">
      
      {/* Subtle Saudi-Inspired Ambient Background Grid & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 dark:opacity-20 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-amber-300/10 to-transparent blur-3xl"></div>
        
        {/* Subtle Saudi Geometric Pattern Overlay */}
        <svg className="w-full h-full opacity-[0.04] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-2 sm:pt-6">
          
          {/* AI Badge - Immediately communicates AI capability */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs font-extrabold shadow-xs backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>مساعدك الذكي بالذكاء الاصطناعي لتخطيط الرحلات</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.08]">
              رحّال
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 tracking-tight">
              خطط رحلتك في المملكة بذكاء واحترافية.
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              يبني لك جدولاً مخصصاً لزياراتك في المملكة يتكيف تلقائياً مع أحوال الطقس، مواقيت الصلاة، حركة المرور وسهولة الوصول لكبار السن والعائلات.
            </p>
          </motion.div>

          {/* Main CTA Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onStart()}
              className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-extrabold text-lg shadow-xl shadow-emerald-700/20 dark:shadow-emerald-900/40 hover:shadow-2xl hover:shadow-emerald-700/30 transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-98 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <span>ابدأ رحلتك الآن</span>
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
            </button>
          </motion.div>

        </div>

        {/* Capabilities Section - Premium Feature Cards */}
        <div className="space-y-6 pt-2">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 tracking-wider uppercase">
              قدرات التخطيط الذكي
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              لماذا يتفوق رحّال في ضبط جدولك؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1: Weather */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-amber-200/80 dark:hover:border-amber-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Sun className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    🌤 تخطيط يراعي الطقس
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    تكييف الأنشطة والأوقات تلقائياً مع أحوال الجو وتجنب الساعات الحارة.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Prayer */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-emerald-200/80 dark:hover:border-emerald-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Moon className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    🕌 مواعيد متناغمة مع الصلاة
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    تنسيق الفترات والاستراحات مع مواقيت الصلاة والمساجد القريبة بسهولة.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Traffic */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-blue-200/80 dark:hover:border-blue-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    🚗 تحسين المسارات والتردد
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    إعادة ترتيب الوجهات ذكياً لتفادي ساعات الذروة والازدحام المروري.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Accessibility */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-purple-200/80 dark:hover:border-purple-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Accessibility className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    ♿ سهولة الوصول الشاملة
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    ترشيح معالم مجهزة بالكامل لكبار السن وذوي المتطلبات الخاصة والأطفال.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 5: Food */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-orange-200/80 dark:hover:border-orange-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Utensils className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    🍽 ترشيحات المطاعم المتميزة
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    دمج تجارب الطهي المحلية والمطاعم الأصيلة ضمن جدولك اليومي.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 6: Tourist attractions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white dark:bg-[#1B1B1B] p-6 rounded-3xl border border-gray-100 dark:border-[#2A2A2A] shadow-xs hover:shadow-md hover:border-teal-200/80 dark:hover:border-teal-800/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base">
                    🏛 الوجهات والمعالم السياحية
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    اكتشاف المعالم والفعاليات الأنسب حسب طبيعة المسافر واهتماماته.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Featured Destinations Gallery */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200/80 dark:border-[#2A2A2A] pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 tracking-wider uppercase">
                وجهات سياحية مختارة
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                استكشف الوجهات البارزة في المملكة
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              انقر على أي وجهة للبدء التلقائي بالتخطيط
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAUDI_DESTINATIONS.map((dest: Destination, index: number) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                onClick={() => onStart(dest.id)}
                className="group relative bg-white dark:bg-[#1B1B1B] rounded-3xl border border-gray-100 dark:border-[#2A2A2A] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1 text-right"
              >
                {/* Large Image Header */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  <img 
                    src={dest.heroImage} 
                    alt={dest.nameAr}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/images/destinations/placeholder.svg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"></div>
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-900/80 dark:bg-emerald-950/90 text-emerald-100 backdrop-blur-md text-[11px] font-extrabold border border-emerald-500/30">
                    {dest.category}
                  </div>

                  {/* Weather Badge - Top Right */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-[11px] font-bold border border-white/20 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{dest.weatherAvg}</span>
                  </div>

                  {/* Title & Tagline Overlaid at Bottom of Image */}
                  <div className="absolute bottom-3 right-4 left-4 text-white space-y-0.5">
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">
                      {dest.nameAr}
                    </h3>
                    <p className="text-xs text-white/90 font-medium line-clamp-1">
                      {dest.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Short Authentic Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                    {dest.description}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-[#2A2A2A]">
                    {/* Best Visiting Season */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>أفضل وقت للزيارة: <strong className="text-gray-800 dark:text-gray-200">{dest.bestTime}</strong></span>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">تخطيط ذكي بنقرة واحدة</span>
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 group-hover:bg-emerald-700 text-emerald-800 dark:text-emerald-300 group-hover:text-white text-xs font-bold transition-all duration-300 shadow-2xs">
                        <span>استكشف الوجهة</span>
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works - Minimal Editorial Section */}
        <div className="bg-white dark:bg-[#1B1B1B] rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-[#2A2A2A] space-y-8 shadow-xs transition-colors">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 tracking-wider uppercase">
              آلية العمل الذكية
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              كيف يصنع رحّال خطتك المثالية؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            <div className="space-y-3 p-5 rounded-2xl bg-gray-50/70 dark:bg-[#222222] border border-gray-100 dark:border-[#2A2A2A]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                ١
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                إدخال تفاصيل رحلتك
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                حدد المدة، الوجهة، عدد المسافرين وتفضيلاتك الخاصة مثل مراعاة أوقات الصلاة والطقس وسهولة الوصول.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-gray-50/70 dark:bg-[#222222] border border-gray-100 dark:border-[#2A2A2A]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                ٢
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                تحليل مباشر بالذكاء الاصطناعي
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                نقوم بحساب مواعيد الصلاة الدقيقة، حالة الطرق، والمواقع المظللة لمنحك أفضل تسلسل للأماكن.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-gray-50/70 dark:bg-[#222222] border border-gray-100 dark:border-[#2A2A2A]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
                ٣
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                تكييف تلقائي مع التغيرات
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                في حال حدوث ارتفاع بالحرارة أو ازدحام مروري، يقترح عليك رحّال خيارات بديلة بلمسة واحدة.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

