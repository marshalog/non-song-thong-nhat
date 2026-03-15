import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { stages } from "@/data/questions";
import { RoomData, TeamData, TeamAnswer } from "@/types/game";

export function useHostActions(room: RoomData | null, teams: TeamData[], answers: TeamAnswer[]) {
  const updateRoom = useCallback(async (updates: Partial<RoomData>) => {
    if (!room) return;
    await supabase.from("game_rooms").update(updates).eq("id", room.id);
  }, [room]);

  const startStage = useCallback(async () => {
    if (!room) return;
    const stage = stages[room.current_stage];
    if (!stage) return;
    await updateRoom({
      phase: "playing",
      current_question_index: 0,
      showing_answer: false,
      time_remaining: stage.questions[0].timeLimit,
    });
  }, [room, updateRoom]);

  const showAnswer = useCallback(async () => {
    await updateRoom({ showing_answer: true, phase: "showing-answer" });
  }, [updateRoom]);

  const nextQuestion = useCallback(async () => {
    if (!room) return;
    const stage = stages[room.current_stage];
    const nextIdx = room.current_question_index + 1;

    // Calculate scores first
    const q = stage.questions[room.current_question_index];
    const activeTeams = teams.filter(t => !t.eliminated);
    const currentAnswers = answers.filter(
      a => a.stage === room.current_stage && a.question_index === room.current_question_index
    );

    for (const team of activeTeams) {
      const teamAnswer = currentAnswers.find(a => a.team_id === team.id);
      if (teamAnswer && teamAnswer.answer_index === q.correctAnswer) {
        const speedBonus = Math.max(0, Math.round((q.timeLimit - teamAnswer.time_elapsed) / q.timeLimit * 5));
        const points = 10 + speedBonus;
        await supabase.from("teams").update({ score: team.score + points }).eq("id", team.id);
      }
    }

    if (nextIdx >= stage.questions.length) {
      // Show scoreboard
      await updateRoom({ phase: "scoreboard", showing_answer: false });
    } else {
      await updateRoom({
        phase: "playing",
        current_question_index: nextIdx,
        showing_answer: false,
        time_remaining: stage.questions[nextIdx].timeLimit,
      });
    }
  }, [room, teams, answers, updateRoom]);

  const eliminateLowest = useCallback(async () => {
    if (!room) return;
    const activeTeams = teams.filter(t => !t.eliminated);
    if (activeTeams.length <= 1) return;
    const lowestScore = Math.min(...activeTeams.map(t => t.score));
    const lowestTeam = activeTeams.find(t => t.score === lowestScore);
    if (!lowestTeam) return;

    await supabase.from("teams").update({ eliminated: true }).eq("id", lowestTeam.id);
    await updateRoom({ phase: "elimination" });
  }, [room, teams, updateRoom]);

  const showMapTransition = useCallback(async () => {
    await updateRoom({ phase: "map-transition" });
  }, [updateRoom]);

  const nextStage = useCallback(async () => {
    if (!room) return;
    const nextStageIdx = room.current_stage + 1;
    if (nextStageIdx >= stages.length) {
      await updateRoom({ phase: "victory" });
      return;
    }

    // Reset scores for new stage
    const activeTeams = teams.filter(t => !t.eliminated);
    for (const team of activeTeams) {
      await supabase.from("teams").update({ score: 0 }).eq("id", team.id);
    }

    await updateRoom({
      phase: "lobby",
      current_stage: nextStageIdx,
      current_question_index: 0,
      showing_answer: false,
      time_remaining: stages[nextStageIdx].questions[0].timeLimit,
    });
  }, [room, teams, updateRoom]);

  return {
    updateRoom,
    startStage,
    showAnswer,
    nextQuestion,
    eliminateLowest,
    showMapTransition,
    nextStage,
  };
}
