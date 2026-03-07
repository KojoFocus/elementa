// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  school?: string;
  grade?: string;
  avatarUrl?: string;
  createdAt: string;
}

// ─── Experiment Core ────────────────────────────────────────────────────────

export type ExperimentId = 'acid-base-indicator';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type SubjectArea = 'chemistry' | 'biology' | 'physics';

export interface ExperimentMeta {
  id: ExperimentId;
  title: string;
  subtitle: string;
  subject: SubjectArea;
  difficulty: DifficultyLevel;
  duration: number; // minutes
  description: string;
  objectives: string[];
  coverImage?: string;
}

// ─── Tools & Equipment ──────────────────────────────────────────────────────

export type ToolId =
  | 'beaker'
  | 'test-tube'
  | 'dropper'
  | 'stirring-rod'
  | 'indicator-solution'
  | 'acid-solution'
  | 'base-solution'
  | 'neutral-solution'
  | 'pH-paper'
  | 'safety-goggles'
  | 'lab-gloves';

export interface LabTool {
  id: ToolId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  required: boolean;
}

// ─── Experiment Steps ────────────────────────────────────────────────────────

export type StepStatus = 'locked' | 'active' | 'completed';

export interface ExperimentStep {
  id: number;
  title: string;
  instruction: string;
  detail: string;
  toolsRequired: ToolId[];
  animation?: string; // animation key
  expectedObservation: string;
  colorChange?: {
    from: string; // hex
    to: string;   // hex
    label: string;
  };
  duration: number; // seconds for animation
}

// ─── Observations ────────────────────────────────────────────────────────────

export interface ObservationEntry {
  stepId: number;
  solution: string;
  observedColor: string;
  pH: string;
  notes: string;
}

export interface ObservationForm {
  entries: ObservationEntry[];
  completedAt?: string;
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizOption {
  id: string; // 'a' | 'b' | 'c' | 'd'
  text: string;
}

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizAnswer {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number; // 0-100
  passed: boolean;
  answers: QuizAnswer[];
  completedAt: string;
}

// ─── Safety ──────────────────────────────────────────────────────────────────

export type SafetyItemId = 'handwash' | 'gloves' | 'goggles';

export interface SafetyItem {
  id: SafetyItemId;
  title: string;
  description: string;
  icon: string;
  animationKey: string;
}

// ─── Lab Session ─────────────────────────────────────────────────────────────

export type LabPhase =
  | 'idle'
  | 'safety'
  | 'brief'
  | 'tool-selection'
  | 'experiment'
  | 'observation'
  | 'quiz'
  | 'results';

export interface LabSession {
  id: string;
  userId: string;
  experimentId: ExperimentId;
  phase: LabPhase;
  currentStepIndex: number;
  completedSteps: number[];
  safetyChecked: SafetyItemId[];
  selectedTools: ToolId[];
  observations: ObservationForm;
  quizResult?: QuizResult;
  startedAt: string;
  completedAt?: string;
}

// ─── Experiment Data Shape ────────────────────────────────────────────────────

export interface ExperimentData {
  meta: ExperimentMeta;
  safetyItems: SafetyItem[];
  tools: LabTool[];
  steps: ExperimentStep[];
  quizQuestions: QuizQuestion[];
}
