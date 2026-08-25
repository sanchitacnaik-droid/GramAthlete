import React, { useState } from 'react';
import { Student, NavTab } from '../types';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Activity, 
  Sparkles, 
  IdCard, 
  TrendingUp, 
  Shield, 
  ChevronRight,
  Zap
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
  onOpenAddStudent: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  setCurrentTab,
  onOpenAddStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSport, setSelectedSport] = useState('All');
  const [filterRisingOnly, setFilterRisingOnly] = useState(false);

  const districts = ['All', 'Shivamogga', 'Mysuru', 'Ballari', 'Belagavi', 'Kalaburagi', 'Mandya'];
  const sports = ['All', 'Athletics', 'Volleyball', 'Football', 'Kabaddi', 'Badminton'];

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = selectedDistrict === 'All' || s.district === selectedDistrict;
    const topSport = s.latestAssessment?.result.bestSport.sport;
    const matchesSport = selectedSport === 'All' || topSport === selectedSport;
    const matchesRising = !filterRisingOnly || s.isRisingTalent;

    return matchesSearch && matchesDistrict && matchesSport && matchesRising;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Athletes Roster
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {students.length} registered students across Karnataka rural cluster schools
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, ID or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white"
            >
              {districts.map(d => (
                <option key={d} value={d}>District: {d}</option>
              ))}
            </select>
          </div>

          {/* Sport Filter */}
          <div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white"
            >
              {sports.map(sp => (
                <option key={sp} value={sp}>Sport: {sp}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Filter Tag */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={filterRisingOnly}
              onChange={(e) => setFilterRisingOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>Show Rising Talent Only 🚀</span>
          </label>

          <span className="text-slate-400">Showing {filteredStudents.length} of {students.length} athletes</span>
        </div>
      </div>

      {/* Athletes Cards / Table */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No students matched your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting the district filter or search query to find athletes.
            </p>
          </div>
        ) : (
          filteredStudents.map(student => {
            const latest = student.latestAssessment;
            const score = latest?.result.overallScore || null;
            const topSport = latest?.result.bestSport.sport || 'Not Tested';
            const isHighPot = latest?.result.potentialCategory === 'HIGH POTENTIAL';

            return (
              <div
                key={student.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isHighPot 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-slate-900">{student.name}</span>
                      <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {student.id}
                      </span>
                      {student.isRisingTalent && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          🚀 Rising Talent (+{student.overallImprovementRate}%)
                        </span>
                      )}
                      {student.isShortlisted && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                          ⭐ Shortlisted
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Age {student.age} • {student.gender}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{student.school}</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold">{student.district}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Actions */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  
                  {/* Score & Sport */}
                  <div className="text-left md:text-right pr-2">
                    {score !== null ? (
                      <div>
                        <div className="text-base font-extrabold text-slate-900">
                          {score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-700">
                          {topSport} ({latest?.result.bestSport.matchPercentage}%)
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                        Needs Test
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelectStudent(student);
                        setCurrentTab('fitness-test');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{score !== null ? 'Retest' : 'Test'}</span>
                    </button>

                    {score !== null && (
                      <>
                        <button
                          onClick={() => {
                            onSelectStudent(student);
                            setCurrentTab('ai-result');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          AI Result
                        </button>

                        <button
                          onClick={() => {
                            onSelectStudent(student);
                            setCurrentTab('passport');
                          }}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Athlete Passport"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            onSelectStudent(student);
                            setCurrentTab('progress');
                          }}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Progress & Growth Plan"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
