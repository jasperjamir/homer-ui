-- Add prompt_text to projects (optional text for project-level prompt)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS prompt_text TEXT;
