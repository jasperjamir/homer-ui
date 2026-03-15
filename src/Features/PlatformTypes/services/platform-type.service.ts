import type { PlatformType } from "@/Features/PlatformTypes/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getPlatformTypes(): Promise<PlatformType[]> {
  const { data, error } = await supabase
    .from("platform_types")
    .select("*")
    .order("code", { ascending: true });
  if (error) throw error;
  return data as PlatformType[];
}
