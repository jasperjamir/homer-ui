export interface Chapter {
  id: string;
  unit_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ChapterInsert = Omit<Chapter, "id" | "created_at" | "updated_at">;

export type ChapterUpdate = Partial<
  Pick<Chapter, "unit_id" | "name" | "description" | "sort_order">
>;
