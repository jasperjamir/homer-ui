import type { AppUser } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

/** Get app_user by id (same as auth.users.id in Supabase). */
export async function getAppUser(id: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as AppUser;
}
