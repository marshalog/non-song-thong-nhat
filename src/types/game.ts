export type QuestionType = 'multiple-choice' | 'fill-in' | 'image-fill-in';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: number | string; // index for MC, string for fill-in
  imageUrl?: string;
  timeLimit?: number; // only for fill-in/image (per question), MC uses stage timer
}

export interface StageData {
  id: number;
  name: string;
  subtitle: string;
  mcTimeLimit: number; // shared timer for all MC questions (seconds)
  questions: Question[];
}

export type GamePhase =
  | 'lobby'
  | 'playing-mc'       // independent MC play
  | 'playing-bonus'    // synchronized fill-in / image questions
  | 'stage-results'    // show answer sheet + scores
  | 'scoreboard'
  | 'elimination'
  | 'video-transition'
  | 'map-transition'
  | 'victory';

export interface TeamData {
  id: string;
  room_id: string;
  name: string;
  icon: string;
  color: string;
  score: number;
  eliminated: boolean;
  order_index: number;
  current_question_index: number;
  finished_at: string | null;
}

export interface RoomData {
  id: string;
  room_code: string;
  admin_password: string;
  phase: string;
  current_stage: number;
  current_question_index: number;
  time_remaining: number;
  showing_answer: boolean;
  stage_started_at: string | null;
}

export interface TeamAnswer {
  id: string;
  room_id: string;
  team_id: string;
  stage: number;
  question_index: number;
  answer_index: number;
  time_elapsed: number;
  text_answer: string | null;
}

export const TEAM_ICONS = [
  { icon: "XT", label: "Xe tăng" },
  { icon: "XB", label: "Xe bọc thép" },
  { icon: "PC", label: "Phi cơ chiến đấu" },
  { icon: "TT", label: "Trực thăng" },
  { icon: "VN", label: "Cờ Việt Nam" },
  { icon: "MT", label: "Cờ Mặt trận Giải phóng" },
];

export const TEAM_COLORS = [
  "#DA251D",
  "#FF6B35",
  "#1B998B",
  "#2D3047",
  "#6B4C9A",
  "#E85D75",
  "#2EC4B6",
  "#E71D36",
];

// Helper to get MC questions from a stage
export function getMcQuestions(stage: StageData): Question[] {
  return stage.questions.filter(q => q.type === 'multiple-choice');
}

// Helper to get bonus (fill-in / image) questions from a stage
export function getBonusQuestions(stage: StageData): Question[] {
  return stage.questions.filter(q => q.type !== 'multiple-choice');
}
