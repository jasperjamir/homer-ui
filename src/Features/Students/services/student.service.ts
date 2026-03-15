import type {
  Student,
  StudentInsert,
  StudentUpdate,
  StudentWithUser,
} from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getStudents(filters?: {
  unitId?: string;
}): Promise<Student[]> {
  let query = supabase.from("students").select("*").order("created_at", { ascending: false });

  if (filters?.unitId) {
    query = query.eq("unit_id", filters.unitId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Student[];
}

/** Students in a unit with app_user name and email (for educator dashboard). */
export async function getStudentsWithUsers(unitId: string): Promise<StudentWithUser[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*, app_users!user_id(name, email)")
    .eq("unit_id", unitId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: Student & { app_users: { name: string | null; email: string | null } | null }) => {
    const { app_users, ...student } = row;
    return {
      ...student,
      name: app_users?.name ?? null,
      email: app_users?.email ?? null,
    } as StudentWithUser;
  });
}

export async function getStudentById(id: string): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Student;
}

/** Single student with app_user name and email (for submissions page). */
export async function getStudentWithUserById(
  id: string,
): Promise<StudentWithUser | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*, app_users!user_id(name, email)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const row = data as Student & {
    app_users: { name: string | null; email: string | null } | null;
  };
  const { app_users, ...student } = row;
  return {
    ...student,
    name: app_users?.name ?? null,
    email: app_users?.email ?? null,
  } as StudentWithUser;
}

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Student;
}

export async function createStudent(student: StudentInsert): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function updateStudent(
  id: string,
  updates: StudentUpdate,
): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}
