import type { Unit, UnitInsert, UnitUpdate } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getUnits(): Promise<Unit[]> {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Unit[];
}

export async function getUnitById(id: string): Promise<Unit> {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Unit;
}

export async function createUnit(unit: UnitInsert): Promise<Unit> {
  const { data, error } = await supabase
    .from("units")
    .insert(unit)
    .select()
    .single();

  if (error) throw error;
  return data as Unit;
}

export async function updateUnit(id: string, updates: UnitUpdate): Promise<Unit> {
  const { data, error } = await supabase
    .from("units")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Unit;
}

export async function deleteUnit(id: string): Promise<void> {
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) throw error;
}
