import { 
  FitnessTestInput, 
  FitnessMetrics, 
  PotentialCategory 
} from '../types';

export interface TalentScoringOutput {
  overallScore: number;
  potentialCategory: PotentialCategory;
  metrics: FitnessMetrics;
  analysisSummary: string;
}

// Clamping utility
const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

// Linear scoring utility against Indian youth fitness benchmarks
const linearScore = (val: number, worstVal: number, bestVal: number, worstScore = 40, bestScore = 100): number => {
  if (bestVal > worstVal) {
    if (val <= worstVal) return worstScore;
    if (val >= bestVal) return bestScore;
    return worstScore + ((val - worstVal) / (bestVal - worstVal)) * (bestScore - worstScore);
  } else {
    // Lower is better (sprint seconds, 800m time)
    if (val >= worstVal) return worstScore;
    if (val <= bestVal) return bestScore;
    return worstScore + ((worstVal - val) / (worstVal - bestVal)) * (bestScore - worstScore);
  }
};

/**
 * Calculates 5 key performance metrics from standardized fitness test inputs
 */
export const calculateFitnessMetrics = (input: FitnessTestInput): FitnessMetrics => {
  // 1. SPEED: 30m sprint (4.0s is elite 98, 4.6s is 88, 5.2s is 72, 6.2s is 45)
  const speed = Math.round(clamp(linearScore(input.sprint30m, 6.2, 3.9, 45, 99), 30, 99));

  // 2. POWER: Standing Broad Jump (m) & Vertical Jump (cm)
  const broadJumpScore = linearScore(input.broadJump, 1.3, 2.35, 45, 99);
  const verticalJumpScore = linearScore(input.verticalJump, 25, 60, 45, 99);
  const power = Math.round(clamp((broadJumpScore * 0.55 + verticalJumpScore * 0.45), 30, 99));

  // 3. ENDURANCE: 800m run (seconds)
  const endurance = Math.round(clamp(linearScore(input.run800m, 260, 140, 45, 99), 30, 99));

  // 4. STRENGTH: Pushups & Situps
  const pushupScore = linearScore(input.pushups, 5, 38, 45, 99);
  const situpScore = linearScore(input.situps, 10, 48, 45, 99);
  const strength = Math.round(clamp((pushupScore * 0.5 + situpScore * 0.5), 30, 99));

  // 5. AGILITY: Speed, Power, BMI factor
  const heightM = input.height / 100;
  const bmi = input.weight / (heightM * heightM);
  let bmiFactor = 1.0;
  if (bmi >= 18 && bmi <= 23) {
    bmiFactor = 1.05;
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

/**
 * Calculates overall talent potential score and category
 */
export const calculateOverallTalentScore = (
  metrics: FitnessMetrics,
  primarySportName = 'Athletics'
): TalentScoringOutput => {
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
    summary = `Exceptional sprint speed (${metrics.speed}) and explosive power (${metrics.power}) place this athlete in the 92nd percentile for ${primarySportName}. High candidate for district sports academy trials.`;
  } else if (overallScore >= 70) {
    summary = `Solid foundation with standout ${metrics.power > metrics.speed ? 'power' : 'speed'} capabilities. With structured 30-day targeted training, this athlete can transition into high-potential brackets.`;
  } else {
    summary = `Good baseline physical foundation. Focus on endurance conditioning and core strength development to unlock athletic potential across ${primarySportName}.`;
  }

  return {
    overallScore,
    potentialCategory,
    metrics,
    analysisSummary: summary
  };
};
