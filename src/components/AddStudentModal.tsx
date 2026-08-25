import React, { useState } from 'react';
import { Student, Gender } from '../types';
import { addStudent, generateAthleteId, getStoredStudents } from '../services/storageService';
import { X, UserPlus, Sparkles, ShieldCheck, Check } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onStudentAdded
}) => {
  const existingCount = getStoredStudents().length;
  const [autoId] = useState<string>(generateAthleteId(existingCount));
  
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(15);
  const [gender, setGender] = useState<Gender>('Male');
  const [school, setSchool] = useState('Government High School');
  const [district, setDistrict] = useState('Shivamogga');
  const [village, setVillage] = useState('Tirthahalli');
  const [height, setHeight] = useState<number>(164);
  const [weight, setWeight] = useState<number>(52);
  const [sportsExperience, setSportsExperience] = useState('');
  const [previousAchievement, setPreviousAchievement] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setName('Ramesh Gowda');
    setAge(15);
    setGender('Male');
    setSchool('Government High School');
    setDistrict('Shivamogga');
    setVillage('Sagara');
    setHeight(166);
    setWeight(54);
    setSportsExperience('School 100m sprint & village kabaddi games');
    setPreviousAchievement('Taluk Athletics U-16 100m Silver Medal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent = addStudent({
      name: name.trim(),
      age: Number(age),
      gender,
      school: school.trim(),
      district: district.trim(),
      village: village.trim(),
      height: Number(height),
      weight: Number(weight),
      sportsExperience: sportsExperience.trim() || 'General physical education activities',
      previousAchievement: previousAchievement.trim() || 'School level participation'
    });

    onStudentAdded(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Student</h2>
              <p className="text-xs text-slate-500">Auto-generated Athlete ID: <span className="font-mono font-bold text-emerald-700">{autoId}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Fictional Data Note */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Protection:</strong> Use fictional sample names. Minor personal contact info is never publicly exposed.
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ravi Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age (Yrs)
                </label>
                <input
                  type="number"
                  min={10}
                  max={20}
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* District & Village */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="Shivamogga">Shivamogga</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Ballari">Ballari</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Kalaburagi">Kalaburagi</option>
                  <option value="Mandya">Mandya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Village / Taluk
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min={120}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min={30}
                  max={120}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Existing Sports Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Existing Sports Experience
              </label>
              <input
                type="text"
                placeholder="e.g. Village kabaddi, 100m sprint"
                value={sportsExperience}
                onChange={(e) => setSportsExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

          </div>

          {/* Previous Achievement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Previous Achievement (if any)
            </label>
            <input
              type="text"
              placeholder="e.g. School 100m 1st place, Taluk runner up"
              value={previousAchievement}
              onChange={(e) => setPreviousAchievement(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>Parent/School consent recorded for physical assessment & talent indexing.</span>
          </label>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!consentChecked}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Register Athlete</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
