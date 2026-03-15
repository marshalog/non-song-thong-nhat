import { Team } from "@/types/game";

interface EliminationScreenProps {
  eliminatedTeam: Team;
  stageName: string;
  onContinue: () => void;
}

export function EliminationScreen({ eliminatedTeam, stageName, onContinue }: EliminationScreenProps) {
  return (
    <div className="fixed inset-0 bg-foreground/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in-up max-w-lg">
        <div className="text-8xl mb-6">💥</div>
        <h1 className="font-display text-4xl font-black text-primary mb-2">LOẠI!</h1>
        <p className="font-display text-xl text-primary-foreground mb-6">{stageName}</p>

        <div
          className="inline-block px-8 py-4 rounded-xl mb-6"
          style={{ backgroundColor: eliminatedTeam.color }}
        >
          <h2 className="font-display text-2xl font-bold text-primary-foreground">{eliminatedTeam.name}</h2>
          <p className="text-primary-foreground/80 text-sm">Điểm: {eliminatedTeam.score}</p>
        </div>

        <div className="mb-8">
          <p className="text-primary-foreground text-lg mb-3">Thành viên:</p>
          <div className="flex justify-center gap-4">
            {eliminatedTeam.players.map(p => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-muted">
                  {p.avatar}
                </div>
                <span className="text-primary-foreground/70 text-xs mt-1">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/60 text-sm italic mb-6">
          Xe tăng đã dừng lại... Cuộc hành trình kết thúc tại đây.
        </p>

        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-colors"
        >
          Tiếp tục chặng tiếp theo →
        </button>
      </div>
    </div>
  );
}
