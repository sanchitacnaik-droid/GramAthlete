import React, { useState, useEffect } from 'react';
import { Student, FitnessTestInput, NavTab } from '../types';
import { submitFitnessAssessment } from '../services/storageService';
import { 
  Activity, 
  Sparkles, 
  Timer, 
  Zap, 
  Flame, 
  Dumbbell, 
  User, 
  CheckCircle2, 
  Info,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FitnessTestViewProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
  onAssessmentCompleted: (student: Student) => void;
}

export const FitnessTestView: React.FC<FitnessTestViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  setCurrentTab,
  onAssessmentCompleted
}) => {
  const currentStudent = selectedStudent || students[0];

  // Fitness Test Form State
  const [sprint30m, setSprint30m] = useState<string>('4.6');
  const [broadJump, setBroadJump] = useState<string>('2.15');
  const [verticalJump, setVerticalJump] = useState<string>('50');
  const [run800mMin, setRun800mMin] = useState<string>('2');
  const [run800mSec, setRun800mSec] = useState<string>('38');
  const [pushups, setPushups] = useState<string>('26');
  const [situps, setSitups] = useState<string>('32');
  const [height, setHeight] = useState<string>(currentStudent ? String(currentStudent.height) : '165');
  const [weight, setWeight] = useState<string>(currentStudent ? String(currentStudent.weight) : '53');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentStudent) {
      setHeight(String(currentStudent.height));
      setWeight(String(currentStudent.weight));
    }
  }, [currentStudent?.id]);

  const handleFillRaviValues = () => {
    setSprint30m('4.6');
    setBroadJump('2.15');
    setVerticalJump('50');
    setRun800mMin('2');
    setRun800mSec('38');
    setPushups('26');
    setSitups('32');
    setHeight('165');
    setWeight('53');
  };

  const handleFillModerateValues = () => {
    setSprint30m('5.0');
    setBroadJump('1.85');
    setVerticalJump('40');
    setRun800mMin('3');
    setRun800mSec('10');
    setPushups('18');
    setSitups('24');
    setHeight('160');
    setWeight('50');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    setIsSubmitting(true);

    const total800mSeconds = (Number(run800mMin) * 60) + Number(run800mSec);

    const inputData: FitnessTestInput = {
      sprint30m: parseFloat(sprint30m) || 4.8,
      broadJump: parseFloat(broadJump) || 1.9,
      verticalJump: parseFloat(verticalJump) || 42,
      run800m: total800mSeconds > 0 ? total800mSeconds : 160,
      pushups: parseInt(pushups) || 20,
      situps: parseInt(situps) || 25,
      height: parseFloat(height) || 165,
      weight: parseFloat(weight) || 53
    };

    setTimeout(() => {
      const { student, result } = submitFitnessAssessment(currentStudent.id, inputData);
      
      // Trigger festive confetti if high potential
      if (result.potentialCategory === 'HIGH POTENTIAL') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      onAssessmentCompleted(student);
      setIsSubmitting(false);
      setCurrentTab('ai-result');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Title & Student Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Standardized Physical Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fitness Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            No video upload needed. Enter direct stopwatch & measuring tape measurements.
          </p>
        </div>

        {/* Quick Demo Pre-fill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillRaviValues}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fill Ravi Demo Values (87 High Potential)</span>
          </button>
        </div>
      </div>

      {/* No Video Required Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-emerald-950">Rural-Optimized: 100% Offline & Video-Free</div>
          <div>PE teachers only need a simple stopwatch, measuring tape, and ground markings to assess students.</div>
        </div>
      </div>

      {/* Selected Student Banner / Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center">
            {currentStudent?.name.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">{currentStudent?.name}</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {currentStudent?.id}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {currentStudent?.age} yrs • {currentStudent?.gender} • {currentStudent?.school} • {currentStudent?.district}
            </div>
          </div>
        </div>

        {/* Change Student Dropdown */}
        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Evaluating Student
          </label>
          <select
            value={currentStudent?.id}
            onChange={(e) => {
              const found = students.find(s => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white font-medium"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id}) - {s.district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fitness Test Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* SECTION 1: SPEED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">1. Speed</h3>
                <p className="text-[11px] text-slate-500">Acceleration & maximum velocity</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">30m Sprint</label>
                <span className="text-[11px] text-slate-400">Stopwatch (seconds)</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="3.5"
                  max="9.0"
                  required
                  placeholder="e.g. 4.60"
                  value={sprint30m}
                  onChange={(e) => setSprint30m(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">sec</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Benchmark: Elite &lt; 4.4s | High &lt; 4.8s | Good &lt; 5.3s</p>
            </div>
          </div>

          {/* SECTION 2: POWER */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">2. Power</h3>
                <p className="text-[11px] text-slate-500">Explosive lower body force</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Broad Jump</label>
                  <span className="text-[10px] text-slate-400">Meters</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="3.0"
                    required
                    placeholder="2.15"
                    value={broadJump}
                    onChange={(e) => setBroadJump(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">m</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Vertical Jump</label>
                  <span className="text-[10px] text-slate-400">Centimeters</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="15"
                    max="90"
                    required
                    placeholder="50"
                    value={verticalJump}
                    onChange={(e) => setVerticalJump(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">cm</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Measures jumping elasticity essential for Athletics, Volleyball & Kabaddi.</p>
          </div>

          {/* SECTION 3: ENDURANCE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">3. Endurance</h3>
                <p className="text-[11px] text-slate-500">Aerobic stamina and recovery</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">800m Run Duration</label>
                <span className="text-[11px] text-slate-400">Minutes : Seconds</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    placeholder="2"
                    value={run800mMin}
                    onChange={(e) => setRun800mMin(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">min</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    placeholder="38"
                    value={run800mSec}
                    onChange={(e) => setRun800mSec(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">sec</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Total: {Number(run800mMin) * 60 + Number(run800mSec)} seconds. Influences Football & Athletics endurance match.</p>
            </div>
          </div>

          {/* SECTION 4: STRENGTH */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">4. Strength</h3>
                <p className="text-[11px] text-slate-500">Upper body & core muscular endurance</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Push-ups</label>
                  <span className="text-[10px] text-slate-400">Reps</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="26"
                  value={pushups}
                  onChange={(e) => setPushups(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Sit-ups (1 min)</label>
                  <span className="text-[10px] text-slate-400">Reps</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  placeholder="32"
                  value={situps}
                  onChange={(e) => setSitups(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Core metrics strongly weighted for Kabaddi, Volleyball and Football.</p>
          </div>

        </div>

        {/* SECTION 5: BODY PROFILE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">5. Body Profile</h3>
              <p className="text-[11px] text-slate-500">Anthropometric measurements for agility & power-to-weight index</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Height (cm)</label>
                <span className="text-[11px] text-slate-400">Standard stadiometer / tape</span>
              </div>
              <input
                type="number"
                min="120"
                max="210"
                required
                placeholder="165"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Weight (kg)</label>
                <span className="text-[11px] text-slate-400">Weighing scale</span>
              </div>
              <input
                type="number"
                min="30"
                max="120"
                required
                placeholder="53"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono font-semibold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Button: Analyze Athlete */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Deterministic AI calculation executes instantly. No external server delay.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSubmitting ? 'Analyzing Measurements...' : 'Analyze Athlete'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
