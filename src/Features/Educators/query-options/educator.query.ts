import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Educator, EducatorInsert, EducatorUpdate } from "@/Shared/models";
import {
  createEducator,
  deleteEducator,
  getEducatorById,
  getEducatorByUserId,
  getEducators,
  updateEducator,
} from "@/Features/Educators/services";

type EducatorFilters = { unitId?: string };

export function getEducatorsQueryOptions<TData = Educator[], TError = Error>(
  filters?: EducatorFilters,
  options?: Omit<
    UseQueryOptions<Educator[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["educators", filters],
    queryFn: () => getEducators(filters),
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getEducatorQueryOptions<TData = Educator, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Educator, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["educator", id],
    queryFn: () => getEducatorById(id),
    enabled: !!id,
    ...options,
  });
}

export function getEducatorByUserIdQueryOptions<
  TData = Educator | null,
  TError = Error,
>(
  userId: string | null,
  options?: Omit<
    UseQueryOptions<Educator | null, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["educator", "by_user", userId],
    queryFn: () =>
      userId ? getEducatorByUserId(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function useCreateEducatorMutation(options?: {
  onSuccess?: (data: Educator) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (educator: EducatorInsert) => createEducator(educator),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["educators"] });
      queryClient.invalidateQueries({ queryKey: ["educator", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateEducatorMutation(options?: {
  onSuccess?: (data: Educator) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: EducatorUpdate }) =>
      updateEducator(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["educators"] });
      queryClient.invalidateQueries({ queryKey: ["educator", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["educator", "by_user", data.user_id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteEducatorMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEducator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educators"] });
      queryClient.invalidateQueries({ queryKey: ["educator"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
