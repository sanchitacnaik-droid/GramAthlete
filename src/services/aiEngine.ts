import { 
  FitnessTestInput, 
  FitnessMetrics, 
  SportMatch, 
  AIAnalysisResult, 
  PotentialCategory,
  GrowthPlan
} from '../types';

/**
 * Deterministic AI Scoring Engine
 * Normalized against Indian Youth Sports Norms (SAI / Khelo India benchmarks for 12-18 yrs).
 */

// Helper to clamp values between min and max
const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

// Linear interpolator
const linearScore = (val: number, worstVal: number, bestVal: number, worstScore = 40, bestScore = 100): number => {
  if (bestVal > worstVal) {
    if (val <= worstVal) return worstScore;
    if (val >= bestVal) return bestScore;
    return worstScore + ((val - worstVal) / (bestVal - worstVal)) * (bestScore - worstScore);
  } else {
    // Lower is better (e.g. sprint time, 800m time)
    if (val >= worstVal) return worstScore;
    if (val <= bestVal) return bestScore;
    return worstScore + ((worstVal - val) / (worstVal - bestVal)) * (bestScore - worstScore);
  }
};

export const calculateFitnessMetrics = (input: FitnessTestInput): FitnessMetrics => {
  // 1. SPEED: 30m sprint (4.0s is elite 98, 4.6s is 88, 5.2s is 72, 6.2s is 45)
  const speed = Math.round(clamp(linearScore(input.sprint30m, 6.2, 3.9, 45, 99), 30, 99));

  // 2. POWER: Combination of Standing Broad Jump (m) & Vertical Jump (cm)
  // Broad Jump: 1.3m (45) to 2.4m (99)
  const broadJumpScore = linearScore(input.broadJump, 1.3, 2.35, 45, 99);
  // Vertical Jump: 25cm (45) to 60cm (99)
  const verticalJumpScore = linearScore(input.verticalJump, 25, 60, 45, 99);
  const power = Math.round(clamp((broadJumpScore * 0.55 + verticalJumpScore * 0.45), 30, 99));

  // 3. ENDURANCE: 800m run (seconds)
  // 260s (4m20s = 45) to 140s (2m20s = 99)
  const endurance = Math.round(clamp(linearScore(input.run800m, 260, 140, 45, 99), 30, 99));

  // 4. STRENGTH: Pushups & Situps
  // Pushups: 5 (45) to 40 (99)
  const pushupScore = linearScore(input.pushups, 5, 38, 45, 99);
  // Situps: 10 (45) to 48 (99)
  const situpScore = linearScore(input.situps, 10, 48, 45, 99);
  const strength = Math.round(clamp((pushupScore * 0.5 + situpScore * 0.5), 30, 99));

  // 5. AGILITY / ATHLETICISM
  // Calculated from Speed, Power, Body Composition (BMI)
  const heightM = input.height / 100;
  const bmi = input.weight / (heightM * heightM);
  let bmiFactor = 1.0;
  if (bmi >= 18 && bmi <= 23) {
    bmiFactor = 1.05; // Optimal athletic build
  } else if (bmi < 16.5 || bmi > 27) {
    bmiFactor = 0.92;
  }
  const rawAgility = (speed * 0.4 + power * 0.35 + strength * 0.25) * bmiFactor;
  const agility = Math.round(clamp(rawAgility, 30, 99));

  return {
    speed,
    power,
    endurance,
    strength,
    agility
  };
};

export const calculateSportMatches = (metrics: FitnessMetrics): SportMatch[] => {
  const { speed, power, endurance, strength, agility } = metrics;

  // 1. Athletics (Track & Field): heavily favors Speed & Power with moderate Endurance
  const athleticsScore = Math.round(clamp(speed * 0.42 + power * 0.38 + endurance * 0.20, 35, 98));

  // 2. Volleyball: heavily favors Vertical Power, Agility & Strength
  const volleyballScore = Math.round(clamp(power * 0.44 + agility * 0.28 + strength * 0.16 + speed * 0.12, 35, 98));

  // 3. Football: favors Endurance, Speed, Agility & Strength
  const footballScore = Math.round(clamp(endurance * 0.36 + speed * 0.32 + agility * 0.20 + strength * 0.12, 35, 98));

  // 4. Kabaddi: favors Strength, Explosive Power & Agility
  const kabaddiScore = Math.round(clamp(strength * 0.42 + power * 0.30 + agility * 0.18 + endurance * 0.10, 35, 98));

  // 5. Badminton: favors Agility, Speed, Reflexes & Power
  const badmintonScore = Math.round(clamp(agility * 0.40 + speed * 0.30 + power * 0.18 + endurance * 0.12, 35, 98));

  const sportsRaw: SportMatch[] = [
    {
      sport: 'Athletics',
      matchPercentage: athleticsScore,
      badge: athleticsScore >= 85 ? 'Top Recommendation' : 'Strong Match',
      iconName: 'Zap',
      why: [
        'Strong 30m sprint acceleration profile',
        'High explosive leg power in broad & vertical jumps',
        'Good lower-body elasticity and velocity output',
        'Suitable stride mechanics for track events'
      ]
    },
    {
      sport: 'Volleyball',
      matchPercentage: volleyballScore,
      badge: volleyballScore >= 85 ? 'Top Recommendation' : 'High Potential',
      iconName: 'Activity',
      why: [
        'Superior vertical jump and explosive power',
        'Quick reactive agility on court transition',
        'Solid upper-body and core stability',
        'Great reach-to-power ratio'
      ]
    },
    {
      sport: 'Football',
      matchPercentage: footballScore,
      badge: footballScore >= 85 ? 'Top Recommendation' : 'Good Match',
      iconName: 'Award',
      why: [
        'Sustained aerobic capacity over 800m test',
        'Repeated sprint ability and acceleration',
        'Balanced strength and multi-directional agility',
        'High stamina index for match duration'
      ]
    },
    {
      sport: 'Kabaddi',
      matchPercentage: kabaddiScore,
      badge: kabaddiScore >= 85 ? 'Top Recommendation' : 'Potential Match',
      iconName: 'Shield',
      why: [
        'High upper-body and core muscular strength',
        'Explosive sudden raid bursts and grip power',
        'Good center-of-gravity balance and resilience',
        'Rapid contact agility and reflex recovery'
      ]
    },
    {
      sport: 'Badminton',
      matchPercentage: badmintonScore,
      badge: badmintonScore >= 85 ? 'Top Recommendation' : 'Compatible',
      iconName: 'Target',
      why: [
        'High lateral court agility and rapid footwork',
        'Instant deceleration and acceleration capability',
        'Quick wrist and upper-body power snap',
        'Efficient cardiovascular recovery between rallies'
      ]
    }
  ];

  // Sort descending by match percentage
  sportsRaw.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return sportsRaw;
};

