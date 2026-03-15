import type { AppUserRole } from "@/Shared/models";

/** User from app_users table - matches Supabase schema */
export interface User {
  id: string;
  name: string;
  email: string | null;
  mobile_number: string | null;
  role: AppUserRole;
  created_at: string;
  updated_at: string;
}

export type UserInsert = Omit<User, "created_at" | "updated_at">;

export type UserUpdate = Partial<Pick<User, "name" | "email" | "mobile_number" | "role">>;

/** Input for creating a user with auth (no id - auth user is created first) */
export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  mobile_number?: string | null;
  role: AppUserRole;
}
