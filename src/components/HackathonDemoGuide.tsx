import React, { useState } from 'react';
import { NavTab, UserRole, Student } from '../types';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  X, 
  Play, 
  Activity, 
  IdCard, 
  TrendingUp, 
  Search, 
  Building 
} from 'lucide-react';

interface HackathonDemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  setCurrentRole: (role: UserRole) => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const HackathonDemoGuide: React.FC<HackathonDemoGuideProps> = ({
  isOpen,
  onClose,
  setCurrentTab,
  setCurrentRole,
  students,
  onSelectStudent
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Landing Page & Mission',
      role: 'teacher' as UserRole,
      tab: 'home' as NavTab,
      description: 'Highlight the mission: "Talent Exists Everywhere. Opportunity Doesn\'t." Show the video-based AI biomechanical assessment and zero-cost manual backup.',
      actionLabel: 'Go to Landing Page'
    },
    {
      step: 2,
      title: 'PE Teacher Home',
      role: 'teacher' as UserRole,
      tab: 'home' as NavTab,
      description: 'Show simple dashboard with 🎥 Video Assessment action card and ⌨️ Manual Assessment backup.',
      actionLabel: 'Open PE Teacher Home'
    },
    {
      step: 3,
      title: '🎥 Video Fitness Assessment (CASE A — Sports Video)',
      role: 'teacher' as UserRole,
      tab: 'video-assessment' as NavTab,
      description: 'Select Ravi Kumar. Choose 🏃 100m Sprint. Click "Analyze Video". System extracts 6 frames (0% to 100%) -> Confirms ✅ SPORTS VIDEO DETECTED (92% Conf) -> Click "Continue to Fitness Analysis" -> Score 87/100 -> Athletics 92%.',
      actionLabel: 'Launch Video Assessment for Ravi'
    },
    {
      step: 4,
      title: '❌ Non-Sports Rejection (CASE B — Strict Stop)',
      role: 'teacher' as UserRole,
      tab: 'video-assessment' as NavTab,
      description: 'Choose "🏫 Classroom" or "🛋️ Sitting" demo video. Click "Analyze Video". System inspects frames, identifies non-athletic static posture, and strictly halts with ❌ NOT A SPORTS VIDEO card without computing fitness score.',
      actionLabel: 'Test Non-Sports Video Rejection'
    },
    {
      step: 5,
      title: '⌨️ Manual Assessment Backup',
      role: 'teacher' as UserRole,
      tab: 'fitness-test' as NavTab,
      description: 'Show alternative zero-cost stopwatch & tape test entry (30m Sprint: 4.6s, Broad Jump: 2.15m).',
      actionLabel: 'Inspect Manual Assessment'
    },
    {
      step: 6,
      title: 'AI Analysis & Sport Match',
      role: 'teacher' as UserRole,
      tab: 'ai-result' as NavTab,
      description: 'Show 87/100 High Potential, 5 fitness progress bars, Athletics 92% match with "Why this sport?" reasoning and teacher observation.',
      actionLabel: 'View AI Result & Sport Match'
    },
    {
      step: 7,
      title: 'Progress & Rising Talent 🚀',
      role: 'teacher' as UserRole,
      tab: 'progress' as NavTab,
      description: 'Show progression line chart (+16.2% improvement from 72 to 87), 🚀 Rising Talent badge, and 30-Day Growth Plan.',
      actionLabel: 'Inspect Progress & 30-Day Plan'
    },
    {
      step: 8,
      title: 'Athlete Passport (Video Certified)',
      role: 'student' as UserRole,
      tab: 'passport' as NavTab,
      description: 'Display verified digital Athlete Passport showing "Latest Assessment: 🎥 Video Assessment • 100m Sprint", GA-2026-00482 ID, and "Share with Scout".',
      actionLabel: 'Open Athlete Passport'
    },
    {
      step: 9,
      title: 'Scout Discovery & Trial Invite',
      role: 'scout' as UserRole,
      tab: 'scout' as NavTab,
      description: 'Switch to Scout role. Filter Athletics >= 85, view Ravi Kumar with 🎥 100m Sprint badge, shortlist, and dispatch trial invitation.',
      actionLabel: 'Switch to Scout Hub'
    },
    {
      step: 10,
      title: 'Karnataka Talent Overview',
      role: 'admin' as UserRole,
      tab: 'talent-overview' as NavTab,
      description: 'Switch to Government Admin. View aggregate video assessments, high potential counts, and district talent clusters across Karnataka.',
      actionLabel: 'View State Overview'
    }
  ];

  const current = demoSteps[currentStep];

  const handleExecuteStep = (index: number) => {
    const s = demoSteps[index];
    setCurrentStep(index);
    setCurrentRole(s.role);
    setCurrentTab(s.tab);

    const ravi = students.find(std => std.name === 'Ravi Kumar') || students[0];
    if (ravi) onSelectStudent(ravi);
  };

  return (
    <div className="fixed bottom-14 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-emerald-500/40 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              3-Min Hackathon Demo Guide
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Step {currentStep + 1} / {demoSteps.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-300">
              0{current.step}. {current.title}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Action Button for Current Step */}
        <button
          onClick={() => handleExecuteStep(currentStep)}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{current.actionLabel}</span>
        </button>

        {/* Navigation Step Indicators & Prev/Next */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
          <button
            disabled={currentStep === 0}
            onClick={() => handleExecuteStep(currentStep - 1)}
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center gap-1 cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1">
            {demoSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteStep(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? 'bg-emerald-400 w-4' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentStep === demoSteps.length - 1}
            onClick={() => handleExecuteStep(currentStep + 1)}
            className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:hover:text-emerald-400 flex items-center gap-1 cursor-pointer font-bold"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
