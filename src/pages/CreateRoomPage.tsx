import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!password.trim()) {
      toast({ title: "Vui lòng nhập mật khẩu admin", variant: "destructive" });
      return;
    }
    setLoading(true);
    const roomCode = generateRoomCode();

    const { error } = await supabase.from("game_rooms").insert({
      room_code: roomCode,
      admin_password: password,
    });

    if (error) {
      toast({ title: "Lỗi tạo phòng", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Store admin auth in sessionStorage
    sessionStorage.setItem(`admin-${roomCode}`, password);
    navigate(`/host/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="question-card max-w-md w-full animate-fade-in-up">
        <h1 className="font-display text-3xl font-black text-primary text-center mb-2">TẠO PHÒNG</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Đặt mật khẩu admin để quản lý phòng chơi
        </p>

        <div className="space-y-4">
          <div>
            <label className="font-display text-sm font-bold text-foreground block mb-1">
              Mật khẩu Admin
            </label>
            <input
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-body text-foreground outline-none focus:border-primary transition-colors"
              placeholder="Nhập mật khẩu..."
            />
            <p className="text-xs text-muted-foreground mt-1">Dùng để truy cập bảng điều khiển host</p>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading}
            size="lg"
            className="w-full font-display font-bold text-lg btn-neon"
          >
            {loading ? "Đang tạo..." : "TẠO PHÒNG"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full text-sm text-muted-foreground hover:text-foreground font-display"
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
