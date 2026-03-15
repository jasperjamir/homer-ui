import type {
  MarketingPrompt,
  MarketingPromptInsert,
  MarketingPromptUpdate,
} from "@/Features/MarketingPrompts/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getMarketingPrompts(): Promise<MarketingPrompt[]> {
  const { data, error } = await supabase
    .from("marketing_prompts")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as MarketingPrompt[];
}

export async function getMarketingPromptById(id: string): Promise<MarketingPrompt | null> {
  const { data, error } = await supabase
    .from("marketing_prompts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as MarketingPrompt;
}

export async function createMarketingPrompt(
  input: MarketingPromptInsert,
): Promise<MarketingPrompt> {
  const { data, error } = await supabase
    .from("marketing_prompts")
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data as MarketingPrompt;
}

export async function updateMarketingPrompt(
  id: string,
  updates: MarketingPromptUpdate,
): Promise<MarketingPrompt> {
  const { data, error } = await supabase
    .from("marketing_prompts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as MarketingPrompt;
}

export async function deleteMarketingPrompt(id: string): Promise<void> {
  const { error } = await supabase.from("marketing_prompts").delete().eq("id", id);
  if (error) throw error;
}
