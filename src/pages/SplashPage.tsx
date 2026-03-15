import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tankIcon from "@/assets/tank-icon.png";
import victoryFlag from "@/assets/victory-flag.png";

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
          <img src={victoryFlag} alt="Cờ" className="w-28 h-28 object-contain animate-flag-raise" />
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-black text-primary mb-3" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.2)" }}>
          HÀNH TRÌNH
        </h1>
        <h1 className="font-display text-4xl md:text-6xl font-black text-gold mb-4" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.2)" }}>
          THỐNG NHẤT
        </h1>
        <p className="font-display text-lg text-muted-foreground mb-2">
          30/4/1975 — Giải phóng miền Nam, thống nhất đất nước
        </p>

        <div className="flex items-center justify-center gap-3 mb-10 mt-4">
          <img src={tankIcon} alt="tank" className="w-10 h-10 object-contain animate-tank-move" />
          <span className="text-sm text-muted-foreground font-display">⭐ ⭐ ⭐</span>
          <img src={tankIcon} alt="tank" className="w-10 h-10 object-contain animate-tank-move" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/create")}
            className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-lg min-w-[220px]"
          >
            🎮 TẠO PHÒNG
          </button>
          <button
            onClick={() => navigate("/join")}
            className="px-10 py-4 rounded-xl bg-army text-primary-foreground font-display font-bold text-xl hover:bg-army-light transition-all hover:scale-105 shadow-lg min-w-[220px]"
          >
            🚀 THAM GIA
          </button>
        </div>

        <button
          onClick={() => setShowInstructions(true)}
          className="mt-6 text-muted-foreground hover:text-foreground underline font-display text-sm transition-colors"
        >
          📖 Hướng dẫn chơi game
        </button>
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

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors"
            >
              Đã hiểu!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashPage;
