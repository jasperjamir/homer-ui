export interface Activity {
  id: string;
  lesson_id: string;
  name: string;
  description: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ActivityInsert = Omit<Activity, "id" | "created_at" | "updated_at">;

export type ActivityUpdate = Partial<
  Pick<Activity, "lesson_id" | "name" | "description" | "url" | "sort_order">
>;
