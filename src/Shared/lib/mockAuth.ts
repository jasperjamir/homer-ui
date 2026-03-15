import type { User } from "@supabase/supabase-js";

/**
 * Mock Supabase User for development bypass
 * Only used when PUBLIC_DEV_BYPASS_AUTH is set
 */
export function createMockSupabaseUser(): User {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    email: "jasper@ekonsultaclinic.ph",
    app_metadata: {},
    user_metadata: {
      full_name: "Jasper Jamir",
      name: "Jasper Jamir",
      avatar_url: undefined,
    },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;
}
