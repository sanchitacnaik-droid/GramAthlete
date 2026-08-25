import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyDisclaimer: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-slate-200 text-xs text-slate-500 space-y-4 no-print">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800">GramAthlete — Rural Athlete Discovery & Growth Network</div>
            <p className="text-[11px] text-slate-500">
              Karnataka Rural Sports Prototype • Built for PE Teachers, Scouts & Grassroot Athletes
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-center md:text-right max-w-md">
          <p>
            <strong>Privacy & Ethics:</strong> All names and statistics shown are fictional prototype data. AI recommendations serve strictly as decision-support tools. Final sports selections must be verified by qualified coaches.
          </p>
        </div>

      </div>
    </footer>
  );
};
