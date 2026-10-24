export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  institution: string;
}

export interface CourseTopic {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  lessonsCount: number;
  quizId?: string;
  completed?: boolean;
  summary: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  description: string;
  instructor: string;
  duration: string;
  totalLessons: number;
  enrolledCount: number;
  rating: number;
  isEnrolled?: boolean;
  progressPercent?: number;
  topics: CourseTopic[];
}

export interface QuizQuestion {
  id: string;
  qNum: number;
  type: 'mcq' | 'code' | 'short';
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface ProctoringRules {
  cameraRequired: boolean;
  strictFullscreen: boolean;
  maxTabSwitches: number;
  trackFocusLoss: boolean;
}

export interface QuizExam {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  code: string; // 6-digit access code (e.g., '849201')
  topicId: string;
  totalQuestions: number;
  timeLimitMin: number;
  passingScore: number;
  active: boolean;
  proctoring: ProctoringRules;
  questions: QuizQuestion[];
}

export interface IntegrityEvent {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  quizId: string;
  quizTitle: string;
  type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'LOOKING_AWAY' | 'RAPID_PASTE' | 'NETWORK_CO_LOCATION';
  severity: 'low' | 'medium' | 'high';
  details: string;
  flagged: boolean;
  investigationId?: string;
}

export interface StudentQuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startTime: string;
  timeTakenSec: number;
  submittedAt: string;
  answers: Record<number, any>;
  violationsCount: {
    tabSwitches: number;
    fullscreenExits: number;
    cameraViolations: number;
  };
  integrityStatus: 'Verified Clean' | 'Flagged for Review' | 'Investigating' | 'Suspicious';
  evidenceStudentId?: string; // links directly to the deep forensic case investigator if flagged!
}

// Deep Forensic Investigator Types (Preserved and enhanced)
export interface Quiz {
  id: string;
  title: string;
  courseCode: string;
  totalQuestions: number;
  timeLimitMin: number;
  avgClassScore: number;
}

export interface QuestionPacing {
  qNum: number;
  type: string;
  studentSec: number;
  classAvgSec: number;
  anomaly?: string;
}

export interface SessionEvent {
  time: string;
  event: string;
  targetWindow: string;
}

export interface StudentTelemetry {
  timing: {
    totalSeconds: number;
    questionPacing: QuestionPacing[];
    keyKeystrokeMetric: string;
  };
  similarity: {
    cohortComparison: string;
    verbatimPhrases: string;
    temporalLag: string;
    matchedStudentName?: string;
    matchedSnippet?: {
      studentCode: string;
      peerCode: string;
      matchedVariables: string[];
    };
  };
  sessionEvents: {
    totalTabSwitches: number;
    totalTimeBlurredSec: number;
    eventLog: SessionEvent[];
  };
  deviceAndHistory: {
    ipAddress: string;
    userAgent: string;
    historicalGPA: number;
    pastQuizAverages: number[];
    historicalPacing: string;
  };
  questionBankNotes: {
    leakStatus: string;
    facultyNote: string;
  };
}

export interface StudentAttempt {
  id: string;
  isPlant: 'A' | 'B' | 'C' | false;
  name: string;
  quizId: string;
  score: number;
  timeTakenMin: number;
  status: 'flagged' | 'normal';
  flagTrigger: string | null;
  flagSeverity: 'high' | 'medium' | 'low' | 'none';
  dataSources: StudentTelemetry;
}

export interface EvidenceItem {
  source: string;
  data_point: string;
  finding: string;
}

export interface CaseReport {
  summary: string;
  confidence_level: 'Low' | 'Medium' | 'High';
  concern_verdict:
    | 'Low Concern (False Positive)'
    | 'Inconclusive / Mixed Evidence'
    | 'High Concern (Substantiated)';
  evidence_for: EvidenceItem[];
  counter_evidence: EvidenceItem[];
  recommended_action: string;
}

export interface TraceStep {
  id: string;
  name: string;
  icon: string;
  source: string;
  status: 'pending' | 'running' | 'completed';
  snippet?: string;
}
