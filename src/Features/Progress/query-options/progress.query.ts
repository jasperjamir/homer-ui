import {
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { computeProgressForStudent } from "@/Features/Progress/services";

export function getProgressQueryOptions<TData = number, TError = Error>(
  studentId: string | null,
  unitId: string | null,
  options?: Omit<
    UseQueryOptions<number, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["progress", studentId, unitId],
    queryFn: () =>
      studentId && unitId
        ? computeProgressForStudent(studentId, unitId)
        : Promise.resolve(0),
    enabled: !!studentId && !!unitId,
    staleTime: 1000 * 30,
    ...options,
  });
}
