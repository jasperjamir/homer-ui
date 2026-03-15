import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  Student,
  StudentInsert,
  StudentUpdate,
  StudentWithUser,
} from "@/Shared/models";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudentByUserId,
  getStudents,
  getStudentWithUserById,
  getStudentsWithUsers,
  updateStudent,
} from "@/Features/Students/services";

type StudentFilters = { unitId?: string };

export function getStudentsWithUsersQueryOptions<TData = StudentWithUser[], TError = Error>(
  unitId: string | null,
  options?: Omit<
    UseQueryOptions<StudentWithUser[], TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["students", "with-users", unitId],
    queryFn: () => (unitId ? getStudentsWithUsers(unitId) : Promise.resolve([])),
    enabled: !!unitId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getStudentsQueryOptions<TData = Student[], TError = Error>(
  filters?: StudentFilters,
  options?: Omit<UseQueryOptions<Student[], TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["students", filters],
    queryFn: () => getStudents(filters),
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getStudentQueryOptions<TData = Student, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<Student, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
    ...options,
  });
}

export function getStudentWithUserByIdQueryOptions<
  TData = StudentWithUser | null,
  TError = Error,
>(
  id: string | null,
  options?: Omit<
    UseQueryOptions<StudentWithUser | null, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student", "with-user", id],
    queryFn: () => (id ? getStudentWithUserById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function getStudentByUserIdQueryOptions<
  TData = Student | null,
  TError = Error,
>(
  userId: string | null,
  options?: Omit<
    UseQueryOptions<Student | null, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["student", "by_user", userId],
    queryFn: () => (userId ? getStudentByUserId(userId) : Promise.resolve(null)),
    enabled: !!userId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function useCreateStudentMutation(options?: {
  onSuccess?: (data: Student) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: StudentInsert) => createStudent(student),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateStudentMutation(options?: {
  onSuccess?: (data: Student) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: StudentUpdate }) =>
      updateStudent(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["student", "by_user", data.user_id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteStudentMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
