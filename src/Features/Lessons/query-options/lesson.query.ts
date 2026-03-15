import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Lesson, LessonInsert, LessonUpdate } from "@/Shared/models";
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessonsByChapterId,
  updateLesson,
} from "@/Features/Lessons/services";

export function getLessonsQueryOptions<TData = Lesson[], TError = Error>(
  chapterId: string,
  options?: Omit<UseQueryOptions<Lesson[], TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["lessons", chapterId],
    queryFn: () => getLessonsByChapterId(chapterId),
    enabled: !!chapterId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getLessonQueryOptions<TData = Lesson, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Lesson, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["lesson", id],
    queryFn: () => getLessonById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateLessonMutation(options?: {
  onSuccess?: (data: Lesson) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lesson: LessonInsert) => createLesson(lesson),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.chapter_id] });
      queryClient.invalidateQueries({ queryKey: ["lesson", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateLessonMutation(options?: {
  onSuccess?: (data: Lesson) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: LessonUpdate }) =>
      updateLesson(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lessons", data.chapter_id] });
      queryClient.invalidateQueries({ queryKey: ["lesson", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteLessonMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLesson(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
