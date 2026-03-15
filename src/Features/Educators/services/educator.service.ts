import type { Educator, EducatorInsert, EducatorUpdate } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getEducators(filters?: {
  unitId?: string;
}): Promise<Educator[]> {
  let query = supabase
    .from("educators")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.unitId) {
    query = query.eq("unit_id", filters.unitId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Educator[];
}

export async function getEducatorById(id: string): Promise<Educator> {
  const { data, error } = await supabase
    .from("educators")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Educator;
}

export async function getEducatorByUserId(
  userId: string,
): Promise<Educator | null> {
  const { data, error } = await supabase
    .from("educators")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Educator;
}

export async function createEducator(
  educator: EducatorInsert,
): Promise<Educator> {
  const { data, error } = await supabase
    .from("educators")
    .insert(educator)
    .select()
    .single();

  if (error) throw error;
  return data as Educator;
}

export async function updateEducator(
  id: string,
  updates: EducatorUpdate,
): Promise<Educator> {
  const { data, error } = await supabase
    .from("educators")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Educator;
}

export async function deleteEducator(id: string): Promise<void> {
  const { error } = await supabase.from("educators").delete().eq("id", id);
  if (error) throw error;
}
