import React, { useState } from 'react';
import { DistrictTalentSummary, NavTab, Student } from '../types';
import { getAggregatedDistrictSummaries } from '../services/storageService';
import { 
  Building, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Award, 
  MapPin, 
  ArrowRight, 
  School, 
  Trophy, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface TalentOverviewViewProps {
  students: Student[];
  setCurrentTab: (tab: NavTab) => void;
  onSelectDistrictFilter?: (district: string) => void;
}

export const TalentOverviewView: React.FC<TalentOverviewViewProps> = ({
  students,
  setCurrentTab
}) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);

  const districtSummaries = getAggregatedDistrictSummaries();

  // Aggregate totals
  const totalSchools = districtSummaries.reduce((sum, d) => sum + d.schoolsCount, 0);
  const totalTested = districtSummaries.reduce((sum, d) => sum + d.testedCount, 0);
  const totalVideoAssessments = districtSummaries.reduce((sum, d) => sum + (d.videoAssessmentsCount || 0), 0);
  const totalHighPot = districtSummaries.reduce((sum, d) => sum + d.highPotentialCount, 0);
  const totalRising = districtSummaries.reduce((sum, d) => sum + d.risingTalentCount, 0);
  const totalReferrals = districtSummaries.reduce((sum, d) => sum + d.scoutReferralsCount, 0);

  const activeDistrict = selectedDistrictName 
    ? districtSummaries.find(d => d.district === selectedDistrictName)
    : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>State Sports Authority & Administration View</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Karnataka Talent Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            District-level talent discovery metrics across rural pilot school clusters.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-slate-200/80 px-3.5 py-1.5 rounded-full text-slate-700 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          <span>Demo Data</span>
        </div>
      </div>

      {/* 6 Aggregate State Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: Schools */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSchools}</div>
          <div className="text-xs font-semibold text-slate-600">Total Schools</div>
          <div className="text-[10px] text-slate-400">Rural High Schools</div>
        </div>

        {/* Card 2: Tested */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalTested.toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-600">Total Tested</div>
          <div className="text-[10px] text-slate-400">Baseline records</div>
        </div>

        {/* Card 3: Video Assessments */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-1 bg-emerald-50/20">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{totalVideoAssessments.toLocaleString()}</div>
          <div className="text-xs font-semibold text-emerald-900">🎥 Video Tests</div>
          <div className="text-[10px] text-emerald-600">CV Kinematics</div>
        </div>

        {/* Card 4: High Potential */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-1 bg-emerald-50/30">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{totalHighPot}</div>
          <div className="text-xs font-semibold text-emerald-900">High Potential</div>
          <div className="text-[10px] text-emerald-600">Score &ge; 85/100</div>
        </div>

        {/* Card 5: Rising Talent */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs text-center space-y-1 bg-amber-50/30">
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{totalRising}</div>
          <div className="text-xs font-semibold text-amber-900">🚀 Rising Talent</div>
          <div className="text-[10px] text-amber-600">&gt;15% improvement</div>
        </div>

        {/* Card 6: Scout Referrals */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs text-center space-y-1 bg-blue-50/30 col-span-2 sm:col-span-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">{totalReferrals}</div>
          <div className="text-xs font-semibold text-blue-900">Scout Referrals</div>
          <div className="text-[10px] text-blue-600">Trial admissions</div>
        </div>

      </div>

      {/* District Talent Distribution List & Details */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">District Talent Breakdown</h2>
            <p className="text-xs text-slate-500">Tap a district card to view emerging sports clusters and school statistics</p>
          </div>
          <button
            onClick={() => setCurrentTab('scout')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Scout Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districtSummaries.map((dist) => {
            const isSelected = selectedDistrictName === dist.district;

            return (
              <div
                key={dist.district}
                onClick={() => setSelectedDistrictName(isSelected ? null : dist.district)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* District Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{dist.district}</h3>
                      <p className="text-xs text-slate-500">{dist.schoolsCount} Schools Active</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {dist.topSport}
                  </span>
                </div>

                {/* District Stats Grid */}
                <div className="grid grid-cols-4 gap-1 text-center p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div>
                    <div className="text-slate-400 text-[9px] uppercase font-bold">Tested</div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">{dist.testedCount}</div>
                  </div>
                  <div>
                    <div className="text-emerald-800 text-[9px] uppercase font-bold">🎥 Video</div>
                    <div className="font-extrabold text-emerald-800 text-xs mt-0.5">{dist.videoAssessmentsCount || 0}</div>
                  </div>
                  <div className="border-x border-slate-200">
                    <div className="text-emerald-700 text-[9px] uppercase font-bold">High Pot.</div>
                    <div className="font-extrabold text-emerald-700 text-xs mt-0.5">{dist.highPotentialCount}</div>
                  </div>
                  <div>
                    <div className="text-amber-700 text-[9px] uppercase font-bold">Rising 🚀</div>
                    <div className="font-extrabold text-amber-700 text-xs mt-0.5">{dist.risingTalentCount}</div>
                  </div>
                </div>

                {/* Lead School */}
                <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Lead Cluster:</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{dist.topSchool}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Selected District Deep Dive Card (if clicked) */}
      {activeDistrict && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                District Talent Profile
              </div>
              <h3 className="text-2xl font-black text-slate-900">{activeDistrict.district} Cluster</h3>
            </div>
            
            <button
              onClick={() => setCurrentTab('scout')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore {activeDistrict.district} Athletes in Scout Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase">Primary Sport Alignment</span>
              <div className="text-base font-extrabold text-slate-900">{activeDistrict.topSport}</div>
              <p className="text-slate-500 text-[11px]">Dominant physical profile matched in this region.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-800 uppercase">Trial Referrals</span>
              <div className="text-base font-extrabold text-emerald-900">{activeDistrict.scoutReferralsCount} Athletes</div>
              <p className="text-emerald-700 text-[11px]">Referred to District / SAI Training trials.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-800 uppercase">Growth Velocity</span>
              <div className="text-base font-extrabold text-amber-900">{activeDistrict.risingTalentCount} Rising Stars</div>
              <p className="text-amber-700 text-[11px]">Athletes with &gt;15% physical improvement rate.</p>
            </div>
          </div>
        </div>
      )}

      {/* Talent Emergence Heatmap Insight Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold">Policy & Infrastructure Insights</h3>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          GramAthlete's aggregated physical test data enables state authorities to allocate coaching staff, athletic tracks, and nutrition kits directly to taluks where natural sprint and explosive power talent is concentrated.
        </p>
        <div className="text-[11px] text-slate-400">
          Aggregated anonymized reporting • Compliant with youth data privacy norms
        </div>
      </div>

    </div>
  );
};
