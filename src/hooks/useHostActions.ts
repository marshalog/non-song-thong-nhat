import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { stages } from "@/data/questions";
import { RoomData, TeamData, TeamAnswer, getMcQuestions, getBonusQuestions } from "@/types/game";

export function useHostActions(room: RoomData | null, teams: TeamData[], answers: TeamAnswer[]) {
  const updateRoom = useCallback(async (updates: Partial<RoomData>) => {
    if (!room) return;
    await supabase.from("game_rooms").update(updates as any).eq("id", room.id);
  }, [room]);

  // Start MC phase: reset team progress, set timer
  const startStage = useCallback(async () => {
    if (!room) return;
    const stage = stages[room.current_stage];
    if (!stage) return;

    // Reset all active teams' question index and finished_at
    const activeTeams = teams.filter(t => !t.eliminated);
    for (const team of activeTeams) {
      await supabase.from("teams").update({
        current_question_index: 0,
        finished_at: null,
        score: 0,
      } as any).eq("id", team.id);
    }

    await updateRoom({
      phase: "playing-mc",
      current_question_index: 0,
      showing_answer: false,
      stage_started_at: new Date().toISOString(),
      time_remaining: stage.mcTimeLimit,
    } as any);
  }, [room, teams, updateRoom]);

  // Called when MC phase ends (timer or first finish) - calculate MC scores
  const endMcPhase = useCallback(async () => {
    if (!room) return;
    const stage = stages[room.current_stage];
    const mcQuestions = getMcQuestions(stage);
    const bonusQuestions = getBonusQuestions(stage);
    const activeTeams = teams.filter(t => !t.eliminated);

    // Calculate scores for each team
    for (const team of activeTeams) {
      let totalPoints = 0;
      for (let qi = 0; qi < mcQuestions.length; qi++) {
        const q = mcQuestions[qi];
        const teamAnswer = answers.find(
          a => a.team_id === team.id && a.stage === room.current_stage && a.question_index === qi
        );
        if (teamAnswer && teamAnswer.answer_index === q.correctAnswer) {
          // Base 10 points + speed bonus (up to 5 based on remaining time ratio)
          const timeRatio = Math.max(0, 1 - teamAnswer.time_elapsed / stage.mcTimeLimit);
          const speedBonus = Math.round(timeRatio * 5);
          totalPoints += 10 + speedBonus;
        }
      }
      await supabase.from("teams").update({ score: totalPoints } as any).eq("id", team.id);
    }

    if (bonusQuestions.length > 0) {
      // Go to bonus phase
      await updateRoom({
        phase: "playing-bonus",
        current_question_index: 0,
        showing_answer: false,
        time_remaining: bonusQuestions[0].timeLimit || 15,
      } as any);
    } else {
      // Skip to stage results
      await updateRoom({ phase: "stage-results", showing_answer: false } as any);
    }
  }, [room, teams, answers, updateRoom]);

  // Show answer for current bonus question
  const showBonusAnswer = useCallback(async () => {
    await updateRoom({ showing_answer: true } as any);
  }, [updateRoom]);

  // Next bonus question or go to results
  const nextBonusQuestion = useCallback(async () => {
    if (!room) return;
    const stage = stages[room.current_stage];
    const bonusQuestions = getBonusQuestions(stage);
    const mcCount = getMcQuestions(stage).length;
    const bonusIdx = room.current_question_index;

    // Score current bonus question
    const currentQ = bonusQuestions[bonusIdx];
    const activeTeams = teams.filter(t => !t.eliminated);
    if (currentQ) {
      type CorrectResult = { team: TeamData; basePoints: number; time: number };
      const correctResults: CorrectResult[] = [];

      for (const team of activeTeams) {
        const teamAnswer = answers.find(
          a => a.team_id === team.id && a.stage === room.current_stage && a.question_index === mcCount + bonusIdx
        );
        if (!teamAnswer) continue;

        const isCorrect = typeof currentQ.correctAnswer === "string"
          ? teamAnswer.text_answer?.trim().toLowerCase() === (currentQ.correctAnswer as string).trim().toLowerCase()
          : teamAnswer.answer_index === currentQ.correctAnswer;

        if (isCorrect) {
          const totalTime = currentQ.timeLimit || 15;
          const timeBonus = Math.max(
            0,
            Math.round(((totalTime - teamAnswer.time_elapsed) / totalTime) * 5),
          );
          const basePoints = 10 + timeBonus;
          correctResults.push({ team, basePoints, time: teamAnswer.time_elapsed });
        }
      }

      // Bonus thêm +2 cho đội nhanh nhất, +1 cho đội nhanh nhì
      correctResults.sort((a, b) => a.time - b.time);
      if (correctResults[0]) {
        correctResults[0].basePoints += 2;
      }
      if (correctResults[1]) {
        correctResults[1].basePoints += 1;
      }

      for (const result of correctResults) {
        await supabase
          .from("teams")
          .update({ score: result.team.score + result.basePoints } as any)
          .eq("id", result.team.id);
      }
    }

    const nextIdx = bonusIdx + 1;
    if (nextIdx >= bonusQuestions.length) {
      await updateRoom({ phase: "stage-results", showing_answer: false } as any);
    } else {
      await updateRoom({
        current_question_index: nextIdx,
        showing_answer: false,
        time_remaining: bonusQuestions[nextIdx].timeLimit || 15,
      } as any);
    }
  }, [room, teams, answers, updateRoom]);

  // Eliminate lowest scoring team
  const eliminateLowest = useCallback(async () => {
    if (!room) return;
    const activeTeams = teams.filter(t => !t.eliminated);
    if (activeTeams.length <= 1) return;
    const lowestScore = Math.min(...activeTeams.map(t => t.score));
    const lowestTeam = activeTeams.find(t => t.score === lowestScore);
    if (!lowestTeam) return;

    await supabase.from("teams").update({ eliminated: true } as any).eq("id", lowestTeam.id);
    await updateRoom({ phase: "elimination" } as any);
  }, [room, teams, updateRoom]);

  const showVideoTransition = useCallback(async () => {
    await updateRoom({ phase: "video-transition" } as any);
  }, [updateRoom]);

  const showMapTransition = useCallback(async () => {
    await updateRoom({ phase: "map-transition" } as any);
  }, [updateRoom]);

  const nextStage = useCallback(async () => {
    if (!room) return;
    const nextStageIdx = room.current_stage + 1;
    if (nextStageIdx >= stages.length) {
      await updateRoom({ phase: "victory" } as any);
      return;
    }

    await updateRoom({
      phase: "lobby",
      current_stage: nextStageIdx,
      current_question_index: 0,
      showing_answer: false,
      time_remaining: stages[nextStageIdx].mcTimeLimit,
      stage_started_at: null,
    } as any);
  }, [room, updateRoom]);

  // Go from stage-results to scoreboard
  const showScoreboard = useCallback(async () => {
    await updateRoom({ phase: "scoreboard" } as any);
  }, [updateRoom]);

  return {
    updateRoom,
    startStage,
    endMcPhase,
    showBonusAnswer,
    nextBonusQuestion,
    eliminateLowest,
    showVideoTransition,
    showMapTransition,
    nextStage,
    showScoreboard,
  };
}