export const analyzeAthleteData = (input: FitnessTestInput): AIAnalysisResult => {
  const metrics = calculateFitnessMetrics(input);
  const sportMatches = calculateSportMatches(metrics);
  const bestSport = sportMatches[0];

  // Composite overall potential score (0 - 100)
  const overallScore = Math.round(
    metrics.speed * 0.25 + 
    metrics.power * 0.25 + 
    metrics.endurance * 0.20 + 
    metrics.strength * 0.15 + 
    metrics.agility * 0.15
  );

  let potentialCategory: PotentialCategory = 'DEVELOPING';
  if (overallScore >= 85) {
    potentialCategory = 'HIGH POTENTIAL';
  } else if (overallScore >= 70) {
    potentialCategory = 'PROMISING';
  } else {
    potentialCategory = 'DEVELOPING';
  }

  let summary = '';
  if (overallScore >= 85) {
    summary = `Exceptional explosive power (${metrics.power}) and sprint speed (${metrics.speed}) place this athlete in the top tier for ${bestSport.sport}. High candidate for district sports academy trials.`;
  } else if (overallScore >= 70) {
    summary = `Solid foundation with standout ${metrics.power > metrics.speed ? 'power' : 'speed'} capabilities. With structured 30-day targeted training, this athlete can transition into high-potential brackets.`;
  } else {
    summary = `Good baseline physical foundation. Focus on endurance conditioning and core strength development to unlock athletic potential across ${bestSport.sport}.`;
  }

  return {
    overallScore,
    potentialCategory,
    metrics,
    sportMatches,
    bestSport,
    analysisSummary: summary,
    calculatedAt: new Date().toISOString()
  };
};

export const generate30DayGrowthPlan = (input: FitnessTestInput, result: AIAnalysisResult): GrowthPlan => {
  const bestSport = result.bestSport.sport;
  const currentSprint = input.sprint30m.toFixed(1);
  const targetSprint = Math.max(3.8, (input.sprint30m - 0.2)).toFixed(1);

  return {
    goalTitle: `Improve 30m Sprint & Explosive Power (${bestSport} Focus)`,
    currentMetric: `30m Sprint: ${currentSprint}s | Broad Jump: ${input.broadJump}m`,
    targetMetric: `30m Sprint: ${targetSprint}s | Broad Jump: ${(input.broadJump + 0.15).toFixed(2)}m`,
    weeks: [
      {
        weekNumber: 1,
        title: 'Foundation & Mobility',
        focus: 'Sprint drills, mobility & basic core strength',
        drills: [
          'Dynamic hip flexor and hamstring mobility (15 mins)',
          'High knees, butt kicks, and A-skips (3 sets x 20m)',
          'Bodyweight squats & plank holds (3 sets x 30s)',
          'Light 400m recovery jog and static stretching'
        ]
      },
      {
        weekNumber: 2,
        title: 'Acceleration & Power',
        focus: 'Drive phase, jump training & recovery',
        drills: [
          'Wall sprint drill & falling acceleration starts (5 reps)',
          'Standing broad jump onto sand/grass (4 sets x 3 jumps)',
          'Single leg bounding and lateral line hops (3 sets)',
          'Hydration & post-session active recovery walk'
        ]
      },
      {
        weekNumber: 3,
        title: 'Technique & Explosiveness',
        focus: 'Sprint mechanics, reactive power & agility',
        drills: [
          'Full-speed 20m flying sprint bursts (4 reps with 2m rest)',
          'Tuck jumps and box/step explosive jumps (3 sets x 6 reps)',
          'Shuttle cone agility drills (4 sets x 15m)',
          'Core stability hollow holds & mountain climbers'
        ]
      },
      {
        weekNumber: 4,
        title: 'Peak & Assessment',
        focus: 'Competition simulation, recovery & re-testing',
        drills: [
          'Tapered high-intensity 30m sprint test runs with stopwatch',
          'Broad jump & vertical leap measurement validation',
          'Full-body mobility routine and foam rolling/muscle release',
          'Submit updated measurements into GramAthlete app'
        ]
      }
    ],
    coachDisclaimer: 'Prototype recommendation. Training should be reviewed and supervised by a qualified school PE teacher or certified athletic coach.',
    status: 'In Progress'
  };
};
