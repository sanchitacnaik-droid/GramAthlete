import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  NavTab, 
  Student, 
  AppNotification, 
  SyncQueueItem 
} from './types';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  getStoredRole, 
  setStoredRole, 
  isOfflineMode, 
  setOfflineMode, 
  getSyncQueue, 
  syncOfflineQueueNow, 
  getSelectedStudentId, 
  setSelectedStudentId 
} from './services/storageService';
import { 
  getNotifications, 
  addNotification, 
  markAllNotificationsRead 
} from './services/notificationService';

// UI Components
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { TeacherHome } from './components/TeacherHome';
import { StudentsView } from './components/StudentsView';
import { VideoAssessmentView } from './components/VideoAssessmentView';
import { FitnessTestView } from './components/FitnessTestView';
import { AIResultView } from './components/AIResultView';
import { ProgressView } from './components/ProgressView';
import { AthletePassportView } from './components/AthletePassportView';
import { ScoutView } from './components/ScoutView';
import { TalentOverviewView } from './components/TalentOverviewView';
import { AddStudentModal } from './components/AddStudentModal';
import { OpportunitiesModal } from './components/OpportunitiesModal';
import { PrivacyDisclaimer } from './components/PrivacyDisclaimer';
import { HackathonDemoGuide } from './components/HackathonDemoGuide';
import { Zap, Sparkles } from 'lucide-react';

