-- Add model column to image_generations for storing AI model used (GROK, NANO BANANA)
ALTER TABLE image_generations ADD COLUMN IF NOT EXISTS model TEXT;
