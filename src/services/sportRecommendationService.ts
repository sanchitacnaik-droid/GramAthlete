import { FitnessMetrics, SportMatch, FitnessTestInput, GrowthPlan } from '../types';

// Helper to clamp values
const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

/**
 * Calculates AI Sport Match Percentages based on biometric fitness capability profile
 */
export const calculateSportRecommendations = (metrics: FitnessMetrics): { bestSport: SportMatch; sportMatches: SportMatch[] } => {
  const { speed, power, endurance, strength, agility } = metrics;

  // 1. Athletics (Track & Field): favors Speed & Power with moderate Endurance
  const athleticsScore = Math.round(clamp(speed * 0.42 + power * 0.38 + endurance * 0.20, 35, 98));

  // 2. Volleyball: favors Vertical Power, Agility & Strength
  const volleyballScore = Math.round(clamp(power * 0.44 + agility * 0.28 + strength * 0.16 + speed * 0.12, 35, 98));

  // 3. Football: favors Endurance, Speed, Agility & Strength
  const footballScore = Math.round(clamp(endurance * 0.36 + speed * 0.32 + agility * 0.20 + strength * 0.12, 35, 98));

  // 4. Kabaddi: favors Strength, Explosive Power & Agility
  const kabaddiScore = Math.round(clamp(strength * 0.42 + power * 0.30 + agility * 0.18 + endurance * 0.10, 35, 98));

  // 5. Badminton: favors Agility, Speed, Reflexes & Power
  const badmintonScore = Math.round(clamp(agility * 0.40 + speed * 0.30 + power * 0.18 + endurance * 0.12, 35, 98));

  const sportMatches: SportMatch[] = [
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

  // Sort descending
  sportMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  const bestSport = sportMatches[0];

  return {
    bestSport,
    sportMatches
  };
};

/**
 * Generates personalized 30-day growth plan
 */
export const generateGrowthPlan = (input: FitnessTestInput, bestSportName: string): GrowthPlan => {
  const currentSprint = input.sprint30m.toFixed(1);
  const targetSprint = Math.max(3.8, (input.sprint30m - 0.2)).toFixed(1);

  return {
    goalTitle: `Improve 30m Sprint & Explosive Power (${bestSportName} Focus)`,
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
