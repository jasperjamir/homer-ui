export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Pick<Project, "name">>;
