export const AppUserRole = {
  STUDENT: "STUDENT",
  EDUCATOR: "EDUCATOR",
} as const;

export type AppUserRole = (typeof AppUserRole)[keyof typeof AppUserRole];

export interface AppUser {
  id: string;
  name: string;
  email: string | null;
  mobile_number: string | null;
  role: AppUserRole;
  created_at: string;
  updated_at: string;
}

export type AppUserInsert = Omit<AppUser, "created_at" | "updated_at">;

export type AppUserUpdate = Partial<
  Pick<AppUser, "name" | "email" | "mobile_number" | "role">
>;
