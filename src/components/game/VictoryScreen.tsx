import { Team } from "@/types/game";
import victoryFlag from "@/assets/victory-flag.png";

interface VictoryScreenProps {
  winner: Team;
  onRestart: () => void;
}

export function VictoryScreen({ winner, onRestart }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Sunburst background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 victory-sunburst" />

      <div className="relative text-center animate-fade-in-up z-10">
        <div className="animate-flag-raise mb-6">
          <img src={victoryFlag} alt="Cờ Việt Nam" className="w-40 h-40 mx-auto object-contain" />
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-black text-gold mb-2" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}>
          CHIẾN THẮNG!
        </h1>
        <p className="font-display text-xl text-primary-foreground/90 mb-8">
          Giải phóng miền Nam, thống nhất đất nước!
        </p>

        <div
          className="inline-block px-10 py-6 rounded-2xl mb-8 shadow-2xl"
          style={{ backgroundColor: winner.color }}
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground">{winner.name}</h2>
          <p className="text-primary-foreground/80 text-lg mt-1">🏆 Đội chiến thắng</p>
          <div className="flex justify-center gap-3 mt-4">
            {winner.players.map(p => (
              <div key={p.id} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl border-2 border-gold">
                  {p.avatar}
                </div>
                <span className="text-primary-foreground/80 text-xs mt-1">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-primary-foreground/70 text-sm italic mb-6">
            "Không có gì quý hơn độc lập, tự do" — Hồ Chí Minh
          </p>
          <button
            onClick={onRestart}
            className="px-8 py-3 rounded-lg bg-gold text-foreground font-display font-bold text-lg hover:bg-gold/90 transition-colors"
          >
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
}
