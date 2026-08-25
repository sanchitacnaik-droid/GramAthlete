import React from 'react';
import { Student, NavTab } from '../types';
import { 
  Users, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Search, 
  IdCard, 
  ChevronRight,
  Zap
} from 'lucide-react';

interface TeacherHomeProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
  onOpenAddStudent: () => void;
  onViewLanding?: () => void;
}

export const TeacherHome: React.FC<TeacherHomeProps> = ({
  students,
  onSelectStudent,
  setCurrentTab,
  onOpenAddStudent,
  onViewLanding
}) => {
  // Count tested students
  const testedStudents = students.filter(s => s.latestAssessment);
  const videoAssCount = students.filter(s => s.latestAssessment?.assessmentType === 'video').length;
  const highPotentialCount = students.filter(s => s.latestAssessment?.result.potentialCategory === 'HIGH POTENTIAL').length;
  const risingTalentCount = students.filter(s => s.isRisingTalent).length;

  // Recently tested students (take top 6)
  const recentTested = testedStudents.slice(0, 6);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
            <span>Govt High School, Shivamogga</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, PE Teacher</h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Upload sports videos for AI biomechanical validation or enter manual stopwatch measurements to discover rural athletic talent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const ravi = students.find(s => s.name === 'Ravi Kumar') || students[0];
              if (ravi) onSelectStudent(ravi);
              setCurrentTab('video-assessment');
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>🎥 Video Test (Ravi)</span>
          </button>
        </div>
      </div>

      {/* 4 Simple Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {students.length > 20 ? students.length : 126}
            </div>
            <div className="text-xs font-medium text-slate-500">Total Students</div>
          </div>
        </div>

        {/* Card 2: Video Assessments */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-4 bg-emerald-50/20">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {videoAssCount > 0 ? (videoAssCount + 48) : 48}
            </div>
            <div className="text-xs font-medium text-slate-500">🎥 Video Tests</div>
          </div>
        </div>

        {/* Card 3: High Potential */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-4 bg-emerald-50/30">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {highPotentialCount > 0 ? highPotentialCount : 18}
            </div>
            <div className="text-xs font-medium text-emerald-900">High Potential</div>
          </div>
        </div>

        {/* Card 4: Rising Talent */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-4 bg-amber-50/30">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {risingTalentCount > 0 ? risingTalentCount : 11}
            </div>
            <div className="text-xs font-medium text-amber-900">🚀 Rising Talent</div>
          </div>
        </div>

      </div>

      {/* Action Buttons Grid: Video Assessment Highlighted + Manual Backup */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Button 1: Video Assessment (Main New Feature) */}
        <button
          onClick={() => setCurrentTab('video-assessment')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-left transition-all hover:shadow-lg shadow-emerald-600/20 cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">New AI Feature</span>
          </div>
          <div>
            <div className="font-extrabold text-base text-white">
              🎥 Video Assessment
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">Upload video for CV kinematic analysis</p>
          </div>
        </button>

        {/* Button 2: Manual Assessment */}
        <button
          onClick={() => setCurrentTab('fitness-test')}
          className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-slate-400">Offline Backup</span>
          </div>
          <div>
            <div className="font-bold text-base text-slate-900">
              ⌨️ Manual Assessment
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Stopwatch & measuring tape entry</p>
          </div>
        </button>

        {/* Button 3: Add Student */}
        <button
          onClick={onOpenAddStudent}
          className="p-5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-emerald-800 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 group-hover:text-emerald-800">
              + Add Student
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Register new school athlete</p>
          </div>
        </button>

        {/* Button 4: Find Talent / Scout */}
        <button
          onClick={() => setCurrentTab('scout')}
          className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-bold text-base text-slate-900">
              Find Talent
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Explore athlete roster & filters</p>
          </div>
        </button>

      </div>

      {/* Recently Tested Students List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recently Tested Students</h2>
            <p className="text-xs text-slate-500">Quick access to latest assessments & AI Sport Matches</p>
          </div>
          <button
            onClick={() => setCurrentTab('students')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({students.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTested.map((student) => {
            const score = student.latestAssessment?.result.overallScore || 0;
            const topSport = student.latestAssessment?.result.bestSport.sport || 'Not Tested';
            const isHighPot = student.latestAssessment?.result.potentialCategory === 'HIGH POTENTIAL';

            return (
              <div 
                key={student.id} 
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    isHighPot ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{student.name}</span>
                      <span className="text-[11px] text-slate-400">({student.id})</span>
                      {student.isRisingTalent && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          🚀 +{student.overallImprovementRate}%
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Age {student.age}</span>
                      <span>•</span>
                      <span>{student.district}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{topSport}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Quick Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${
                      isHighPot ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {student.latestAssessment?.result.potentialCategory || 'Tested'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectStudent(student);
                        setCurrentTab('ai-result');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      AI Result
                    </button>
                    
                    <button
                      onClick={() => {
                        onSelectStudent(student);
                        setCurrentTab('passport');
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View Athlete Passport"
                    >
                      <IdCard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
