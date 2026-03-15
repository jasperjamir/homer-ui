import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Chapter, ChapterInsert, ChapterUpdate } from "@/Shared/models";
import {
  createChapter,
  deleteChapter,
  getChapterById,
  getChaptersByUnitId,
  updateChapter,
} from "@/Features/Chapters/services";

export function getChaptersQueryOptions<TData = Chapter[], TError = Error>(
  unitId: string,
  options?: Omit<UseQueryOptions<Chapter[], TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["chapters", unitId],
    queryFn: () => getChaptersByUnitId(unitId),
    enabled: !!unitId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getChapterQueryOptions<TData = Chapter, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Chapter, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["chapter", id],
    queryFn: () => getChapterById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateChapterMutation(options?: {
  onSuccess?: (data: Chapter) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chapter: ChapterInsert) => createChapter(chapter),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", data.unit_id] });
      queryClient.invalidateQueries({ queryKey: ["chapter", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateChapterMutation(options?: {
  onSuccess?: (data: Chapter) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ChapterUpdate }) =>
      updateChapter(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chapters", data.unit_id] });
      queryClient.invalidateQueries({ queryKey: ["chapter", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteChapterMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChapter(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["chapter", id] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
