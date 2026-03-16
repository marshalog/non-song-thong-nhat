import { useParams, useNavigate } from "react-router-dom";
import { useRoomSubscription } from "@/hooks/useRoomSubscription";
import { stages } from "@/data/questions";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { VideoTransition } from "@/components/game/VideoTransition";
import tankIcon from "@/assets/tank-icon.png";

const TeamGamePage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, teams, answers, loading } = useRoomSubscription(roomCode);
  const teamId = sessionStorage.getItem(`team-${roomCode}`);
  const [localTimer, setLocalTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lastQuestionKey, setLastQuestionKey] = useState("");

  const myTeam = teams.find(t => t.id === teamId);

  // Local timer
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <img src={tankIcon} alt="loading" className="w-16 h-16 mx-auto animate-tank-move mb-4" />
          <p className="font-display text-lg text-muted-foreground">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-display text-xl text-primary mb-4">Không tìm thấy phòng</p>
          <button onClick={() => navigate("/")} className="text-muted-foreground underline">Quay lại</button>
        </div>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-display text-xl text-primary mb-4">Bạn chưa tham gia phòng này</p>
          <button onClick={() => navigate("/join")} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold">Tham gia</button>
        </div>
      </div>
    );
  }

  const stage = stages[room.current_stage];
  const question = stage?.questions[room.current_question_index];

  const myAnswer = answers.find(
    a => a.team_id === teamId && a.stage === room.current_stage && a.question_index === room.current_question_index
  );

  const handleAnswer = async (answerIndex: number) => {
    if (!room || !teamId || myAnswer) return;
    const q = stage?.questions[room.current_question_index];
    if (!q) return;
    const elapsed = q.timeLimit - localTimer;

    const { error } = await supabase.from("team_answers").insert({
      room_id: room.id,
      team_id: teamId,
      stage: room.current_stage,
      question_index: room.current_question_index,
      answer_index: answerIndex,
      time_elapsed: elapsed,
    });

    if (error) {
      toast({ title: "Lỗi gửi đáp án", variant: "destructive" });
    }
  };

  // Lobby
  if (room.phase === "lobby") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">{myTeam.icon}</div>
          <h1 className="font-display text-3xl font-black mb-2" style={{ color: myTeam.color }}>{myTeam.name}</h1>
          <p className="text-muted-foreground font-display mb-6">Phòng: <span className="font-bold text-gold">{roomCode}</span></p>

          <div className="tank-cabin max-w-sm mx-auto mb-6" style={{ borderLeftColor: myTeam.color, borderLeftWidth: 4 }}>
            <p className="text-primary-foreground text-sm font-display">
              {room.current_stage === 0
                ? "⏳ Đang chờ host bắt đầu game..."
                : `⏳ Đang chờ host bắt đầu chặng ${room.current_stage + 1}...`}
            </p>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {teams.map(t => (
              <div key={t.id} className="px-3 py-1.5 rounded-full text-xs font-display font-bold text-primary-foreground" style={{ backgroundColor: t.color }}>
                {t.icon} {t.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Eliminated
  if (myTeam.eliminated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          <div className="text-8xl mb-6">💥</div>
          <h1 className="font-display text-4xl font-black text-primary mb-4">BỊ LOẠI</h1>
          <p className="text-muted-foreground font-display mb-6">Xe tăng đã dừng lại... Cuộc hành trình kết thúc tại đây.</p>
          <div className="text-6xl mb-4">{myTeam.icon}</div>
          <h2 className="font-display text-2xl font-bold" style={{ color: myTeam.color }}>{myTeam.name}</h2>
          <p className="text-muted-foreground mt-2">Điểm: {myTeam.score}</p>
        </div>
      </div>
    );
  }

  // Playing - show question
  if ((room.phase === "playing" || room.phase === "showing-answer") && question) {
    const isShowingAnswer = room.phase === "showing-answer";
    const timerPercent = (localTimer / question.timeLimit) * 100;
    const letterLabels = ["A", "B", "C", "D"];

    return (
      <div className="min-h-screen bg-background flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{myTeam.icon}</span>
            <span className="font-display font-bold text-sm" style={{ color: myTeam.color }}>{myTeam.name}</span>
          </div>
          <span className="font-display text-sm text-gold font-bold">{stage?.name}</span>
        </div>

        {/* Timer */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerPercent > 50 ? "hsl(var(--army-green))" : timerPercent > 20 ? "hsl(var(--gold-dark))" : "hsl(var(--primary))",
            }}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-3xl font-black text-primary">{localTimer}s</span>
          <span className="text-sm text-muted-foreground font-display">
            Câu {room.current_question_index + 1}/{stage.questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-card flex-1">
          <h2 className="font-display text-lg font-bold text-foreground mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, idx) => {
              const isCorrect = idx === question.correctAnswer;
              const isMyAnswer = myAnswer?.answer_index === idx;
              return (
                <button
                  key={idx}
                  disabled={!!myAnswer || isShowingAnswer}
                  onClick={() => handleAnswer(idx)}
                  className={`text-left p-4 rounded-lg border-2 font-body font-medium transition-all duration-200 ${
                    isShowingAnswer
                      ? isCorrect
                        ? "border-army bg-army/10 text-army"
                        : isMyAnswer
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted text-muted-foreground"
                      : isMyAnswer
                        ? "border-primary bg-primary/10"
                        : !!myAnswer
                          ? "border-muted text-muted-foreground cursor-not-allowed"
                          : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer active:scale-95"
                  }`}
                >
                  <span className="font-display font-bold text-primary mr-2">{letterLabels[idx]}.</span>
                  {option}
                  {isShowingAnswer && isCorrect && <span className="float-right text-xl">✅</span>}
                  {isShowingAnswer && isMyAnswer && !isCorrect && <span className="float-right text-xl">❌</span>}
                </button>
              );
            })}
          </div>

          {myAnswer && !isShowingAnswer && (
            <div className="mt-4 text-center">
              <p className="font-display text-sm text-gold font-bold animate-fade-in-up">✅ Đã gửi đáp án! Đang chờ các đội khác...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Video transition - show to players too
  if (room.phase === "video-transition") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <VideoTransition onComplete={() => {}} duration={7} />
      </div>
    );
  }

  // Scoreboard / elimination / map / victory - show waiting state
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center animate-fade-in-up">
        <div className="text-6xl mb-4">{myTeam.icon}</div>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: myTeam.color }}>{myTeam.name}</h2>

        {room.phase === "victory" ? (
          <div>
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="font-display text-4xl font-black text-gold mb-2">CHIẾN THẮNG!</h1>
            <p className="text-muted-foreground font-display">Giải phóng miền Nam, thống nhất đất nước!</p>
          </div>
        ) : (
          <div className="tank-cabin max-w-sm">
            <p className="text-primary-foreground text-sm font-display">
              {room.phase === "scoreboard" && "📊 Đang xem bảng điểm..."}
              {room.phase === "elimination" && "💥 Đang công bố kết quả..."}
              {room.phase === "map-transition" && "🗺️ Đang di chuyển trên bản đồ..."}
              {room.phase === "stage-result" && "📊 Đang xem kết quả chặng..."}
            </p>
            <p className="text-gold font-display font-bold mt-2">Điểm: {myTeam.score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamGamePage;
