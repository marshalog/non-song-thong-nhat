import { useParams, useNavigate } from "react-router-dom";
import { useRoomSubscription } from "@/hooks/useRoomSubscription";
import { useHostActions } from "@/hooks/useHostActions";
import { stages } from "@/data/questions";
import { getMcQuestions, getBonusQuestions } from "@/types/game";
import { useState, useEffect, useRef } from "react";
import { GameMap } from "@/components/game/GameMap";
import { ScoreboardOverlay } from "@/components/game/ScoreboardOverlay";
import { EliminationScreen } from "@/components/game/EliminationScreen";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { HostControlPanel } from "@/components/game/HostControlPanel";
import { VideoTransition } from "@/components/game/VideoTransition";
import { StageResultsView } from "@/components/game/StageResultsView";
import tankIcon from "@/assets/tank-icon.png";
import logoGame from "@/assets/logo_game.png";
import { Button } from "@/components/ui/button";

const HostGamePage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { room, teams, answers, loading } = useRoomSubscription(roomCode);
  const hostActions = useHostActions(room, teams, answers);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [mcTimer, setMcTimer] = useState(100);
  const [bonusTimer, setBonusTimer] = useState(15);
  const mcTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bonusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mcEndedRef = useRef(false);

  // Check admin auth
  useEffect(() => {
    if (room && roomCode) {
      const storedPwd = sessionStorage.getItem(`admin-${roomCode}`);
      if (storedPwd === room.admin_password) setAdminAuth(true);
    }
  }, [room, roomCode]);

  // MC phase timer
  useEffect(() => {
    if (room?.phase !== "playing-mc") {
      if (mcTimerRef.current) clearInterval(mcTimerRef.current);
      mcEndedRef.current = false;
      return;
    }
    const stage = stages[room.current_stage];
    if (!stage) return;
    setMcTimer(stage.mcTimeLimit);
    mcEndedRef.current = false;

    mcTimerRef.current = setInterval(() => {
      setMcTimer(prev => {
        if (prev <= 1) {
          if (mcTimerRef.current) clearInterval(mcTimerRef.current);
          if (!mcEndedRef.current) {
            mcEndedRef.current = true;
            hostActions.endMcPhase();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (mcTimerRef.current) clearInterval(mcTimerRef.current); };
  }, [room?.phase, room?.current_stage]);

  // Check if a team finished all MC questions → end MC for everyone
  useEffect(() => {
    if (room?.phase !== "playing-mc" || mcEndedRef.current) return;
    const stage = stages[room.current_stage];
    const mcCount = getMcQuestions(stage).length;
    const activeTeams = teams.filter(t => !t.eliminated);
    const finishedTeam = activeTeams.find(t => t.finished_at !== null);
    if (finishedTeam) {
      if (mcTimerRef.current) clearInterval(mcTimerRef.current);
      mcEndedRef.current = true;
      hostActions.endMcPhase();
    }
  }, [teams, room?.phase, room?.current_stage]);

  // Bonus phase timer
  useEffect(() => {
    if (room?.phase !== "playing-bonus") {
      if (bonusTimerRef.current) clearInterval(bonusTimerRef.current);
      return;
    }
    const stage = stages[room.current_stage];
    const bonusQs = getBonusQuestions(stage);
    const q = bonusQs[room.current_question_index];
    if (!q) return;
    setBonusTimer(q.timeLimit || 15);

    bonusTimerRef.current = setInterval(() => {
      setBonusTimer(prev => {
        if (prev <= 1) {
          if (bonusTimerRef.current) clearInterval(bonusTimerRef.current);
          hostActions.showBonusAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (bonusTimerRef.current) clearInterval(bonusTimerRef.current); };
  }, [room?.phase, room?.current_question_index]);

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
          <Button
            onClick={() => {
              if (room && adminPwd === room.admin_password) {
                sessionStorage.setItem(`admin-${roomCode}`, adminPwd);
                setAdminAuth(true);
              }
            }}
            className="w-full font-display font-bold btn-neon"
          >
            Xác nhận
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground font-display">
            Quay lại
          </Button>
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
  const activeTeams = teams.filter(t => !t.eliminated);
  const lastEliminated = teams.filter(t => t.eliminated).slice(-1)[0];
  const mcQuestions = getMcQuestions(stage);
  const bonusQuestions = getBonusQuestions(stage);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-army py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoGame} alt="Non Sông Thống Nhất" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-sm text-white font-bold">{stage?.name}</span>
            <span className="bg-gold/20 text-white px-3 py-1 rounded-full text-xs font-display font-bold">
              Phòng: {roomCode}
            </span>
            <Button
              onClick={() => setShowAdmin(!showAdmin)}
              variant="ghost"
              size="sm"
              className="px-3 py-1 font-display font-bold text-xs text-white hover:text-white hover:bg-primary/15 btn-neon"
            >
              {showAdmin ? "Ẩn" : "📊 Điều khiển"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {showAdmin && <HostControlPanel room={room} teams={teams} answers={answers} stages={stages} />}

        {/* Lobby */}
        {room.phase === "lobby" && (
          <div className="space-y-6">
            <GameMap teams={teams} currentStage={room.current_stage} />
            <div className="question-card max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-black text-primary text-center mb-2">
                {room.current_stage === 0 ? "PHÒNG CHỜ" : `CHUẨN BỊ CHẶNG ${room.current_stage + 1}`}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-2">{stage.subtitle}</p>
              <p className="text-xs text-muted-foreground text-center mb-6">
                {mcQuestions.length} câu trắc nghiệm ({stage.mcTimeLimit}s)
                {bonusQuestions.length > 0 && ` + ${bonusQuestions.length} câu bonus`}
                {" • "}{teams.length} đội
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {teams.map(t => (
                  <div key={t.id} className={`tank-cabin text-center ${t.eliminated ? "eliminated" : ""}`} style={{ borderLeftColor: t.color, borderLeftWidth: 4 }}>
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

              <Button
                onClick={hostActions.startStage}
                disabled={activeTeams.length < 2}
                size="lg"
                className="w-full font-display font-bold text-xl btn-neon"
              >
                BẮT ĐẦU {room.current_stage === 0 ? "GAME" : `CHẶNG ${room.current_stage + 1}`}
              </Button>
            </div>
          </div>
        )}

        {/* MC Phase - Host monitors teams */}
        {room.phase === "playing-mc" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="question-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-black text-primary">⏱️ TRẮC NGHIỆM</h2>
                <span className="font-display text-4xl font-black text-primary">{mcTimer}s</span>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-6">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(mcTimer / stage.mcTimeLimit) * 100}%`,
                    backgroundColor: mcTimer > stage.mcTimeLimit * 0.5
                      ? "hsl(var(--army-green))"
                      : mcTimer > stage.mcTimeLimit * 0.2
                        ? "hsl(var(--gold-dark))"
                        : "hsl(var(--primary))",
                  }}
                />
              </div>

              <p className="text-sm text-muted-foreground mb-4 font-display">
                {mcQuestions.length} câu hỏi • Các đội tự trả lời độc lập
              </p>

              {/* Team progress */}
              <div className="space-y-3">
                {activeTeams.map(team => {
                  const teamAnswerCount = answers.filter(
                    a => a.team_id === team.id && a.stage === room.current_stage && a.question_index < mcQuestions.length
                  ).length;
                  const progress = (teamAnswerCount / mcQuestions.length) * 100;
                  const isFinished = team.finished_at !== null;

                  return (
                    <div key={team.id} className="flex items-center gap-3">
                      <span className="text-xl w-8">{team.icon}</span>
                      <span className="font-display font-bold text-sm w-24 truncate" style={{ color: team.color }}>{team.name}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%`, backgroundColor: team.color }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-display font-bold text-foreground">
                          {teamAnswerCount}/{mcQuestions.length}
                        </span>
                      </div>
                      {isFinished && <span className="text-lg">🏁</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => { mcEndedRef.current = true; hostActions.endMcPhase(); }}
              variant="outline"
              className="w-full font-display font-bold"
            >
              ⏹️ Kết thúc sớm
            </Button>
          </div>
        )}

        {/* Bonus Phase - synchronized fill-in / image questions */}
        {room.phase === "playing-bonus" && bonusQuestions[room.current_question_index] && (() => {
          const q = bonusQuestions[room.current_question_index];
          const mcCount = mcQuestions.length;
          const globalIdx = mcCount + room.current_question_index;
          const currentAnswers = answers.filter(a => a.stage === room.current_stage && a.question_index === globalIdx);
          const letterLabels = ["A", "B", "C", "D"];

          return (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="question-card animate-fade-in-up">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm font-bold text-army">
                    {q.type === 'fill-in' ? '✍️ CÂU ĐIỀN ĐÁP ÁN' : '🖼️ CÂU HÌNH ẢNH'}
                  </span>
                  <span className="font-display text-sm text-muted-foreground">
                    Bonus {room.current_question_index + 1}/{bonusQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display text-4xl font-black text-primary">{bonusTimer}s</span>
                  <span className="text-sm text-muted-foreground">
                    {currentAnswers.length}/{activeTeams.length} đội đã trả lời
                  </span>
                </div>

                {q.imageUrl && (
                  <div className="mb-4 flex justify-center">
                    <img src={q.imageUrl} alt="Hình ảnh câu hỏi" className="max-h-60 rounded-lg border-2 border-border" />
                  </div>
                )}

                <h2 className="font-display text-2xl font-bold text-foreground mb-6">{q.question}</h2>

                {room.showing_answer && (
                  <div className="bg-army/10 border-2 border-army rounded-lg p-4 mb-4">
                    <p className="font-display font-bold text-army">Đáp án: {q.correctAnswer}</p>
                  </div>
                )}

                {/* Team answers */}
                {room.showing_answer && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeTeams.map(team => {
                      const ans = currentAnswers.find(a => a.team_id === team.id);
                      const isCorrect = ans?.text_answer?.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
                      return (
                        <div key={team.id} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          !ans ? "border-border text-muted-foreground"
                            : isCorrect ? "bg-army/10 border-army text-army"
                              : "bg-primary/10 border-primary text-primary"
                        }`}>
                          {team.icon} {team.name}: {ans ? `${ans.text_answer} ${isCorrect ? "✅" : "❌"}` : "⏰"}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!room.showing_answer ? (
                  <Button onClick={hostActions.showBonusAnswer} size="lg" className="w-full font-display font-bold text-lg bg-gold text-foreground hover:bg-gold/90 btn-neon">
                    Hiện đáp án
                  </Button>
                ) : (
                  <Button onClick={hostActions.nextBonusQuestion} size="lg" className="w-full font-display font-bold text-lg btn-neon">
                    {room.current_question_index + 1 < bonusQuestions.length ? "Câu tiếp theo" : "Xem kết quả chặng"}
                  </Button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Stage Results */}
        {room.phase === "stage-results" && (
          <StageResultsView
            stage={stage}
            stageIndex={room.current_stage}
            teams={teams}
            answers={answers}
            onContinue={hostActions.showScoreboard}
          />
        )}

        {/* Scoreboard */}
        {room.phase === "scoreboard" && (
          <ScoreboardOverlay teams={teams} stageName={stage.name} onEliminate={hostActions.eliminateLowest} />
        )}

        {/* Elimination */}
        {room.phase === "elimination" && lastEliminated && (
          <EliminationScreen eliminatedTeam={lastEliminated} stageName={stage.name} onContinue={hostActions.showVideoTransition} />
        )}

        {/* Video transition */}
        {room.phase === "video-transition" && (
          <VideoTransition onComplete={hostActions.showMapTransition} duration={7} />
        )}

        {/* Map transition */}
        {room.phase === "map-transition" && (
          <div className="space-y-6">
            <GameMap teams={teams} currentStage={room.current_stage} animateToNext />
            <div className="text-center">
              <p className="font-display text-xl text-foreground font-bold mb-6 animate-fade-in-up">
                🗺️ Các xe tăng đang di chuyển...
              </p>
              <Button onClick={hostActions.nextStage} size="lg" className="font-display font-bold text-lg px-8 btn-neon">
                Tiếp tục chặng tiếp theo
              </Button>
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
