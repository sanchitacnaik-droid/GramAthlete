import React, { useState, useRef, useEffect } from 'react';
import { 
  Student, 
  NavTab, 
  VideoValidationStatus, 
  VideoActivityType, 
  VideoAnalysisMetadata, 
  ClassifierDebugInfo 
} from '../types';
import { 
  VideoFileDescriptor, 
  classifySportsActivity, 
  classifySportsActivityAsync,
  DEMO_VIDEO_SAMPLES, 
  DemoVideoSample,
  VideoValidationOutcome 
} from '../services/videoValidationService';
import { createDescriptorFromFile } from '../services/videoUploadService';
import { analyzeSportsVideo } from '../services/videoAnalysisService';
import { submitVideoAssessment, isOfflineMode, referToScout } from '../services/storageService';
import { addNotification } from '../services/notificationService';
import { 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  FileVideo, 
  Play, 
  Pause, 
  RefreshCw, 
  Trophy, 
  Zap, 
  Flame, 
  Timer, 
  Dumbbell, 
  Activity, 
  IdCard, 
  TrendingUp, 
  Share2, 
  Info, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ShieldCheck, 
  Clock, 
  Eye, 
  Check, 
  RotateCcw,
  Terminal,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoAssessmentViewProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  setCurrentTab: (tab: NavTab) => void;
  onAssessmentCompleted: (student: Student) => void;
}

type AnalysisStage = 
  | 'UPLOAD' 
  | 'CHECKING' 
  | 'VALIDATION_FAILED_NON_SPORTS' 
  | 'VALIDATION_FAILED_UNCERTAIN'
  | 'VALIDATION_FAILED_QUALITY' 
  | 'SPORTS_CONFIRMED' 
  | 'ANALYZING_FITNESS' 
  | 'COMPLETE';

