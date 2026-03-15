-- Remove asset-platform mapping tables (upload flow no longer persists mappings)
DROP TABLE IF EXISTS video_asset_platform_mappings;
DROP TABLE IF EXISTS image_asset_platform_mappings;
