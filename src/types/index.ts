export type UserRole = 'teacher' | 'scout' | 'admin' | 'student';

export type NavTab = 
  | 'home' 
  | 'students' 
  | 'video-assessment'
  | 'fitness-test' 
  | 'ai-result' 
  | 'progress' 
  | 'passport' 
  | 'scout' 
  | 'talent-overview';

export type Gender = 'Male' | 'Female' | 'Other';

export type PotentialCategory = 'HIGH POTENTIAL' | 'PROMISING' | 'DEVELOPING';

export type ScoutPipelineStage = 
  | 'Identified' 
  | 'Teacher Verified' 
  | 'AI Recommended' 
  | 'Scout Reviewing' 
  | 'Trial Invited';

export type VideoValidationStatus = 
  | 'IDLE'
  | 'CHECKING' 
  | 'VALID_SPORTS' 
  | 'NOT_SPORTS' 
  | 'LOW_QUALITY'
  | 'UNCERTAIN';

export type SportsClassification = 'sports' | 'non_sports' | 'uncertain';

export interface ClassifierDebugInfo {
  framesAnalyzed: number;
  sportsFrames: number;
  nonSportsFrames: number;
  uncertainFrames: number;
  sportsConfidence: number;
  nonSportsConfidence: number;
  motionIntensityScore: number;
  finalClassification: SportsClassification;
  reason: string;
  frameDetails?: {
    frameIndex: number;
    timestampSec: number;
    percentage: number;
    isSportsMotion: boolean;
    motionDelta: number;
    brightness: number;
    detectedActivityHint?: string;
  }[];
}

export type VideoActivityType = 
  | '100m Sprint' 
  | 'Broad Jump' 
  | 'Vertical Jump' 
  | 'Volleyball Spike' 
  | 'Football Drill' 
  | 'Kabaddi Raid' 
  | 'Athletics General'
  | 'General Fitness' 
  | 'Classroom Video'
  | 'Non-Sports Activity';

export interface VideoMovementMeasurements {
  estimatedTime?: string;         // e.g. "11.4s (100m)" or "4.6s (30m split)"
  estimatedDistance?: string;     // e.g. "100m" or "2.15m"
  runningSpeed?: string;          // e.g. "27.4 km/h"
  acceleration?: string;          // e.g. "3.4 m/s²"
  movementConsistency?: number;   // 0 - 100% e.g. 94%
  takeoffMechanics?: number;      // 0 - 100% e.g. 91%
  landingMechanics?: number;      // 0 - 100% e.g. 88%
  explosivePowerIndex?: number;   // 0 - 100 e.g. 88
  movementIntensity?: 'High' | 'Moderate' | 'Low';
  durationSec?: number;
}

export interface VideoAnalysisMetadata {
  filename: string;
  fileSizeMb: number;
  durationSec: number;
  format: string;
  activityDetected: VideoActivityType;
  confidence: number;            // 0 - 100% (e.g. 92)
  validationStatus: VideoValidationStatus;
  validationReason?: string;
  measurements: VideoMovementMeasurements;
  analyzedAt: string;
  isDemoSample?: boolean;
  debugInfo?: ClassifierDebugInfo;
}

export interface FitnessTestInput {
  sprint30m: number;      // in seconds e.g. 4.6
  broadJump: number;      // in meters e.g. 2.10
  verticalJump: number;   // in cm e.g. 45
  run800m: number;        // in seconds e.g. 165
  pushups: number;        // reps count e.g. 28
  situps: number;         // reps count e.g. 32
  height: number;         // in cm e.g. 165
  weight: number;         // in kg e.g. 52
}

export interface FitnessMetrics {
  speed: number;        // 0 - 100
  power: number;        // 0 - 100
  endurance: number;    // 0 - 100
  strength: number;     // 0 - 100
  agility: number;      // 0 - 100
}

export interface SportMatch {
  sport: string;         // 'Athletics' | 'Volleyball' | 'Football' | 'Kabaddi' | 'Badminton'
  matchPercentage: number; // 0 - 100
  badge: string;
  why: string[];
  iconName: string;
}

export interface AIAnalysisResult {
  overallScore: number;       // 0 - 100 (e.g. 87)
  potentialCategory: PotentialCategory;
  metrics: FitnessMetrics;
  sportMatches: SportMatch[];
  bestSport: SportMatch;
  analysisSummary: string;
  calculatedAt: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  date: string;
  monthLabel: string; // e.g. 'Month 1', 'Month 2'
  assessmentType: 'video' | 'manual';
  input: FitnessTestInput;
  result: AIAnalysisResult;
  improvementPercent?: number;
  videoMetadata?: VideoAnalysisMetadata;
}

export interface TeacherObservation {
  disciplined: boolean;
  strongMotivation: boolean;
  teamwork: boolean;
  leadership: boolean;
  regularAttendance: boolean;
  fastLearner: boolean;
  coachability: boolean;
  comment: string;
  updatedAt: string;
}

export interface GrowthPlanWeek {
  weekNumber: number;
  title: string;
  focus: string;
  drills: string[];
}

export interface GrowthPlan {
  goalTitle: string;
  currentMetric: string;
  targetMetric: string;
  weeks: GrowthPlanWeek[];
  coachDisclaimer: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface Student {
  id: string; // e.g. 'GA-2026-00482'
  name: string;
  age: number;
  gender: Gender;
  school: string;
  district: string;
  village: string;
  height: number; // in cm
  weight: number; // in kg
  sportsExperience: string;
  previousAchievement: string;
  registeredAt: string;
  scoutStatus: ScoutPipelineStage;
  trialDate?: string;
  isShortlisted?: boolean;
  isReferredToScout?: boolean;
  teacherObservation?: TeacherObservation;
  growthPlan?: GrowthPlan;
  assessments: AssessmentRecord[];
  latestAssessment?: AssessmentRecord;
  isRisingTalent?: boolean;
  overallImprovementRate?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  sport: string;
  location: string;
  district: string;
  date: string;
  eligibility: string;
  organization: string;
  description: string;
  applied: boolean;
}

export interface DistrictTalentSummary {
  district: string;
  schoolsCount: number;
  testedCount: number;
  videoAssessmentsCount: number;
  highPotentialCount: number;
  risingTalentCount: number;
  scoutReferralsCount: number;
  topSport: string;
  topSchool: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'assessment' | 'student' | 'observation' | 'scout';
  title: string;
  timestamp: string;
  data: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning' | 'scout';
}

