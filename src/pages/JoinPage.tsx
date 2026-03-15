import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TEAM_ICONS, TEAM_COLORS } from "@/types/game";
import { toast } from "@/hooks/use-toast";

const JoinPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"code" | "setup">("code");
  const [roomCode, setRoomCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(TEAM_ICONS[0].icon);
  const [selectedColor, setSelectedColor] = useState(TEAM_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleCheckRoom = async () => {
    if (!roomCode.trim()) {
      toast({ title: "Vui lòng nhập mã phòng", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("game_rooms")
      .select("id, phase")
      .eq("room_code", roomCode.toUpperCase().trim())
      .single();

    if (error || !data) {
      toast({ title: "Không tìm thấy phòng", description: "Kiểm tra lại mã phòng", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check team count
    const { count } = await supabase
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("room_id", data.id);

    if ((count ?? 0) >= 4) {
      toast({ title: "Phòng đã đủ 4 đội", variant: "destructive" });
      setLoading(false);
      return;
    }

    setRoomId(data.id);
    setStep("setup");
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!teamName.trim()) {
      toast({ title: "Vui lòng nhập tên đội", variant: "destructive" });
      return;
    }
    setLoading(true);

    // Get current team count for order_index
    const { count } = await supabase
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId);

    const { data, error } = await supabase.from("teams").insert({
      room_id: roomId,
      name: teamName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      order_index: count ?? 0,
    }).select().single();

    if (error) {
      toast({ title: "Lỗi tham gia", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Store team ID in session
    sessionStorage.setItem(`team-${roomCode.toUpperCase().trim()}`, data.id);
    navigate(`/play/${roomCode.toUpperCase().trim()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="question-card max-w-md w-full animate-fade-in-up">
        {step === "code" ? (
          <>
            <h1 className="font-display text-3xl font-black text-primary text-center mb-2">THAM GIA</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Nhập mã phòng để tham gia game</p>

            <div className="space-y-4">
              <input
                type="text"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 rounded-lg border-2 border-border bg-background font-display font-bold text-2xl text-center text-foreground outline-none focus:border-primary transition-colors tracking-[0.3em]"
                placeholder="MÃ PHÒNG"
                maxLength={6}
              />

              <button
                onClick={handleCheckRoom}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-army text-primary-foreground font-display font-bold text-lg hover:bg-army-light transition-all disabled:opacity-50"
              >
                {loading ? "Đang kiểm tra..." : "🚀 TIẾP TỤC"}
              </button>

              <button onClick={() => navigate("/")} className="w-full text-sm text-muted-foreground hover:text-foreground underline font-display">
                ← Quay lại
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-black text-primary text-center mb-1">THIẾT LẬP ĐỘI</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Phòng: <span className="font-bold text-gold">{roomCode}</span></p>

            <div className="space-y-5">
              {/* Team name */}
              <div>
                <label className="font-display text-sm font-bold text-foreground block mb-1">Tên đội</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-display font-bold text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="Nhập tên đội..."
                  maxLength={20}
                />
              </div>

              {/* Icon selection */}
              <div>
                <label className="font-display text-sm font-bold text-foreground block mb-2">Logo đội</label>
                <div className="grid grid-cols-6 gap-2">
                  {TEAM_ICONS.map(item => (
                    <button
                      key={item.icon}
                      onClick={() => setSelectedIcon(item.icon)}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 transition-all ${
                        selectedIcon === item.icon
                          ? "border-primary bg-primary/10 scale-110"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div>
                <label className="font-display text-sm font-bold text-foreground block mb-2">Màu đội</label>
                <div className="flex gap-2 flex-wrap">
                  {TEAM_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-3 transition-all ${
                        selectedColor === color ? "scale-125 border-foreground" : "border-transparent hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="tank-cabin flex items-center gap-3" style={{ borderLeftColor: selectedColor, borderLeftWidth: 4 }}>
                <span className="text-3xl">{selectedIcon}</span>
                <span className="font-display font-bold text-primary-foreground text-lg">
                  {teamName || "Tên đội"}
                </span>
              </div>

              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? "Đang tham gia..." : "⭐ THAM GIA"}
              </button>

              <button onClick={() => setStep("code")} className="w-full text-sm text-muted-foreground hover:text-foreground underline font-display">
                ← Quay lại
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinPage;
