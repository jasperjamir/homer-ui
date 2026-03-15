-- Add model column to video_generations for storing AI model used (GROK, SORA)
ALTER TABLE video_generations ADD COLUMN IF NOT EXISTS model TEXT;
