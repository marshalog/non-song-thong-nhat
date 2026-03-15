import { Team } from "@/types/game";
import tankIcon from "@/assets/tank-icon.png";
import vietnamMap from "@/assets/vietnam-map.jpg";

interface GameMapProps {
  teams: Team[];
  currentStage: number;
}

const stagePositions = [
  { x: 18, y: 28, label: "Chặng 1: Tiến Công" },
  { x: 48, y: 48, label: "Chặng 2: Phá Cổng" },
  { x: 78, y: 68, label: "Chặng 3: Cắm Cờ" },
];

export function GameMap({ teams, currentStage }: GameMapProps) {
  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border-2 border-border">
      <img src={vietnamMap} alt="Bản đồ Việt Nam" className="w-full h-full object-cover" />
      
      {/* Stage markers */}
      {stagePositions.map((pos, idx) => (
        <div
          key={idx}
          className="absolute flex flex-col items-center"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-lg border-3 ${
              idx <= currentStage ? "bg-gold text-foreground star-glow border-gold-dark" : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {idx + 1}
          </div>
          <span className="mt-1 text-[10px] font-display font-bold bg-foreground/70 text-primary-foreground px-2 py-0.5 rounded whitespace-nowrap">
            {pos.label}
          </span>
        </div>
      ))}

      {/* Tank positions */}
      {teams.map((team, i) => {
        const stageIdx = team.eliminated
          ? Math.max(0, currentStage - 1)
          : currentStage;
        const pos = stagePositions[Math.min(stageIdx, stagePositions.length - 1)];
        const offset = (i - 1.5) * 5;

        return (
          <div
            key={team.id}
            className={`absolute transition-all duration-1000 ease-out ${team.eliminated ? "eliminated" : "animate-tank-move"}`}
            style={{
              left: `${pos.x + offset}%`,
              top: `${pos.y + 12 + i * 3}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex flex-col items-center">
              <img src={tankIcon} alt="tank" className="w-12 h-8 object-contain" style={{ filter: team.eliminated ? "grayscale(1)" : "none" }} />
              <span
                className="text-[9px] font-display font-bold px-1.5 py-0.5 rounded mt-0.5"
                style={{ backgroundColor: team.color, color: "#fff" }}
              >
                {team.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
