-- Replace platform_type enum with platform_types table for easier scaling (e.g. Facebook, Twitter).
-- Maps both old (IG, Tiktok) and current (INSTAGRAM, TIKTOK) enum values to the new table.

CREATE TABLE platform_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

INSERT INTO platform_types (code, name) VALUES
  ('INSTAGRAM', 'Instagram'),
  ('TIKTOK', 'TikTok');

-- Map enum value to platform_types.code (handles both pre-003 and post-003 enum values)
CREATE OR REPLACE FUNCTION _platform_type_to_code(t text) RETURNS text AS $$
  SELECT CASE t
    WHEN 'IG' THEN 'INSTAGRAM'
    WHEN 'Tiktok' THEN 'TIKTOK'
    WHEN 'INSTAGRAM' THEN 'INSTAGRAM'
    WHEN 'TIKTOK' THEN 'TIKTOK'
    ELSE 'INSTAGRAM'
  END;
$$ LANGUAGE sql IMMUTABLE;

-- upload_platforms
ALTER TABLE upload_platforms ADD COLUMN platform_type_id UUID REFERENCES platform_types(id);
UPDATE upload_platforms SET platform_type_id = (SELECT id FROM platform_types WHERE code = _platform_type_to_code(platform_type::text));
ALTER TABLE upload_platforms ALTER COLUMN platform_type_id SET NOT NULL;
ALTER TABLE upload_platforms DROP COLUMN platform_type;

-- image_generations (nullable)
ALTER TABLE image_generations ADD COLUMN platform_type_id UUID REFERENCES platform_types(id);
UPDATE image_generations SET platform_type_id = (SELECT id FROM platform_types WHERE code = _platform_type_to_code(platform_type::text)) WHERE platform_type IS NOT NULL;
ALTER TABLE image_generations DROP COLUMN platform_type;

-- video_generations (nullable)
ALTER TABLE video_generations ADD COLUMN platform_type_id UUID REFERENCES platform_types(id);
UPDATE video_generations SET platform_type_id = (SELECT id FROM platform_types WHERE code = _platform_type_to_code(platform_type::text)) WHERE platform_type IS NOT NULL;
ALTER TABLE video_generations DROP COLUMN platform_type;

DROP FUNCTION _platform_type_to_code(text);
DROP TYPE platform_type;
