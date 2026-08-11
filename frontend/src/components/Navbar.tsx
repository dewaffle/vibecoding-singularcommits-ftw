import React, { useState } from 'react';
import { ScreenState } from '../types';
import { Compass, Sparkles, PlusCircle, Sun, Moon, Globe, User, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  onReset: () => void;
  onSimulateContextChange?: () => void;
  hasAlternativePlan?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onReset,
  onSimulateContextChange,
  hasAlternativePlan,
  theme = 'light',
  onToggleTheme
}) => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border-b border-gray-100 dark:border-[#2A2A2A] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <button 
          onClick={onReset}
          className="flex items-center gap-3 group text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl p-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-800 transition-all duration-300">
            <Compass className="w-6 h-6 transition-transform group-hover:rotate-45 duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-gray-950 dark:text-white">
                رحّال
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                مساعد AI
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
              مساعد التخطيط الذكي للرحلات والزيارات
            </p>
          </div>
        </button>

        {/* Center Step Pills */}
        <div className="hidden md:flex items-center gap-1 bg-gray-50 dark:bg-[#1B1B1B] p-1.5 rounded-2xl border border-gray-100 dark:border-[#2A2A2A]">
          <button
            onClick={() => onNavigate('welcome')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              currentScreen === 'welcome'
                ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            الرئيسية
          </button>
          
          <button
            onClick={() => onNavigate('setup')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              currentScreen === 'setup'
                ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            إعداد الرحلة
          </button>

          {(currentScreen === 'plan' || currentScreen === 'alternative') && (
            <button
              onClick={() => onNavigate('plan')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                currentScreen === 'plan' || currentScreen === 'alternative'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              الجدول اليومي
            </button>
          )}
        </div>

        {/* Actions & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Toggle Placeholder */}
          <button
            onClick={() => setLang(l => (l === 'ar' ? 'en' : 'ar'))}
            title="تغيير اللغة (تطوير مستقبلي)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1B1B1B] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828] text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95"
          >
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>{lang === 'ar' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1B1B1B] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828] transition-all flex items-center justify-center active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>
          )}

          {/* Profile Placeholder */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(p => !p)}
              title="الملف الشخصي"
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1B1B1B] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#282828] transition-all flex items-center justify-center active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#1B1B1B] border border-gray-100 dark:border-[#2A2A2A] rounded-2xl shadow-xl p-3 z-50 text-right text-xs space-y-2">
                <div className="p-2 border-b border-gray-100 dark:border-[#2A2A2A]">
                  <p className="font-bold text-gray-900 dark:text-white">زائر رحّال</p>
                  <p className="text-[10px] text-gray-400">حساب افتراضي</p>
                </div>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-right p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 font-semibold"
                >
                  رحلاتي المحفوظة
                </button>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-right p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#222222] text-gray-700 dark:text-gray-300 font-semibold"
                >
                  الإعدادات والتفضيلات
                </button>
              </div>
            )}
          </div>

          {currentScreen === 'plan' && onSimulateContextChange && (
            <button
              onClick={onSimulateContextChange}
              title="محاكاة تغير حالة الطقس أو المرور لتوليد خطة بديلة"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">محاكاة الطقس والمرور</span>
              <span className="sm:hidden">تحديث</span>
            </button>
          )}

          {currentScreen !== 'welcome' && currentScreen !== 'setup' && (
            <button
              onClick={() => onNavigate('setup')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>رحلة جديدة</span>
            </button>
          )}

          {currentScreen === 'welcome' && (
            <button
              onClick={() => onNavigate('setup')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40"
            >
              <span>ابدأ رحلتك</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

