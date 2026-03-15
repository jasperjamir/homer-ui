-- Platform type for upload destinations and generation target
CREATE TYPE platform_type AS ENUM ('IG', 'Tiktok');

-- Config: projects (dropdown in prompts)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Config: marketing prompts
CREATE TABLE marketing_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  prompt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Config: upload platforms (max 10 enforced in app)
CREATE TABLE upload_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform_type platform_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Image flow: one generation per "Generate Image Links" submit
CREATE TABLE image_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  marketing_prompt_id UUID REFERENCES marketing_prompts(id) ON DELETE SET NULL,
  platform_type platform_type,
  asset_count INT NOT NULL CHECK (asset_count >= 1 AND asset_count <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE image_generation_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_generation_id UUID NOT NULL REFERENCES image_generations(id) ON DELETE CASCADE,
  index INT NOT NULL CHECK (index >= 1 AND index <= 10),
  asset_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(image_generation_id, index)
);

-- Video flow: one generation per prompt submit
CREATE TABLE video_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  marketing_prompt_id UUID REFERENCES marketing_prompts(id) ON DELETE SET NULL,
  platform_type platform_type,
  asset_count INT NOT NULL CHECK (asset_count >= 1 AND asset_count <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storyboard: one row per video generation (output of Step 1)
CREATE TABLE video_generation_storyboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_generation_id UUID NOT NULL UNIQUE REFERENCES video_generations(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE video_generation_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_generation_id UUID NOT NULL REFERENCES video_generations(id) ON DELETE CASCADE,
  index INT NOT NULL CHECK (index >= 1 AND index <= 10),
  asset_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(video_generation_id, index)
);

-- Upload: mapping image assets to platforms
CREATE TABLE image_asset_platform_mappings (
  image_generation_asset_id UUID NOT NULL REFERENCES image_generation_assets(id) ON DELETE CASCADE,
  upload_platform_id UUID NOT NULL REFERENCES upload_platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (image_generation_asset_id, upload_platform_id)
);

-- Upload: mapping video assets to platforms
CREATE TABLE video_asset_platform_mappings (
  video_generation_asset_id UUID NOT NULL REFERENCES video_generation_assets(id) ON DELETE CASCADE,
  upload_platform_id UUID NOT NULL REFERENCES upload_platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (video_generation_asset_id, upload_platform_id)
);

-- Indexes for list/filter queries
CREATE INDEX idx_image_generation_assets_created ON image_generation_assets(created_at);
CREATE INDEX idx_video_generation_assets_created ON video_generation_assets(created_at);
CREATE INDEX idx_image_generations_created_at ON image_generations(created_at DESC);
CREATE INDEX idx_video_generations_created_at ON video_generations(created_at DESC);
