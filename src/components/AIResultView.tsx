import React, { useState, useEffect } from 'react';
import { Student, NavTab, TeacherObservation } from '../types';
import { updateObservation, referToScout } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { 
  Sparkles, 
  Trophy, 
  Target, 
  Zap, 
  Flame, 
  Timer, 
  Dumbbell, 
  Activity, 
  CheckCircle2, 
  IdCard, 
  TrendingUp, 
  Share2, 
  MessageSquare, 
  Info, 
  ShieldAlert,
  ChevronRight,
  Award,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIResultViewProps {
  student: Student | null;
  onStudentUpdated: (updatedStudent: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
}

export const AIResultView: React.FC<AIResultViewProps> = ({
  student,
  onStudentUpdated,
  setCurrentTab
}) => {
  if (!student || !student.latestAssessment) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-12">
        <Activity className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Found</h2>
        <p className="text-sm text-slate-500">Please select an athlete and complete a fitness assessment first.</p>
        <button
          onClick={() => setCurrentTab('fitness-test')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
        >
          Go to Fitness Assessment
        </button>
      </div>
    );
  }

  const result = student.latestAssessment.result;
  const metrics = result.metrics;
  const sportMatches = result.sportMatches;
  const bestSport = result.bestSport;

  // Teacher observation local state
  const existingObs = student.teacherObservation;
  const [disciplined, setDisciplined] = useState(existingObs?.disciplined ?? true);
  const [strongMotivation, setStrongMotivation] = useState(existingObs?.strongMotivation ?? true);
  const [teamwork, setTeamwork] = useState(existingObs?.teamwork ?? true);
  const [leadership, setLeadership] = useState(existingObs?.leadership ?? false);
  const [regularAttendance, setRegularAttendance] = useState(existingObs?.regularAttendance ?? true);
  const [fastLearner, setFastLearner] = useState(existingObs?.fastLearner ?? true);
  const [coachability, setCoachability] = useState(existingObs?.coachability ?? true);
  const [comment, setComment] = useState(
    existingObs?.comment ||
    'Student consistently performs well during school athletics and shows strong motivation to improve.'
  );

  const [obsSaved, setObsSaved] = useState(false);
  const [referredSuccess, setReferredSuccess] = useState(student.isReferredToScout || false);

  useEffect(() => {
    if (existingObs) {
      setDisciplined(existingObs.disciplined);
      setStrongMotivation(existingObs.strongMotivation);
      setTeamwork(existingObs.teamwork);
      setLeadership(existingObs.leadership);
      setRegularAttendance(existingObs.regularAttendance);
      setFastLearner(existingObs.fastLearner);
      setCoachability(existingObs.coachability);
      setComment(existingObs.comment);
    }
  }, [student.id]);

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedObs: TeacherObservation = {
      disciplined,
      strongMotivation,
      teamwork,
      leadership,
      regularAttendance,
      fastLearner,
      coachability,
      comment: comment.trim(),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updated = updateObservation(student.id, updatedObs);
    onStudentUpdated(updated);
    setObsSaved(true);
    setTimeout(() => setObsSaved(false), 3000);
  };

  const handleReferToScout = () => {
    const updated = referToScout(student.id);
    onStudentUpdated(updated);
    setReferredSuccess(true);
    addNotification({
      title: 'Scout Referral Sent',
      message: `${student.name} (${bestSport.sport} - ${result.overallScore}/100) referred to district scout pool.`,
      type: 'scout'
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const metricList = [
    { label: 'Speed', value: metrics.speed, icon: <Zap className="w-4 h-4 text-orange-600" />, color: 'bg-orange-500' },
    { label: 'Power', value: metrics.power, icon: <Flame className="w-4 h-4 text-red-600" />, color: 'bg-red-500' },
    { label: 'Endurance', value: metrics.endurance, icon: <Timer className="w-4 h-4 text-blue-600" />, color: 'bg-blue-500' },
    { label: 'Strength', value: metrics.strength, icon: <Dumbbell className="w-4 h-4 text-emerald-600" />, color: 'bg-emerald-600' },
    { label: 'Agility', value: metrics.agility, icon: <Activity className="w-4 h-4 text-purple-600" />, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              AI Analysis Completed
            </span>
            <span className="text-xs text-slate-400 font-mono">{student.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {student.name} — Potential Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Age {student.age} • {student.gender} • {student.school}, {student.district}
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4 bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black text-emerald-700 leading-none">
              {result.overallScore}
            </div>
            <div className="text-[11px] font-bold text-emerald-900 mt-1 uppercase tracking-wider">
              Score / 100
            </div>
          </div>
          <div className="border-l border-emerald-200 pl-4 space-y-1">
            <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-black tracking-wide">
              {result.potentialCategory}
            </span>
            <p className="text-[11px] text-emerald-900 font-medium">
              Top Recommended: <strong className="text-emerald-950">{bestSport.sport} ({bestSport.matchPercentage}%)</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 5 Fitness Bars + AI Sport Match */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Fitness Breakdown (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Fitness Breakdown</h2>
            <p className="text-xs text-slate-500">Normalized physical capability scores</p>
          </div>

          <div className="space-y-4">
            {metricList.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    {m.icon}
                    <span>{m.label}</span>
                  </div>
                  <span className="font-mono text-slate-900 text-sm">{m.value} / 100</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${m.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${m.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Explanation Note */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <p className="font-medium">
              "Strong sprint speed ({metrics.speed}) and explosive power ({metrics.power}) make this athlete a strong potential match for speed and power-based sports."
            </p>
          </div>
        </div>

        {/* Right Column: AI Sport Match & Why This Sport (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Best Sport Match Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-green-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">BEST SPORT MATCH</span>
              </div>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                {bestSport.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-b border-emerald-700/60 pb-4">
              <div className="text-3xl font-black">{bestSport.sport}</div>
              <div className="text-3xl font-black text-amber-300">{bestSport.matchPercentage}%</div>
            </div>

            {/* Why This Sport? Explanation */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Why this sport?
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-emerald-50">
                {bestSport.why.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other Sport Matches Ranking */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Other Compatible Sports
              </h3>
              <span className="text-xs text-slate-400">Deterministic Match</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {sportMatches.slice(1).map((sport) => (
                <div 
                  key={sport.sport}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{sport.sport}</div>
                    <div className="text-[10px] text-slate-500">{sport.badge}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-base text-emerald-700">{sport.matchPercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Decision Support Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Important Prototype Notice:</strong> AI-assisted prototype assessment. This is decision support and not an official selection or medical assessment. AI does not guarantee sporting success; final decisions require coach evaluation.
        </div>
      </div>

      {/* Combined AI Assessment + Teacher Observation Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold mb-1">
              <span>Human in the Loop</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Assessment + Teacher Observation
            </h2>
            <p className="text-xs text-slate-500">
              Combine quantitative fitness data with behavioral observations for a complete evaluation.
            </p>
          </div>

          {referredSuccess ? (
            <div className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Referred to Scout Pool</span>
            </div>
          ) : (
            <button
              onClick={handleReferToScout}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Refer {student.name.split(' ')[0]} to Scout</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSaveObservation} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Behavioral & Attitude Indicators (PE Teacher Assessment)
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={disciplined}
                  onChange={(e) => setDisciplined(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Good Discipline</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={strongMotivation}
                  onChange={(e) => setStrongMotivation(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Strong Motivation</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={teamwork}
                  onChange={(e) => setTeamwork(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Teamwork</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={leadership}
                  onChange={(e) => setLeadership(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Leadership</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={regularAttendance}
                  onChange={(e) => setRegularAttendance(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Regular Attendance</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={fastLearner}
                  onChange={(e) => setFastLearner(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Fast Learner</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={coachability}
                  onChange={(e) => setCoachability(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Coachability</span>
              </label>

            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Teacher Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-slate-800"
              placeholder="Enter specific teacher observations on athletic enthusiasm, consistency, and attitude..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-700 font-semibold">
              {obsSaved ? '✓ Observation saved and verified!' : ''}
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Observation</span>
            </button>
          </div>
        </form>

      </div>

      {/* Bottom Next Step Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        
        <button
          onClick={() => setCurrentTab('passport')}
          className="p-5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs text-left transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IdCard className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-800">
                View Athlete Passport
              </div>
              <p className="text-xs text-slate-500">Printable digital sports card for scouts</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600" />
        </button>

        <button
          onClick={() => setCurrentTab('progress')}
          className="p-5 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 shadow-xs text-left transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 group-hover:text-amber-800">
                Open 30-Day Growth Plan & Progress
              </div>
              <p className="text-xs text-slate-500">Track improvement & Rising Talent status</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600" />
        </button>

      </div>

    </div>
  );
};
