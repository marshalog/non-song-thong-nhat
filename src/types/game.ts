export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  players: Player[];
  score: number;
  eliminated: boolean;
  currentPlayerIndex: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // seconds
}

export interface StageData {
  id: number;
  name: string;
  subtitle: string;
  questions: Question[];
}

export type GamePhase = 'setup' | 'playing' | 'stage-result' | 'elimination' | 'victory';

export interface GameState {
  phase: GamePhase;
  currentStage: number;
  currentQuestionIndex: number;
  teams: Team[];
  timeRemaining: number;
  answeredTeams: Record<number, { answer: number; time: number }>;
  showingAnswer: boolean;
}
