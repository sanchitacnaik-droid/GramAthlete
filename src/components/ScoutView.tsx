import React, { useState } from 'react';
import { Student, NavTab } from '../types';
import { toggleStudentShortlist, updateScoutStage } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { ScoutAthleteModal } from './ScoutAthleteModal';
import { 
  Search, 
  Filter, 
  Star, 
  Mail, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Eye, 
  TrendingUp, 
  Award,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoutViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onStudentUpdated: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
}

export const ScoutView: React.FC<ScoutViewProps> = ({
  students,
  onSelectStudent,
  onStudentUpdated,
  setCurrentTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [sportFilter, setSportFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [minScore, setMinScore] = useState<number>(75);
  const [risingOnly, setRisingOnly] = useState(false);
  const [shortlistedOnly, setShortlistedOnly] = useState(false);

  // Selected student for deep dive modal
  const [scoutModalStudent, setScoutModalStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const districts = ['All', 'Shivamogga', 'Mysuru', 'Ballari', 'Belagavi', 'Kalaburagi', 'Mandya'];
  const sports = ['All', 'Athletics', 'Volleyball', 'Football', 'Kabaddi', 'Badminton'];

  // Quick Preset Helper: "Find athletes aged 14–16 with Athletics potential above 85"
  const applyPresetAthletics85 = () => {
    setDistrictFilter('All');
    setSportFilter('Athletics');
    setGenderFilter('All');
    setMinScore(85);
    setRisingOnly(false);
    setSearchTerm('');
  };

  const applyPresetRisingTalent = () => {
    setDistrictFilter('All');
    setSportFilter('All');
    setMinScore(70);
    setRisingOnly(true);
    setSearchTerm('');
  };

  const filteredStudents = students.filter(s => {
    const score = s.latestAssessment?.result.overallScore || 0;
    const topSport = s.latestAssessment?.result.bestSport.sport;

    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'All' || s.district === districtFilter;
    const matchesSport = sportFilter === 'All' || topSport === sportFilter;
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;
    const matchesScore = score >= minScore;
    const matchesRising = !risingOnly || s.isRisingTalent;
    const matchesShortlist = !shortlistedOnly || s.isShortlisted;

    return matchesSearch && matchesDistrict && matchesSport && matchesGender && matchesScore && matchesRising && matchesShortlist;
  });

  const handleOpenAthlete = (student: Student) => {
    onSelectStudent(student);
    setScoutModalStudent(student);
    setIsModalOpen(true);
  };

  const handleQuickShortlist = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    const newStatus = toggleStudentShortlist(student.id);
    const updated = { ...student, isShortlisted: newStatus };
    onStudentUpdated(updated);
    addNotification({
      title: newStatus ? 'Athlete Shortlisted ⭐' : 'Athlete Un-shortlisted',
      message: `${student.name} updated in your talent list.`,
      type: 'scout'
    });
  };

  const handleQuickInvite = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    const updated = updateScoutStage(student.id, 'Trial Invited', '2026-03-25');
    onStudentUpdated(updated);
    addNotification({
      title: 'Trial Invitation Sent ✉️',
      message: `Direct selection trial invitation sent for ${student.name}.`,
      type: 'scout'
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Karnataka Rural Scout Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Rural Talent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Filter grassroot athletes by raw fitness potential, top sport match and rate of improvement.
          </p>
        </div>

        {/* Quick Scout Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={applyPresetAthletics85}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Athletics &ge; 85 Score</span>
          </button>

          <button
            onClick={applyPresetRisingTalent}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Rising Talent Only 🚀</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athlete name, ID, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white font-medium"
            >
              {districts.map(d => (
                <option key={d} value={d}>District: {d}</option>
              ))}
            </select>
          </div>

          {/* Sport Filter */}
          <div>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm bg-white font-medium"
            >
              {sports.map(sp => (
                <option key={sp} value={sp}>Sport: {sp}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Secondary Filter Row: Min Potential Slider + Checkboxes */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          
          {/* Min Potential Slider */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-semibold whitespace-nowrap">Min Potential Score:</span>
            <input
              type="range"
              min={60}
              max={95}
              step={1}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-32 accent-blue-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {minScore} / 100
            </span>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={risingOnly}
                onChange={(e) => setRisingOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>🚀 Rising Talent Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shortlistedOnly}
                onChange={(e) => setShortlistedOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>⭐ Shortlisted ({students.filter(s => s.isShortlisted).length})</span>
            </label>

            <span className="text-slate-400">
              Found <strong>{filteredStudents.length}</strong> matching athletes
            </span>
          </div>

        </div>

      </div>

      {/* Athlete Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No athletes matched this scout filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Lower the minimum potential score or clear the sport filter to discover more rural talent.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const latest = student.latestAssessment;
            const score = latest?.result.overallScore || 75;
            const bestSport = latest?.result.bestSport.sport || 'Athletics';
            const matchPct = latest?.result.bestSport.matchPercentage || 85;
            const isHighPot = latest?.result.potentialCategory === 'HIGH POTENTIAL';

            return (
              <div
                key={student.id}
                onClick={() => handleOpenAthlete(student)}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                {/* Top Row: Name, ID & Badges */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                        {student.name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Age {student.age}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{student.district}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleQuickShortlist(e, student)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        student.isShortlisted
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                      }`}
                      title={student.isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                    >
                      <Star className={`w-4 h-4 ${student.isShortlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* School */}
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {student.school}
                  </p>

                  {/* Badges Ribbon */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {latest?.assessmentType === 'video' ? (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span>🎥</span>
                        <span>{latest.videoMetadata?.activityDetected || 'Video Test'}</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                        ⌨️ Manual Test
                      </span>
                    )}

                    {student.isRisingTalent && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        🚀 +{student.overallImprovementRate}%
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {student.scoutStatus}
                    </span>
                    {student.trialDate && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Trial: {student.trialDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Potential & Sport Metrics Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Top Sport</div>
                    <div className="text-sm font-extrabold text-emerald-800">{bestSport}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{matchPct}% Match</div>
                  </div>

                  <div className="text-right border-l border-slate-200 pl-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Potential</div>
                    <div className="text-xl font-black text-slate-900">
                      {score} <span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                    <div className={`text-[10px] font-bold uppercase ${isHighPot ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {latest?.result.potentialCategory || 'Tested'}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAthlete(student);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={(e) => handleQuickInvite(e, student)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Invite Trial</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Scout Athlete Modal */}
      <ScoutAthleteModal
        student={scoutModalStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentUpdated={(upd) => {
          onStudentUpdated(upd);
          setScoutModalStudent(upd);
        }}
      />

    </div>
  );
};
