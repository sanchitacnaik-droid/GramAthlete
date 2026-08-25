import React, { useState } from 'react';
import { Student, NavTab } from '../types';
import { referToScout } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { 
  IdCard, 
  Printer, 
  Share2, 
  TrendingUp, 
  Trophy, 
  Award, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  School,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AthletePassportProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
  onStudentUpdated: (student: Student) => void;
}

export const AthletePassportView: React.FC<AthletePassportProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  setCurrentTab,
  onStudentUpdated
}) => {
  const currentStudent = selectedStudent || students.find(s => s.name === 'Ravi Kumar') || students[0];
  const [isShared, setIsShared] = useState(currentStudent?.isReferredToScout || false);

  if (!currentStudent) return null;

  const latestAss = currentStudent.latestAssessment;
  const result = latestAss?.result;
  const metrics = result?.metrics;
  const bestSport = result?.bestSport;
  const obs = currentStudent.teacherObservation;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWithScout = () => {
    const updated = referToScout(currentStudent.id);
    onStudentUpdated(updated);
    setIsShared(true);
    addNotification({
      title: 'Passport Shared with Scout',
      message: `Digital Athlete Passport for ${currentStudent.name} (${currentStudent.id}) sent to Karnataka Scout Network.`,
      type: 'scout'
    });
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <IdCard className="w-3.5 h-3.5" />
            <span>Verified Digital Sports Credential</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Athlete Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official verifiable talent passport for sports hostel admissions and scout reviews.
          </p>
        </div>

        {/* Switcher & Print Button */}
        <div className="flex items-center gap-2">
          <select
            value={currentStudent.id}
            onChange={(e) => {
              const found = students.find(s => s.id === e.target.value);
              if (found) {
                onSelectStudent(found);
                setIsShared(found.isReferredToScout || false);
              }
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white font-medium shadow-xs"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Download / Print</span>
          </button>
        </div>
      </div>

      {/* THE DIGITAL ATHLETE PASSPORT CARD */}
      <div className="passport-card bg-white rounded-3xl border-2 border-emerald-600/30 shadow-xl overflow-hidden relative">
        
        {/* Passport Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 text-white p-6 sm:p-7 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-emerald-200">
                  Government of Karnataka • Rural Sports Discovery
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">ATHLETE PASSPORT</h2>
              </div>
            </div>

            {/* Passport ID & Status Seal */}
            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-emerald-200 uppercase font-mono tracking-wider">Athlete ID</div>
                <div className="font-mono font-black text-base sm:text-lg text-white bg-black/20 px-3 py-0.5 rounded-lg border border-white/20">
                  {currentStudent.id}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-md text-center leading-tight">
                SEAL<br/>VERIFIED
              </div>
            </div>
          </div>

        </div>

        {/* Passport Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Athlete Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {currentStudent.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">{currentStudent.name}</h3>
                  {currentStudent.isRisingTalent && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                      🚀 Rising Talent (+{currentStudent.overallImprovementRate}%)
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><School className="w-3.5 h-3.5 text-slate-400" /> {currentStudent.school}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentStudent.village}, {currentStudent.district}</span>
                  <span>•</span>
                  <span>Age: <strong className="text-slate-900">{currentStudent.age}</strong></span>
                </div>
              </div>
            </div>

            {/* Potential Score Seal */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl self-start sm:self-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-700 leading-none">
                  {result?.overallScore || 87}
                </div>
                <div className="text-[10px] font-bold text-emerald-800 mt-0.5">/ 100 POTENTIAL</div>
              </div>
              <div className="border-l border-emerald-200 pl-3">
                <span className="text-[11px] font-black uppercase text-white bg-emerald-600 px-2 py-0.5 rounded">
                  {result?.potentialCategory || 'HIGH POTENTIAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Differentiators Grid: Best Sport + Measurements + Radar/Bars */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Left: Recommended Sport & Body Profile */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  AI Recommended Sport Match
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-extrabold text-emerald-800">
                    {bestSport?.sport || 'Athletics'}
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {bestSport?.matchPercentage || 92}% Match
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  Matches physical characteristics for speed acceleration, vertical elasticity & explosive power.
                </p>
              </div>

              {/* Physical Profile Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Height:</span>
                  <div className="font-bold text-slate-900 text-sm">{currentStudent.height} cm</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Weight:</span>
                  <div className="font-bold text-slate-900 text-sm">{currentStudent.weight} kg</div>
                </div>
              </div>

              {/* Latest Assessment Details Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Latest Assessment Method
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {latestAss?.assessmentType === 'video' ? '🎥 Video Assessment' : '⌨️ Manual Assessment'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-800 font-bold">
                  <span>Activity Evaluated:</span>
                  <span className="text-emerald-900">{latestAss?.videoMetadata?.activityDetected || '100m Sprint'}</span>
                </div>
                {latestAss?.videoMetadata?.confidence && (
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>AI Video Confidence:</span>
                    <span className="text-emerald-700 font-bold">{latestAss.videoMetadata.confidence}%</span>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
                <div className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Recorded Achievements</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  {currentStudent.previousAchievement || 'School 100m — 1st place | Taluk Athletics — 2nd place'}
                </p>
              </div>
            </div>

            {/* Right: Fitness Metrics Progress Bars */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Fitness Capability Index
                </div>
                <span className="text-[10px] text-slate-400 font-medium">SAI Norms</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Speed (30m Sprint: {latestAss?.input.sprint30m || 4.6}s)</span>
                    <span className="text-emerald-700">{metrics?.speed || 92} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${metrics?.speed || 92}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Power (Broad Jump: {latestAss?.input.broadJump || 2.15}m)</span>
                    <span className="text-emerald-700">{metrics?.power || 88} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${metrics?.power || 88}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Endurance (800m Run)</span>
                    <span className="text-emerald-700">{metrics?.endurance || 74} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metrics?.endurance || 74}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Strength (Pushups/Situps)</span>
                    <span className="text-emerald-700">{metrics?.strength || 81} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${metrics?.strength || 81}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Teacher Observation Verification Note */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Verified PE Teacher Observation</span>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{obs?.comment || 'Student consistently performs well during school athletics and shows strong motivation to improve.'}"
              </p>
            </div>

            {/* QR Simulation */}
            <div className="shrink-0 flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 self-start sm:self-auto shadow-2xs">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                SCAN TO<br/>VERIFY ID
              </div>
            </div>
          </div>

          {/* Passport Watermark Footer */}
          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
            GramAthlete Network ID: {currentStudent.id} • Karnataka Pilot Cluster • Decision Support System
          </div>

        </div>

      </div>

      {/* Passport Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        
        <button
          onClick={() => setCurrentTab('progress')}
          className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4 text-slate-600" />
          <span>View Progress History</span>
        </button>

        <div className="flex items-center gap-2">
          {isShared ? (
            <div className="px-5 py-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs sm:text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Shared with Karnataka Scout Pool</span>
            </div>
          ) : (
            <button
              onClick={handleShareWithScout}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Passport with Scout</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
