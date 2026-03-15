export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface StageData {
  id: number;
  name: string;
  subtitle: string;
  questions: Question[];
}

export type GamePhase = 'lobby' | 'playing' | 'showing-answer' | 'scoreboard' | 'map-transition' | 'stage-result' | 'elimination' | 'victory';

export interface TeamData {
  id: string;
  room_id: string;
  name: string;
  icon: string;
  color: string;
  score: number;
  eliminated: boolean;
  order_index: number;
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
}

export interface TeamAnswer {
  id: string;
  room_id: string;
  team_id: string;
  stage: number;
  question_index: number;
  answer_index: number;
  time_elapsed: number;
}

export const TEAM_ICONS = [
  { icon: "⭐", label: "Ngôi sao" },
  { icon: "🔥", label: "Lửa" },
  { icon: "🏆", label: "Cúp vàng" },
  { icon: "⚔️", label: "Kiếm" },
  { icon: "🛡️", label: "Khiên" },
  { icon: "🚀", label: "Tên lửa" },
  { icon: "🎯", label: "Mục tiêu" },
  { icon: "💪", label: "Sức mạnh" },
  { icon: "🦅", label: "Đại bàng" },
  { icon: "🐉", label: "Rồng" },
  { icon: "🌟", label: "Sao sáng" },
  { icon: "🎖️", label: "Huân chương" },
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
