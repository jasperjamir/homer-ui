import type { Lesson, LessonInsert, LessonUpdate } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getLessonsByChapterId(
  chapterId: string,
): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Lesson[];
}

export async function getLessonById(id: string): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Lesson;
}

export async function createLesson(lesson: LessonInsert): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .insert(lesson)
    .select()
    .single();

  if (error) throw error;
  return data as Lesson;
}

export async function updateLesson(
  id: string,
  updates: LessonUpdate,
): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Lesson;
}

export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
}
