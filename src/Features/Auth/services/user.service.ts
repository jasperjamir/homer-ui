import type { TProfile } from "@/Shared/models";
import { Role } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  mobile_number: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

function mapAppUserToProfile(appUser: AppUser): TProfile {
  const nameParts = (appUser.name ?? "").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  const role = (appUser.role ?? Role.PATIENT) as TProfile["role"];
  const roles = role ? [role] : [];

  return {
    firstName,
    lastName,
    email: appUser.email ?? "",
    phone: appUser.mobile_number ?? undefined,
    phoneVerified: false,
    role,
    roles,
  };
}

export async function getUserProfile(): Promise<TProfile> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("id, name, email, mobile_number, role, created_at, updated_at")
    .eq("id", session.user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("User profile not found");
    }
    throw error;
  }

  return mapAppUserToProfile(data as AppUser);
}
