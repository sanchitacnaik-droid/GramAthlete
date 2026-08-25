import { 
  Student, 
  Opportunity, 
  DistrictTalentSummary, 
  AppNotification, 
  FitnessTestInput 
} from '../types';
import { analyzeAthleteData, generate30DayGrowthPlan } from './aiEngine';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'High Potential Detected',
    message: 'Ravi Kumar (Shivamogga) reached score 87/100 in Athletics.',
    timestamp: '10 mins ago',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'Rising Talent Alert 🚀',
    message: 'Ravi Kumar improved by +16.2% over last 60 days.',
    timestamp: '2 hours ago',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-3',
    title: 'Scout Review Request',
    message: 'Karnataka State SAI Scout reviewed Meena Patil (Belagavi).',
    timestamp: '1 day ago',
    read: true,
    type: 'scout'
  },
  {
    id: 'notif-4',
    title: 'Trial Invitation Dispatched',
    message: 'District Athletics Trial invitation sent for Arjun Rathod.',
    timestamp: '2 days ago',
    read: true,
    type: 'scout'
  }
];

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'District Athletics Talent Hunt 2026',
    sport: 'Athletics',
    location: 'District Stadium, Shivamogga',
    district: 'Shivamogga',
    date: 'March 15, 2026',
    eligibility: 'U-16 Boys & Girls with Sprint < 5.0s or Broad Jump > 1.80m',
    organization: 'Department of Youth Empowerment & Sports (DYES)',
    description: 'Direct trials for residential sports hostel admission with full scholarship and nutritional support.',
    applied: false
  },
  {
    id: 'opp-2',
    title: 'State Volleyball Development Camp',
    sport: 'Volleyball',
    location: 'Chamundi Vihar Stadium, Mysuru',
    district: 'Mysuru',
    date: 'April 02, 2026',
    eligibility: 'U-17 Students with Vertical Leap > 45cm',
    organization: 'Karnataka Volleyball Association',
    description: 'Intensive 21-day camp coached by NIS certified instructors. Top 8 selected for Junior State team.',
    applied: true
  },
  {
    id: 'opp-3',
    title: 'SAI Rural Talent Search Trials',
    sport: 'Kabaddi',
    location: 'Ballari Sports Complex, Ballari',
    district: 'Ballari',
    date: 'March 28, 2026',
    eligibility: 'Age 14-17 with high agility & strength metrics',
    organization: 'Sports Authority of India (SAI)',
    description: 'National scouting initiative for Khelo India youth development feeder centers.',
    applied: false
  },
  {
    id: 'opp-4',
    title: 'Junior State Football League Trials',
    sport: 'Football',
    location: 'District Ground, Belagavi',
    district: 'Belagavi',
    date: 'April 10, 2026',
    eligibility: 'Age 13-16 with 800m run under 2m 45s',
    organization: 'Karnataka State Football Association',
    description: 'Selection trials for regional academy squad competing in national youth championships.',
    applied: false
  },
  {
    id: 'opp-5',
    title: 'Karnataka Badminton Talent Program',
    sport: 'Badminton',
    location: 'Sir M. Visvesvaraya Indoor Stadium, Mandya',
    district: 'Mandya',
    date: 'March 22, 2026',
    eligibility: 'Age 12-15 with agility test score >= 80',
    organization: 'State Badminton Development Cell',
    description: 'Equipment sponsorship and weekend training camps by former national champions.',
    applied: false
  }
];

