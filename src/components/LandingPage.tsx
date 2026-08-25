import React from 'react';
import { UserRole, NavTab } from '../types';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Target, 
  Compass, 
  Activity, 
  FileSpreadsheet, 
  Search, 
  IdCard,
  Building,
  School,
  ChevronRight,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: NavTab) => void;
  setCurrentRole: (role: UserRole) => void;
  onQuickStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentTab,
  setCurrentRole,
  onQuickStartDemo
}) => {
  const handleRoleSelect = (role: UserRole, targetTab: NavTab) => {
    setCurrentRole(role);
    setCurrentTab(targetTab);
  };

  const steps = [
    { title: 'Upload Video', desc: 'Athlete activity recording', icon: <Activity className="w-5 h-5 text-emerald-600" /> },
    { title: 'Check Sports', desc: 'Validates sports movement', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
    { title: 'AI Analysis', desc: 'Pose & measurement extraction', icon: <Sparkles className="w-5 h-5 text-emerald-600" /> },
    { title: 'Fitness Score', desc: 'Speed, Power, Agility (87/100)', icon: <Zap className="w-5 h-5 text-emerald-600" /> },
    { title: 'Sport Match', desc: 'Athletics, Volleyball, etc.', icon: <Target className="w-5 h-5 text-emerald-600" /> },
    { title: 'Passport', desc: 'Verified digital sports ID', icon: <IdCard className="w-5 h-5 text-emerald-600" /> },
    { title: 'Progress', desc: '🚀 Rising Talent acceleration', icon: <TrendingUp className="w-5 h-5 text-emerald-600" /> },
    { title: 'Scout Trial', desc: 'District trials & SAI camps', icon: <Award className="w-5 h-5 text-emerald-600" /> },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-18 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 rounded-3xl border border-emerald-100/70 p-6 sm:p-12 shadow-sm">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-green-200/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* Pilot Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Karnataka Rural Sports Discovery Pilot</span>
            <span className="text-emerald-700 font-normal">| AI Video Analysis + Manual Backup</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
            Talent Exists Everywhere. <br className="hidden sm:inline" />
            <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">Opportunity Doesn't.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            GramAthlete discovers rural sporting talent through AI video movement analysis, physical fitness validation, and grassroots scout discovery.
          </p>

          {/* Secondary Message Tagline */}
          <div className="text-sm font-semibold tracking-widest text-emerald-800 uppercase flex items-center justify-center gap-3 pt-1">
            <span>Discover</span> • <span>Develop</span> • <span>Connect</span> • <span>Rise</span>
          </div>

          {/* Action Buttons */}
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setCurrentRole('teacher');
                setCurrentTab('video-assessment');
              }}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <span>🎥 Video Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setCurrentRole('scout');
                setCurrentTab('scout');
              }}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Find Talent</span>
            </button>

            <button
              onClick={onQuickStartDemo}
              className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Launch 3-Min Hackathon Demo</span>
            </button>
          </div>

        </div>
      </section>

      {/* Visual Process Section */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How GramAthlete Works</h2>
          <p className="text-slate-500 text-sm">From a rural school measurement to district selection trials in 8 simple steps</p>
        </div>

        {/* Process Flow Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center relative group hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="text-[10px] font-bold text-emerald-700 mb-0.5">0{idx + 1}</div>
              <div className="font-bold text-xs text-slate-900 leading-snug">{step.title}</div>
              <div className="text-[10px] text-slate-500 mt-1">{step.desc}</div>
              
              {/* Arrow connector */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Key Difference: Traditional vs GramAthlete */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">The GramAthlete Difference</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Democratizing talent discovery without mandatory video uploads or costly equipment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Traditional Pipeline */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Traditional System</span>
                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-semibold">High Friction</span>
              </div>
              <div className="text-sm font-semibold text-slate-700">
                School → Expensive Travel → Selection Competition → Scout
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rural students miss out due to lack of travel funds, missed tournament notices, or lack of expensive video equipment.
              </p>
            </div>

            {/* GramAthlete Pipeline */}
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">GramAthlete Framework</span>
                <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-md font-semibold">Zero Cost Barrier</span>
              </div>
              <div className="text-sm font-bold text-emerald-950">
                School → Fitness Data → AI Sport Match → Rising Talent → Development → Scout → Opportunity
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                PE teachers use simple stopwatches & measuring tapes. Deterministic AI matches sports & flags rising talent right from the village school.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Demo Statistics Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Network Impact at a Glance</h3>
            <p className="text-xs text-slate-500">Aggregated discovery metrics across Karnataka rural pilot clusters</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>Demo Data</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,240</div>
            <div className="text-xs font-semibold text-slate-600">Students Tested</div>
            <div className="text-[10px] text-slate-400">Baseline measurements</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-1 bg-emerald-50/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">186</div>
            <div className="text-xs font-semibold text-emerald-900">High Potential</div>
            <div className="text-[10px] text-emerald-600">Score &ge; 85/100</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs text-center space-y-1 bg-amber-50/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">72</div>
            <div className="text-xs font-semibold text-amber-900">🚀 Rising Talent</div>
            <div className="text-[10px] text-amber-600">&gt;15% improvement</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs text-center space-y-1 bg-blue-50/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">38</div>
            <div className="text-xs font-semibold text-blue-900">Scout Referrals</div>
            <div className="text-[10px] text-blue-600">Trial invitations</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">24</div>
            <div className="text-xs font-semibold text-slate-600">Rural Schools</div>
            <div className="text-[10px] text-slate-400">6 Districts</div>
          </div>

        </div>
      </section>

      {/* Role Selection / Fast Login for Hackathon Demo */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            Prototype Demo Access
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">Fast Role Simulation</h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            Select a role to test the workflow from PE Teacher entry to Scout trial selection.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => handleRoleSelect('teacher', 'home')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <div className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
              Login as PE Teacher
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add students, record simple fitness values & generate AI Sport Matches.
            </p>
            <div className="text-xs text-emerald-400 font-semibold mt-3 flex items-center gap-1">
              Enter PE Dashboard →
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('scout', 'scout')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <div className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
              Login as Scout
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Filter rural talent by sport, score & rate of improvement. Invite to trials.
            </p>
            <div className="text-xs text-blue-400 font-semibold mt-3 flex items-center gap-1">
              Open Scout Hub →
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('admin', 'talent-overview')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <div className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
              Login as Govt Admin
            </div>
            <p className="text-xs text-slate-400 mt-1">
              View district-level talent distribution across Karnataka state.
            </p>
            <div className="text-xs text-purple-400 font-semibold mt-3 flex items-center gap-1">
              View State Overview →
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('student', 'passport')}
            className="p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center mb-3">
              <IdCard className="w-5 h-5" />
            </div>
            <div className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
              Login as Student
            </div>
            <p className="text-xs text-slate-400 mt-1">
              View digital Athlete Passport, 30-day growth plan and trial invitations.
            </p>
            <div className="text-xs text-amber-400 font-semibold mt-3 flex items-center gap-1">
              Open Athlete Passport →
            </div>
          </button>

        </div>
      </section>

    </div>
  );
};
