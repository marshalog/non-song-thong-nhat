import { Team } from "@/types/game";
import tankIcon from "@/assets/tank-icon.png";

interface TankCabinProps {
  team: Team;
  isActive: boolean;
  hasAnswered: boolean;
}

export function TankCabin({ team, isActive, hasAnswered }: TankCabinProps) {
  return (
    <div
      className={`tank-cabin transition-all duration-300 ${team.eliminated ? "eliminated" : ""} ${isActive ? "ring-2 ring-gold scale-105" : ""}`}
      style={{ borderLeftColor: team.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <img src={tankIcon} alt="tank" className="w-8 h-8 object-contain" />
        <h3 className="font-display text-sm font-bold text-primary-foreground truncate">{team.name}</h3>
        <span className="ml-auto font-display text-gold font-bold text-lg">{team.score}</span>
      </div>

      <div className="flex gap-1.5">
        {team.players.map((player, idx) => (
          <div
            key={player.id}
            className={`flex flex-col items-center transition-all duration-200 ${
              idx === team.currentPlayerIndex && !team.eliminated ? "scale-110" : "opacity-70"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 ${
                idx === team.currentPlayerIndex && !team.eliminated
                  ? "border-gold star-glow bg-secondary"
                  : "border-muted bg-secondary/50"
              }`}
            >
              {player.avatar}
            </div>
            <span className="text-[10px] text-primary-foreground/80 mt-0.5 truncate max-w-[50px]">
              {player.name}
            </span>
          </div>
        ))}
      </div>

      {hasAnswered && !team.eliminated && (
        <div className="mt-1 text-center text-[10px] font-bold text-gold animate-fade-in-up">
          ✅ Đã trả lời
        </div>
      )}
      {team.eliminated && (
        <div className="mt-1 text-center text-[10px] font-bold text-primary-foreground/50">
          ❌ Đã bị loại
        </div>
      )}
    </div>
  );
}
