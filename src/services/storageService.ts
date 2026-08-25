import { 
  Student, 
  FitnessTestInput, 
  TeacherObservation, 
  ScoutPipelineStage, 
  Opportunity, 
  DistrictTalentSummary, 
  SyncQueueItem, 
  UserRole 
} from '../types';
import { 
  createInitialStudents, 
  DEMO_OPPORTUNITIES, 
  DISTRICT_SUMMARIES 
} from './mockData';
import { 
  analyzeAthleteData, 
  generate30DayGrowthPlan 
} from './aiEngine';
import { VideoAnalysisMetadata } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'gramathlete_students_v1',
  ROLE: 'gramathlete_role_v1',
  IS_OFFLINE: 'gramathlete_is_offline_v1',
  SYNC_QUEUE: 'gramathlete_sync_queue_v1',
  OPPORTUNITIES: 'gramathlete_opportunities_v1',
  SELECTED_STUDENT: 'gramathlete_selected_student_id_v1'
};

export const getStoredRole = (): UserRole => {
  const role = localStorage.getItem(STORAGE_KEYS.ROLE);
  if (role === 'teacher' || role === 'scout' || role === 'admin' || role === 'student') {
    return role;
  }
  return 'teacher';
};

export const setStoredRole = (role: UserRole): void => {
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
};

export const isOfflineMode = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.IS_OFFLINE) === 'true';
};

export const setOfflineMode = (offline: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.IS_OFFLINE, offline ? 'true' : 'false');
};

export const getSyncQueue = (): SyncQueueItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveSyncQueue = (queue: SyncQueueItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
};

export const getStoredStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!data) {
    const initial = createInitialStudents();
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch {
    const initial = createInitialStudents();
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initial));
    return initial;
  }
};

export const saveStoredStudents = (students: Student[]): void => {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const getStudentById = (id: string): Student | undefined => {
  const students = getStoredStudents();
  return students.find(s => s.id === id);
};

export const getSelectedStudentId = (): string => {
  const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT);
  if (stored) return stored;
  // Default to Ravi Kumar for immediate demo flow
  return 'GA-2026-00482';
};

export const setSelectedStudentId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, id);
};

export const getOpportunities = (): Opportunity[] => {
  const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(DEMO_OPPORTUNITIES));
    return DEMO_OPPORTUNITIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEMO_OPPORTUNITIES;
  }
};

export const applyToOpportunity = (id: string): Opportunity[] => {
  const opps = getOpportunities();
  const updated = opps.map(o => o.id === id ? { ...o, applied: true } : o);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(updated));
  return updated;
};

