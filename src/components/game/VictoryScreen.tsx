import { TeamData } from "@/types/game";
import victoryImage from "@/assets/victory.png";
import bgNstn from "@/assets/bg_nstn.png";
import { Button } from "@/components/ui/button";

interface VictoryScreenProps {
  winner: TeamData;
  onRestart: () => void;
}

export function VictoryScreen({ winner, onRestart }: VictoryScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundImage: `url(${bgNstn})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute inset-0 victory-sunburst" />

      <div className="relative text-center animate-fade-in-up z-10">
        <div className="animate-flag-raise mb-6">
          <img src={victoryImage} alt="Chiến thắng" className="w-40 h-40 mx-auto object-contain" />
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-black text-foreground mb-2" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}>
          CHIẾN THẮNG!
        </h1>
        <p className="font-display text-xl text-primary-foreground/90 mb-8">
          Giải phóng miền Nam, thống nhất đất nước!
        </p>

        <div
          className="inline-block px-10 py-6 rounded-2xl mb-8 shadow-2xl"
          style={{ backgroundColor: winner.color }}
        >
          <div className="mb-3 flex justify-center">
            <img src={victoryImage} alt="Đội chiến thắng" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground">{winner.name}</h2>
          <p className="text-primary-foreground/80 text-lg mt-1">🏆 Đội chiến thắng</p>
        </div>

        <div>
          <p className="text-primary-foreground/70 text-sm italic mb-6">
            "Không có gì quý hơn độc lập, tự do" — Hồ Chí Minh
          </p>
          <Button
            onClick={onRestart}
            size="lg"
            className="font-display text-lg px-8 btn-neon bg-gold text-foreground hover:bg-gold/90"
          >
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
