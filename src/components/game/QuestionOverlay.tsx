import { Question, Team } from "@/types/game";
import { useEffect, useState } from "react";

interface QuestionOverlayProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  stageName: string;
  timeRemaining: number;
  showingAnswer: boolean;
  answeredTeams: Record<number, { answer: number; time: number }>;
  activeTeams: Team[];
  onAnswer: (teamId: number, answerIndex: number) => void;
  onNext: () => void;
  onCalculateScores: () => void;
}

export function QuestionOverlay({
  question,
  questionIndex,
  totalQuestions,
  stageName,
  timeRemaining,
  showingAnswer,
  answeredTeams,
  activeTeams,
  onAnswer,
  onNext,
  onCalculateScores,
}: QuestionOverlayProps) {
  const [scored, setScored] = useState(false);
  const timerPercent = (timeRemaining / question.timeLimit) * 100;

  useEffect(() => {
    if (showingAnswer && !scored) {
      onCalculateScores();
      setScored(true);
    }
  }, [showingAnswer, scored, onCalculateScores]);

  useEffect(() => {
    setScored(false);
  }, [question.id]);

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="question-card w-full max-w-3xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-sm font-bold text-army">{stageName}</span>
          <span className="font-display text-sm text-muted-foreground">
            Câu {questionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerPercent > 50 ? "hsl(var(--army-green))" : timerPercent > 20 ? "hsl(var(--gold-dark))" : "hsl(var(--primary))",
            }}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-display text-3xl font-black text-primary">{timeRemaining}s</span>
        </div>

        {/* Question */}
        <h2 className="font-display text-xl font-bold text-foreground mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correctAnswer;
            const letterLabels = ["A", "B", "C", "D"];
            return (
              <button
                key={idx}
                disabled={showingAnswer}
                className={`relative text-left p-4 rounded-lg border-2 font-body font-medium transition-all duration-200 ${
                  showingAnswer
                    ? isCorrect
                      ? "border-army bg-army/10 text-army"
                      : "border-muted text-muted-foreground"
                    : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer active:scale-95"
                }`}
              >
                <span className="font-display font-bold text-primary mr-2">{letterLabels[idx]}.</span>
                {option}
                {showingAnswer && isCorrect && (
                  <span className="absolute top-2 right-2 text-xl">✅</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Team answer buttons (when not showing answer) */}
        {!showingAnswer && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3 font-display font-bold">Chọn đáp án cho đội:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeTeams.map(team => {
                const hasAnswered = answeredTeams[team.id] !== undefined;
                return (
                  <div key={team.id} className="space-y-1">
                    <p className="text-xs font-bold text-center truncate" style={{ color: team.color }}>
                      {team.name}
                    </p>
                    <div className="flex gap-1">
                      {["A", "B", "C", "D"].map((letter, i) => (
                        <button
                          key={i}
                          disabled={hasAnswered}
                          onClick={() => onAnswer(team.id, i)}
                          className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                            hasAnswered && answeredTeams[team.id]?.answer === i
                              ? "bg-primary text-primary-foreground"
                              : hasAnswered
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results & Next */}
        {showingAnswer && (
          <div className="border-t pt-4 animate-fade-in-up">
            <div className="flex flex-wrap gap-2 mb-4">
              {activeTeams.map(team => {
                const answer = answeredTeams[team.id];
                const isCorrect = answer?.answer === question.correctAnswer;
                return (
                  <div
                    key={team.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      isCorrect
                        ? "bg-army/10 border-army text-army"
                        : "bg-primary/10 border-primary text-primary"
                    }`}
                  >
                    {team.name}: {answer ? (isCorrect ? `✅ (${answer.time}s)` : "❌") : "⏰ Hết giờ"}
                  </div>
                );
              })}
            </div>
            <button
              onClick={onNext}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              {questionIndex + 1 < totalQuestions ? "Câu tiếp theo →" : "Kết thúc chặng"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
