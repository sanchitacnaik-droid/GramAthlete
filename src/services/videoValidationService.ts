import { 
  VideoValidationStatus, 
  VideoActivityType, 
  VideoMovementMeasurements,
  ClassifierDebugInfo 
} from '../types';
import { VideoFileDescriptor, validateVideoUpload } from './videoUploadService';
import { 
  extractSyntheticSampleFrames, 
  extractFramesFromVideoElement,
  FrameExtractionResult 
} from './videoFrameExtractionService';
import { 
  classifyVideoContent, 
  SportsClassificationResult 
} from './sportsClassificationService';

export type { VideoFileDescriptor };

export interface VideoValidationOutcome {
  status: VideoValidationStatus;
  isValidSports: boolean;
  activityDetected: VideoActivityType | null;
  confidence: number;
  message: string;
  details: string;
  measurements?: VideoMovementMeasurements;
  debugInfo?: ClassifierDebugInfo;
  frameData?: FrameExtractionResult;
}

export interface DemoVideoSample {
  id: string;
  title: string;
  category: 'sports' | 'non-sports' | 'corrupt' | 'uncertain';
  icon: string;
  filename: string;
  durationSec: number;
  fileSizeMb: number;
  format: string;
  activityDetected: VideoActivityType | null;
  confidence: number;
  description: string;
  measurements: VideoMovementMeasurements;
  syntheticVideoType: 'sprint' | 'jump' | 'volleyball' | 'classroom' | 'food' | 'sitting' | 'scenery' | 'blank' | 'uncertain';
}

export const DEMO_VIDEO_SAMPLES: DemoVideoSample[] = [
  {
    id: 'sample-sprint-ravi',
    title: '🏃 100m Sprint — Ravi Kumar (Valid Sports)',
    category: 'sports',
    icon: '🏃',
    filename: 'ravi_kumar_100m_sprint_district_trials.mp4',
    durationSec: 12.4,
    fileSizeMb: 14.8,
    format: 'MP4 (H.264)',
    activityDetected: '100m Sprint',
    confidence: 92,
    description: 'High-speed acceleration and drive phase video captured on outdoor school track.',
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
    syntheticVideoType: 'sprint'
  },
  {
    id: 'sample-jump-meena',
    title: '🏃‍♀️ Long Jump — Meena Patil (Valid Sports)',
    category: 'sports',
    icon: '🏃‍♀️',
    filename: 'meena_patil_long_jump_sandpit.mp4',
    durationSec: 8.6,
    fileSizeMb: 9.4,
    format: 'MP4',
    activityDetected: 'Broad Jump',
    confidence: 89,
    description: 'Approach run, explosive board takeoff, and flight trajectory into sand pit.',
    measurements: {
      estimatedTime: 'Approach: 3.8s',
      estimatedDistance: '2.22m mark',
      runningSpeed: '23.8 km/h approach',
      acceleration: '2.95 m/s²',
      movementConsistency: 91,
      explosivePowerIndex: 92,
      takeoffMechanics: 93,
      landingMechanics: 86,
      movementIntensity: 'High',
      durationSec: 8.6
    },
    syntheticVideoType: 'jump'
  },
  {
    id: 'sample-volleyball-anjali',
    title: '🏐 Volleyball Spike — Anjali Gowda (Valid Sports)',
    category: 'sports',
    icon: '🏐',
    filename: 'anjali_gowda_volleyball_spike_smash.mov',
    durationSec: 9.2,
    fileSizeMb: 11.2,
    format: 'MOV',
    activityDetected: 'Volleyball Spike',
    confidence: 88,
    description: 'Vertical leap elevation, arm cocking, and ball contact smash at net.',
    measurements: {
      estimatedTime: 'Hang time: 0.68s',
      estimatedDistance: 'Vertical Leap: 54cm',
      runningSpeed: '18.2 km/h approach',
      acceleration: '3.10 m/s²',
      movementConsistency: 89,
      explosivePowerIndex: 94,
      takeoffMechanics: 92,
      landingMechanics: 90,
      movementIntensity: 'High',
      durationSec: 9.2
    },
    syntheticVideoType: 'volleyball'
  },
  {
    id: 'sample-classroom-invalid',
    title: '🏫 Classroom / Lecture (Invalid Non-Sports)',
    category: 'non-sports',
    icon: '🏫',
    filename: 'classroom_lecture_morning_desk.mp4',
    durationSec: 15.0,
    fileSizeMb: 18.2,
    format: 'MP4',
    activityDetected: 'Classroom Video',
    confidence: 96,
    description: 'Students seated at wooden desks in a stationary classroom lecture without athletic movement.',
    measurements: {
      movementIntensity: 'Low',
      movementConsistency: 12,
      durationSec: 15.0
    },
    syntheticVideoType: 'classroom'
  },
  {
    id: 'sample-sitting-invalid',
    title: '🛋️ Person Sitting / Talking (Invalid Non-Sports)',
    category: 'non-sports',
    icon: '🛋️',
    filename: 'person_sitting_conversation_bench.mp4',
    durationSec: 10.5,
    fileSizeMb: 12.0,
    format: 'MP4',
    activityDetected: 'Non-Sports Activity',
    confidence: 94,
    description: 'Individual seated on bench in normal conversation without physical sports activity.',
    measurements: {
      movementIntensity: 'Low',
      movementConsistency: 15,
      durationSec: 10.5
    },
    syntheticVideoType: 'sitting'
  },
  {
    id: 'sample-food-invalid',
    title: '🥪 Mid-Day Meal / Food (Invalid Non-Sports)',
    category: 'non-sports',
    icon: '🥪',
    filename: 'school_lunch_midday_meal_plate.webm',
    durationSec: 7.4,
    fileSizeMb: 6.8,
    format: 'WebM',
    activityDetected: 'Non-Sports Activity',
    confidence: 98,
    description: 'Close-up video of meal plate and dining table. Zero athletic exertion detected.',
    measurements: {
      movementIntensity: 'Low',
      movementConsistency: 5,
      durationSec: 7.4
    },
    syntheticVideoType: 'food'
  },
  {
    id: 'sample-scenery-invalid',
    title: '🏞️ Landscape / Scenery (Invalid Non-Sports)',
    category: 'non-sports',
    icon: '🏞️',
    filename: 'school_playground_empty_landscape.mp4',
    durationSec: 8.0,
    fileSizeMb: 8.5,
    format: 'MP4',
    activityDetected: 'Non-Sports Activity',
    confidence: 95,
    description: 'Outdoor scenic overview of trees and buildings with no active sports or human exercise.',
    measurements: {
      movementIntensity: 'Low',
      movementConsistency: 8,
      durationSec: 8.0
    },
    syntheticVideoType: 'scenery'
  },
  {
    id: 'sample-corrupt-quality',
    title: '⚠️ Low Quality / Blank Video (Quality Check Failure)',
    category: 'corrupt',
    icon: '⚠️',
    filename: 'black_screen_underexposed_dark.mp4',
    durationSec: 0.8,
    fileSizeMb: 0.3,
    format: 'MP4',
    activityDetected: null,
    confidence: 15,
    description: 'Underexposed, blank recording below duration & exposure threshold.',
    measurements: {},
    syntheticVideoType: 'blank'
  },
  {
    id: 'sample-uncertain-motion',
    title: '❓ Ambiguous / Low Movement (Uncertain Verification)',
    category: 'uncertain',
    icon: '❓',
    filename: 'unclear_glance_ambiguous_motion.mp4',
    durationSec: 4.5,
    fileSizeMb: 5.2,
    format: 'MP4',
    activityDetected: null,
    confidence: 48,
    description: 'Low-contrast recording with ambiguous motion signature below 70% certainty.',
    measurements: {},
    syntheticVideoType: 'uncertain'
  }
];

