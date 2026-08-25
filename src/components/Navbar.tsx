import React, { useState } from 'react';
import { 
  UserRole, 
  NavTab, 
  AppNotification, 
  SyncQueueItem 
} from '../types';
import { 
  Trophy, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  User, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  syncQueue: SyncQueueItem[];
  onSyncNow: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenOpportunities: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  isOffline,
  setIsOffline,
  syncQueue,
  onSyncNow,
  notifications,
  onOpenOpportunities
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifsDropdown, setShowNotifsDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncNow();
      setIsSyncing(false);
    }, 600);
  };

  const navItems: { id: NavTab; label: string; iconEmoji?: string; roles?: UserRole[] }[] = [
    { id: 'home', label: 'Home' },
    { id: 'students', label: 'Students' },
    { id: 'video-assessment', label: '🎥 Video Assessment' },
    { id: 'fitness-test', label: '⌨️ Manual Assessment' },
    { id: 'ai-result', label: 'AI Results' },
    { id: 'progress', label: 'Progress' },
    { id: 'passport', label: 'Athlete Passport' },
    { id: 'scout', label: 'Scout' },
    { id: 'talent-overview', label: 'Talent Overview' },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    teacher: { label: 'PE Teacher', badge: 'Rural School', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    scout: { label: 'Scout', badge: 'Talent Search', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    admin: { label: 'Govt Admin', badge: 'State Sports Cell', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    student: { label: 'Student', badge: 'Athlete View', color: 'bg-amber-100 text-amber-800 border-amber-300' }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner / Accessibility Ribbon */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1 text-xs flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">GramAthlete</span>
          <span className="hidden sm:inline text-slate-400">| Rural Athlete Discovery & Growth Network</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenOpportunities}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sports Opportunities</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Karnataka Pilot</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Gram<span className="text-emerald-600">Athlete</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Rural
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5 font-medium">Discovery & Growth Network</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    active 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Offline Toggle + Role Switcher + Notifs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Offline Mode Simulator Indicator */}
            <div className="flex items-center">
              {isOffline ? (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="hidden md:inline">Offline Mode</span>
                  <span className="md:hidden">Offline</span>
                  {syncQueue.length > 0 && (
                    <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                      {syncQueue.length} pending
                    </span>
                  )}
                  <button
                    onClick={handleSyncClick}
                    disabled={isSyncing}
                    title="Sync saved data to server"
                    className="ml-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Sync</span>
                  </button>
                  <button
                    onClick={() => setIsOffline(false)}
                    className="text-amber-700 hover:text-amber-900 text-[10px] underline ml-1 cursor-pointer"
                    title="Switch back to online"
                  >
                    Go Online
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsOffline(true)}
                  title="Click to test rural offline mode simulation"
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Online</span>
                </button>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${roleLabels[currentRole].color}`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="font-semibold">{roleLabels[currentRole].label}</span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">▼</span>
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Role (Demo)
                  </div>
                  {(['teacher', 'scout', 'admin', 'student'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        currentRole === role ? 'font-bold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{roleLabels[role].label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{roleLabels[role].badge}</span>
                      </div>
                      {currentRole === role && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifsDropdown(!showNotifsDropdown)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifsDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setShowNotifsDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">Notifications</span>
                    <span className="text-[11px] text-emerald-600 font-medium">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 uppercase px-3 py-1">Navigation</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button 
              onClick={() => {
                onOpenOpportunities();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Sports Opportunities</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
