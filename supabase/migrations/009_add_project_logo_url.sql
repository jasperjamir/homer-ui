-- Optional project logo URL (separate from prompt text)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo_url TEXT;
