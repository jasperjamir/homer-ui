import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Activity, ActivityInsert, ActivityUpdate } from "@/Shared/models";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getActivitiesByLessonId,
  updateActivity,
} from "@/Features/Activities/services";

export function getActivitiesQueryOptions<TData = Activity[], TError = Error>(
  lessonId: string,
  options?: Omit<
    UseQueryOptions<Activity[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["activities", lessonId],
    queryFn: () => getActivitiesByLessonId(lessonId),
    enabled: !!lessonId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getActivityQueryOptions<TData = Activity, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Activity, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["activity", id],
    queryFn: () => getActivityById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateActivityMutation(options?: {
  onSuccess?: (data: Activity) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activity: ActivityInsert) => createActivity(activity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", data.lesson_id],
      });
      queryClient.invalidateQueries({ queryKey: ["activity", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateActivityMutation(options?: {
  onSuccess?: (data: Activity) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ActivityUpdate }) =>
      updateActivity(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", data.lesson_id],
      });
      queryClient.invalidateQueries({ queryKey: ["activity", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteActivityMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
