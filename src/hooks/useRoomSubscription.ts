import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomData, TeamData, TeamAnswer } from "@/types/game";

export function useRoomSubscription(roomCode: string | undefined) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [answers, setAnswers] = useState<TeamAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoom = useCallback(async () => {
    if (!roomCode) return;
    const { data } = await supabase
      .from("game_rooms")
      .select("*")
      .eq("room_code", roomCode)
      .single();
    if (data) setRoom(data as RoomData);
  }, [roomCode]);

  const fetchTeams = useCallback(async () => {
    if (!room) return;
    const { data } = await supabase
      .from("teams")
      .select("*")
      .eq("room_id", room.id)
      .order("order_index");
    if (data) setTeams(data as TeamData[]);
  }, [room?.id]);

  const fetchAnswers = useCallback(async () => {
    if (!room) return;
    const { data } = await supabase
      .from("team_answers")
      .select("*")
      .eq("room_id", room.id);
    if (data) setAnswers(data as TeamAnswer[]);
  }, [room?.id]);

  // Initial fetch
  useEffect(() => {
    if (!roomCode) return;
    setLoading(true);
    fetchRoom().then(() => setLoading(false));
  }, [roomCode, fetchRoom]);

  useEffect(() => {
    if (room) {
      fetchTeams();
      fetchAnswers();
    }
  }, [room?.id, fetchTeams, fetchAnswers]);

  // Real-time subscriptions
  useEffect(() => {
    if (!room?.id) return;

    const channel = supabase
      .channel(`room-${room.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${room.id}` }, (payload) => {
        if (payload.new) setRoom(payload.new as RoomData);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "teams", filter: `room_id=eq.${room.id}` }, () => {
        fetchTeams();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "team_answers", filter: `room_id=eq.${room.id}` }, () => {
        fetchAnswers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.id, fetchTeams, fetchAnswers]);

  return { room, teams, answers, loading, refetchRoom: fetchRoom, refetchTeams: fetchTeams, refetchAnswers: fetchAnswers };
}
