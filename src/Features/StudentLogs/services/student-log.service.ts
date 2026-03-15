import type {
  StudentLog,
  StudentLogInsert,
  StudentLogUpdate,
} from "@/Shared/models";
import { StudentLogStatus } from "@/Shared/models";
import { supabase } from "@/Shared/lib/supabase";

export async function getStudentLogsByStudentId(
  studentId: string,
): Promise<StudentLog[]> {
  const { data, error } = await supabase
    .from("student_logs")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as StudentLog[];
}

export interface StudentLogWithActivity extends StudentLog {
  activity_name: string | null;
}

/** Chapter/lesson/activity hierarchy for display (sort_order for ordering). */
export interface StudentLogWithHierarchy extends StudentLogWithActivity {
  chapter_id: string;
  chapter_name: string;
  chapter_sort_order: number;
  lesson_id: string;
  lesson_name: string;
  lesson_sort_order: number;
  activity_sort_order: number;
}

type ActivityRow = {
  name: string | null;
  sort_order: number;
  lessons: {
    id: string;
    name: string;
    sort_order: number;
    chapters: { id: string; name: string; sort_order: number } | null;
  } | null;
};

export async function getStudentLogsWithActivities(
  studentId: string,
): Promise<StudentLogWithActivity[]> {
  const { data, error } = await supabase
    .from("student_logs")
    .select("*, activities!activity_id(name)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(
    (row: StudentLog & { activities: { name: string } | null }) => ({
      ...row,
      activity_name: row.activities?.name ?? null,
    }),
  ) as StudentLogWithActivity[];
}

export async function getStudentLogsWithHierarchy(
  studentId: string,
): Promise<StudentLogWithHierarchy[]> {
  const { data, error } = await supabase
    .from("student_logs")
    .select(
      "*, activities!activity_id(name, sort_order, lessons!lesson_id(id, name, sort_order, chapters!chapter_id(id, name, sort_order)))",
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map(
    (row: StudentLog & { activities: ActivityRow | null }) => {
      const activity = row.activities;
      const lesson = activity?.lessons ?? null;
      const chapter = lesson?.chapters ?? null;
      return {
        ...row,
        activity_name: activity?.name ?? null,
        chapter_id: chapter?.id ?? "",
        chapter_name: chapter?.name ?? "",
        chapter_sort_order: chapter?.sort_order ?? 0,
        lesson_id: lesson?.id ?? "",
        lesson_name: lesson?.name ?? "",
        lesson_sort_order: lesson?.sort_order ?? 0,
        activity_sort_order: activity?.sort_order ?? 0,
      } as StudentLogWithHierarchy;
    },
  ) as StudentLogWithHierarchy[];
}

export async function getStudentLogsByActivityId(
  activityId: string,
): Promise<StudentLog[]> {
  const { data, error } = await supabase
    .from("student_logs")
    .select("*")
    .eq("activity_id", activityId);

  if (error) throw error;
  return data as StudentLog[];
}

export async function getStudentLogByStudentAndActivity(
  studentId: string,
  activityId: string,
): Promise<StudentLog | null> {
  const { data, error } = await supabase
    .from("student_logs")
    .select("*")
    .eq("student_id", studentId)
    .eq("activity_id", activityId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as StudentLog;
}

export async function createStudentLog(
  log: StudentLogInsert,
): Promise<StudentLog> {
  const { data, error } = await supabase
    .from("student_logs")
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as StudentLog;
}

export async function updateStudentLog(
  id: string,
  updates: StudentLogUpdate,
): Promise<StudentLog> {
  const { data, error } = await supabase
    .from("student_logs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as StudentLog;
}

export async function submitStudentLog(
  studentId: string,
  activityId: string,
  payload: {
    submission_link: string;
    submission_details?: string | null;
  },
): Promise<StudentLog> {
  const existing = await getStudentLogByStudentAndActivity(
    studentId,
    activityId,
  );
  const now = new Date().toISOString();

  if (existing) {
    return updateStudentLog(existing.id, {
      submission_link: payload.submission_link,
      submission_details: payload.submission_details ?? existing.submission_details,
      submission_date: now,
      status: StudentLogStatus.FOR_APPROVAL,
    });
  }

  return createStudentLog({
    student_id: studentId,
    activity_id: activityId,
    submission_link: payload.submission_link,
    submission_details: payload.submission_details ?? null,
    submission_date: now,
    status: StudentLogStatus.FOR_APPROVAL,
    approval_date: null,
    approver_id: null,
  });
}

export async function approveStudentLog(
  logId: string,
  approverId: string,
): Promise<StudentLog> {
  return updateStudentLog(logId, {
    status: StudentLogStatus.APPROVED,
    approval_date: new Date().toISOString(),
    approver_id: approverId,
  });
}
