/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Shell } from './components/layout/Shell';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ScenarioLab } from './components/ScenarioLab';
import { BusinessHub } from './components/BusinessHub';
import { HabitLog } from './components/HabitLog';
import { Analytics } from './components/Analytics';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center gap-6 text-slate-900">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-black font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Policy Engine</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'lab': return <ScenarioLab />;
      case 'business': return <BusinessHub />;
      case 'habits': return <HabitLog />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
