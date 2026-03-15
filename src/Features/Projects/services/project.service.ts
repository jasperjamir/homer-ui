import type { Project, ProjectInsert, ProjectUpdate } from "@/Features/Projects/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Project;
}

export async function createProject(input: ProjectInsert): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
