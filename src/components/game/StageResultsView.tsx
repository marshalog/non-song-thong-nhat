import { TeamData, TeamAnswer, StageData, getMcQuestions, getBonusQuestions } from "@/types/game";
import { Button } from "@/components/ui/button";

interface StageResultsViewProps {
  stage: StageData;
  stageIndex: number;
  teams: TeamData[];
  answers: TeamAnswer[];
  onContinue: () => void;
}

export function StageResultsView({ stage, stageIndex, teams, answers, onContinue }: StageResultsViewProps) {
  const mcQuestions = getMcQuestions(stage);
  const bonusQuestions = getBonusQuestions(stage);
  const allQuestions = stage.questions;
  const activeTeams = [...teams].filter(t => !t.eliminated).sort((a, b) => b.score - a.score);
  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="text-center">
        <h2 className="font-display text-3xl font-black text-primary mb-1">📋 KẾT QUẢ {stage.name.toUpperCase()}</h2>
        <p className="text-muted-foreground font-display text-sm">{stage.subtitle}</p>
      </div>

      {/* Scoreboard */}
      <div className="question-card">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">🏆 Bảng xếp hạng</h3>
        <div className="space-y-3">
          {activeTeams.map((team, idx) => {
            const stageAnswers = answers.filter(a => a.team_id === team.id && a.stage === stageIndex);
            const correctCount = allQuestions.reduce((count, q, qi) => {
              const ans = stageAnswers.find(a => a.question_index === qi);
              if (!ans) return count;
              if (q.type === 'multiple-choice') {
                return count + (ans.answer_index === q.correctAnswer ? 1 : 0);
              } else {
                return count + (ans.text_answer?.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase() ? 1 : 0);
              }
            }, 0);

            return (
              <div
                key={team.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                  idx === activeTeams.length - 1
                    ? "border-primary bg-primary/5"
                    : idx === 0
                      ? "border-gold bg-gold/10"
                      : "border-army bg-army/5"
                }`}
              >
                <span className="font-display text-3xl font-black w-10">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                </span>
                <span className="text-2xl">{team.icon}</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-lg" style={{ color: team.color }}>{team.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {correctCount}/{allQuestions.length} câu đúng
                    {team.finished_at && " • ✅ Hoàn thành"}
                  </p>
                </div>
                <span className="font-display text-2xl font-black">{team.score} điểm</span>
                {idx === activeTeams.length - 1 && (
                  <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">NGUY HIỂM</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Sheet */}
      <div className="question-card">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">📝 Bảng đáp án</h3>
        <div className="space-y-4">
          {allQuestions.map((q, qi) => (
            <div key={q.id} className="border border-border rounded-lg p-3">
              <div className="flex items-start gap-2 mb-2">
                <span className="font-display font-bold text-primary text-sm">Câu {qi + 1}.</span>
                <span className="text-sm text-foreground font-medium">{q.question}</span>
                {q.type !== 'multiple-choice' && (
                  <span className="ml-auto text-[10px] bg-gold/20 text-foreground px-2 py-0.5 rounded font-display font-bold whitespace-nowrap">
                    {q.type === 'fill-in' ? '✍️ Điền' : '🖼️ Hình ảnh'}
                  </span>
                )}
              </div>

              {/* Correct answer */}
              <div className="text-xs mb-2">
                <span className="text-army font-bold">
                  Đáp án: {q.type === 'multiple-choice' ? `${letterLabels[q.correctAnswer as number]}. ${q.options![q.correctAnswer as number]}` : q.correctAnswer}
                </span>
              </div>

              {/* Team answers */}
              <div className="flex flex-wrap gap-1.5">
                {activeTeams.map(team => {
                  const ans = answers.find(a => a.team_id === team.id && a.stage === stageIndex && a.question_index === qi);
                  let isCorrect = false;
                  let answerDisplay = "—";
                  if (ans) {
                    if (q.type === 'multiple-choice') {
                      isCorrect = ans.answer_index === q.correctAnswer;
                      answerDisplay = letterLabels[ans.answer_index] || "?";
                    } else {
                      isCorrect = ans.text_answer?.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
                      answerDisplay = ans.text_answer || "—";
                    }
                  }
                  return (
                    <span
                      key={team.id}
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        !ans ? "bg-muted text-muted-foreground" : isCorrect ? "bg-army/20 text-army" : "bg-primary/20 text-primary"
                      }`}
                    >
                      {team.icon} {ans ? (isCorrect ? "✅" : "❌") : "⏰"} {answerDisplay}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onContinue} size="lg" className="w-full font-display font-bold text-lg btn-neon">
        Xem bảng điểm & Loại đội
      </Button>
    </div>
  );
}
