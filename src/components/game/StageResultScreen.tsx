import { Team } from "@/types/game";

interface StageResultScreenProps {
  teams: Team[];
  stageName: string;
  onEliminate: () => void;
}

export function StageResultScreen({ teams, stageName, onEliminate }: StageResultScreenProps) {
  const activeTeams = teams.filter(t => !t.eliminated).sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-foreground/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="question-card max-w-lg w-full animate-fade-in-up">
        <h2 className="font-display text-2xl font-black text-primary text-center mb-1">KẾT QUẢ</h2>
        <p className="font-display text-sm text-muted-foreground text-center mb-6">{stageName}</p>

        <div className="space-y-3 mb-6">
          {activeTeams.map((team, idx) => (
            <div
              key={team.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                idx === activeTeams.length - 1 ? "border-primary bg-primary/5" : "border-army bg-army/5"
              }`}
            >
              <span className="font-display text-2xl font-black w-8">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "💀"}
              </span>
              <div className="flex-1">
                <p className="font-display font-bold" style={{ color: team.color }}>{team.name}</p>
              </div>
              <span className="font-display text-xl font-black">{team.score}</span>
              {idx === activeTeams.length - 1 && (
                <span className="text-xs text-primary font-bold">LOẠI</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onEliminate}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          Công bố kết quả →
        </button>
      </div>
    </div>
  );
}
