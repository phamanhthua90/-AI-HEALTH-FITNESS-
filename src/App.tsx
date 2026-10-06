/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProfileView } from './components/ProfileView';
import { MealPlanView } from './components/MealPlanView';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { AIEvaluationView } from './components/AIEvaluationView';
import { AIChatbotFullView } from './components/AIChatbotFullView';
import { AIChatbotModal } from './components/AIChatbotModal';
import { Footer } from './components/Footer';
import {
  initialProfile,
  initialMetrics,
  initialAdvice,
  initial7DaysMeals,
  initial4WeeksPlan,
} from './data/initialData';
import { UserProfile, ProfileMetrics, AIAdvice, DayMealPlan, WeekWorkoutPlan } from './types';
import { MessageCircleHeart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('intro');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [metrics, setMetrics] = useState<ProfileMetrics>(initialMetrics);
  const [advice, setAdvice] = useState<AIAdvice>(initialAdvice);
  const [meals, setMeals] = useState<DayMealPlan[]>(initial7DaysMeals);
  const [workoutPlan, setWorkoutPlan] = useState<WeekWorkoutPlan[]>(initial4WeeksPlan);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        openChatbot={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'intro' && (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab)}
            profile={profile}
            metrics={metrics}
            openChatbot={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            setProfile={setProfile}
            metrics={metrics}
            setMetrics={setMetrics}
            advice={advice}
            setAdvice={setAdvice}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'meals' && (
          <MealPlanView
            meals={meals}
            setMeals={setMeals}
            profile={profile}
            metrics={metrics}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutPlanView
            workoutPlan={workoutPlan}
            setWorkoutPlan={setWorkoutPlan}
            profile={profile}
          />
        )}

        {activeTab === 'ai-eval' && <AIEvaluationView />}

        {activeTab === 'chatbot' && (
          <AIChatbotFullView
            profile={profile}
            metrics={metrics}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Floating Chatbot Launch Button (visible when chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Trò chuyện cùng AI Health Coach"
          aria-label="Mở trợ lý AI"
        >
          <div className="relative">
            <MessageCircleHeart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-600 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Trợ lý AI</span>
        </button>
      )}

      {/* AI Health Coach Chatbot Modal / Drawer */}
      <AIChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={profile}
        metrics={metrics}
      />
    </div>
  );
}