export const DISTRICT_SUMMARIES: DistrictTalentSummary[] = [
  {
    district: 'Shivamogga',
    schoolsCount: 6,
    testedCount: 126,
    videoAssessmentsCount: 48,
    highPotentialCount: 18,
    risingTalentCount: 11,
    scoutReferralsCount: 8,
    topSport: 'Athletics',
    topSchool: 'Govt High School, Tirthahalli'
  },
  {
    district: 'Mysuru',
    schoolsCount: 5,
    testedCount: 310,
    videoAssessmentsCount: 112,
    highPotentialCount: 42,
    risingTalentCount: 19,
    scoutReferralsCount: 10,
    topSport: 'Volleyball',
    topSchool: 'Morarji Desai Residential School'
  },
  {
    district: 'Ballari',
    schoolsCount: 4,
    testedCount: 245,
    videoAssessmentsCount: 84,
    highPotentialCount: 35,
    risingTalentCount: 14,
    scoutReferralsCount: 7,
    topSport: 'Football',
    topSchool: 'Govt PU College, Sandur'
  },
  {
    district: 'Belagavi',
    schoolsCount: 4,
    testedCount: 220,
    videoAssessmentsCount: 76,
    highPotentialCount: 38,
    risingTalentCount: 12,
    scoutReferralsCount: 6,
    topSport: 'Athletics',
    topSchool: 'Kittur Rani Channamma School'
  },
  {
    district: 'Kalaburagi',
    schoolsCount: 3,
    testedCount: 185,
    videoAssessmentsCount: 62,
    highPotentialCount: 29,
    risingTalentCount: 9,
    scoutReferralsCount: 4,
    topSport: 'Kabaddi',
    topSchool: 'Adarsha Vidyalaya, Aland'
  },
  {
    district: 'Mandya',
    schoolsCount: 2,
    testedCount: 154,
    videoAssessmentsCount: 55,
    highPotentialCount: 24,
    risingTalentCount: 7,
    scoutReferralsCount: 3,
    topSport: 'Badminton',
    topSchool: 'Govt High School, Maddur'
  }
];

// Helper to build assessment histories for demo students
const makeAssessment = (
  id: string,
  studentId: string,
  date: string,
  monthLabel: string,
  input: FitnessTestInput,
  improvementPercent?: number,
  assessmentType: 'video' | 'manual' = 'manual',
  videoMetadata?: any
) => {
  const result = analyzeAthleteData(input);
  return {
    id,
    studentId,
    date,
    monthLabel,
    assessmentType,
    input,
    result,
    improvementPercent,
    videoMetadata
  };
};

