
-- Add per-team question tracking for independent play
ALTER TABLE public.teams 
  ADD COLUMN current_question_index integer NOT NULL DEFAULT 0,
  ADD COLUMN finished_at timestamptz DEFAULT NULL;

-- Add stage start time for shared timer
ALTER TABLE public.game_rooms 
  ADD COLUMN stage_started_at timestamptz DEFAULT NULL;

-- Add text answer support for fill-in questions
ALTER TABLE public.team_answers 
  ADD COLUMN text_answer text DEFAULT NULL;
