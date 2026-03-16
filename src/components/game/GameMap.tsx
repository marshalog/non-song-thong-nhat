import { TeamData } from "@/types/game";
import { useState, useEffect } from "react";
import tankIcon from "@/assets/tank-icon.png";
import gameMap from "@/assets/map.png";

interface GameMapProps {
  teams: TeamData[];
  currentStage: number;
  animateToNext?: boolean;
}

// Positions mapped to the new map image
// Stage 1: Flag position (bottom-left), Stage 2: Gate (middle), Stage 3: Independence Palace (top)
// Positions precisely matched to map.png landmarks
// Stage 1: Red flag (bottom-left), Stage 2: Gate (middle-right), Stage 3: Independence Palace (top-center)
const stagePositions = [
  { x: 14, y: 78, label: "Chặng 1: Lá cờ" },
  { x: 43, y: 33, label: "Chặng 2: Cánh cổng" },
  { x: 50, y: 9, label: "Chặng 3: Dinh Độc Lập" },
];

export function GameMap({ teams, currentStage, animateToNext }: GameMapProps) {
  const [animatedStage, setAnimatedStage] = useState(animateToNext ? Math.max(0, currentStage - 1) : currentStage);

  useEffect(() => {
    if (animateToNext) {
      const timer = setTimeout(() => {
        setAnimatedStage(currentStage);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimatedStage(currentStage);
    }
  }, [animateToNext, currentStage]);

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border-2 border-border">
      <img src={gameMap} alt="Bản đồ hành quân" className="w-full h-full object-cover" />

      {/* Stage markers */}
      {stagePositions.map((pos, idx) => (
        <div
          key={idx}
          className="absolute flex flex-col items-center"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-lg border-3 ${
              idx <= currentStage ? "bg-gold text-foreground border-gold-dark" : "bg-muted text-muted-foreground border-border"
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
        const stageIdx = team.eliminated ? Math.max(0, animatedStage - 1) : animatedStage;
        const pos = stagePositions[Math.min(stageIdx, stagePositions.length - 1)];
        const offset = (i - 1.5) * 6;

        return (
          <div
            key={team.id}
            className={`absolute ${team.eliminated ? "eliminated" : ""}`}
            style={{
              left: `${pos.x + offset}%`,
              top: `${pos.y + 10 + i * 4}%`,
              transform: "translate(-50%, -50%)",
              transition: "left 5s ease-in-out, top 5s ease-in-out",
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src={tankIcon}
                alt="tank"
                className={`w-28 h-20 object-contain ${!team.eliminated && animateToNext ? "animate-tank-rumble" : ""}`}
                style={{ filter: team.eliminated ? "grayscale(1)" : "none" }}
              />
              <span
                className="text-[10px] font-display font-bold px-2 py-0.5 rounded mt-0.5 flex items-center gap-0.5"
                style={{ backgroundColor: team.color, color: "#fff" }}
              >
                {team.icon} {team.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