export const validateVideoQuality = (file: VideoFileDescriptor): { valid: boolean; reason?: string } => {
  const res = validateVideoUpload(file);
  return { valid: res.valid, reason: res.reason };
};

/**
 * Validates and classifies a video descriptor using multi-frame sampling.
 * Can be executed synchronously with synthetic frame extraction or asynchronously with real video element.
 */
export const classifySportsActivity = (
  file: VideoFileDescriptor,
  videoElement?: HTMLVideoElement | null
): VideoValidationOutcome => {
  // Extract frames (synthetic sample or preset descriptor)
  const sampleKey = file.sampleKey || file.filename;
  const frameData = extractSyntheticSampleFrames(sampleKey, file.durationSec);

  // Run sports classification
  const classification = classifyVideoContent(file, frameData);

  // Find sample if fixture
  const sample = DEMO_VIDEO_SAMPLES.find(
    s => s.id === file.sampleKey || s.filename === file.filename
  );

  return {
    status: classification.status,
    isValidSports: classification.classification === 'sports',
    activityDetected: classification.activity,
    confidence: classification.confidence,
    message: classification.message,
    details: classification.details,
    measurements: sample?.measurements,
    debugInfo: classification.debugInfo,
    frameData
  };
};

/**
 * Async frame extraction and classification for real uploaded video elements
 */
export const classifySportsActivityAsync = async (
  file: VideoFileDescriptor,
  videoElement: HTMLVideoElement
): Promise<VideoValidationOutcome> => {
  try {
    const sampleKey = file.sampleKey || file.filename;
    const frameData = await extractFramesFromVideoElement(videoElement, file.durationSec, sampleKey);
    const classification = classifyVideoContent(file, frameData);

    const sample = DEMO_VIDEO_SAMPLES.find(
      s => s.id === file.sampleKey || s.filename === file.filename
    );

    return {
      status: classification.status,
      isValidSports: classification.classification === 'sports',
      activityDetected: classification.activity,
      confidence: classification.confidence,
      message: classification.message,
      details: classification.details,
      measurements: sample?.measurements,
      debugInfo: classification.debugInfo,
      frameData
    };
  } catch (e) {
    // Fallback to synchronous extraction if canvas draw fails
    return classifySportsActivity(file);
  }
};