export function App() {
  // State
  const [currentRole, setCurrentRoleState] = useState<UserRole>(getStoredRole());
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [homeSubView, setHomeSubView] = useState<'teacher' | 'landing'>('landing');
  const [isOffline, setIsOfflineState] = useState<boolean>(isOfflineMode());
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(getSyncQueue());
  const [students, setStudents] = useState<Student[]>(getStoredStudents());
  
  // Selected Student for Test / AI Result / Passport / Progress
  const [selectedStudent, setSelectedStudentState] = useState<Student | null>(() => {
    const all = getStoredStudents();
    const storedId = getSelectedStudentId();
    return all.find(s => s.id === storedId) || all[0] || null;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(getNotifications());

  // Modal controls
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Sync state helpers
  const handleSetRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setStoredRole(role);
  };

  const handleSetOffline = (offline: boolean) => {
    setIsOfflineState(offline);
    setOfflineMode(offline);
    if (offline) {
      addNotification({
        title: 'Offline Simulation Active 🟠',
        message: 'Assessments entered will be stored locally and queued for synchronization.',
        type: 'warning'
      });
    } else {
      addNotification({
        title: 'Online Mode Restored 🟢',
        message: 'Real-time connectivity active.',
        type: 'info'
      });
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudentState(student);
    setSelectedStudentId(student.id);
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    const updatedList = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updatedList);
    saveStoredStudents(updatedList);
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudentState(updatedStudent);
    }
  };

  const handleStudentAdded = (newStudent: Student) => {
    const updatedList = [newStudent, ...students];
    setStudents(updatedList);
    setSelectedStudentState(newStudent);
    setSelectedStudentId(newStudent.id);
    setSyncQueue(getSyncQueue());

    addNotification({
      title: 'New Student Registered',
      message: `${newStudent.name} (${newStudent.id}) registered at ${newStudent.school}.`,
      type: 'success'
    });

    // Auto navigate to Fitness Test for newly added student
    setCurrentTab('fitness-test');
  };

  const handleAssessmentCompleted = (updatedStudent: Student) => {
    handleStudentUpdated(updatedStudent);
    setSyncQueue(getSyncQueue());
    const score = updatedStudent.latestAssessment?.result.overallScore;
    const sport = updatedStudent.latestAssessment?.result.bestSport.sport;

    addNotification({
      title: 'Physical Assessment Analyzed',
      message: `${updatedStudent.name} achieved ${score}/100 in ${sport}.`,
      type: 'success'
    });
  };

  const handleSyncNow = () => {
    const { count } = syncOfflineQueueNow();
    setSyncQueue([]);
    setSyncToastMessage(`Successfully synchronized ${count > 0 ? count : 'all'} pending assessments to GramAthlete Cloud!`);
    addNotification({
      title: 'Sync Complete 🟢',
      message: `${count} local assessment records synchronized successfully.`,
      type: 'success'
    });
    setTimeout(() => setSyncToastMessage(null), 4000);
  };

  // Launch Hackathon 3-Min demo helper
  const handleQuickStartDemo = () => {
    setIsDemoGuideOpen(true);
    handleSetRole('teacher');
    setCurrentTab('home');
    const ravi = students.find(s => s.name === 'Ravi Kumar') || students[0];
    if (ravi) handleSelectStudent(ravi);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-16 xl:pb-0">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={handleSetRole}
        isOffline={isOffline}
        setIsOffline={handleSetOffline}
        syncQueue={syncQueue}
        onSyncNow={handleSyncNow}
        notifications={notifications}
        onOpenNotifications={() => markAllNotificationsRead()}
        onOpenOpportunities={() => setIsOpportunitiesOpen(true)}
      />

      {/* Sync Success Toast Banner */}
      {syncToastMessage && (
        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center shadow-md animate-in fade-in slide-in-from-top duration-200 sticky top-16 z-30 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{syncToastMessage}</span>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* TAB 1: HOME (Landing / Teacher Dashboard with seamless view switcher) */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Top View Selector on Home */}
            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
              <button
                onClick={() => setHomeSubView('teacher')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  homeSubView === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                PE Teacher Dashboard
              </button>
              <button
                onClick={() => setHomeSubView('landing')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  homeSubView === 'landing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Platform Overview
              </button>
            </div>

            {homeSubView === 'teacher' ? (
              <TeacherHome
                students={students}
                onSelectStudent={handleSelectStudent}
                setCurrentTab={setCurrentTab}
                onOpenAddStudent={() => setIsAddStudentOpen(true)}
                onViewLanding={() => setHomeSubView('landing')}
              />
            ) : (
              <LandingPage
                setCurrentTab={setCurrentTab}
                setCurrentRole={(r) => {
                  handleSetRole(r);
                  if (r === 'teacher') setHomeSubView('teacher');
                }}
                onQuickStartDemo={handleQuickStartDemo}
              />
            )}
          </div>
        )}

        {/* TAB 2: STUDENTS ROSTER */}
        {currentTab === 'students' && (
          <StudentsView
            students={students}
            onSelectStudent={handleSelectStudent}
            setCurrentTab={setCurrentTab}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
          />
        )}

        {/* TAB 3: 🎥 VIDEO FITNESS ASSESSMENT */}
        {currentTab === 'video-assessment' && (
          <VideoAssessmentView
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            setCurrentTab={setCurrentTab}
            onAssessmentCompleted={handleAssessmentCompleted}
          />
        )}

        {/* TAB 4: ⌨️ MANUAL FITNESS ASSESSMENT FORM */}
        {currentTab === 'fitness-test' && (
          <FitnessTestView
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            setCurrentTab={setCurrentTab}
            onAssessmentCompleted={handleAssessmentCompleted}
          />
        )}

        {/* TAB 4: AI RESULT & SPORT MATCH */}
        {currentTab === 'ai-result' && (
          <AIResultView
            student={selectedStudent}
            onStudentUpdated={handleStudentUpdated}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* TAB 5: PROGRESS & 30-DAY PLAN */}
        {currentTab === 'progress' && (
          <ProgressView
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* TAB 6: ATHLETE PASSPORT */}
        {currentTab === 'passport' && (
          <AthletePassportView
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            setCurrentTab={setCurrentTab}
            onStudentUpdated={handleStudentUpdated}
          />
        )}

        {/* TAB 7: SCOUT TALENT DISCOVERY */}
        {currentTab === 'scout' && (
          <ScoutView
            students={students}
            onSelectStudent={handleSelectStudent}
            onStudentUpdated={handleStudentUpdated}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* TAB 8: GOVERNMENT TALENT OVERVIEW */}
        {currentTab === 'talent-overview' && (
          <TalentOverviewView
            students={students}
            setCurrentTab={setCurrentTab}
          />
        )}

      </main>

      {/* Floating 3-Min Hackathon Demo Launcher Button */}
      <div className="fixed bottom-16 sm:bottom-6 left-4 sm:left-6 z-40 no-print">
        <button
          onClick={() => setIsDemoGuideOpen(!isDemoGuideOpen)}
          className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xl border border-emerald-500/50 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>{isDemoGuideOpen ? 'Hide Demo Guide' : '3-Min Hackathon Demo'}</span>
        </button>
      </div>

      {/* Interactive Hackathon Step-by-Step Navigator Guide */}
      <HackathonDemoGuide
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setCurrentRole={handleSetRole}
        students={students}
        onSelectStudent={handleSelectStudent}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onStudentAdded={handleStudentAdded}
      />

      {/* Sports Opportunities Modal */}
      <OpportunitiesModal
        isOpen={isOpportunitiesOpen}
        onClose={() => setIsOpportunitiesOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Privacy & Safety Footer */}
      <PrivacyDisclaimer />

    </div>
  );
}

export default App;
