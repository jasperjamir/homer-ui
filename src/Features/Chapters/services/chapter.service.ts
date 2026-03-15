import type { Chapter, ChapterInsert, ChapterUpdate } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getChaptersByUnitId(unitId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("unit_id", unitId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Chapter[];
}

export async function getChapterById(id: string): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Chapter;
}

export async function createChapter(chapter: ChapterInsert): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .insert(chapter)
    .select()
    .single();

  if (error) throw error;
  return data as Chapter;
}

export async function updateChapter(
  id: string,
  updates: ChapterUpdate,
): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Chapter;
}

export async function deleteChapter(id: string): Promise<void> {
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) throw error;
}
