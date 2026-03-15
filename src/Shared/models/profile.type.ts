export const Role = {
  PARTNER: "partner",
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
  MANAGEMENT: "management",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type TProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  role: Role;
  roles?: Role[];
};
