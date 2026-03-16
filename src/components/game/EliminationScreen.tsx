import { TeamData } from "@/types/game";
import { Button } from "@/components/ui/button";

interface EliminationScreenProps {
  eliminatedTeam: TeamData;
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
          <div className="text-4xl mb-2">{eliminatedTeam.icon}</div>
          <h2 className="font-display text-2xl font-bold text-primary-foreground">{eliminatedTeam.name}</h2>
          <p className="text-primary-foreground/80 text-sm">Điểm: {eliminatedTeam.score}</p>
        </div>

        <p className="text-primary-foreground/60 text-sm italic mb-6">
          Xe tăng đã dừng lại... Cuộc hành trình kết thúc tại đây.
        </p>

        <Button
          onClick={onContinue}
          size="lg"
          className="font-display text-lg px-8 btn-neon"
        >
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
}
