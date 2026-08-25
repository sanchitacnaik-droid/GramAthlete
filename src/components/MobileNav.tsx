import React from 'react';
import { NavTab } from '../types';
import { 
  Home, 
  Users, 
  Video,
  Activity, 
  Sparkles, 
  TrendingUp, 
  IdCard, 
  Search, 
  BarChart3 
} from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'video-assessment', label: 'Video', icon: <Video className="w-4 h-4 text-emerald-600" /> },
    { id: 'fitness-test', label: 'Manual', icon: <Activity className="w-4 h-4" /> },
    { id: 'ai-result', label: 'AI Result', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'passport', label: 'Passport', icon: <IdCard className="w-4 h-4" /> },
    { id: 'scout', label: 'Scout', icon: <Search className="w-4 h-4" /> },
    { id: 'talent-overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 no-print shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
        {tabs.map(tab => {
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all ${
                active 
                  ? 'text-emerald-700 bg-emerald-50 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`${active ? 'scale-110 text-emerald-600' : ''} transition-transform`}>
                {tab.icon}
              </div>
              <span className="truncate w-full text-center mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
