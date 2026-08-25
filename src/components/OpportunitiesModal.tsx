import React, { useState } from 'react';
import { Opportunity } from '../types';
import { getOpportunities, applyToOpportunity } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { 
  X, 
  Compass, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Building, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpportunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunitiesModal: React.FC<OpportunitiesModalProps> = ({
  isOpen,
  onClose
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(getOpportunities());
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (opp: Opportunity) => {
    const updated = applyToOpportunity(opp.id);
    setOpportunities(updated);
    setAppliedId(opp.id);

    addNotification({
      title: 'Opportunity Application Submitted 🎯',
      message: `Nomination registered for ${opp.title} (${opp.location}).`,
      type: 'success'
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => setAppliedId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Sports Opportunities</h2>
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Demo Opportunity
                </span>
              </div>
              <p className="text-xs text-slate-500">Upcoming trials, camps and sports hostel admissions in Karnataka</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Opportunities List */}
        <div className="p-6 space-y-4">
          
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span>PE Teachers and Scouts can nominate high-potential students directly to trials.</span>
            <span className="text-[11px] font-bold text-emerald-800">5 Active Schemes</span>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {opp.sport}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{opp.title}</h3>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>{opp.organization}</span>
                    </div>
                  </div>

                  <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-1 rounded self-start sm:self-auto">
                    Demo Opportunity
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Location: <strong>{opp.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Date: <strong>{opp.date}</strong></span>
                  </div>
                </div>

                {/* Eligibility & Apply Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">Eligibility:</strong> {opp.eligibility}
                  </div>

                  {opp.applied || appliedId === opp.id ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Nomination Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(opp)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Nominate Athlete</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
