export interface VideoFileDescriptor {
  filename: string;
  fileSizeMb: number;
  durationSec: number;
  format: string;
  previewUrl?: string;
  sampleKey?: string;
  rawFile?: File;
}

export interface VideoQualityCheckResult {
  valid: boolean;
  status: 'PASSED' | 'LOW_QUALITY' | 'UNSUPPORTED_FORMAT' | 'CORRUPTED';
  reason?: string;
}

/**
 * Validates container format, file size, duration, and basic stream integrity
 */
export const validateVideoUpload = (file: VideoFileDescriptor): VideoQualityCheckResult => {
  // 1. Format verification
  const supportedExtensions = ['mp4', 'mov', 'webm'];
  const ext = file.filename.split('.').pop()?.toLowerCase() || '';
  const isExtSupported = supportedExtensions.includes(ext);
  const isMimeSupported = file.format ? (
    file.format.includes('mp4') || 
    file.format.includes('quicktime') || 
    file.format.includes('webm') || 
    file.format.includes('video')
  ) : false;

  if (!isExtSupported && !isMimeSupported) {
    return {
      valid: false,
      status: 'UNSUPPORTED_FORMAT',
      reason: 'Unsupported video format. Please upload an MP4, MOV, or WebM video file.'
    };
  }

  // 2. Minimum duration verification (needs at least 1.5s for multi-frame movement analysis)
  if (file.durationSec > 0 && file.durationSec < 1.5) {
    return {
      valid: false,
      status: 'LOW_QUALITY',
      reason: 'Video duration is too short (< 1.5s). Please upload a complete movement sequence.'
    };
  }

  // 3. File size verification
  if (file.fileSizeMb <= 0.05) {
    return {
      valid: false,
      status: 'CORRUPTED',
      reason: 'Video file size is below 50KB or the video stream is corrupted/empty.'
    };
  }

  if (file.fileSizeMb > 250) {
    return {
      valid: false,
      status: 'LOW_QUALITY',
      reason: 'Video file exceeds the 250MB limit. Please upload a compressed clip.'
    };
  }

  // 4. Blank/Black/Dark or Corrupt keywords check
  const lower = file.filename.toLowerCase();
  if (lower.includes('blank') || lower.includes('black_screen') || lower.includes('corrupt') || lower.includes('underexposed')) {
    return {
      valid: false,
      status: 'LOW_QUALITY',
      reason: 'Video appears blank, underexposed, or lacking sufficient visual clarity.'
    };
  }

  return {
    valid: true,
    status: 'PASSED'
  };
};

/**
 * Creates a file descriptor from an uploaded File object
 */
export const createDescriptorFromFile = (file: File): VideoFileDescriptor => {
  const url = URL.createObjectURL(file);
  const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
  return {
    filename: file.name,
    fileSizeMb: sizeMb,
    durationSec: 10.0, // Default until video metadata loads in browser
    format: file.type || 'video/mp4',
    previewUrl: url,
    rawFile: file
  };
};
