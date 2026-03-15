import type { Role } from "./role.type";

export type TProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  role: Role;
  roles?: Role[];
};
