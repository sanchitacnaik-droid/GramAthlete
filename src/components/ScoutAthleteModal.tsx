import React, { useState } from 'react';
import { Student, ScoutPipelineStage } from '../types';
import { updateScoutStage, toggleStudentShortlist } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { 
  X, 
  Star, 
  Mail, 
  Share2, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  Award, 
  IdCard, 
  Activity, 
  Building,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScoutAthleteModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onStudentUpdated: (student: Student) => void;
}

export const ScoutAthleteModal: React.FC<ScoutAthleteModalProps> = ({
  student,
  isOpen,
  onClose,
  onStudentUpdated
}) => {
  if (!isOpen || !student) return null;

  const [trialInvited, setTrialInvited] = useState(student.scoutStatus === 'Trial Invited');
  const [trialDate, setTrialDate] = useState(student.trialDate || '2026-03-25');
  const [isShortlisted, setIsShortlisted] = useState(student.isShortlisted || false);
  const [contactSchoolSent, setContactSchoolSent] = useState(false);
  const [referToCoachSent, setReferToCoachSent] = useState(false);

  const pipelineStages: ScoutPipelineStage[] = [
    'Identified',
    'Teacher Verified',
    'AI Recommended',
    'Scout Reviewing',
    'Trial Invited'
  ];

  const currentStageIndex = pipelineStages.indexOf(student.scoutStatus);

  const handleStageClick = (stage: ScoutPipelineStage) => {
    const updated = updateScoutStage(student.id, stage);
    onStudentUpdated(updated);
    addNotification({
      title: 'Scout Pipeline Updated',
      message: `${student.name} stage updated to: ${stage}`,
      type: 'scout'
    });
  };

  const handleToggleShortlist = () => {
    const newStatus = toggleStudentShortlist(student.id);
    setIsShortlisted(newStatus);
    const updated = { ...student, isShortlisted: newStatus };
    onStudentUpdated(updated);
    addNotification({
      title: newStatus ? 'Athlete Shortlisted ⭐' : 'Athlete Removed from Shortlist',
      message: `${student.name} (${student.latestAssessment?.result.bestSport.sport || 'Athlete'}) ${newStatus ? 'added to your scouting list' : 'removed'}.`,
      type: 'scout'
    });
  };

  const handleInviteToTrial = () => {
    const updated = updateScoutStage(student.id, 'Trial Invited', trialDate);
    onStudentUpdated(updated);
    setTrialInvited(true);
    addNotification({
      title: 'Official Trial Invitation Dispatched ✉️',
      message: `Trial scheduled for ${student.name} on ${trialDate} at District Sports Stadium.`,
      type: 'scout'
    });
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  const handleContactSchool = () => {
    setContactSchoolSent(true);
    addNotification({
      title: 'Headmaster Contact Initiated',
      message: `Inquiry sent to ${student.school} regarding ${student.name}.`,
      type: 'info'
    });
    setTimeout(() => setContactSchoolSent(false), 4000);
  };

  const handleReferToCoach = () => {
    setReferToCoachSent(true);
    addNotification({
      title: 'Profile Forwarded to District Coach',
      message: `${student.name}'s Athlete Passport forwarded to DYES Head Coach.`,
      type: 'success'
    });
    setTimeout(() => setReferToCoachSent(false), 4000);
  };

  const result = student.latestAssessment?.result;
  const metrics = result?.metrics;
  const bestSport = result?.bestSport;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {student.id}
                </span>
                {student.isRisingTalent && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    🚀 Rising Talent (+{student.overallImprovementRate}%)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Age {student.age} • {student.school}, {student.district}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* 5-STAGE TALENT PIPELINE */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Talent Discovery Pipeline
            </div>

            <div className="grid grid-cols-5 gap-1 text-center">
              {pipelineStages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <button
                    key={stage}
                    onClick={() => handleStageClick(stage)}
                    className={`p-2 rounded-xl text-left sm:text-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : isPassed
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider mb-0.5">Stage 0{idx + 1}</div>
                    <div className="text-[11px] leading-tight line-clamp-2">{stage}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics & Sport Match */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Sport Match Card */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Top AI Sport Match
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {student.latestAssessment?.assessmentType === 'video' ? '🎥 Video Assessment' : '⌨️ Manual Test'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-emerald-900">{bestSport?.sport || 'Athletics'}</div>
                <div className="text-2xl font-black text-emerald-700">{bestSport?.matchPercentage || 92}%</div>
              </div>
              <div className="text-xs text-emerald-950">
                Score: <strong>{result?.overallScore || 87} / 100 ({result?.potentialCategory})</strong>
                {student.latestAssessment?.videoMetadata && (
                  <span className="text-[11px] text-emerald-800 block mt-0.5">
                    Activity: {student.latestAssessment.videoMetadata.activityDetected} ({student.latestAssessment.videoMetadata.confidence}% AI Confidence)
                  </span>
                )}
              </div>
            </div>

            {/* Fitness Highlights */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Physical Benchmarks
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>Speed: <strong className="text-slate-900">{metrics?.speed || 92}/100</strong></div>
                <div>Power: <strong className="text-slate-900">{metrics?.power || 88}/100</strong></div>
                <div>Endurance: <strong className="text-slate-900">{metrics?.endurance || 74}/100</strong></div>
                <div>Strength: <strong className="text-slate-900">{metrics?.strength || 81}/100</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1">
                30m Sprint: {student.latestAssessment?.input.sprint30m}s • Broad Jump: {student.latestAssessment?.input.broadJump}m
              </div>
            </div>

          </div>

          {/* Achievements & Teacher Observation */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
              <span className="font-bold text-amber-900 uppercase">Achievements:</span>
              <p className="text-slate-700">{student.previousAchievement}</p>
            </div>

            {student.teacherObservation && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase">PE Teacher Verification Comment:</span>
                <p className="text-slate-800 italic">"{student.teacherObservation.comment}"</p>
                <div className="text-[10px] text-slate-400">
                  Verified: Discipline, Motivation, Regular Attendance & Coachability
                </div>
              </div>
            )}
          </div>

          {/* Trial Invitation Schedule Form */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Schedule Official Selection Trial</span>
              </div>
              {trialInvited && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Trial Active
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Trial Date</label>
                <input
                  type="date"
                  value={trialDate}
                  onChange={(e) => setTrialDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  disabled
                  value="District Stadium, Shivamogga"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100 text-slate-600"
                />
              </div>
            </div>

            <button
              onClick={handleInviteToTrial}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{trialInvited ? 'Update Trial Invitation' : 'Dispatch Official Trial Invitation'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
            
            <button
              onClick={handleToggleShortlist}
              className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isShortlisted
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              <Star className={`w-4 h-4 ${isShortlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isShortlisted ? 'Shortlisted ⭐' : 'Shortlist'}</span>
            </button>

            <button
              onClick={handleReferToCoach}
              disabled={referToCoachSent}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>{referToCoachSent ? '✓ Forwarded' : 'Refer to Coach'}</span>
            </button>

            <button
              onClick={handleContactSchool}
              disabled={contactSchoolSent}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1"
            >
              <Building className="w-4 h-4" />
              <span>{contactSchoolSent ? '✓ Inquiry Sent' : 'Contact School'}</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
