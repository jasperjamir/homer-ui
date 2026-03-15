export const StudentLogStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  FOR_APPROVAL: "FOR_APPROVAL",
  APPROVED: "APPROVED",
} as const;

export type StudentLogStatus =
  (typeof StudentLogStatus)[keyof typeof StudentLogStatus];

export interface StudentLog {
  id: string;
  student_id: string;
  activity_id: string;
  submission_link: string | null;
  submission_details: string | null;
  submission_date: string | null;
  status: StudentLogStatus;
  approval_date: string | null;
  approver_id: string | null;
  created_at: string;
  updated_at: string;
}

export type StudentLogInsert = Omit<
  StudentLog,
  "id" | "created_at" | "updated_at"
>;

export type StudentLogUpdate = Partial<
  Pick<
    StudentLog,
    | "submission_link"
    | "submission_details"
    | "submission_date"
    | "status"
    | "approval_date"
    | "approver_id"
  >
>;
