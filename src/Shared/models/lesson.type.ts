export interface Lesson {
  id: string;
  chapter_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type LessonInsert = Omit<Lesson, "id" | "created_at" | "updated_at">;

export type LessonUpdate = Partial<
  Pick<Lesson, "chapter_id" | "name" | "description" | "sort_order">
>;
