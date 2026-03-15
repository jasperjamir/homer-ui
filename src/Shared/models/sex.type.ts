export const Sex = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export type TSex = (typeof Sex)[keyof typeof Sex];
