import React, { useState } from 'react';
import { Student, NavTab } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Play, 
  Award, 
  ChevronRight 
} from 'lucide-react';

interface ProgressViewProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  setCurrentTab
}) => {
  const currentStudent = selectedStudent || students.find(s => s.name === 'Ravi Kumar') || students[0];
  const [activeFilter, setActiveFilter] = useState<'improvement' | 'potential' | 'consistent' | 'new'>('improvement');
  const [planStarted, setPlanStarted] = useState(false);

  if (!currentStudent) return null;

  const assessments = currentStudent.assessments || [];
  
  // Chart Data
  const chartData = assessments.map((ass, idx) => ({
    name: ass.monthLabel || `Test ${idx + 1}`,
    score: ass.result.overallScore,
    speed: ass.result.metrics.speed,
    power: ass.result.metrics.power,
    sprint: ass.input.sprint30m,
    broadJump: ass.input.broadJump
  }));

  // Fallback demo points if only 1 assessment exists
  const displayChartData = chartData.length >= 2 ? chartData : [
    { name: 'Month 1', score: 72, sprint: 4.9, broadJump: 1.85 },
    { name: 'Month 2', score: 78, sprint: 4.8, broadJump: 1.95 },
    { name: 'Month 3', score: 84, sprint: 4.7, broadJump: 2.05 },
    { name: 'Month 4', score: currentStudent.latestAssessment?.result.overallScore || 87, sprint: 4.6, broadJump: 2.15 }
  ];

  const firstScore = displayChartData[0].score;
  const latestScore = displayChartData[displayChartData.length - 1].score;
  const currentRate = currentStudent.overallImprovementRate ?? 0;
  const improvementRate = currentRate > 0 
    ? currentRate 
    : parseFloat((((latestScore - firstScore) / (firstScore || 1)) * 100).toFixed(1));

  const isRising = Boolean(currentStudent.isRisingTalent || improvementRate >= 10);
  const plan = currentStudent.growthPlan;

  // Other students who are rising talent for quick comparison
  const risingTalentsList = students.filter(s => Boolean(s.isRisingTalent || (s.overallImprovementRate ?? 0) > 10)).slice(0, 4);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header & Student Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Growth & Longitudinal Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentStudent.name}'s Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentStudent.school} • {currentStudent.district} • Athlete ID: <span className="font-mono">{currentStudent.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={currentStudent.id}
            onChange={(e) => {
              const found = students.find(s => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white font-medium shadow-xs"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id}) {s.isRisingTalent ? '🚀' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentTab('fitness-test')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Retest Athlete</span>
          </button>
        </div>
      </div>

      {/* RISING TALENT HIGHLIGHT BANNER */}
      {isRising && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wide backdrop-blur-xs">
              <span>🚀 RISING TALENT DETECTED</span>
            </div>
            <div className="text-2xl font-black bg-white/20 px-3 py-0.5 rounded-xl">
              +{improvementRate}% Improvement
            </div>
          </div>
          <h2 className="text-xl font-bold">
            {currentStudent.name} is accelerating faster than 92% of peer cohort!
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            "This athlete has shown significant physical improvement over the last 60 days. GramAthlete identifies rapid improvers early so coaching resources reach hungry talent."
          </p>
        </div>
      )}

      {/* Main Progression Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left: Progression Line Chart (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Score Progression Over Time</h2>
              <p className="text-xs text-slate-500">Overall athletic potential score across assessment intervals</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +{improvementRate}% Total
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="AI Score" 
                  stroke="#16a34a" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Comparison Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">30m Sprint</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                4.9s → 4.8s → <span className="text-emerald-700">4.6s</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">-0.30s faster</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Broad Jump</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                1.85m → 1.95m → <span className="text-emerald-700">2.15m</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">+30cm further</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Vertical Jump</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                38cm → 42cm → <span className="text-emerald-700">50cm</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">+12cm leap</div>
            </div>

          </div>
        </div>

        {/* Right: Rising Talent Filter Category Hub (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Talent Discovery Filters</h2>
            <p className="text-xs text-slate-500">Categorization criteria for rural scout identification</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'improvement', label: 'Highest Improvement', desc: 'Rapid acceleration' },
              { id: 'potential', label: 'Highest Potential', desc: 'Score >= 85' },
              { id: 'consistent', label: 'Most Consistent', desc: '100% test attendance' },
              { id: 'new', label: 'Newly Discovered', desc: 'Tested this month' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">{f.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>

          {/* Peer Rising Talent Spotlight */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Other Rising Athletes in District
            </div>
            <div className="space-y-1.5">
              {risingTalentsList.map(t => (
                <div 
                  key={t.id}
                  onClick={() => onSelectStudent(t)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.school}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    +{t.overallImprovementRate}% 🚀
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Assessment History Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Assessment History Timeline</h2>
            <p className="text-xs text-slate-500">Longitudinal log of video and manual fitness evaluations</p>
          </div>
          <button
            onClick={() => setCurrentTab('video-assessment')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>+ New Video Assessment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {(assessments.length > 0 ? assessments : [
            {
              id: 'ass-1',
              monthLabel: 'Month 1',
              date: '2025-11-10',
              assessmentType: 'manual' as const,
              result: { overallScore: 72, potentialCategory: 'PROMISING' as const, bestSport: { sport: 'Athletics' } },
              input: { sprint30m: 4.9, broadJump: 1.85, verticalJump: 38 }
            },
            {
              id: 'ass-2',
              monthLabel: 'Month 2',
              date: '2025-12-12',
              assessmentType: 'manual' as const,
              result: { overallScore: 78, potentialCategory: 'PROMISING' as const, bestSport: { sport: 'Athletics' } },
              input: { sprint30m: 4.8, broadJump: 1.95, verticalJump: 42 },
              improvementPercent: 8.3
            },
            {
              id: 'ass-3',
              monthLabel: 'Month 3',
              date: '2026-01-15',
              assessmentType: 'manual' as const,
              result: { overallScore: 84, potentialCategory: 'PROMISING' as const, bestSport: { sport: 'Athletics' } },
              input: { sprint30m: 4.7, broadJump: 2.05, verticalJump: 46 },
              improvementPercent: 7.7
            },
            {
              id: 'ass-4',
              monthLabel: 'Month 4',
              date: '2026-02-18',
              assessmentType: 'video' as const,
              videoMetadata: { activityDetected: '100m Sprint', confidence: 92 },
              result: { overallScore: 87, potentialCategory: 'HIGH POTENTIAL' as const, bestSport: { sport: 'Athletics' } },
              input: { sprint30m: 4.6, broadJump: 2.15, verticalJump: 50 },
              improvementPercent: 3.6
            }
          ]).map((ass: any, idx: number) => {
            const isVideo = ass.assessmentType === 'video';
            const isLatest = idx === (assessments.length > 0 ? assessments.length - 1 : 3);

            return (
              <div key={ass.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isVideo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isVideo ? '🎥' : '⌨️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{ass.monthLabel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVideo ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isVideo ? `🎥 Video (${ass.videoMetadata?.activityDetected || 'Sprint'})` : '⌨️ Manual Test'}
                      </span>
                      {isLatest && (
                        <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                          LATEST
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      30m: {ass.input?.sprint30m}s • Broad Jump: {ass.input?.broadJump}m • Date: {ass.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {ass.improvementPercent && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +{ass.improvementPercent}%
                    </span>
                  )}
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900">{ass.result?.overallScore} / 100</span>
                    <div className="text-[10px] text-slate-400 font-semibold">{ass.result?.bestSport?.sport}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-DAY DEVELOPMENT PLAN SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Personalized Growth Plan</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">30-Day Development Plan</h2>
            <p className="text-xs text-slate-500">
              {plan?.goalTitle || 'Targeted acceleration & explosive power routine for Athletics'}
            </p>
          </div>

          <button
            onClick={() => setPlanStarted(true)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              planStarted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
            }`}
          >
            {planStarted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Plan in Progress (Week 2 of 4)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start 30-Day Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Target Metrics Banner */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Current Baseline: </span>
            <strong className="text-slate-900">{plan?.currentMetric || '30m Sprint: 4.8s | Broad Jump: 1.95m'}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">30-Day Target: </span>
            <strong className="text-emerald-700">{plan?.targetMetric || '30m Sprint: 4.6s | Broad Jump: 2.10m'}</strong>
          </div>
        </div>

        {/* 4 Weeks Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Week 1
              </span>
              <span className="text-[10px] text-slate-400">Foundation</span>
            </div>
            <div className="font-bold text-xs text-slate-900">Sprint drills, mobility & basic strength</div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li>Dynamic hip & hamstring mobility</li>
              <li>High knees & A-skips (3x20m)</li>
              <li>Bodyweight squats & core holds</li>
              <li>Recovery jog & stretch</li>
            </ul>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                Week 2
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Active</span>
            </div>
            <div className="font-bold text-xs text-slate-900">Acceleration, jump training & recovery</div>
            <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
              <li>Falling start accelerations</li>
              <li>Sand/grass broad jumps (4x3)</li>
              <li>Single-leg bounding drills</li>
              <li>Post-session active recovery</li>
            </ul>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Week 3
              </span>
              <span className="text-[10px] text-slate-400">Technique</span>
            </div>
            <div className="font-bold text-xs text-slate-900">Sprint technique, explosive power, agility</div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li>20m flying sprint bursts</li>
              <li>Tuck jumps & explosive box steps</li>
              <li>Shuttle cone agility drills</li>
              <li>Mountain climbers & core work</li>
            </ul>
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Week 4
              </span>
              <span className="text-[10px] text-slate-400">Testing</span>
            </div>
            <div className="font-bold text-xs text-slate-900">Sprint testing, recovery & final assessment</div>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li>Tapered 30m sprint test runs</li>
              <li>Broad jump measurement check</li>
              <li>Full body mobility routine</li>
              <li>Retest and sync to GramAthlete</li>
            </ul>
          </div>

        </div>

        {/* Coach Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Safety & Coaching Note:</strong> Prototype recommendation. Training should be reviewed and supervised by a qualified school PE teacher or certified athletic coach.
          </span>
        </div>

      </div>

    </div>
  );
};
