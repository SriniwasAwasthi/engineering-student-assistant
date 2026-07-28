import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './screens/Dashboard';
import { StudyPlanner } from './screens/StudyPlanner';
import { CollegeCompanion } from './screens/CollegeCompanion';
import { PlacementPrep } from './screens/PlacementPrep';
import { ProjectGenerator } from './screens/ProjectGenerator';
import { CareerRoadmap } from './screens/CareerRoadmap';
import { Settings } from './screens/Settings';
import { Menu, GraduationCap, Moon, Sun } from 'lucide-react';

const AppContent: React.FC = () => {


  const { isOnboarded, theme, toggleTheme, userProfile } = useApp();
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sub-Tab Navigation States
  const [plannerActiveTab, setPlannerActiveTab] = useState<any>('tasks');
  const [companionActiveTab, setCompanionActiveTab] = useState<any>('schedule');
  const [placementActiveTab, setPlacementActiveTab] = useState<any>('challenge');

  if (!isOnboarded) {
    return <Onboarding />;
  }

  // Intercept navigation calls to parse sub-tabs
  const handleNavigate = (target: string) => {
    if (target.startsWith('companion-')) {
      const tab = target.replace('companion-', '');
      setCompanionActiveTab(tab);
      setActiveScreen('companion');
    } else if (target.startsWith('placement-')) {
      const tab = target.replace('placement-', '');
      setPlacementActiveTab(tab);
      setActiveScreen('placement');
    } else if (target.startsWith('planner-')) {
      const tab = target.replace('planner-', '');
      setPlannerActiveTab(tab);
      setActiveScreen('planner');
    } else {
      setActiveScreen(target);
    }
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard setActiveScreen={handleNavigate} />;
      case 'planner':
        return <StudyPlanner activeTab={plannerActiveTab} setActiveTab={setPlannerActiveTab} />;
      case 'companion':
        return <CollegeCompanion activeTab={companionActiveTab} setActiveTab={setCompanionActiveTab} />;
      case 'placement':
        return <PlacementPrep activeTab={placementActiveTab} setActiveTab={setPlacementActiveTab} />;
      case 'projects':
        return <ProjectGenerator />;
      case 'roadmap':
        return <CareerRoadmap />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveScreen={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Navigation drawer */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={handleNavigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main content body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg/80 backdrop-blur-md px-6 flex items-center justify-between z-10 select-none">
          <div className="flex items-center gap-3 md:hidden">
            <GraduationCap className="text-indigo-primary" size={24} />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight uppercase">
              Student Assistant
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-black text-slate-450 uppercase tracking-widest">Workspace Dashboard</span>
          </div>

          {/* Quick profile actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg/85 text-slate-500 dark:text-slate-400 transition"
              title="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {userProfile && (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-card-border pl-3">
                <div className="w-8 h-8 rounded-full bg-indigo-primary/10 text-indigo-primary flex items-center justify-center font-bold text-xs">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                  {userProfile.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic page screens rendering */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {


  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
