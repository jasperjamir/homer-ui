-- Add duration column to video_generations (total video duration in seconds)
ALTER TABLE video_generations ADD COLUMN IF NOT EXISTS duration INT;
