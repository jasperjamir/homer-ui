import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { StudentLog } from "@/Shared/models";
import {
  approveStudentLog,
  getStudentLogByStudentAndActivity,
  getStudentLogsByStudentId,
  getStudentLogsWithActivities,
  getStudentLogsWithHierarchy,
  submitStudentLog,
  updateStudentLog,
} from "@/Features/StudentLogs/services";
import type {
  StudentLogWithActivity,
  StudentLogWithHierarchy,
} from "@/Features/StudentLogs/services";

export function getStudentLogsQueryOptions<TData = StudentLog[], TError = Error>(
  studentId: string,
  options?: Omit<
    UseQueryOptions<StudentLog[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student_logs", studentId],
    queryFn: () => getStudentLogsByStudentId(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 30,
    ...options,
  });
}

export function getStudentLogsWithActivitiesQueryOptions<
  TData = StudentLogWithActivity[],
  TError = Error,
>(
  studentId: string | null,
  options?: Omit<
    UseQueryOptions<StudentLogWithActivity[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student_logs", "with_activities", studentId],
    queryFn: () =>
      studentId ? getStudentLogsWithActivities(studentId) : Promise.resolve([]),
    enabled: !!studentId,
    staleTime: 1000 * 30,
    ...options,
  });
}

export function getStudentLogsWithHierarchyQueryOptions<
  TData = StudentLogWithHierarchy[],
  TError = Error,
>(
  studentId: string | null,
  options?: Omit<
    UseQueryOptions<StudentLogWithHierarchy[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student_logs", "with_hierarchy", studentId],
    queryFn: () =>
      studentId
        ? getStudentLogsWithHierarchy(studentId)
        : Promise.resolve([]),
    enabled: !!studentId,
    staleTime: 1000 * 30,
    ...options,
  });
}

export function getStudentLogByStudentAndActivityQueryOptions<
  TData = StudentLog | null,
  TError = Error,
>(
  studentId: string | null,
  activityId: string | null,
  options?: Omit<
    UseQueryOptions<StudentLog | null, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student_log", studentId, activityId],
    queryFn: () =>
      studentId && activityId
        ? getStudentLogByStudentAndActivity(studentId, activityId)
        : Promise.resolve(null),
    enabled: !!studentId && !!activityId,
    ...options,
  });
}

export function useSubmitStudentLogMutation(options?: {
  onSuccess?: (data: StudentLog) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      activityId,
      payload,
    }: {
      studentId: string;
      activityId: string;
      payload: { submission_link: string; submission_details?: string | null };
    }) => submitStudentLog(studentId, activityId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student_logs", data.student_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student_log", data.student_id, data.activity_id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useApproveStudentLogMutation(options?: {
  onSuccess?: (data: StudentLog) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ logId, approverId }: { logId: string; approverId: string }) =>
      approveStudentLog(logId, approverId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student_logs", data.student_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student_logs", "with_hierarchy", data.student_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student_log", data.student_id, data.activity_id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateStudentLogMutation(options?: {
  onSuccess?: (data: StudentLog) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateStudentLog>[1];
    }) => updateStudentLog(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["student_logs", data.student_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student_logs", "with_hierarchy", data.student_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student_log", data.student_id, data.activity_id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
