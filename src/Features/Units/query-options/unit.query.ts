import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Unit, UnitInsert, UnitUpdate } from "@/Shared/models";
import {
  createUnit,
  deleteUnit,
  getUnitById,
  getUnits,
  updateUnit,
} from "@/Features/Units/services";

export function getUnitsQueryOptions<TData = Unit[], TError = Error>(
  options?: Omit<UseQueryOptions<Unit[], TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["units"],
    queryFn: getUnits,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getUnitQueryOptions<TData = Unit, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Unit, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["unit", id],
    queryFn: () => getUnitById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateUnitMutation(options?: {
  onSuccess?: (data: Unit) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unit: UnitInsert) => createUnit(unit),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateUnitMutation(options?: {
  onSuccess?: (data: Unit) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UnitUpdate }) =>
      updateUnit(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["unit", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteUnitMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