export const VideoAssessmentView: React.FC<VideoAssessmentViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  setCurrentTab,
  onAssessmentCompleted
}) => {
  const currentStudent = selectedStudent || students.find(s => s.name === 'Ravi Kumar') || students[0];

  // Uploaded / Selected video state
  const [selectedFile, setSelectedFile] = useState<VideoFileDescriptor | null>(null);
  const [activeSample, setActiveSample] = useState<DemoVideoSample | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Workflow Stage
  const [stage, setStage] = useState<AnalysisStage>('UPLOAD');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Validation & Classification Intermediate Data
  const [validationResult, setValidationResult] = useState<VideoValidationOutcome | null>(null);
  const [debugInfo, setDebugInfo] = useState<ClassifierDebugInfo | null>(null);

  // Analysis Outputs
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoAnalysisMetadata | null>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [isReferred, setIsReferred] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Step labels for the step-by-step progress indicator
  const progressSteps = [
    { num: 1, label: 'Uploading Video' },
    { num: 2, label: 'Sampling Video Frames (0%, 20%, 40%, 60%, 80%, 100%)' },
    { num: 3, label: 'Sports vs Non-Sports Classification' },
    { num: 4, label: 'Biomechanical Movement Analysis' },
    { num: 5, label: 'Fitness Metrics Calculation' },
    { num: 6, label: 'AI Sport Recommendation' },
  ];

  // Set default sample on mount for Ravi Kumar
  useEffect(() => {
    if (!selectedFile && !activeSample) {
      handleSelectDemoSample(DEMO_VIDEO_SAMPLES[0]);
    }
  }, []);

  // Update referral status when student changes
  useEffect(() => {
    if (currentStudent) {
      setIsReferred(currentStudent.isReferredToScout || false);
    }
  }, [currentStudent?.id]);

  // Synthetic skeleton pose animation for video canvas
  useEffect(() => {
    if (!canvasRef.current || !showSkeletonOverlay) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const renderPose = () => {
      frame += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      const type = activeSample?.syntheticVideoType || 'sprint';

      if (type === 'classroom' || type === 'sitting') {
        // Seated figure (Non-sports)
        const centerX = w * 0.5;
        const centerY = h * 0.55;

        // Head
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 45, 12, 0, Math.PI * 2);
        ctx.fill();

        // Seated torso & legs
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 33);
        ctx.lineTo(centerX, centerY + 20); // spine
        ctx.lineTo(centerX + 25, centerY + 20); // lap
        ctx.lineTo(centerX + 25, centerY + 65); // seated legs
        ctx.stroke();

        // Arms on desk / lap
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX + 20, centerY);
        ctx.lineTo(centerX + 35, centerY);
        ctx.stroke();

        // Status badge on canvas
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(
          type === 'classroom' 
            ? '• Pose: Seated (Static Classroom Lecture)' 
            : '• Pose: Seated Individual (No Athletic Exertion)', 
          20, 
          30
        );
      } else if (type === 'food') {
        // Table / object motion (Non-sports)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('• Object: Mid-Day Meal Plate (Zero Human Skeletal Motion)', 20, 30);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.3, h * 0.4, w * 0.4, h * 0.3);
      } else if (type === 'scenery') {
        // Landscape / scenery (Non-sports)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('• Scene: Empty Grounds / Landscape (No Human Athletic Activity)', 20, 30);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.8);
        ctx.lineTo(w * 0.5, h * 0.4);
        ctx.lineTo(w * 0.9, h * 0.8);
        ctx.stroke();
      } else if (type === 'blank') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('• Quality: Blank / Underexposed Frame (<12 Luminance)', 20, 30);
      } else if (type === 'uncertain') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('• Classifier: Ambiguous Kinematic Signature (<70% Confidence)', 20, 30);
      } else {
        // Dynamic Sports Pose (Sprint / Jump / Volleyball)
        const t = frame;
        const cycle = Math.sin(t);
        const cosCycle = Math.cos(t);

        const centerX = w * 0.48 + cycle * 30;
        const centerY = h * 0.48;

        const jointColor = '#10b981';
        const boneColor = 'rgba(16, 185, 129, 0.85)';
        const vectorColor = '#38bdf8';

        // Head
        ctx.fillStyle = jointColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 65, 14, 0, Math.PI * 2);
        ctx.fill();

        // Keypoints
        const neck = { x: centerX, y: centerY - 50 };
        const midHip = { x: centerX, y: centerY };
        const leftShoulder = { x: centerX - 18, y: centerY - 45 };
        const rightShoulder = { x: centerX + 18, y: centerY - 45 };
        const leftElbow = { x: centerX - 30 + cosCycle * 18, y: centerY - 20 };
        const rightElbow = { x: centerX + 30 - cosCycle * 18, y: centerY - 20 };
        const leftWrist = { x: centerX - 40 + cosCycle * 25, y: centerY + 5 };
        const rightWrist = { x: centerX + 40 - cosCycle * 25, y: centerY + 5 };

        const leftHip = { x: centerX - 12, y: centerY };
        const rightHip = { x: centerX + 12, y: centerY };
        const leftKnee = { x: centerX - 25 - cycle * 28, y: centerY + 42 - Math.max(0, cycle) * 15 };
        const rightKnee = { x: centerX + 25 + cycle * 28, y: centerY + 42 - Math.max(0, -cycle) * 15 };
        const leftAnkle = { x: leftKnee.x - 10 - cycle * 20, y: centerY + 85 + cycle * 10 };
        const rightAnkle = { x: rightKnee.x + 10 + cycle * 20, y: centerY + 85 - cycle * 10 };

        const drawLine = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        };

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';

        drawLine(neck, midHip);
        drawLine(leftShoulder, rightShoulder);
        drawLine(leftHip, rightHip);

        drawLine(leftShoulder, leftElbow);
        drawLine(leftElbow, leftWrist);
        drawLine(rightShoulder, rightElbow);
        drawLine(rightElbow, rightWrist);

        drawLine(leftHip, leftKnee);
        drawLine(leftKnee, leftAnkle);
        drawLine(rightHip, rightKnee);
        drawLine(rightKnee, rightAnkle);

        // Velocity vector arrow
        ctx.strokeStyle = vectorColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 65);
        ctx.lineTo(centerX + 35, centerY - 65);
        ctx.stroke();

        // Joint Circles
        const joints = [neck, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle];
        ctx.fillStyle = '#ffffff';
        joints.forEach(j => {
          ctx.beginPath();
          ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`• AI Keypoints: 17 Joint Nodes Active | Velocity: ${(26.5 + Math.abs(cycle) * 2).toFixed(1)} km/h`, 20, 30);
      }

      animFrameIdRef.current = requestAnimationFrame(renderPose);
    };

    renderPose();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [showSkeletonOverlay, activeSample?.syntheticVideoType, stage]);

  // Handle Preset Sample Selection
  const handleSelectDemoSample = (sample: DemoVideoSample) => {
    setActiveSample(sample);
    setSelectedFile({
      filename: sample.filename,
      fileSizeMb: sample.fileSizeMb,
      durationSec: sample.durationSec,
      format: sample.format,
      sampleKey: sample.id
    });
    setStage('UPLOAD');
    setValidationError('');
    setAnalysisResult(null);
    setValidationResult(null);
    setDebugInfo(null);
  };

  // Handle Real File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const descriptor = createDescriptorFromFile(file);
    setActiveSample(null);
    setSelectedFile(descriptor);
    setStage('UPLOAD');
    setValidationError('');
    setAnalysisResult(null);
    setValidationResult(null);
    setDebugInfo(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const descriptor = createDescriptorFromFile(file);
      setActiveSample(null);
      setSelectedFile(descriptor);
      setStage('UPLOAD');
      setValidationError('');
      setAnalysisResult(null);
      setValidationResult(null);
      setDebugInfo(null);
    }
  };

  // Step 1 -> Step 2 -> Step 3 Validation & Classification
  const handleStartAnalysis = async () => {
    if (!selectedFile || !currentStudent) return;

    setStage('CHECKING');
    setCurrentStepIndex(1); // Step 1: Uploading

    // Simulate Step 1 Uploading
    setTimeout(async () => {
      setCurrentStepIndex(2); // Step 2: Sampling Frames (0%, 20%, 40%, 60%, 80%, 100%)

      setTimeout(async () => {
        setCurrentStepIndex(3); // Step 3: Sports vs Non-Sports Classification

        // Perform Classification (Async canvas extraction if video element is ready, or synchronous frame extraction)
        let validation: VideoValidationOutcome;
        if (videoRef.current && selectedFile.rawFile) {
          validation = await classifySportsActivityAsync(selectedFile, videoRef.current);
        } else {
          validation = classifySportsActivity(selectedFile, videoRef.current);
        }

        setValidationResult(validation);
        setDebugInfo(validation.debugInfo || null);

        // Branching according to prompt specifications:
        if (validation.status === 'LOW_QUALITY') {
          setStage('VALIDATION_FAILED_QUALITY');
          setValidationError(validation.details || 'The video quality is too low or corrupted.');
          return;
        }

        if (validation.status === 'UNCERTAIN') {
          setStage('VALIDATION_FAILED_UNCERTAIN');
          setValidationError(validation.details || 'The activity in the video could not be verified with sufficient confidence.');
          return;
        }

        if (validation.status === 'NOT_SPORTS' || !validation.isValidSports) {
          setStage('VALIDATION_FAILED_NON_SPORTS');
          setValidationError(validation.details || 'This video does not appear to contain a recognizable sports or fitness activity.');
          return;
        }

        // CONFIRMED SPORTS VIDEO -> Show intermediate confirmation card (Step 8 of prompt)
        setStage('SPORTS_CONFIRMED');

      }, 600);
    }, 600);
  };

  // User triggers continuation to Fitness Analysis from Confirmed Sports step
  const handleProceedToFitnessAnalysis = () => {
    if (!selectedFile || !currentStudent || !validationResult || !validationResult.activityDetected) return;

    setStage('ANALYZING_FITNESS');
    setCurrentStepIndex(4); // Movement Analysis

    setTimeout(() => {
      setCurrentStepIndex(5); // Fitness Calculation

      setTimeout(() => {
        setCurrentStepIndex(6); // Sport Recommendation

        // Execute full deterministic analysis pipeline
        const { metadata, fitnessInput, aiResult } = analyzeSportsVideo(
          selectedFile,
          currentStudent,
          validationResult.activityDetected!,
          validationResult.confidence,
          validationResult.measurements,
          validationResult.debugInfo
        );

        setVideoMetadata(metadata);
        setAnalysisResult(aiResult);

        // Persist into student's history
        const { student: updatedStudent } = submitVideoAssessment(
          currentStudent.id,
          metadata,
          fitnessInput
        );

        onAssessmentCompleted(updatedStudent);
        setStage('COMPLETE');

        // Trigger confetti celebration if high potential
        if (aiResult.potentialCategory === 'HIGH POTENTIAL') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        addNotification({
          title: 'Video Assessment Complete 🎥',
          message: `${currentStudent.name} assessed in ${metadata.activityDetected}: Score ${aiResult.overallScore}/100 (${aiResult.bestSport.sport}).`,
          type: 'success'
        });

      }, 500);
    }, 500);
  };

  const handleReferToScoutFromVideo = () => {
    if (!currentStudent) return;
    const updated = referToScout(currentStudent.id);
    onAssessmentCompleted(updated);
    setIsReferred(true);
    addNotification({
      title: 'Scout Referral Sent 🌟',
      message: `${currentStudent.name} (Video: ${videoMetadata?.activityDetected || '100m Sprint'} - ${analysisResult?.overallScore || 87}/100) referred to scout pool.`,
      type: 'scout'
    });
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const resetToUpload = () => {
    setStage('UPLOAD');
    setValidationError('');
    setAnalysisResult(null);
    setValidationResult(null);
    setDebugInfo(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <Video className="w-3.5 h-3.5" />
            <span>AI Computer-Vision Fitness Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Video Fitness Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload sports videos for multi-frame activity validation, kinematic movement extraction & talent identification.
          </p>
        </div>

        {/* Switch to Manual Backup Option */}
        <button
          onClick={() => setCurrentTab('fitness-test')}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span>Switch to ⌨️ Manual Assessment</span>
        </button>
      </div>

      {/* Offline Mode Indicator Notice */}
      {isOfflineMode() && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Offline Mode Active 🟠:</strong> Video analysis will be processed locally and queued in local cache until server connection is restored.
          </div>
        </div>
      )}

      {/* Student Selector Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center">
            {currentStudent?.name.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">{currentStudent?.name}</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {currentStudent?.id}
              </span>
              {currentStudent?.isRisingTalent && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  🚀 Rising Talent
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Age {currentStudent?.age} • {currentStudent?.gender} • {currentStudent?.school} • {currentStudent?.district}
            </div>
          </div>
        </div>

        {/* Change Student Dropdown */}
        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Evaluating Athlete
          </label>
          <select
            value={currentStudent?.id}
            onChange={(e) => {
              const found = students.find(s => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white font-medium"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.id}) - {s.district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUICK PRESET SAMPLES FOR HACKATHON JUDGES */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Click Test Scenarios for Judges (Sports vs Non-Sports Rejection)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Preset Test Clips</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {DEMO_VIDEO_SAMPLES.map((sample) => {
            const isSelected = activeSample?.id === sample.id;
            const isInvalid = sample.category === 'non-sports' || sample.category === 'corrupt';
            const isUncertain = sample.category === 'uncertain';

            return (
              <button
                key={sample.id}
                onClick={() => handleSelectDemoSample(sample)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? isInvalid
                      ? 'bg-red-50 border-red-400 text-red-950 font-bold shadow-xs'
                      : isUncertain
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <span className="text-base shrink-0">{sample.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold">{sample.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{sample.filename}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: UPLOAD & PREVIEW */}
      {stage === 'UPLOAD' && (
        <div className="space-y-6">
          
          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900">Upload Athlete Video</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload a video of the athlete performing a sports or fitness activity.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supported formats: <strong>MP4, MOV, WebM</strong> (Max 250MB)
            </p>

            <button
              type="button"
              className="mt-4 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Choose Video
            </button>
          </div>

          {/* Video Selected Card & Interactive Preview */}
          {selectedFile && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-200">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileVideo className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 break-all">{selectedFile.filename}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>{selectedFile.fileSizeMb} MB</span>
                      <span>•</span>
                      <span>Duration: {selectedFile.durationSec}s</span>
                      <span>•</span>
                      <span>Format: {selectedFile.format}</span>
                    </div>
                  </div>
                </div>

                {/* Athlete ID Seal */}
                <div className="text-left sm:text-right bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Assigned Athlete</div>
                  <div className="text-xs font-extrabold text-slate-900">{currentStudent.name} ({currentStudent.id})</div>
                </div>
              </div>

              {/* Video Player & AI Skeleton Pose Overlay Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-[380px] flex items-center justify-center border border-slate-800 shadow-inner">
                
                {selectedFile.previewUrl ? (
                  <video
                    ref={videoRef}
                    src={selectedFile.previewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                    <canvas
                      ref={canvasRef}
                      width={640}
                      height={360}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Top Controls Ribbon */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => setShowSkeletonOverlay(!showSkeletonOverlay)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      showSkeletonOverlay 
                        ? 'bg-emerald-600/90 text-white shadow-sm' 
                        : 'bg-black/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>AI Pose Overlay: {showSkeletonOverlay ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Video Info Tag */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-lg border border-white/10 z-20">
                  Preview: {activeSample ? activeSample.title : selectedFile.filename}
                </div>
              </div>

              {/* CTA: Analyze Video */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>The video will undergo multi-frame quality check & sports activity classification before fitness analysis.</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Video</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* STAGE 2: CHECKING VIDEO (STEPPER MODAL / CARD) */}
      {(stage === 'CHECKING' || stage === 'ANALYZING_FITNESS') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-200 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">
              {stage === 'CHECKING' ? 'Checking Video Content...' : 'Analyzing Fitness Kinematics...'}
            </h3>
            <p className="text-xs text-slate-500">
              {stage === 'CHECKING' 
                ? 'Extracting multi-frame samples (0%, 20%, 40%, 60%, 80%, 100%) and classifying sports activity.' 
                : 'Extracting kinematic velocity, explosive takeoff, and biometric capability metrics.'}
            </p>
          </div>

          {/* 6-Step Progress Indicator */}
          <div className="space-y-2.5 text-left pt-2">
            {progressSteps.map((step) => {
              const isCompleted = currentStepIndex > step.num;
              const isCurrent = currentStepIndex === step.num;

              return (
                <div 
                  key={step.num}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' 
                      : isCurrent 
                        ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                        : 'bg-slate-50 text-slate-400 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] opacity-70">Step {step.num}</span>
                    <span>{step.label}</span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="text-emerald-700 font-bold">✓</span>
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    ) : (
                      <span className="opacity-30">•</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 3: INTERMEDIATE SPORTS CONFIRMED (Step 8 of prompt) */}
      {stage === 'SPORTS_CONFIRMED' && validationResult && (
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              ✅ SPORTS VIDEO DETECTED
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Activity: {validationResult.activityDetected || 'Athletics'}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-bold">
              <span>Confidence: {validationResult.confidence}%</span>
              <span>•</span>
              <span>Athlete: {currentStudent.name}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {validationResult.details}
            </p>
          </div>

          {/* Action CTA to begin fitness analysis */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleProceedToFitnessAnalysis}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue to Fitness Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={resetToUpload}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Upload Different Video
            </button>
          </div>

          {/* Developer / Classifier Diagnostics Accordion (Step 11 of prompt) */}
          {debugInfo && (
            <div className="pt-4 border-t border-slate-100 text-left">
              <button
                type="button"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1.5 font-bold cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Developer Diagnostics (Classifier Metrics)</span>
                </span>
                {showDebugPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDebugPanel && (
                <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs space-y-2 font-mono border border-slate-800">
                  <div className="text-emerald-400 font-bold">--- VIDEO VALIDATION DIAGNOSTICS ---</div>
                  <div>Frames analyzed: <strong className="text-white">{debugInfo.framesAnalyzed}</strong></div>
                  <div>Sports frames: <strong className="text-emerald-400">{debugInfo.sportsFrames}</strong> | Non-sports frames: <strong className="text-red-400">{debugInfo.nonSportsFrames}</strong></div>
                  <div>Sports confidence: <strong className="text-emerald-400">{debugInfo.sportsConfidence}%</strong> | Non-sports confidence: <strong className="text-slate-300">{debugInfo.nonSportsConfidence}%</strong></div>
                  <div>Motion energy score: <strong className="text-cyan-300">{debugInfo.motionIntensityScore}%</strong></div>
                  <div>Final classification: <span className="text-emerald-400 font-bold">✅ SPORTS</span></div>
                  <div className="text-slate-400 text-[11px] pt-1">Reason: {debugInfo.reason}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: VALIDATION FAILED — NON-SPORTS VIDEO (STRICT STOP - Step 6 of prompt) */}
      {stage === 'VALIDATION_FAILED_NON_SPORTS' && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-red-200 text-red-900 text-xs font-black uppercase tracking-wider">
              ❌ NOT A SPORTS VIDEO
            </div>
            <h2 className="text-2xl font-black text-red-950 tracking-tight">
              Non-Sports Content Detected
            </h2>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed max-w-md mx-auto font-medium">
              "This video does not appear to contain a recognizable sports or fitness activity."
            </p>
            <p className="text-xs text-red-700 max-w-md mx-auto">
              Please upload a video showing the athlete performing a sports or fitness activity.
            </p>
          </div>

          {/* Diagnostic Note */}
          <div className="bg-white/90 p-3.5 rounded-2xl border border-red-200 text-xs text-red-900 text-left space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Pipeline Safety Rule Enforced:</span>
            </div>
            <p className="text-[11px] text-red-700">
              GramAthlete strictly halts fitness scoring, talent ranking, and scout referrals for non-sports recordings (classroom lectures, sitting individuals, food, animals, or general scenery).
            </p>
          </div>

          {/* Action Buttons as requested in prompt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={resetToUpload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Upload Another Video</span>
            </button>

            <button
              onClick={() => setCurrentTab('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Developer / Classifier Diagnostics Accordion */}
          {debugInfo && (
            <div className="pt-4 border-t border-red-200 text-left">
              <button
                type="button"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="w-full flex items-center justify-between text-xs text-red-800 hover:text-red-950 py-1.5 font-bold cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-red-600" />
                  <span>Developer Diagnostics (Classifier Metrics)</span>
                </span>
                {showDebugPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDebugPanel && (
                <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs space-y-2 font-mono border border-slate-800">
                  <div className="text-red-400 font-bold">--- VIDEO VALIDATION DIAGNOSTICS ---</div>
                  <div>Frames analyzed: <strong className="text-white">{debugInfo.framesAnalyzed}</strong></div>
                  <div>Sports frames: <strong className="text-slate-400">{debugInfo.sportsFrames}</strong> | Non-sports frames: <strong className="text-red-400">{debugInfo.nonSportsFrames}</strong></div>
                  <div>Sports confidence: <strong className="text-slate-400">{debugInfo.sportsConfidence}%</strong> | Non-sports confidence: <strong className="text-red-400">{debugInfo.nonSportsConfidence}%</strong></div>
                  <div>Motion energy score: <strong className="text-cyan-300">{debugInfo.motionIntensityScore}%</strong></div>
                  <div>Final classification: <span className="text-red-400 font-bold">❌ NON-SPORTS</span></div>
                  <div className="text-slate-400 text-[11px] pt-1">Reason: {debugInfo.reason}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: VALIDATION FAILED — UNCERTAIN VIDEO (Step 7 of prompt) */}
      {stage === 'VALIDATION_FAILED_UNCERTAIN' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <HelpCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider">
              ⚠️ VIDEO COULD NOT BE VERIFIED
            </div>
            <h2 className="text-2xl font-black text-amber-950 tracking-tight">
              Activity Unverified
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed max-w-md mx-auto font-medium">
              "Please upload a clearer video showing the athlete performing the activity."
            </p>
          </div>

          {/* Action Buttons as requested in prompt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={resetToUpload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Upload Another Video</span>
            </button>

            <button
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>

          {/* Developer / Classifier Diagnostics */}
          {debugInfo && (
            <div className="pt-4 border-t border-amber-200 text-left">
              <button
                type="button"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                className="w-full flex items-center justify-between text-xs text-amber-900 hover:text-amber-950 py-1.5 font-bold cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-600" />
                  <span>Developer Diagnostics (Classifier Metrics)</span>
                </span>
                {showDebugPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDebugPanel && (
                <div className="mt-3 bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs space-y-2 font-mono border border-slate-800">
                  <div className="text-amber-400 font-bold">--- VIDEO VALIDATION DIAGNOSTICS ---</div>
                  <div>Frames analyzed: <strong className="text-white">{debugInfo.framesAnalyzed}</strong></div>
                  <div>Sports frames: <strong className="text-slate-300">{debugInfo.sportsFrames}</strong> | Uncertain frames: <strong className="text-amber-400">{debugInfo.uncertainFrames}</strong></div>
                  <div>Sports confidence: <strong className="text-amber-400">{debugInfo.sportsConfidence}%</strong> (&lt; 70% threshold)</div>
                  <div>Final classification: <span className="text-amber-400 font-bold">⚠️ UNCERTAIN</span></div>
                  <div className="text-slate-400 text-[11px] pt-1">Reason: {debugInfo.reason}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE 6: VALIDATION FAILED — LOW QUALITY / BLANK */}
      {stage === 'VALIDATION_FAILED_QUALITY' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider">
              ⚠️ VIDEO QUALITY TOO LOW
            </div>
            <h2 className="text-2xl font-black text-amber-950 tracking-tight">
              Cannot Analyze Reliably
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed max-w-md mx-auto font-medium">
              "The video cannot be analyzed reliably. Please upload a clearer video showing the athlete performing the activity."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={resetToUpload}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Upload Another Video</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 7: COMPLETE RESULT SCREEN (Only reachable after sports validation) */}
      {stage === 'COMPLETE' && analysisResult && videoMetadata && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Top Result Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>VIDEO ANALYSIS COMPLETE ✅</span>
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                    ✅ Valid Sports Video
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{currentStudent.id}</span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  {currentStudent.name} — {videoMetadata.activityDetected}
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-500">
                  Detected Activity: <strong className="text-slate-900">{videoMetadata.activityDetected}</strong> • Confidence: <strong className="text-emerald-700">{videoMetadata.confidence}%</strong> • {currentStudent.school}, {currentStudent.district}
                </p>
              </div>

              {/* Overall Potential Score */}
              <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl self-start md:self-auto">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-emerald-700 leading-none">
                    {analysisResult.overallScore}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-900 mt-1 uppercase tracking-wider">
                    Score / 100
                  </div>
                </div>
                <div className="border-l border-emerald-200 pl-4 space-y-1">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-black tracking-wide">
                    {analysisResult.potentialCategory}
                  </span>
                  <p className="text-[11px] text-emerald-900 font-medium">
                    Best Sport: <strong className="text-emerald-950">{analysisResult.bestSport.sport} ({analysisResult.bestSport.matchPercentage}%)</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Movement & Biomechanical Measurements Grid */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Computer-Vision Movement Measurements Extracted</span>
                </h3>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  {videoMetadata.confidence}% AI Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {videoMetadata.measurements.estimatedTime && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Estimated Time</span>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{videoMetadata.measurements.estimatedTime}</div>
                  </div>
                )}
                {videoMetadata.measurements.runningSpeed && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Running Speed</span>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{videoMetadata.measurements.runningSpeed}</div>
                  </div>
                )}
                {videoMetadata.measurements.acceleration && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Acceleration</span>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">{videoMetadata.measurements.acceleration}</div>
                  </div>
                )}
                {videoMetadata.measurements.movementConsistency && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Movement Consistency</span>
                    <div className="font-extrabold text-emerald-700 text-sm mt-0.5">{videoMetadata.measurements.movementConsistency}%</div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid: 5 Fitness Capabilities + Best Sport Card */}
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Left 5 Cols: Fitness Scores */}
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Performance Metrics</h3>
                  <p className="text-xs text-slate-500">Calculated from video kinematic extraction</p>
                </div>

                <div className="space-y-3 text-xs font-bold">
                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-orange-500" /> Speed</span>
                      <span className="font-mono text-slate-900">{analysisResult.metrics.speed} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${analysisResult.metrics.speed}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-red-500" /> Power</span>
                      <span className="font-mono text-slate-900">{analysisResult.metrics.power} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${analysisResult.metrics.power}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-blue-500" /> Endurance</span>
                      <span className="font-mono text-slate-900">{analysisResult.metrics.endurance} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysisResult.metrics.endurance}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5 text-emerald-600" /> Strength</span>
                      <span className="font-mono text-slate-900">{analysisResult.metrics.strength} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${analysisResult.metrics.strength}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-purple-600" /> Agility</span>
                      <span className="font-mono text-slate-900">{analysisResult.metrics.agility} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${analysisResult.metrics.agility}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Best Sport & Why this sport */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Best Sport Card */}
                <div className="bg-gradient-to-br from-emerald-800 to-green-900 text-white p-5 rounded-2xl shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-300" />
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">BEST SPORT MATCH</span>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {analysisResult.bestSport.badge}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-b border-emerald-700/60 pb-3">
                    <div className="text-2xl font-black">{analysisResult.bestSport.sport}</div>
                    <div className="text-2xl font-black text-amber-300">{analysisResult.bestSport.matchPercentage}%</div>
                  </div>

                  {/* Why this sport? */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      Why this sport?
                    </div>
                    <div className="grid sm:grid-cols-2 gap-1.5 text-xs text-emerald-50">
                      {analysisResult.bestSport.why.map((reason: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other Sport Matches Ranking */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {analysisResult.sportMatches.slice(1).map((sm: any) => (
                    <div key={sm.sport} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-500 truncate">{sm.sport}</div>
                      <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{sm.matchPercentage}%</div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* AI Decision Support Disclaimer */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong>Decision-Support Notice:</strong> AI recommendations are decision-support tools. Final selection should be made by qualified coaches/scouts.
              </div>
            </div>

            {/* Bottom Direct Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={resetToUpload}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Another Video</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentTab('passport')}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <IdCard className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Athlete Passport</span>
                </button>

                <button
                  onClick={() => setCurrentTab('progress')}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Progress</span>
                </button>

                {isReferred ? (
                  <div className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Referred to Scout Pool</span>
                  </div>
                ) : (
                  <button
                    onClick={handleReferToScoutFromVideo}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Refer to Scout</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
