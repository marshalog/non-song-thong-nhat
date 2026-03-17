import { useParams, useNavigate } from "react-router-dom";
import { useRoomSubscription } from "@/hooks/useRoomSubscription";
import { stages } from "@/data/questions";
import { getMcQuestions, getBonusQuestions } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { VideoTransition } from "@/components/game/VideoTransition";
import c1Video from "@/assets/C1.mp4";
import c2Video from "@/assets/C2.mp4";
import c3Video from "@/assets/C3.mp4";
import tankIcon from "@/assets/tank-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TeamGamePage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, teams, answers, loading } = useRoomSubscription(roomCode);
  const teamId = sessionStorage.getItem(`team-${roomCode}`);

  const [mcTimer, setMcTimer] = useState(100);
  const [bonusTimer, setBonusTimer] = useState(15);
  const [localQIndex, setLocalQIndex] = useState(0);
  const [fillAnswer, setFillAnswer] = useState("");
  const [mcStopped, setMcStopped] = useState(false);
  const mcTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bonusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const myTeam = teams.find(t => t.id === teamId);

  // Reset local state when MC phase starts
  useEffect(() => {
    if (room?.phase === "playing-mc") {
      const stage = stages[room.current_stage];
      setMcTimer(stage.mcTimeLimit);
      setLocalQIndex(0);
      setMcStopped(false);
    }
  }, [room?.phase, room?.current_stage]);

  // MC timer (local countdown)
  useEffect(() => {
    if (room?.phase !== "playing-mc") {
      if (mcTimerRef.current) clearInterval(mcTimerRef.current);
      return;
    }
    mcTimerRef.current = setInterval(() => {
      setMcTimer(prev => {
        if (prev <= 1) {
          if (mcTimerRef.current) clearInterval(mcTimerRef.current);
          setMcStopped(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (mcTimerRef.current) clearInterval(mcTimerRef.current); };
  }, [room?.phase, room?.current_stage]);

  // Detect when room exits playing-mc (first team finished → host ends MC)
  useEffect(() => {
    if (room?.phase !== "playing-mc") {
      setMcStopped(true);
      if (mcTimerRef.current) clearInterval(mcTimerRef.current);
    }
  }, [room?.phase]);

  // Bonus timer
  useEffect(() => {
    if (room?.phase !== "playing-bonus") {
      if (bonusTimerRef.current) clearInterval(bonusTimerRef.current);
      return;
    }
    const stage = stages[room.current_stage];
    const bonusQs = getBonusQuestions(stage);
    const q = bonusQs[room.current_question_index];
    if (q) setBonusTimer(q.timeLimit || 15);
    setFillAnswer("");

    bonusTimerRef.current = setInterval(() => {
      setBonusTimer(prev => {
        if (prev <= 1) {
          if (bonusTimerRef.current) clearInterval(bonusTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (bonusTimerRef.current) clearInterval(bonusTimerRef.current); };
  }, [room?.phase, room?.current_question_index]);

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
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">Quay lại</Button>
        </div>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-display text-xl text-primary mb-4">Bạn chưa tham gia phòng này</p>
          <Button onClick={() => navigate("/join")} size="lg" className="font-display font-bold px-6 btn-neon">Tham gia</Button>
        </div>
      </div>
    );
  }

  const stage = stages[room.current_stage];
  const mcQuestions = getMcQuestions(stage);
  const bonusQuestions = getBonusQuestions(stage);
  const stageEndVideo = [c1Video, c2Video, c3Video][room.current_stage] ?? c1Video;

  // Handle MC answer
  const handleMcAnswer = async (answerIndex: number) => {
    if (!room || !teamId || mcStopped) return;
    const elapsed = stage.mcTimeLimit - mcTimer;

    const { error } = await supabase.from("team_answers").insert({
      room_id: room.id,
      team_id: teamId,
      stage: room.current_stage,
      question_index: localQIndex,
      answer_index: answerIndex,
      time_elapsed: elapsed,
    });

    if (error) {
      toast({ title: "Lỗi gửi đáp án", variant: "destructive" });
      return;
    }

    const nextIdx = localQIndex + 1;
    if (nextIdx >= mcQuestions.length) {
      // Finished all MC questions - mark team as finished
      await supabase.from("teams").update({
        finished_at: new Date().toISOString(),
        current_question_index: nextIdx,
      } as any).eq("id", teamId);
      setMcStopped(true);
    } else {
      setLocalQIndex(nextIdx);
      await supabase.from("teams").update({
        current_question_index: nextIdx,
      } as any).eq("id", teamId);
    }
  };

  // Handle fill-in answer
  const handleFillAnswer = async () => {
    if (!room || !teamId || !fillAnswer.trim()) return;
    const mcCount = mcQuestions.length;
    const globalIdx = mcCount + room.current_question_index;
    const q = bonusQuestions[room.current_question_index];
    const elapsed = (q.timeLimit || 15) - bonusTimer;

    // Check if already answered
    const existing = answers.find(a => a.team_id === teamId && a.stage === room.current_stage && a.question_index === globalIdx);
    if (existing) return;

    const { error } = await supabase.from("team_answers").insert({
      room_id: room.id,
      team_id: teamId,
      stage: room.current_stage,
      question_index: globalIdx,
      answer_index: -1,
      text_answer: fillAnswer.trim(),
      time_elapsed: elapsed,
    });

    if (error) toast({ title: "Lỗi gửi đáp án", variant: "destructive" });
    setFillAnswer("");
  };

  // Lobby
  if (room.phase === "lobby") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">{myTeam.icon}</div>
          <h1 className="font-display text-3xl font-black mb-2" style={{ color: myTeam.color }}>{myTeam.name}</h1>
          <p className="text-muted-foreground font-display mb-6">Phòng: <span className="font-bold text-foreground">{roomCode}</span></p>
          <div className="tank-cabin max-w-sm mx-auto mb-6" style={{ borderLeftColor: myTeam.color, borderLeftWidth: 4 }}>
            <p className="text-primary-foreground text-sm font-display">
              {room.current_stage === 0 ? "⏳ Đang chờ host bắt đầu game..." : `⏳ Đang chờ bắt đầu chặng ${room.current_stage + 1}...`}
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
          <p className="text-muted-foreground font-display mb-6">Xe tăng đã dừng lại...</p>
          <div className="text-6xl mb-4">{myTeam.icon}</div>
          <h2 className="font-display text-2xl font-bold" style={{ color: myTeam.color }}>{myTeam.name}</h2>
        </div>
      </div>
    );
  }

  // MC Phase - independent play
  if (room.phase === "playing-mc") {
    const question = mcQuestions[localQIndex];
    const alreadyAnswered = !question || mcStopped;
    const timerPercent = (mcTimer / stage.mcTimeLimit) * 100;
    const letterLabels = ["A", "B", "C", "D"];

    if (alreadyAnswered) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="text-center animate-fade-in-up">
            <div className="text-6xl mb-4">🏁</div>
            <h2 className="font-display text-2xl font-black text-foreground mb-2">
              {mcStopped && localQIndex >= mcQuestions.length ? "HOÀN THÀNH!" : "HẾT GIỜ!"}
            </h2>
            <p className="text-muted-foreground font-display mb-4">
              Đã trả lời {localQIndex}/{mcQuestions.length} câu
            </p>
            <p className="text-sm text-muted-foreground font-display">Đang chờ kết quả...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex flex-col p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{myTeam.icon}</span>
            <span className="font-display font-bold text-sm" style={{ color: myTeam.color }}>{myTeam.name}</span>
          </div>
          <span className="font-display text-sm text-foreground font-bold">{stage.name}</span>
        </div>

        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timerPercent > 50 ? "hsl(var(--army-green))" : timerPercent > 20 ? "hsl(var(--gold-dark))" : "hsl(var(--primary))",
            }}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-3xl font-black text-primary">{mcTimer}s</span>
          <span className="text-sm text-muted-foreground font-display">
            Câu {localQIndex + 1}/{mcQuestions.length}
          </span>
        </div>

        <div className="question-card flex-1">
          <h2 className="font-display text-lg font-bold text-foreground mb-6 leading-relaxed">
            {question.question}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {question.options!.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => handleMcAnswer(idx)}
                className="justify-start text-left p-4 rounded-lg border-2 font-body font-medium border-border hover:border-primary hover:bg-primary/5 cursor-pointer active:scale-95 btn-neon"
              >
                <span className="font-display font-bold text-primary mr-2">{letterLabels[idx]}.</span>
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bonus Phase - fill-in / image questions (synchronized)
  if (room.phase === "playing-bonus") {
    const q = bonusQuestions[room.current_question_index];
    if (!q) return null;
    const mcCount = mcQuestions.length;
    const globalIdx = mcCount + room.current_question_index;
    const myAnswer = answers.find(a => a.team_id === teamId && a.stage === room.current_stage && a.question_index === globalIdx);
    const isShowingAnswer = room.showing_answer;

    return (
      <div className="min-h-screen bg-background flex flex-col p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{myTeam.icon}</span>
            <span className="font-display font-bold text-sm" style={{ color: myTeam.color }}>{myTeam.name}</span>
          </div>
          <span className="font-display text-sm font-bold text-foreground">
            {q.type === 'fill-in' ? '✍️ Điền đáp án' : '🖼️ Câu hình ảnh'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-3xl font-black text-primary">{bonusTimer}s</span>
          <span className="text-sm text-muted-foreground font-display">
            Bonus {room.current_question_index + 1}/{bonusQuestions.length}
          </span>
        </div>

        <div className="question-card flex-1">
          {q.imageUrl && (
            <div className="mb-4 flex justify-center">
              <img src={q.imageUrl} alt="Hình ảnh" className="max-h-48 rounded-lg border-2 border-border" />
            </div>
          )}

          <h2 className="font-display text-lg font-bold text-foreground mb-6 leading-relaxed">{q.question}</h2>

          {isShowingAnswer ? (
            <div className="space-y-3">
              <div className="bg-army/10 border-2 border-army rounded-lg p-4">
                <p className="font-display font-bold text-army">Đáp án: {q.correctAnswer}</p>
              </div>
              {myAnswer && (
                <p className="text-sm text-muted-foreground font-display">
                  Bạn trả lời: <span className="font-bold text-foreground">{myAnswer.text_answer}</span>
                  {myAnswer.text_answer?.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase() ? " ✅" : " ❌"}
                </p>
              )}
            </div>
          ) : myAnswer ? (
            <div className="text-center">
              <p className="font-display text-sm text-foreground font-bold animate-fade-in-up">✅ Đã gửi: {myAnswer.text_answer}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={fillAnswer}
                onChange={e => setFillAnswer(e.target.value)}
                placeholder="Nhập đáp án..."
                className="font-body"
                disabled={bonusTimer <= 0}
                onKeyDown={e => { if (e.key === "Enter") handleFillAnswer(); }}
              />
              <Button onClick={handleFillAnswer} disabled={!fillAnswer.trim() || bonusTimer <= 0} className="font-display font-bold btn-neon">
                Gửi
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Video transition
  if (room.phase === "video-transition") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <VideoTransition src={stageEndVideo} onComplete={() => {}} />
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
            <h1 className="font-display text-4xl font-black text-foreground mb-2">CHIẾN THẮNG!</h1>
            <p className="text-muted-foreground font-display">Non sông thống nhất!</p>
          </div>
        ) : (
          <div className="tank-cabin max-w-sm">
            <p className="text-primary-foreground text-sm font-display">
              {room.phase === "stage-results" && "📋 Đang xem kết quả chặng..."}
              {room.phase === "scoreboard" && "📊 Đang xem bảng điểm..."}
              {room.phase === "elimination" && "💥 Đang công bố kết quả..."}
              {room.phase === "map-transition" && "🗺️ Đang di chuyển trên bản đồ..."}
            </p>
            <p className="text-foreground font-display font-bold mt-2">Điểm: {myTeam.score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamGamePage;
