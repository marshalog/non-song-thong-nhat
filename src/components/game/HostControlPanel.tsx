import { RoomData, TeamData, TeamAnswer, StageData } from "@/types/game";

interface HostControlPanelProps {
  room: RoomData;
  teams: TeamData[];
  answers: TeamAnswer[];
  stages: StageData[];
}

const TOTAL_QUESTIONS = 10;

function getAnsweredCount(teamId: string, stage: number, answers: TeamAnswer[]): number {
  return answers.filter(a => a.team_id === teamId && a.stage === stage).length;
}

export function HostControlPanel({ room, teams, answers, stages }: HostControlPanelProps) {
  const stage = stages[room.current_stage];
  const totalInStage = stage?.questions.length ?? TOTAL_QUESTIONS;

  return (
    <div className="mb-6 animate-fade-in-up">
      <div className="host-control-panel">
        {/* Header - military style */}
        <div className="panel-header">
          <div className="panel-header-accent" />
          <h3 className="font-display text-lg font-bold tracking-wider uppercase">
            Tình hình chiến dịch
          </h3>
          <p className="font-display text-xs opacity-80 mt-0.5">
            Bảng theo dõi trạng thái — không hiển thị đáp án
          </p>
        </div>

        {/* Room info - tactical grid */}
        <div className="panel-info-grid">
          <div className="panel-info-item">
            <span className="panel-info-label">Mã phòng</span>
            <span className="panel-info-value font-mono tracking-widest">{room.room_code}</span>
          </div>
          <div className="panel-info-item">
            <span className="panel-info-label">Giai đoạn</span>
            <span className="panel-info-value text-xs uppercase">{room.phase}</span>
          </div>
          <div className="panel-info-item">
            <span className="panel-info-label">Chặng</span>
            <span className="panel-info-value">{room.current_stage + 1} / 3</span>
          </div>
          <div className="panel-info-item">
            <span className="panel-info-label">Thời gian còn</span>
            <span className="panel-info-value">{room.time_remaining}s</span>
          </div>
        </div>

        {/* Teams status - only progress bars, no answers */}
        <div className="mt-4">
          <h4 className="font-display text-sm font-bold text-primary-foreground/90 mb-3 tracking-wide uppercase flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-sm" />
            Trạng thái các đơn vị
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {teams.map(team => {
              const answeredCount = getAnsweredCount(team.id, room.current_stage, answers);
              const percent = totalInStage > 0 ? Math.min(100, (answeredCount / totalInStage) * 100) : 0;
              const isEliminated = team.eliminated;

              return (
                <div
                  key={team.id}
                  className={`panel-team-card ${isEliminated ? "panel-team-card--eliminated" : ""}`}
                  style={{ borderLeftColor: team.color, borderLeftWidth: 4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="panel-team-icon"
                        style={{ backgroundColor: `${team.color}20`, color: team.color }}
                      >
                        {team.icon}
                      </span>
                      <span className="font-display font-bold text-primary-foreground text-sm truncate">
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-display font-black text-primary-foreground text-lg tabular-nums">
                        {team.score}
                      </span>
                      <span className="text-[10px] text-primary-foreground/60 font-display">điểm</span>
                      {isEliminated && (
                        <span className="panel-badge-eliminated">Đã loại</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: team.color,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-primary-foreground/70 font-display mt-1.5">
                    Đã trả lời: {answeredCount} / {totalInStage} câu
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
