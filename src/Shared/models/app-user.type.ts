export const AppUserRole = {
  STUDENT: "STUDENT",
  EDUCATOR: "EDUCATOR",
} as const;

export type AppUserRole = (typeof AppUserRole)[keyof typeof AppUserRole];
