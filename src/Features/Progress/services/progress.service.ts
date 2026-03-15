import { supabase } from "@/Shared/lib/supabase";

/**
 * Compute progress % for a student in their unit: approved activities / total activities.
 * Returns 0-100. Progress is computed from student_logs (approved count / total activities).
 */
export async function computeProgressForStudent(
  studentId: string,
  unitId: string,
): Promise<number> {
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .single();
  if (!student) return 0;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("unit_id", unitId);
  if (!chapters?.length) return 100;

  const chapterIds = chapters.map((c) => c.id);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .in("chapter_id", chapterIds);
  if (!lessons?.length) return 100;

  const lessonIds = lessons.map((l) => l.id);
  const { data: activities } = await supabase
    .from("activities")
    .select("id")
    .in("lesson_id", lessonIds);
  const total = activities?.length ?? 0;
  if (total === 0) return 100;

  const { data: approvedLogs } = await supabase
    .from("student_logs")
    .select("id")
    .eq("student_id", studentId)
    .eq("status", "APPROVED")
    .in("activity_id", activities?.map((a) => a.id) ?? []);

  const approved = approvedLogs?.length ?? 0;
  return Math.round((approved / total) * 100);
}
