export interface Unit {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type UnitInsert = Omit<Unit, "id" | "created_at" | "updated_at">;

export type UnitUpdate = Partial<Pick<Unit, "name" | "description">>;