// Generate Athlete ID GA-2026-XXXXX
export const generateAthleteId = (existingCount: number): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GA-2026-${String(existingCount + 100).slice(0, 2)}${randomSuffix.toString().slice(-3)}`;
};

export const addStudent = (studentData: Omit<Student, 'id' | 'registeredAt' | 'scoutStatus' | 'assessments' | 'growthPlan'>): Student => {
  const students = getStoredStudents();
  const newId = generateAthleteId(students.length);
  const newStudent: Student = {
    ...studentData,
    id: newId,
    registeredAt: new Date().toISOString().split('T')[0],
    scoutStatus: 'Identified',
    isShortlisted: false,
    isReferredToScout: false,
    isRisingTalent: false,
    overallImprovementRate: 0,
    assessments: []
  };

  const updatedStudents = [newStudent, ...students];
  saveStoredStudents(updatedStudents);

  if (isOfflineMode()) {
    const queue = getSyncQueue();
    queue.push({
      id: `sync-${Date.now()}`,
      type: 'student',
      title: `New Student: ${newStudent.name} (${newStudent.id})`,
      timestamp: new Date().toLocaleTimeString(),
      data: newStudent
    });
    saveSyncQueue(queue);
  }

  return newStudent;
};

export const submitFitnessAssessment = (studentId: string, input: FitnessTestInput): { student: Student; result: any } => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) {
    throw new Error(`Student ${studentId} not found`);
  }

  const aiResult = analyzeAthleteData(input);
  const growthPlan = generate30DayGrowthPlan(input, aiResult);

  const prevAssessments = student.assessments || [];
  const monthNum = prevAssessments.length + 1;
  const prevScore = prevAssessments.length > 0 
    ? prevAssessments[prevAssessments.length - 1].result.overallScore 
    : aiResult.overallScore;

  const improvementPercent = prevAssessments.length > 0 && prevScore > 0
    ? parseFloat((((aiResult.overallScore - prevScore) / prevScore) * 100).toFixed(1))
    : 0;

  // Calculate cumulative improvement from first assessment
  const firstScore = prevAssessments.length > 0 
    ? prevAssessments[0].result.overallScore 
    : aiResult.overallScore;
  const overallImprovementRate = prevAssessments.length > 0 && firstScore > 0
    ? parseFloat((((aiResult.overallScore - firstScore) / firstScore) * 100).toFixed(1))
    : improvementPercent;

  const isRising = overallImprovementRate >= 10.0 || (prevAssessments.length >= 2 && improvementPercent >= 7.0);

  const newAssessmentRecord = {
    id: `ass-${Date.now()}`,
    studentId,
    date: new Date().toISOString().split('T')[0],
    monthLabel: `Month ${monthNum}`,
    assessmentType: 'manual' as const,
    input,
    result: aiResult,
    improvementPercent
  };

  // If high potential, advance pipeline if currently 'Identified'
  let newScoutStatus = student.scoutStatus;
  if (aiResult.potentialCategory === 'HIGH POTENTIAL' && newScoutStatus === 'Identified') {
    newScoutStatus = 'AI Recommended';
  }

  const updatedStudent: Student = {
    ...student,
    height: input.height,
    weight: input.weight,
    scoutStatus: newScoutStatus,
    isRisingTalent: isRising,
    overallImprovementRate: Math.max(0, overallImprovementRate),
    assessments: [...prevAssessments, newAssessmentRecord],
    latestAssessment: newAssessmentRecord,
    growthPlan
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);

  if (isOfflineMode()) {
    const queue = getSyncQueue();
    queue.push({
      id: `sync-${Date.now()}`,
      type: 'assessment',
      title: `Manual Assessment for ${student.name} (${aiResult.overallScore}/100 - ${aiResult.bestSport.sport})`,
      timestamp: new Date().toLocaleTimeString(),
      data: newAssessmentRecord
    });
    saveSyncQueue(queue);
  }

  return { student: updatedStudent, result: aiResult };
};

export const submitVideoAssessment = (
  studentId: string,
  videoMetadata: VideoAnalysisMetadata,
  fitnessInput: FitnessTestInput
): { student: Student; result: any } => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) {
    throw new Error(`Student ${studentId} not found`);
  }

  const aiResult = analyzeAthleteData(fitnessInput);
  const growthPlan = generate30DayGrowthPlan(fitnessInput, aiResult);

  const prevAssessments = student.assessments || [];
  const monthNum = prevAssessments.length + 1;
  const prevScore = prevAssessments.length > 0 
    ? prevAssessments[prevAssessments.length - 1].result.overallScore 
    : aiResult.overallScore;

  const improvementPercent = prevAssessments.length > 0 && prevScore > 0
    ? parseFloat((((aiResult.overallScore - prevScore) / prevScore) * 100).toFixed(1))
    : 0;

  // Calculate cumulative improvement from first assessment
  const firstScore = prevAssessments.length > 0 
    ? prevAssessments[0].result.overallScore 
    : aiResult.overallScore;
  const overallImprovementRate = prevAssessments.length > 0 && firstScore > 0
    ? parseFloat((((aiResult.overallScore - firstScore) / firstScore) * 100).toFixed(1))
    : improvementPercent;

  const isRising = overallImprovementRate >= 10.0 || (prevAssessments.length >= 2 && improvementPercent >= 7.0);

  const newAssessmentRecord = {
    id: `ass-vid-${Date.now()}`,
    studentId,
    date: new Date().toISOString().split('T')[0],
    monthLabel: `Month ${monthNum}`,
    assessmentType: 'video' as const,
    input: fitnessInput,
    result: aiResult,
    improvementPercent,
    videoMetadata
  };

  // If high potential, advance pipeline if currently 'Identified'
  let newScoutStatus = student.scoutStatus;
  if (aiResult.potentialCategory === 'HIGH POTENTIAL' && newScoutStatus === 'Identified') {
    newScoutStatus = 'AI Recommended';
  }

  const updatedStudent: Student = {
    ...student,
    height: fitnessInput.height,
    weight: fitnessInput.weight,
    scoutStatus: newScoutStatus,
    isRisingTalent: isRising,
    overallImprovementRate: Math.max(0, overallImprovementRate),
    assessments: [...prevAssessments, newAssessmentRecord],
    latestAssessment: newAssessmentRecord,
    growthPlan
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);

  if (isOfflineMode()) {
    const queue = getSyncQueue();
    queue.push({
      id: `sync-${Date.now()}`,
      type: 'assessment',
      title: `Video Assessment for ${student.name} (${videoMetadata.activityDetected} - ${aiResult.overallScore}/100)`,
      timestamp: new Date().toLocaleTimeString(),
      data: newAssessmentRecord
    });
    saveSyncQueue(queue);
  }

  return { student: updatedStudent, result: aiResult };
};

export const updateObservation = (studentId: string, observation: TeacherObservation): Student => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) throw new Error('Student not found');

  const updatedStudent: Student = {
    ...student,
    teacherObservation: observation,
    scoutStatus: student.scoutStatus === 'Identified' ? 'Teacher Verified' : student.scoutStatus
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);

  if (isOfflineMode()) {
    const queue = getSyncQueue();
    queue.push({
      id: `sync-${Date.now()}`,
      type: 'observation',
      title: `Teacher Observation for ${student.name}`,
      timestamp: new Date().toLocaleTimeString(),
      data: observation
    });
    saveSyncQueue(queue);
  }

  return updatedStudent;
};

export const referToScout = (studentId: string): Student => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) throw new Error('Student not found');

  const updatedStudent: Student = {
    ...student,
    isReferredToScout: true,
    scoutStatus: student.scoutStatus === 'Identified' ? 'Teacher Verified' : student.scoutStatus
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);
  return updatedStudent;
};

export const updateScoutStage = (studentId: string, stage: ScoutPipelineStage, trialDate?: string): Student => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) throw new Error('Student not found');

  const updatedStudent: Student = {
    ...student,
    scoutStatus: stage,
    trialDate: trialDate || student.trialDate
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);
  return updatedStudent;
};

export const toggleStudentShortlist = (studentId: string): boolean => {
  const students = getStoredStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return false;

  const newStatus = !student.isShortlisted;
  const updatedStudent: Student = {
    ...student,
    isShortlisted: newStatus
  };

  const updatedList = students.map(s => s.id === studentId ? updatedStudent : s);
  saveStoredStudents(updatedList);
  return newStatus;
};

export const syncOfflineQueueNow = (): { count: number; items: SyncQueueItem[] } => {
  const queue = getSyncQueue();
  const count = queue.length;
  // Clear queue
  saveSyncQueue([]);
  return { count, items: queue };
};

export const getAggregatedDistrictSummaries = (): DistrictTalentSummary[] => {
  const students = getStoredStudents();
  const baseline = [...DISTRICT_SUMMARIES];

  return baseline.map(dist => {
    const districtStudents = students.filter(s => s.district.toLowerCase() === dist.district.toLowerCase());
    const testedLocal = districtStudents.filter(s => s.latestAssessment).length;
    const videoAssLocal = districtStudents.filter(s => s.latestAssessment?.assessmentType === 'video').length;
    const highPotLocal = districtStudents.filter(s => s.latestAssessment?.result.potentialCategory === 'HIGH POTENTIAL').length;
    const risingLocal = districtStudents.filter(s => s.isRisingTalent).length;
    const referredLocal = districtStudents.filter(s => s.isReferredToScout).length;

    return {
      ...dist,
      testedCount: dist.testedCount + testedLocal,
      videoAssessmentsCount: dist.videoAssessmentsCount + videoAssLocal,
      highPotentialCount: dist.highPotentialCount + highPotLocal,
      risingTalentCount: dist.risingTalentCount + risingLocal,
      scoutReferralsCount: dist.scoutReferralsCount + referredLocal
    };
  });
};

export const resetAllDemoData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.IS_OFFLINE);
  localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_STUDENT);
  getStoredStudents();
};
