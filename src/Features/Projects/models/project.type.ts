export interface Project {
  id: string;
  name: string;
  prompt_text: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Pick<Project, "name" | "prompt_text" | "logo_url">>;
