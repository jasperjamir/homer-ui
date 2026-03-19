-- Remove DB schema used to configure upload destinations (upload_platforms + platform_types)
-- Upload flow now uses /accounts API instead.

-- Ensure the generations tables always have a `platform_type` string value
-- (Upload UI and generation badges depend on it).
ALTER TABLE image_generations ADD COLUMN IF NOT EXISTS platform_type TEXT;
ALTER TABLE video_generations ADD COLUMN IF NOT EXISTS platform_type TEXT;

-- Drop upload destination configuration table (no longer used).
DROP TABLE IF EXISTS upload_platforms;

DO $$
BEGIN
  -- If platform_types exists, migrate any platform_type_id values back to platform_type
  -- and then drop platform_types + platform_type_id columns.
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_types') THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'image_generations' AND column_name = 'platform_type_id'
    ) THEN
      EXECUTE '
        UPDATE image_generations ig
        SET platform_type = pt.code
        FROM platform_types pt
        WHERE ig.platform_type_id = pt.id
      ';
      EXECUTE 'ALTER TABLE image_generations DROP COLUMN platform_type_id';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'video_generations' AND column_name = 'platform_type_id'
    ) THEN
      EXECUTE '
        UPDATE video_generations vg
        SET platform_type = pt.code
        FROM platform_types pt
        WHERE vg.platform_type_id = pt.id
      ';
      EXECUTE 'ALTER TABLE video_generations DROP COLUMN platform_type_id';
    END IF;

    EXECUTE 'DROP TABLE platform_types';
  END IF;
END
$$;

