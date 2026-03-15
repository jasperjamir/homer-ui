import { z } from "zod";
import { AppUserRole } from "@/Shared/models";

/** Philippine mobile: 09XXXXXXXXX only (09 + 9 digits) */
const PH_MOBILE_REGEX = /^09\d{9}$/;

const phMobileSchema = z
  .string()
  .refine(
    (val) => !val || val.trim() === "" || PH_MOBILE_REGEX.test(val.replace(/\s/g, "")),
    "Enter a valid Philippine mobile number (e.g. 09171234567)",
  )
  .optional()
  .nullable();

/** Schema for creating a new user (auto-creates auth user) */
export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile_number: phMobileSchema,
  role: z.enum([AppUserRole.STUDENT, AppUserRole.EDUCATOR]),
});

/** Schema for updating an existing user */
export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  mobile_number: phMobileSchema,
  role: z.enum([AppUserRole.STUDENT, AppUserRole.EDUCATOR]),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
