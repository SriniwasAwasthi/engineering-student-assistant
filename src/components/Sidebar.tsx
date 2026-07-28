import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarRange,
  BookOpen,
  Briefcase,
  Lightbulb,
  Milestone,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  collapsed,
  setCollapsed
}) => {
  const { theme, toggleTheme, userProfile } = useApp();

  const menuItems = [
    { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
    { id: 'planner', name: 'Study Planner', icon: BookOpen },
    { id: 'companion', name: 'College', icon: GraduationCap },
    { id: 'placement', name: 'Placement', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: Lightbulb },
    { id: 'roadmap', name: 'Career', icon: Milestone }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-slate-50 dark:bg-slate-dark-bg border-r border-slate-200 dark:border-slate-card-border text-slate-600 dark:text-slate-400 transition-all duration-300 z-10 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-card-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-indigo-primary text-white shrink-0 animate-glow">
              <GraduationCap size={22} />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight whitespace-nowrap">
                Engineering
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition duration-200"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Mini Profile */}
        {!collapsed && userProfile && (
          <div className="mx-4 my-6 p-4 rounded-2xl bg-slate-200/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-card-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-primary to-orange-accent flex items-center justify-center font-bold text-white text-base shadow-md">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{userProfile.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.branch} | Sem {userProfile.semester}</div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-primary text-white shadow-lg shadow-indigo-600/10'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-505 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'} />
                {!collapsed && <span className="truncate font-sans font-bold">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Theme Toggle & Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-card-border space-y-2">
          {/* Settings button */}
          <button
            onClick={() => setActiveScreen('settings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-250 ${
              activeScreen === 'settings'
                ? 'bg-indigo-primary text-white shadow-lg shadow-indigo-600/10'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings size={20} className={activeScreen === 'settings' ? 'text-white' : 'text-slate-550 dark:text-slate-400'} />
            {!collapsed && <span className="font-sans font-bold">Settings</span>}
          </button>

          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-200/20 dark:bg-slate-800/20 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition duration-200`}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={18} className="text-amber-400" />
                {!collapsed && <span className="font-sans font-bold">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon size={18} className="text-indigo-400" />
                {!collapsed && <span className="font-sans font-bold">Dark Mode</span>}
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-50 dark:bg-slate-dark-bg border-t border-slate-200 dark:border-slate-card-border flex justify-around items-center py-2 px-1 z-20 shadow-2xl">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition duration-200 ${
                isActive ? 'text-indigo-primary dark:text-indigo-secondary' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-sans font-bold tracking-tight">{item.name}</span>
            </button>
          );
        })}
        {/* Mobile Settings Icon */}
        <button
          onClick={() => setActiveScreen('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition duration-200 ${
            activeScreen === 'settings' ? 'text-indigo-primary dark:text-indigo-secondary' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-sans font-bold tracking-tight">Settings</span>
        </button>
      </nav>
    </>
  );
};
export default Sidebar;
