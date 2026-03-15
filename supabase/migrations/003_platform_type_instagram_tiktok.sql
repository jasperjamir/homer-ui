-- Replace platform_type enum values: IG -> INSTAGRAM, Tiktok -> TIKTOK
-- PostgreSQL cannot remove enum values, so we create a new type and migrate.

CREATE TYPE platform_type_new AS ENUM ('INSTAGRAM', 'TIKTOK');

-- upload_platforms
ALTER TABLE upload_platforms ADD COLUMN platform_type_new platform_type_new;
UPDATE upload_platforms SET platform_type_new = CASE platform_type::text
  WHEN 'IG' THEN 'INSTAGRAM'::platform_type_new
  WHEN 'Tiktok' THEN 'TIKTOK'::platform_type_new
  ELSE 'INSTAGRAM'::platform_type_new
END;
ALTER TABLE upload_platforms ALTER COLUMN platform_type_new SET NOT NULL;
ALTER TABLE upload_platforms DROP COLUMN platform_type;
ALTER TABLE upload_platforms RENAME COLUMN platform_type_new TO platform_type;

-- image_generations (nullable)
ALTER TABLE image_generations ADD COLUMN platform_type_new platform_type_new;
UPDATE image_generations SET platform_type_new = CASE platform_type::text
  WHEN 'IG' THEN 'INSTAGRAM'::platform_type_new
  WHEN 'Tiktok' THEN 'TIKTOK'::platform_type_new
  ELSE NULL
END;
ALTER TABLE image_generations DROP COLUMN platform_type;
ALTER TABLE image_generations RENAME COLUMN platform_type_new TO platform_type;

-- video_generations (nullable)
ALTER TABLE video_generations ADD COLUMN platform_type_new platform_type_new;
UPDATE video_generations SET platform_type_new = CASE platform_type::text
  WHEN 'IG' THEN 'INSTAGRAM'::platform_type_new
  WHEN 'Tiktok' THEN 'TIKTOK'::platform_type_new
  ELSE NULL
END;
ALTER TABLE video_generations DROP COLUMN platform_type;
ALTER TABLE video_generations RENAME COLUMN platform_type_new TO platform_type;

-- Swap enum types
DROP TYPE platform_type;
ALTER TYPE platform_type_new RENAME TO platform_type;
