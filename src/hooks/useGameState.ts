import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, GamePhase, Team, Player } from "@/types/game";
import { stages, defaultTeams } from "@/data/questions";

const AVATARS = ["🎖️", "⭐", "🔥", "💪", "🏆", "🎯", "⚔️", "🛡️", "🚀", "💥", "🌟", "🎗️", "🏅", "👊", "✊", "🫡"];

function createDefaultTeams(): Team[] {
  return defaultTeams.map((t, i) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    players: Array.from({ length: 4 }, (_, j) => ({
      id: `${t.id}-${j}`,
      name: `Thành viên ${j + 1}`,
      avatar: AVATARS[i * 4 + j],
    })),
    score: 0,
    eliminated: false,
    currentPlayerIndex: 0,
  }));
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: "setup",
    currentStage: 0,
    currentQuestionIndex: 0,
    teams: createDefaultTeams(),
    timeRemaining: 15,
    answeredTeams: {},
    showingAnswer: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateTeams = useCallback((teams: Team[]) => {
    setState(prev => ({ ...prev, teams }));
  }, []);

  const updateTeamName = useCallback((teamId: number, name: string) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, name } : t),
    }));
  }, []);

  const updatePlayerName = useCallback((teamId: number, playerIndex: number, name: string) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t =>
        t.id === teamId
          ? { ...t, players: t.players.map((p, i) => i === playerIndex ? { ...p, name } : p) }
          : t
      ),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: "playing",
      currentStage: 0,
      currentQuestionIndex: 0,
      timeRemaining: stages[0].questions[0].timeLimit,
      answeredTeams: {},
      showingAnswer: false,
    }));
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearTimer();
          return { ...prev, timeRemaining: 0, showingAnswer: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, [clearTimer]);

  const submitAnswer = useCallback((teamId: number, answerIndex: number) => {
    setState(prev => {
      if (prev.answeredTeams[teamId] !== undefined) return prev;
      const elapsed = stages[prev.currentStage].questions[prev.currentQuestionIndex].timeLimit - prev.timeRemaining;
      const newAnswered = { ...prev.answeredTeams, [teamId]: { answer: answerIndex, time: elapsed } };
      
      const activeTeams = prev.teams.filter(t => !t.eliminated);
      const allAnswered = activeTeams.every(t => newAnswered[t.id] !== undefined);
      
      if (allAnswered) {
        clearTimer();
        return { ...prev, answeredTeams: newAnswered, showingAnswer: true };
      }
      return { ...prev, answeredTeams: newAnswered };
    });
  }, [clearTimer]);

  const calculateScores = useCallback(() => {
    setState(prev => {
      const stage = stages[prev.currentStage];
      const q = stage.questions[prev.currentQuestionIndex];
      const newTeams = prev.teams.map(t => {
        if (t.eliminated) return t;
        const answer = prev.answeredTeams[t.id];
        if (!answer) return t;
        let points = 0;
        if (answer.answer === q.correctAnswer) {
          points = 10;
          // Speed bonus: max 5 extra points
          const speedBonus = Math.max(0, Math.round((q.timeLimit - answer.time) / q.timeLimit * 5));
          points += speedBonus;
        }
        return { ...t, score: t.score + points };
      });
      return { ...prev, teams: newTeams };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const stage = stages[prev.currentStage];
      const nextIdx = prev.currentQuestionIndex + 1;

      // Rotate active players
      const newTeams = prev.teams.map(t => {
        if (t.eliminated) return t;
        return { ...t, currentPlayerIndex: (t.currentPlayerIndex + 1) % t.players.length };
      });

      if (nextIdx >= stage.questions.length) {
        // Stage complete
        return { ...prev, teams: newTeams, phase: "stage-result" };
      }

      return {
        ...prev,
        teams: newTeams,
        currentQuestionIndex: nextIdx,
        timeRemaining: stage.questions[nextIdx].timeLimit,
        answeredTeams: {},
        showingAnswer: false,
      };
    });
  }, []);

  const eliminateLowest = useCallback(() => {
    setState(prev => {
      const activeTeams = prev.teams.filter(t => !t.eliminated);
      const lowestScore = Math.min(...activeTeams.map(t => t.score));
      const lowestTeam = activeTeams.find(t => t.score === lowestScore);

      if (!lowestTeam) return prev;

      const newTeams = prev.teams.map(t =>
        t.id === lowestTeam.id ? { ...t, eliminated: true } : t
      );

      return { ...prev, teams: newTeams, phase: "elimination" };
    });
  }, []);

  const nextStage = useCallback(() => {
    setState(prev => {
      const nextStageIdx = prev.currentStage + 1;

      if (nextStageIdx >= stages.length) {
        return { ...prev, phase: "victory" };
      }

      // Reset scores for new stage
      const newTeams = prev.teams.map(t => ({ ...t, score: t.eliminated ? t.score : 0 }));

      return {
        ...prev,
        teams: newTeams,
        phase: "playing",
        currentStage: nextStageIdx,
        currentQuestionIndex: 0,
        timeRemaining: stages[nextStageIdx].questions[0].timeLimit,
        answeredTeams: {},
        showingAnswer: false,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    clearTimer();
    setState({
      phase: "setup",
      currentStage: 0,
      currentQuestionIndex: 0,
      teams: createDefaultTeams(),
      timeRemaining: 15,
      answeredTeams: {},
      showingAnswer: false,
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    startGame,
    startTimer,
    submitAnswer,
    calculateScores,
    nextQuestion,
    eliminateLowest,
    nextStage,
    resetGame,
    updateTeams,
    updateTeamName,
    updatePlayerName,
  };
}
