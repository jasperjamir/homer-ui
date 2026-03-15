import type { Activity, ActivityInsert, ActivityUpdate } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getActivitiesByLessonId(
  lessonId: string,
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Activity[];
}

export async function getActivityById(id: string): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Activity;
}

export async function createActivity(
  activity: ActivityInsert,
): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}

export async function updateActivity(
  id: string,
  updates: ActivityUpdate,
): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}