export const createInitialStudents = (): Student[] => {
  // 1. RAVI KUMAR (The primary demo hero)
  const raviInput4: FitnessTestInput = {
    sprint30m: 4.6,
    broadJump: 2.15,
    verticalJump: 50,
    run800m: 158,
    pushups: 26,
    situps: 32,
    height: 165,
    weight: 53
  };
  const raviInput3: FitnessTestInput = {
    sprint30m: 4.7,
    broadJump: 2.05,
    verticalJump: 46,
    run800m: 168,
    pushups: 23,
    situps: 29,
    height: 164,
    weight: 53
  };
  const raviInput2: FitnessTestInput = {
    sprint30m: 4.8,
    broadJump: 1.95,
    verticalJump: 42,
    run800m: 178,
    pushups: 20,
    situps: 26,
    height: 164,
    weight: 52
  };
  const raviInput1: FitnessTestInput = {
    sprint30m: 4.9,
    broadJump: 1.85,
    verticalJump: 38,
    run800m: 190,
    pushups: 16,
    situps: 22,
    height: 163,
    weight: 52
  };

  const raviAss1 = makeAssessment('ass-ravi-1', 'GA-2026-00482', '2025-11-10', 'Month 1', raviInput1, undefined, 'manual');
  const raviAss2 = makeAssessment('ass-ravi-2', 'GA-2026-00482', '2025-12-12', 'Month 2', raviInput2, 8.3, 'manual');
  const raviAss3 = makeAssessment('ass-ravi-3', 'GA-2026-00482', '2026-01-15', 'Month 3', raviInput3, 7.7, 'manual');
  const raviAss4 = makeAssessment('ass-ravi-4', 'GA-2026-00482', '2026-02-18', 'Month 4', raviInput4, 3.6, 'video', {
    filename: 'ravi_kumar_100m_sprint_district_trials.mp4',
    fileSizeMb: 14.8,
    durationSec: 12.4,
    format: 'MP4',
    activityDetected: '100m Sprint',
    confidence: 92,
    validationStatus: 'VALID_SPORTS',
    validationReason: 'Sports movement sequence verified with standard human pose extraction.',
    measurements: {
      estimatedTime: '11.42s (100m)',
      estimatedDistance: '100 meters',
      runningSpeed: '27.4 km/h top velocity',
      acceleration: '3.42 m/s²',
      movementConsistency: 94,
      explosivePowerIndex: 88,
      takeoffMechanics: 91,
      landingMechanics: 89,
      movementIntensity: 'High',
      durationSec: 12.4
    },
    analyzedAt: '2026-02-18T10:30:00Z',
    isDemoSample: true
  });

  const raviResult = raviAss4.result;
  const raviGrowthPlan = generate30DayGrowthPlan(raviInput4, raviResult);

  const ravi: Student = {
    id: 'GA-2026-00482',
    name: 'Ravi Kumar',
    age: 15,
    gender: 'Male',
    school: 'Government High School',
    district: 'Shivamogga',
    village: 'Tirthahalli',
    height: 165,
    weight: 53,
    sportsExperience: 'School annual sports 100m, village kabaddi games',
    previousAchievement: 'School 100m — 1st place | Taluk Athletics — 2nd place',
    registeredAt: '2025-11-01',
    scoutStatus: 'Scout Reviewing',
    isShortlisted: true,
    isReferredToScout: true,
    isRisingTalent: true,
    overallImprovementRate: 16.2,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: false,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Student consistently performs well during school athletics and shows strong motivation to improve. Highly receptive to sprint posture coaching.',
      updatedAt: '2026-02-18'
    },
    growthPlan: raviGrowthPlan,
    assessments: [raviAss1, raviAss2, raviAss3, raviAss4],
    latestAssessment: raviAss4
  };

  // 2. ANJALI GOWDA (Volleyball Specialist)
  const anjaliInput: FitnessTestInput = {
    sprint30m: 4.9,
    broadJump: 2.10,
    verticalJump: 54,
    run800m: 172,
    pushups: 22,
    situps: 30,
    height: 170,
    weight: 56
  };
  const anjaliAss1 = makeAssessment('ass-anjali-1', 'GA-2026-00104', '2025-12-05', 'Month 1', {
    ...anjaliInput,
    verticalJump: 46,
    sprint30m: 5.1
  });
  const anjaliAss2 = makeAssessment('ass-anjali-2', 'GA-2026-00104', '2026-02-10', 'Month 2', anjaliInput, 8.5);
  const anjali: Student = {
    id: 'GA-2026-00104',
    name: 'Anjali Gowda',
    age: 14,
    gender: 'Female',
    school: 'Morarji Desai Residential School',
    district: 'Mysuru',
    village: 'Hunsur',
    height: 170,
    weight: 56,
    sportsExperience: 'School volleyball team captain, kho-kho player',
    previousAchievement: 'District U-14 Volleyball Runner-up',
    registeredAt: '2025-12-01',
    scoutStatus: 'Teacher Verified',
    isShortlisted: true,
    isReferredToScout: true,
    isRisingTalent: false,
    overallImprovementRate: 8.5,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: true,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Excellent court vision, tall reach, and natural vertical lift. Great leadership among peers.',
      updatedAt: '2026-02-10'
    },
    growthPlan: generate30DayGrowthPlan(anjaliInput, anjaliAss2.result),
    assessments: [anjaliAss1, anjaliAss2],
    latestAssessment: anjaliAss2
  };

  // 3. MEENA PATIL (Top Athletics high potential)
  const meenaInput: FitnessTestInput = {
    sprint30m: 4.4,
    broadJump: 2.22,
    verticalJump: 52,
    run800m: 150,
    pushups: 25,
    situps: 35,
    height: 162,
    weight: 50
  };
  const meenaAss1 = makeAssessment('ass-meena-1', 'GA-2026-00219', '2025-11-20', 'Month 1', {
    ...meenaInput,
    sprint30m: 4.6
  });
  const meenaAss2 = makeAssessment('ass-meena-2', 'GA-2026-00219', '2026-02-04', 'Month 2', meenaInput, 5.2);
  const meena: Student = {
    id: 'GA-2026-00219',
    name: 'Meena Patil',
    age: 15,
    gender: 'Female',
    school: 'Kittur Rani Channamma School',
    district: 'Belagavi',
    village: 'Bailhongal',
    height: 162,
    weight: 50,
    sportsExperience: 'Taluk level 200m champion',
    previousAchievement: 'Gold Medal - Belagavi District 200m Sprint',
    registeredAt: '2025-11-15',
    scoutStatus: 'Trial Invited',
    trialDate: '2026-03-20',
    isShortlisted: true,
    isReferredToScout: true,
    isRisingTalent: false,
    overallImprovementRate: 5.2,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: false,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Raw athletic acceleration. Exceptional natural sprint rhythm.',
      updatedAt: '2026-02-04'
    },
    growthPlan: generate30DayGrowthPlan(meenaInput, meenaAss2.result),
    assessments: [meenaAss1, meenaAss2],
    latestAssessment: meenaAss2
  };

  // 4. KIRAN NAYAK (Football & Stamina)
  const kiranInput: FitnessTestInput = {
    sprint30m: 4.8,
    broadJump: 1.98,
    verticalJump: 42,
    run800m: 146,
    pushups: 24,
    situps: 34,
    height: 168,
    weight: 58
  };
  const kiranAss1 = makeAssessment('ass-kiran-1', 'GA-2026-00331', '2026-01-10', 'Month 1', kiranInput);
  const kiran: Student = {
    id: 'GA-2026-00331',
    name: 'Kiran Nayak',
    age: 16,
    gender: 'Male',
    school: 'Govt PU College',
    district: 'Ballari',
    village: 'Sandur',
    height: 168,
    weight: 58,
    sportsExperience: 'Midfielder in local rural football club',
    previousAchievement: 'Sandur Taluk Football Best Midfielder 2025',
    registeredAt: '2026-01-05',
    scoutStatus: 'Identified',
    isShortlisted: false,
    isReferredToScout: false,
    isRisingTalent: false,
    overallImprovementRate: 0,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: true,
      regularAttendance: true,
      fastLearner: false,
      coachability: true,
      comment: 'Very high aerobic stamina. Never gets tired during 800m drills.',
      updatedAt: '2026-01-10'
    },
    growthPlan: generate30DayGrowthPlan(kiranInput, kiranAss1.result),
    assessments: [kiranAss1],
    latestAssessment: kiranAss1
  };

  // 5. ARJUN RATHOD (Kabaddi Powerhouse)
  const arjunInput: FitnessTestInput = {
    sprint30m: 4.7,
    broadJump: 2.12,
    verticalJump: 46,
    run800m: 175,
    pushups: 35,
    situps: 42,
    height: 172,
    weight: 66
  };
  const arjunAss1 = makeAssessment('ass-arjun-1', 'GA-2026-00412', '2025-12-18', 'Month 1', {
    ...arjunInput,
    pushups: 26,
    situps: 32
  });
  const arjunAss2 = makeAssessment('ass-arjun-2', 'GA-2026-00412', '2026-02-14', 'Month 2', arjunInput, 14.8);
  const arjun: Student = {
    id: 'GA-2026-00412',
    name: 'Arjun Rathod',
    age: 16,
    gender: 'Male',
    school: 'Adarsha Vidyalaya',
    district: 'Kalaburagi',
    village: 'Aland',
    height: 172,
    weight: 66,
    sportsExperience: 'Right raider in local village kabaddi tournaments',
    previousAchievement: 'Kalaburagi Rural Kabaddi Best Raider Trophy',
    registeredAt: '2025-12-10',
    scoutStatus: 'AI Recommended',
    isShortlisted: true,
    isReferredToScout: true,
    isRisingTalent: true,
    overallImprovementRate: 14.8,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: true,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Strong upper body power and fearless tackling spirit. Outstanding kabaddi potential.',
      updatedAt: '2026-02-14'
    },
    growthPlan: generate30DayGrowthPlan(arjunInput, arjunAss2.result),
    assessments: [arjunAss1, arjunAss2],
    latestAssessment: arjunAss2
  };

  // 6. SNEHA PUJAR (Badminton Agility)
  const snehaInput: FitnessTestInput = {
    sprint30m: 4.8,
    broadJump: 1.95,
    verticalJump: 44,
    run800m: 168,
    pushups: 20,
    situps: 30,
    height: 158,
    weight: 47
  };
  const snehaAss1 = makeAssessment('ass-sneha-1', 'GA-2026-00523', '2026-01-20', 'Month 1', snehaInput);
  const sneha: Student = {
    id: 'GA-2026-00523',
    name: 'Sneha Pujar',
    age: 14,
    gender: 'Female',
    school: 'Govt High School',
    district: 'Mandya',
    village: 'Maddur',
    height: 158,
    weight: 47,
    sportsExperience: 'School badminton singles player',
    previousAchievement: 'Mandya Taluk Shuttle Badminton Champion',
    registeredAt: '2026-01-12',
    scoutStatus: 'Teacher Verified',
    isShortlisted: false,
    isReferredToScout: true,
    isRisingTalent: false,
    overallImprovementRate: 0,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: false,
      leadership: false,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Extremely quick reflexes and court footwork speed.',
      updatedAt: '2026-01-20'
    },
    growthPlan: generate30DayGrowthPlan(snehaInput, snehaAss1.result),
    assessments: [snehaAss1],
    latestAssessment: snehaAss1
  };

  // 7. MANOJ HEGDE
  const manojInput: FitnessTestInput = {
    sprint30m: 5.1,
    broadJump: 1.88,
    verticalJump: 40,
    run800m: 162,
    pushups: 19,
    situps: 28,
    height: 164,
    weight: 54
  };
  const manojAss = makeAssessment('ass-manoj-1', 'GA-2026-00615', '2026-02-01', 'Month 1', manojInput);
  const manoj: Student = {
    id: 'GA-2026-00615',
    name: 'Manoj Hegde',
    age: 15,
    gender: 'Male',
    school: 'Government High School',
    district: 'Shivamogga',
    village: 'Sagara',
    height: 164,
    weight: 54,
    sportsExperience: 'School football goalkeeper and defender',
    previousAchievement: 'School Sports Day High Jump 3rd place',
    registeredAt: '2026-01-25',
    scoutStatus: 'Identified',
    isShortlisted: false,
    isReferredToScout: false,
    isRisingTalent: false,
    overallImprovementRate: 0,
    teacherObservation: {
      disciplined: true,
      strongMotivation: false,
      teamwork: true,
      leadership: false,
      regularAttendance: true,
      fastLearner: false,
      coachability: true,
      comment: 'Solid work ethic. Needs encouragement on speed acceleration.',
      updatedAt: '2026-02-01'
    },
    growthPlan: generate30DayGrowthPlan(manojInput, manojAss.result),
    assessments: [manojAss],
    latestAssessment: manojAss
  };

  // 8. KAVYA SHETTY (Rising Talent in Volleyball)
  const kavyaInput: FitnessTestInput = {
    sprint30m: 4.7,
    broadJump: 2.14,
    verticalJump: 56,
    run800m: 164,
    pushups: 24,
    situps: 33,
    height: 173,
    weight: 57
  };
  const kavyaAss1 = makeAssessment('ass-kavya-1', 'GA-2026-00728', '2025-11-28', 'Month 1', {
    ...kavyaInput,
    verticalJump: 44,
    sprint30m: 5.1
  });
  const kavyaAss2 = makeAssessment('ass-kavya-2', 'GA-2026-00728', '2026-02-12', 'Month 2', kavyaInput, 15.6);
  const kavya: Student = {
    id: 'GA-2026-00728',
    name: 'Kavya Shetty',
    age: 15,
    gender: 'Female',
    school: 'Morarji Desai Residential School',
    district: 'Mysuru',
    village: 'Nanjangud',
    height: 173,
    weight: 57,
    sportsExperience: 'School volleyball smash specialist',
    previousAchievement: 'Mysuru Taluk Volleyball Best Attacker',
    registeredAt: '2025-11-20',
    scoutStatus: 'Scout Reviewing',
    isShortlisted: true,
    isReferredToScout: true,
    isRisingTalent: true,
    overallImprovementRate: 15.6,
    teacherObservation: {
      disciplined: true,
      strongMotivation: true,
      teamwork: true,
      leadership: true,
      regularAttendance: true,
      fastLearner: true,
      coachability: true,
      comment: 'Tremendous height advantage combined with sharp jump timing.',
      updatedAt: '2026-02-12'
    },
    growthPlan: generate30DayGrowthPlan(kavyaInput, kavyaAss2.result),
    assessments: [kavyaAss1, kavyaAss2],
    latestAssessment: kavyaAss2
  };

  // Generate 12 more realistic students to complete the 20+ requirement
  const additionalNames = [
    { name: 'Praveen Naik', gender: 'Male' as const, age: 14, district: 'Ballari', school: 'Govt PU College', village: 'Sandur', sport: 'Football', prev: 'Taluk 400m 2nd' },
    { name: 'Deepa K', gender: 'Female' as const, age: 15, district: 'Belagavi', school: 'Kittur Rani Channamma School', village: 'Chikodi', sport: 'Athletics', prev: 'High Jump Silver' },
    { name: 'Suresh Chaluvadi', gender: 'Male' as const, age: 16, district: 'Kalaburagi', school: 'Adarsha Vidyalaya', village: 'Sedam', sport: 'Kabaddi', prev: 'Inter-school Kabaddi Winner' },
    { name: 'Pooja Honnalli', gender: 'Female' as const, age: 14, district: 'Mandya', school: 'Govt High School', village: 'Pandavapura', sport: 'Badminton', prev: 'District U-14 Quarterfinalist' },
    { name: 'Basavaraj M', gender: 'Male' as const, age: 15, district: 'Shivamogga', school: 'Government High School', village: 'Bhadravathi', sport: 'Athletics', prev: 'Taluk Cross Country 4th' },
    { name: 'Lakshmi G', gender: 'Female' as const, age: 16, district: 'Mysuru', school: 'Morarji Desai Residential School', village: 'K.R. Nagar', sport: 'Volleyball', prev: 'Zonal Volleyball Team Member' },
    { name: 'Vijay Kumar', gender: 'Male' as const, age: 14, district: 'Ballari', school: 'Govt PU College', village: 'Hospet', sport: 'Athletics', prev: 'School 100m 2nd' },
    { name: 'Rashmi B', gender: 'Female' as const, age: 15, district: 'Belagavi', school: 'Kittur Rani Channamma School', village: 'Gokak', sport: 'Athletics', prev: 'District Long Jump Bronze' },
    { name: 'Chetan Gowda', gender: 'Male' as const, age: 16, district: 'Kalaburagi', school: 'Adarsha Vidyalaya', village: 'Jewargi', sport: 'Kabaddi', prev: 'District Kabaddi Team' },
    { name: 'Divya Patil', gender: 'Female' as const, age: 14, district: 'Mandya', school: 'Govt High School', village: 'Nagamangala', sport: 'Badminton', prev: 'School Badminton Champion' },
    { name: 'Sandeep S', gender: 'Male' as const, age: 15, district: 'Shivamogga', school: 'Government High School', village: 'Shikaripura', sport: 'Football', prev: 'School Football Striker' },
    { name: 'Roopa K', gender: 'Female' as const, age: 15, district: 'Mysuru', school: 'Morarji Desai Residential School', village: 'Periyapatna', sport: 'Volleyball', prev: 'District Volleyball Squad' }
  ];

  const extraStudents: Student[] = additionalNames.map((s, idx) => {
    const id = `GA-2026-${String(800 + idx).padStart(5, '0')}`;
    const baseSprint = 4.6 + (idx % 5) * 0.15;
    const baseJump = 1.80 + (idx % 4) * 0.12;
    const input: FitnessTestInput = {
      sprint30m: parseFloat(baseSprint.toFixed(2)),
      broadJump: parseFloat(baseJump.toFixed(2)),
      verticalJump: 38 + (idx % 6) * 3,
      run800m: 160 + (idx % 5) * 8,
      pushups: 18 + (idx % 5) * 3,
      situps: 26 + (idx % 4) * 3,
      height: 158 + (idx % 7) * 2,
      weight: 48 + (idx % 6) * 2
    };
    const ass = makeAssessment(`ass-extra-${idx}`, id, '2026-01-28', 'Month 1', input);
    const isRising = idx % 4 === 1;
    const impRate = isRising ? 12.4 + idx : 0;

    return {
      id,
      name: s.name,
      age: s.age,
      gender: s.gender,
      school: s.school,
      district: s.district,
      village: s.village,
      height: input.height,
      weight: input.weight,
      sportsExperience: `School ${s.sport} player`,
      previousAchievement: s.prev,
      registeredAt: '2026-01-15',
      scoutStatus: idx % 3 === 0 ? 'Teacher Verified' : 'Identified',
      isShortlisted: idx === 0 || idx === 3,
      isReferredToScout: idx % 2 === 0,
      isRisingTalent: isRising,
      overallImprovementRate: impRate,
      teacherObservation: {
        disciplined: true,
        strongMotivation: idx % 2 === 0,
        teamwork: true,
        leadership: idx % 3 === 0,
        regularAttendance: true,
        fastLearner: true,
        coachability: true,
        comment: `Good stamina and active discipline in school ${s.sport} practice sessions.`,
        updatedAt: '2026-01-28'
      },
      growthPlan: generate30DayGrowthPlan(input, ass.result),
      assessments: [ass],
      latestAssessment: ass
    };
  });

  return [ravi, anjali, meena, kiran, arjun, sneha, manoj, kavya, ...extraStudents];
};
