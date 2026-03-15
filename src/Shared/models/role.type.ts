export const Role = {
  PARTNER: "partner",
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
  MANAGEMENT: "management",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
