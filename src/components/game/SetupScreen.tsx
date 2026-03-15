import { Team } from "@/types/game";

interface SetupScreenProps {
  teams: Team[];
  onUpdateTeamName: (teamId: number, name: string) => void;
  onUpdatePlayerName: (teamId: number, playerIndex: number, name: string) => void;
  onStart: () => void;
}

export function SetupScreen({ teams, onUpdateTeamName, onUpdatePlayerName, onStart }: SetupScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="font-display text-4xl md:text-5xl font-black text-primary mb-2">
          HÀNH TRÌNH THỐNG NHẤT
        </h1>
        <p className="font-display text-lg text-muted-foreground">
          30/4/1975 — Giải phóng miền Nam, thống nhất đất nước
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Nhập tên đội và thành viên để bắt đầu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
        {teams.map(team => (
          <div
            key={team.id}
            className="tank-cabin animate-fade-in-up"
            style={{ borderLeftColor: team.color, borderLeftWidth: 4, animationDelay: `${team.id * 100}ms` }}
          >
            <input
              type="text"
              value={team.name}
              onChange={e => onUpdateTeamName(team.id, e.target.value)}
              className="w-full font-display font-bold text-lg bg-transparent text-primary-foreground border-b border-primary-foreground/20 pb-1 mb-3 outline-none focus:border-gold"
            />
            <div className="space-y-2">
              {team.players.map((player, idx) => (
                <div key={player.id} className="flex items-center gap-2">
                  <span className="text-xl">{player.avatar}</span>
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => onUpdatePlayerName(team.id, idx, e.target.value)}
                    className="flex-1 bg-transparent text-primary-foreground text-sm border-b border-primary-foreground/10 pb-0.5 outline-none focus:border-gold"
                    placeholder={`Thành viên ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-12 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
      >
        ⭐ BẮT ĐẦU HÀNH TRÌNH ⭐
      </button>
    </div>
  );
}
