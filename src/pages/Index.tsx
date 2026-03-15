import { useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import { stages } from "@/data/questions";
import { SetupScreen } from "@/components/game/SetupScreen";
import { GameMap } from "@/components/game/GameMap";
import { TankCabin } from "@/components/game/TankCabin";
import { QuestionOverlay } from "@/components/game/QuestionOverlay";
import { StageResultScreen } from "@/components/game/StageResultScreen";
import { EliminationScreen } from "@/components/game/EliminationScreen";
import { VictoryScreen } from "@/components/game/VictoryScreen";

const Index = () => {
  const {
    state,
    startGame,
    startTimer,
    submitAnswer,
    calculateScores,
    nextQuestion,
    eliminateLowest,
    nextStage,
    resetGame,
    updateTeamName,
    updatePlayerName,
  } = useGameState();

  const { phase, currentStage, currentQuestionIndex, teams, timeRemaining, answeredTeams, showingAnswer } = state;

  // Start timer when playing
  useEffect(() => {
    if (phase === "playing" && !showingAnswer) {
      startTimer();
    }
  }, [phase, currentQuestionIndex, showingAnswer, startTimer]);

  if (phase === "setup") {
    return (
      <SetupScreen
        teams={teams}
        onUpdateTeamName={updateTeamName}
        onUpdatePlayerName={updatePlayerName}
        onStart={startGame}
      />
    );
  }

  const activeTeams = teams.filter(t => !t.eliminated);
  const stage = stages[currentStage];
  const question = stage?.questions[currentQuestionIndex];

  const eliminatedTeam = teams.find(t => t.eliminated && phase === "elimination" &&
    teams.filter(t2 => t2.eliminated).length === currentStage + 1 &&
    t.id === teams.filter(t2 => t2.eliminated).slice(-1)[0]?.id
  );
  const lastEliminated = teams.filter(t => t.eliminated).slice(-1)[0];

  const winner = phase === "victory" ? activeTeams[0] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="bg-army py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-primary-foreground">
            ⭐ HÀNH TRÌNH THỐNG NHẤT
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-gold font-bold">
              {stage?.name}
            </span>
            <button
              onClick={resetGame}
              className="text-xs text-primary-foreground/60 hover:text-primary-foreground underline"
            >
              Chơi lại
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Map */}
        <GameMap teams={teams} currentStage={currentStage} />

        {/* Team cabins */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {teams.map(team => (
            <TankCabin
              key={team.id}
              team={team}
              isActive={!team.eliminated && phase === "playing"}
              hasAnswered={answeredTeams[team.id] !== undefined}
            />
          ))}
        </div>
      </div>

      {/* Question overlay */}
      {phase === "playing" && question && (
        <QuestionOverlay
          question={question}
          questionIndex={currentQuestionIndex}
          totalQuestions={stage.questions.length}
          stageName={stage.name}
          timeRemaining={timeRemaining}
          showingAnswer={showingAnswer}
          answeredTeams={answeredTeams}
          activeTeams={activeTeams}
          onAnswer={submitAnswer}
          onNext={nextQuestion}
          onCalculateScores={calculateScores}
        />
      )}

      {/* Stage result */}
      {phase === "stage-result" && (
        <StageResultScreen
          teams={teams}
          stageName={stage.name}
          onEliminate={eliminateLowest}
        />
      )}

      {/* Elimination */}
      {phase === "elimination" && lastEliminated && (
        <EliminationScreen
          eliminatedTeam={lastEliminated}
          stageName={stage.name}
          onContinue={() => {
            if (currentStage + 1 >= stages.length) {
              // After stage 3 elimination, show victory
              nextStage();
            } else {
              nextStage();
            }
          }}
        />
      )}

      {/* Victory */}
      {phase === "victory" && winner && (
        <VictoryScreen winner={winner} onRestart={resetGame} />
      )}
    </div>
  );
};

export default Index;
