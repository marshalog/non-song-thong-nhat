import { TeamData } from "@/types/game";
import { useEffect, useState } from "react";

interface ScoreboardOverlayProps {
  teams: TeamData[];
  stageName: string;
  onEliminate: () => void;
}

export function ScoreboardOverlay({ teams, stageName, onEliminate }: ScoreboardOverlayProps) {
  const [countdown, setCountdown] = useState(5);
  const activeTeams = [...teams].filter(t => !t.eliminated).sort((a, b) => b.score - a.score);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onEliminate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onEliminate]);

  return (
    <div className="fixed inset-0 bg-foreground/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="question-card max-w-lg w-full animate-fade-in-up">
        <h2 className="font-display text-3xl font-black text-primary text-center mb-1">📊 BẢNG ĐIỂM</h2>
        <p className="font-display text-sm text-muted-foreground text-center mb-2">{stageName}</p>
        <p className="font-display text-xs text-foreground text-center mb-6">Tự động tiếp tục sau {countdown}s</p>

        <div className="space-y-3 mb-6">
          {activeTeams.map((team, idx) => (
            <div
              key={team.id}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                idx === activeTeams.length - 1 ? "border-primary bg-primary/5" : "border-army bg-army/5"
              }`}
            >
              <span className="font-display text-3xl font-black w-10">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "4️⃣"}
              </span>
              <span className="text-2xl">{team.icon}</span>
              <div className="flex-1">
                <p className="font-display font-bold text-lg" style={{ color: team.color }}>{team.name}</p>
              </div>
              <span className="font-display text-2xl font-black">{team.score}</span>
              {idx === activeTeams.length - 1 && (
                <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded">LOẠI</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
