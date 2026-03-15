export interface Student {
  id: string;
  user_id: string;
  unit_id: string | null;
  created_at: string;
  updated_at: string;
  current_chapter_id: string | null;
  current_lesson_id: string | null;
}

export type StudentInsert = Omit<Student, "id" | "created_at" | "updated_at">;

export type StudentUpdate = Partial<
  Pick<Student, "user_id" | "unit_id" | "current_chapter_id" | "current_lesson_id">
>;

/** Student with app_user name and email (for educator dashboard) */
export interface StudentWithUser extends Student {
  name: string | null;
  email: string | null;
}
