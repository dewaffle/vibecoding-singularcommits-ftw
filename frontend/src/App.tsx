/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, TripSetupData, TripPlan } from './types';
import { fetchOrGenerateTripPlan } from './utils/apiClient';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TripSetupScreen } from './components/TripSetupScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { DailyPlanScreen } from './components/DailyPlanScreen';
import { AlternativePlanModal } from './components/AlternativePlanModal';
import { SAMPLE_RIYADH_PLAN } from './data/mockPlans';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('welcome');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('riyadh');
  const [pendingSetupData, setPendingSetupData] = useState<TripSetupData | null>(null);
  
  // Dark mode theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rahhal_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rahhal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active Generated Plan
  const [currentTripPlan, setCurrentTripPlan] = useState<TripPlan>(SAMPLE_RIYADH_PLAN);

  // Alternative Plan States
  const [isAlternativeModalOpen, setIsAlternativeModalOpen] = useState<boolean>(false);
  const [isAlternativeApplied, setIsAlternativeApplied] = useState<boolean>(false);

  // The loading screen's animation runs on its own fixed timer (cosmetic),
  // while the real trip plan — potentially a live AI call — resolves on its
  // own schedule. We only navigate to the plan screen once BOTH are done,
  // so a slow AI response never gets cut off by the animation finishing first.
  const [isAnimationDone, setIsAnimationDone] = useState<boolean>(false);
  const [isPlanDataReady, setIsPlanDataReady] = useState<boolean>(false);

  useEffect(() => {
    if (isAnimationDone && isPlanDataReady) {
      setIsAlternativeApplied(false);
      setCurrentScreen('plan');
    }
  }, [isAnimationDone, isPlanDataReady]);

  // Navigation handlers
  const handleStartJourney = (destinationId?: string) => {
    if (destinationId) {
      setSelectedDestinationId(destinationId);
    }
    setCurrentScreen('setup');
  };

  const handleGeneratePlan = (setupData: TripSetupData) => {
    setPendingSetupData(setupData);
    setIsAnimationDone(false);
    setIsPlanDataReady(false);
    setCurrentScreen('loading');

    fetchOrGenerateTripPlan(setupData)
      .then((plan) => {
        setCurrentTripPlan(plan);
        setIsPlanDataReady(true);
      })
      .catch(() => {
        // fetchOrGenerateTripPlan already falls back internally, but as a
        // last resort keep whatever plan was already loaded rather than
        // leaving the app stuck on the loading screen forever.
        setIsPlanDataReady(true);
      });
  };

  const handleLoadingAnimationComplete = () => {
    setIsAnimationDone(true);
  };

  // Simulate Weather/Traffic change for Hackathon Demo Trigger
  const handleSimulateContextChange = () => {
    setIsAlternativeModalOpen(true);
  };

  const handleApplyAlternative = () => {
    if (currentTripPlan.alternativePlans && currentTripPlan.alternativePlans.length > 0) {
      setCurrentTripPlan(prev => ({
        ...prev,
        dailyPlans: prev.alternativePlans || prev.dailyPlans,
        hasAlternativePlan: false
      }));
    }
    setIsAlternativeApplied(true);
    setIsAlternativeModalOpen(false);
  };

  const handleReset = () => {
    setCurrentScreen('welcome');
    setIsAlternativeApplied(false);
    setIsAlternativeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] text-[#111827] dark:text-[#F9FAFB] font-['IBM_Plex_Sans_Arabic',sans-serif] dir-rtl selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200">
      
      {/* Top Fixed Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onReset={handleReset}
        onSimulateContextChange={handleSimulateContextChange}
        hasAlternativePlan={currentTripPlan.hasAlternativePlan}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content View Switcher */}
      <main>
        {currentScreen === 'welcome' && (
          <WelcomeScreen onStart={handleStartJourney} />
        )}

        {currentScreen === 'setup' && (
          <TripSetupScreen
            initialDestinationId={selectedDestinationId}
            onGeneratePlan={handleGeneratePlan}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'loading' && (
          <LoadingScreen
            setupData={pendingSetupData}
            destinationName={currentTripPlan.destinationName || 'المملكة'}
            onComplete={handleLoadingAnimationComplete}
          />
        )}

        {(currentScreen === 'plan' || currentScreen === 'alternative') && (
          <DailyPlanScreen
            tripPlan={currentTripPlan}
            onShowAlternative={() => setIsAlternativeModalOpen(true)}
            isAlternativeApplied={isAlternativeApplied}
          />
        )}
      </main>

      {/* Alternative Plan Modal (Screen 5) */}
      <AlternativePlanModal
        isOpen={isAlternativeModalOpen}
        tripPlan={currentTripPlan}
        onApplyAlternative={handleApplyAlternative}
        onClose={() => setIsAlternativeModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="bg-white dark:bg-[#1B1B1B] border-t border-gray-100 dark:border-[#2A2A2A] py-8 px-4 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2 no-print transition-colors">
        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
          رحّال — المخطط الذكي للرحلات والزيارات في المملكة العربية السعودية
        </div>
        <p className="max-w-md mx-auto text-gray-400 dark:text-gray-500">
          تطبيق استعراضي أولي للابتكار والسياحة • مصمم بأعلى معايير تجربة المستخدم واللغة العربية
        </p>
      </footer>

    </div>
  );
}
