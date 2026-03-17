import { RoomData, TeamData, TeamAnswer, StageData } from "@/types/game";

interface HostControlPanelProps {
  room: RoomData;
  teams: TeamData[];
  answers: TeamAnswer[];
  stages: StageData[];
}

export function HostControlPanel({ room, teams, answers, stages }: HostControlPanelProps) {
  const activeTeams = teams.filter(t => !t.eliminated);
  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="tank-cabin">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">📊 BẢNG ĐIỀU KHIỂN ADMIN</h3>

        {/* Room info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[10px] text-primary-foreground/60 font-display">Mã phòng</p>
            <p className="font-display font-bold text-foreground text-lg">{room.room_code}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[10px] text-primary-foreground/60 font-display">Giai đoạn</p>
            <p className="font-display font-bold text-primary-foreground text-sm">{room.phase}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[10px] text-primary-foreground/60 font-display">Chặng</p>
            <p className="font-display font-bold text-primary-foreground text-lg">{room.current_stage + 1}/3</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-[10px] text-primary-foreground/60 font-display">Câu hỏi</p>
            <p className="font-display font-bold text-primary-foreground text-lg">{room.current_question_index + 1}/10</p>
          </div>
        </div>

        {/* Teams overview */}
        <div className="mb-4">
          <h4 className="font-display text-sm font-bold text-primary-foreground/80 mb-2">CÁC ĐỘI</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {teams.map(team => (
              <div
                key={team.id}
                className={`bg-secondary/50 rounded-lg p-2 ${team.eliminated ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg">{team.icon}</span>
                  <span className="font-display font-bold text-primary-foreground text-xs truncate">{team.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-display font-bold text-lg">{team.score}</span>
                  {team.eliminated && <span className="text-[10px] text-primary-foreground/50">❌ Loại</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer history for current stage */}
        <div>
          <h4 className="font-display text-sm font-bold text-primary-foreground/80 mb-2">
            CÂU TRẢ LỜI - {stages[room.current_stage]?.name}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-primary-foreground/20">
                  <th className="text-left py-1.5 px-2 font-display text-primary-foreground/60">Câu</th>
                  {activeTeams.map(t => (
                    <th key={t.id} className="text-center py-1.5 px-2 font-display" style={{ color: t.color }}>
                      {t.icon} {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stages[room.current_stage]?.questions.map((q, qIdx) => {
                  const qAnswers = answers.filter(a => a.stage === room.current_stage && a.question_index === qIdx);
                  return (
                    <tr key={qIdx} className="border-b border-primary-foreground/10">
                      <td className="py-1.5 px-2 text-primary-foreground/80">C{qIdx + 1}</td>
                      {activeTeams.map(t => {
                        const ans = qAnswers.find(a => a.team_id === t.id);
                        if (!ans) return <td key={t.id} className="text-center py-1.5 px-2 text-primary-foreground/30">—</td>;
                        const isCorrect = q.type === 'multiple-choice'
                          ? ans.answer_index === q.correctAnswer
                          : ans.text_answer?.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
                        const display = q.type === 'multiple-choice' ? letterLabels[ans.answer_index] : (ans.text_answer || "—");
                        return (
                          <td key={t.id} className={`text-center py-1.5 px-2 font-bold ${isCorrect ? "text-foreground" : "text-primary"}`}>
                            {display} {isCorrect ? "✅" : "❌"} ({ans.time_elapsed.toFixed(1)}s)
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
