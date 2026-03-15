import type {
  UploadPlatform,
  UploadPlatformInsert,
  UploadPlatformUpdate,
} from "@/Features/UploadPlatforms/models";
import { supabase } from "@/Shared/lib/supabase";

const MAX_PLATFORMS = 10;

export async function getUploadPlatforms(): Promise<UploadPlatform[]> {
  const { data, error } = await supabase
    .from("upload_platforms")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as UploadPlatform[];
}

export async function getUploadPlatformById(id: string): Promise<UploadPlatform | null> {
  const { data, error } = await supabase
    .from("upload_platforms")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as UploadPlatform;
}

export async function createUploadPlatform(
  input: UploadPlatformInsert,
): Promise<UploadPlatform> {
  const count = await getUploadPlatformCount();
  if (count >= MAX_PLATFORMS) {
    throw new Error(`Maximum ${MAX_PLATFORMS} platforms allowed.`);
  }
  const { data, error } = await supabase
    .from("upload_platforms")
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as UploadPlatform;
}

export async function getUploadPlatformCount(): Promise<number> {
  const { count, error } = await supabase
    .from("upload_platforms")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function updateUploadPlatform(
  id: string,
  updates: UploadPlatformUpdate,
): Promise<UploadPlatform> {
  const { data, error } = await supabase
    .from("upload_platforms")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as UploadPlatform;
}

export async function deleteUploadPlatform(id: string): Promise<void> {
  const { error } = await supabase.from("upload_platforms").delete().eq("id", id);
  if (error) throw error;
}
