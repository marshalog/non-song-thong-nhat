import { Question, TeamData, TeamAnswer } from "@/types/game";

interface HostQuestionViewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  stageName: string;
  timeRemaining: number;
  isShowingAnswer: boolean;
  teams: TeamData[];
  currentAnswers: TeamAnswer[];
  onShowAnswer: () => void;
  onNext: () => void;
}

export function HostQuestionView({
  question,
  questionIndex,
  totalQuestions,
  stageName,
  timeRemaining,
  isShowingAnswer,
  teams,
  currentAnswers,
  onShowAnswer,
  onNext,
}: HostQuestionViewProps) {
  const timerPercent = (timeRemaining / question.timeLimit) * 100;
  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Question card */}
      <div className="question-card animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-sm font-bold text-army">{stageName}</span>
          <span className="font-display text-sm text-muted-foreground">
            Câu {questionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Timer */}
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerPercent > 50 ? "hsl(var(--army-green))" : timerPercent > 20 ? "hsl(var(--gold-dark))" : "hsl(var(--primary))",
            }}
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="font-display text-4xl font-black text-primary">{timeRemaining}s</span>
          <span className="text-sm text-muted-foreground">
            {currentAnswers.length}/{teams.length} đội đã trả lời
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {question.options.map((option, idx) => {
            const isCorrect = idx === question.correctAnswer;
            const answeredCount = currentAnswers.filter(a => a.answer_index === idx).length;
            return (
              <div
                key={idx}
                className={`relative text-left p-4 rounded-lg border-2 font-body font-medium transition-all ${
                  isShowingAnswer
                    ? isCorrect
                      ? "border-army bg-army/10 text-army"
                      : "border-muted text-muted-foreground"
                    : "border-border"
                }`}
              >
                <span className="font-display font-bold text-primary mr-2">{letterLabels[idx]}.</span>
                {option}
                {isShowingAnswer && isCorrect && <span className="absolute top-2 right-2 text-xl">✅</span>}
                {answeredCount > 0 && (
                  <span className="absolute top-2 right-2 bg-muted px-2 py-0.5 rounded-full text-xs font-bold text-foreground">
                    {answeredCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Team answer status */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {teams.map(team => {
              const teamAnswer = currentAnswers.find(a => a.team_id === team.id);
              const isCorrect = teamAnswer?.answer_index === question.correctAnswer;
              return (
                <div
                  key={team.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                    !teamAnswer
                      ? "border-border text-muted-foreground"
                      : isShowingAnswer
                        ? isCorrect
                          ? "bg-army/10 border-army text-army"
                          : "bg-primary/10 border-primary text-primary"
                        : "bg-gold/10 border-gold text-foreground"
                  }`}
                >
                  <span>{team.icon}</span>
                  <span>{team.name}</span>
                  {teamAnswer && !isShowingAnswer && <span>✅</span>}
                  {teamAnswer && isShowingAnswer && (
                    <span>
                      {isCorrect ? `✅ (${teamAnswer.time_elapsed.toFixed(1)}s)` : `❌ ${letterLabels[teamAnswer.answer_index]}`}
                    </span>
                  )}
                  {!teamAnswer && isShowingAnswer && <span>⏰</span>}
                </div>
              );
            })}
          </div>

          {/* Control buttons */}
          {!isShowingAnswer ? (
            <button
              onClick={onShowAnswer}
              className="w-full py-3 rounded-lg bg-gold text-foreground font-display font-bold text-lg hover:bg-gold/90 transition-colors"
            >
              Hiện đáp án
            </button>
          ) : (
            <button
              onClick={onNext}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              {questionIndex + 1 < totalQuestions ? "Câu tiếp theo →" : "Kết thúc chặng →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
