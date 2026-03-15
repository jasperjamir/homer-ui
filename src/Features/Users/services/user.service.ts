import type { User, UserCreateInput, UserInsert, UserUpdate } from "@/Features/Users/models";
import { supabase } from "@/Shared/lib/supabase";
import { AppUserRole } from "@/Shared/models";

export async function createUserWithAuth(input: UserCreateInput): Promise<User> {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.name } },
  });

  if (signUpError) {
    if (signUpError.message?.toLowerCase().includes("already registered")) {
      throw new Error("A user with this email already exists.");
    }
    throw signUpError;
  }

  const authUser = authData.user;
  if (!authUser?.id) {
    throw new Error("Failed to create auth user.");
  }

  const appUser: UserInsert = {
    id: authUser.id,
    name: input.name,
    email: input.email,
    mobile_number: input.mobile_number ?? null,
    role: input.role,
  };

  const { data: userData, error: insertError } = await supabase
    .from("app_users")
    .insert(appUser)
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  const user = userData as User;

  if (input.role === AppUserRole.EDUCATOR) {
    const { error: educatorError } = await supabase.from("educators").insert({
      user_id: user.id,
      unit_id: null,
    });
    if (educatorError) throw educatorError;
  } else if (input.role === AppUserRole.STUDENT) {
    const { error: studentError } = await supabase.from("students").insert({
      user_id: user.id,
      unit_id: null,
    });
    if (studentError) throw studentError;
  }

  return user;
}

export async function getUsers(filters?: { search?: string; role?: string }) {
  let query = supabase.from("app_users").select("*").order("name", { ascending: true });

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,mobile_number.ilike.%${filters.search}%,id.ilike.%${filters.search}%`,
    );
  }

  if (filters?.role) {
    query = query.eq("role", filters.role);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as User[];
}

export async function getUserById(id: string): Promise<User> {
  const { data, error } = await supabase.from("app_users").select("*").eq("id", id).single();

  if (error) throw error;
  return data as User;
}

export async function getUserByAuthUserId(auth_user_id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("id", auth_user_id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as User;
}

export async function createUser(user: UserInsert): Promise<User> {
  const { data, error } = await supabase.from("app_users").insert(user).select().single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(id: string, updates: UserUpdate): Promise<User> {
  const { data, error } = await supabase
    .from("app_users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from("app_users").delete().eq("id", id);

  if (error) throw error;
}
