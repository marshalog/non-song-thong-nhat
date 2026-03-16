import { useParams, useNavigate } from "react-router-dom";
import { useRoomSubscription } from "@/hooks/useRoomSubscription";
import { useHostActions } from "@/hooks/useHostActions";
import { stages } from "@/data/questions";
import { useState, useEffect, useRef } from "react";
import { GameMap } from "@/components/game/GameMap";
import { HostQuestionView } from "@/components/game/HostQuestionView";
import { ScoreboardOverlay } from "@/components/game/ScoreboardOverlay";
import { EliminationScreen } from "@/components/game/EliminationScreen";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { HostControlPanel } from "@/components/game/HostControlPanel";
import { VideoTransition } from "@/components/game/VideoTransition";
import tankIcon from "@/assets/tank-icon.png";

const HostGamePage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, teams, answers, loading } = useRoomSubscription(roomCode);
  const hostActions = useHostActions(room, teams, answers);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [localTimer, setLocalTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lastQuestionKey, setLastQuestionKey] = useState("");

  // Check admin auth
  useEffect(() => {
    if (room && roomCode) {
      const storedPwd = sessionStorage.getItem(`admin-${roomCode}`);
      if (storedPwd === room.admin_password) {
        setAdminAuth(true);
      }
    }
  }, [room, roomCode]);

  // Timer
  useEffect(() => {
    if (!room) return;
    const key = `${room.current_stage}-${room.current_question_index}`;
    if (room.phase === "playing" && key !== lastQuestionKey) {
      setLastQuestionKey(key);
      const stage = stages[room.current_stage];
      const q = stage?.questions[room.current_question_index];
      if (q) setLocalTimer(q.timeLimit);
    }
  }, [room?.phase, room?.current_stage, room?.current_question_index, lastQuestionKey]);

  useEffect(() => {
    if (room?.phase === "playing" && !room.showing_answer) {
      timerRef.current = setInterval(() => {
        setLocalTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            hostActions.showAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [room?.phase, room?.showing_answer, lastQuestionKey]);

  // Admin auth gate
  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="question-card max-w-md w-full animate-fade-in-up">
          <h2 className="font-display text-2xl font-black text-primary text-center mb-4">🔒 Xác thực Admin</h2>
          <input
            type="password"
            value={adminPwd}
            onChange={e => setAdminPwd(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background font-body text-foreground outline-none focus:border-primary mb-4"
            placeholder="Nhập mật khẩu admin..."
            onKeyDown={e => {
              if (e.key === "Enter" && room && adminPwd === room.admin_password) {
                sessionStorage.setItem(`admin-${roomCode}`, adminPwd);
                setAdminAuth(true);
              }
            }}
          />
          <button
            onClick={() => {
              if (room && adminPwd === room.admin_password) {
                sessionStorage.setItem(`admin-${roomCode}`, adminPwd);
                setAdminAuth(true);
              }
            }}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors"
          >
            Xác nhận
          </button>
          <button onClick={() => navigate("/")} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground underline font-display">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (loading || !room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <img src={tankIcon} alt="loading" className="w-16 h-16 animate-tank-move" />
      </div>
    );
  }

  const stage = stages[room.current_stage];
  const question = stage?.questions[room.current_question_index];
  const activeTeams = teams.filter(t => !t.eliminated);
  const lastEliminated = teams.filter(t => t.eliminated).slice(-1)[0];

  // Current question answers
  const currentAnswers = answers.filter(
    a => a.stage === room.current_stage && a.question_index === room.current_question_index
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-army py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-primary-foreground">⭐ HÀNH TRÌNH THỐNG NHẤT</h1>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-gold font-bold">{stage?.name}</span>
            <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-display font-bold">
              Phòng: {roomCode}
            </span>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="px-3 py-1 rounded-lg bg-primary/20 text-primary-foreground text-xs font-display font-bold hover:bg-primary/30 transition-colors"
            >
              {showAdmin ? "Ẩn bảng điều khiển" : "📊 Bảng điều khiển"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Admin panel toggle */}
        {showAdmin && (
          <HostControlPanel
            room={room}
            teams={teams}
            answers={answers}
            stages={stages}
          />
        )}

        {/* Lobby */}
        {room.phase === "lobby" && (
          <div className="space-y-6">
            <GameMap teams={teams} currentStage={room.current_stage} />

            <div className="question-card max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-black text-primary text-center mb-2">
                {room.current_stage === 0 ? "PHÒNG CHỜ" : `CHUẨN BỊ CHẶNG ${room.current_stage + 1}`}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {teams.length}/4 đội đã tham gia
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {teams.map(t => (
                  <div
                    key={t.id}
                    className={`tank-cabin text-center ${t.eliminated ? "eliminated" : ""}`}
                    style={{ borderLeftColor: t.color, borderLeftWidth: 4 }}
                  >
                    <div className="text-3xl mb-1">{t.icon}</div>
                    <p className="font-display font-bold text-primary-foreground text-sm truncate">{t.name}</p>
                    {t.eliminated && <p className="text-[10px] text-primary-foreground/50">❌ Đã loại</p>}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - teams.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="border-2 border-dashed border-border rounded-lg p-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm font-display">Đang chờ...</span>
                  </div>
                ))}
              </div>

              <button
                onClick={hostActions.startStage}
                disabled={activeTeams.length < 2}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                ⭐ BẮT ĐẦU {room.current_stage === 0 ? "GAME" : `CHẶNG ${room.current_stage + 1}`}
              </button>
            </div>
          </div>
        )}

        {/* Playing / Showing answer */}
        {(room.phase === "playing" || room.phase === "showing-answer") && question && (
          <HostQuestionView
            question={question}
            questionIndex={room.current_question_index}
            totalQuestions={stage.questions.length}
            stageName={stage.name}
            timeRemaining={localTimer}
            isShowingAnswer={room.phase === "showing-answer"}
            teams={activeTeams}
            currentAnswers={currentAnswers}
            onShowAnswer={hostActions.showAnswer}
            onNext={hostActions.nextQuestion}
          />
        )}

        {/* Scoreboard */}
        {room.phase === "scoreboard" && (
          <ScoreboardOverlay
            teams={teams}
            stageName={stage.name}
            onEliminate={hostActions.eliminateLowest}
          />
        )}

        {/* Elimination */}
        {room.phase === "elimination" && lastEliminated && (
          <EliminationScreen
            eliminatedTeam={lastEliminated}
            stageName={stage.name}
            onContinue={hostActions.showMapTransition}
          />
        )}

        {/* Map transition */}
        {room.phase === "map-transition" && (
          <div className="space-y-6">
            <GameMap teams={teams} currentStage={room.current_stage} />
            <div className="text-center">
              <p className="font-display text-xl text-gold font-bold mb-6 animate-fade-in-up">
                🗺️ Các xe tăng đang di chuyển...
              </p>
              <button
                onClick={hostActions.nextStage}
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg hover:bg-primary/90 transition-all"
              >
                Tiếp tục chặng tiếp theo →
              </button>
            </div>
          </div>
        )}

        {/* Victory */}
        {room.phase === "victory" && activeTeams[0] && (
          <VictoryScreen winner={activeTeams[0]} onRestart={() => navigate("/")} />
        )}
      </div>
    </div>
  );
};

export default HostGamePage;
