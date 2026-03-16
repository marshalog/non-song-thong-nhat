import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoGame from "@/assets/logo_game.png";
import { Button } from "@/components/ui/button";

const SplashPage = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 victory-sunburst opacity-20" />

      {/* Logo animation */}
      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="mb-6 flex justify-center">
          <img src={logoGame} alt="Non Sông Thống Nhất" className="w-80 md:w-[28rem] object-contain animate-flag-raise" />
        </div>

        <p className="font-display text-lg text-muted-foreground mb-2">
          30/4/1975 — Giải phóng miền Nam, thống nhất đất nước
        </p>

        <div className="flex items-center justify-center gap-3 mb-10 mt-4">
          <span className="text-sm text-muted-foreground font-display">⭐ ⭐ ⭐</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/create")}
            size="lg"
            className="font-display text-xl min-w-[220px] btn-neon"
          >
            TẠO PHÒNG
          </Button>
          <Button
            onClick={() => navigate("/join")}
            size="lg"
            variant="secondary"
            className="font-display text-xl min-w-[220px] btn-neon"
          >
            THAM GIA
          </Button>
        </div>

        <Button
          onClick={() => setShowInstructions(true)}
          variant="ghost"
          className="mt-6 font-display text-sm text-muted-foreground hover:text-foreground"
        >
          Hướng dẫn chơi game
        </Button>
      </div>

      {/* Instructions dialog */}
      {showInstructions && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInstructions(false)}>
          <div className="question-card max-w-2xl w-full animate-fade-in-up max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-black text-primary mb-4">📖 Hướng dẫn chơi game</h2>

            <div className="space-y-4 text-sm text-foreground">
              <div>
                <h3 className="font-display font-bold text-army mb-1">🎮 Cách tạo phòng</h3>
                <p>Host (người tổ chức) bấm "Tạo phòng", đặt mật khẩu admin, rồi chia sẻ mã phòng cho các đội.</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-army mb-1">🚀 Cách tham gia</h3>
                <p>Các đội bấm "Tham gia", nhập mã phòng, chọn tên đội và logo, rồi đợi host bắt đầu.</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-army mb-1">🗺️ Luật chơi</h3>
                <p>Game có 3 chặng, mỗi chặng 10 câu hỏi trắc nghiệm. Đội trả lời đúng và nhanh nhất sẽ được nhiều điểm nhất.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Chặng 1 - Tiến Công:</strong> 4 đội chơi, đội kém nhất bị loại</li>
                  <li><strong>Chặng 2 - Phá Cổng:</strong> 3 đội chơi, đội kém nhất bị loại</li>
                  <li><strong>Chặng 3 - Cắm Cờ:</strong> 2 đội chơi, đội thắng sẽ cắm cờ tại Dinh Thống Nhất</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display font-bold text-army mb-1">⭐ Tính điểm</h3>
                <p>Trả lời đúng: 10 điểm + bonus tốc độ (tối đa 5 điểm). Trả lời sai hoặc hết giờ: 0 điểm.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full font-display font-bold btn-neon"
            >
              Đã hiểu!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashPage;
