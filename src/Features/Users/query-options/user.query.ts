import {
  queryOptions,
  type UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { User, UserCreateInput, UserUpdate } from "@/Features/Users/models";
import {
  createUserWithAuth,
  deleteUser,
  getUserByAuthUserId,
  getUserById,
  getUsers,
  updateUser,
} from "@/Features/Users/services";

type UserFilters = {
  search?: string;
  role?: string;
};

export function getUsersQueryOptions<TData = User[], TError = Error>(
  filters?: UserFilters,
  options?: Omit<UseQueryOptions<User[], TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  });
}

export function getUserQueryOptions<TData = User, TError = Error>(
  id: string,
  options?: Omit<UseQueryOptions<User, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    ...options,
  });
}

export function getUserByAuthUserIdQueryOptions<TData = User | null, TError = Error>(
  auth_user_id: string,
  options?: Omit<UseQueryOptions<User | null, TError, TData>, "queryKey" | "queryFn">,
) {
  return queryOptions({
    queryKey: ["user", "auth_user_id", auth_user_id],
    queryFn: () => getUserByAuthUserId(auth_user_id),
    enabled: !!auth_user_id,
    ...options,
  });
}

type UserMutationOptions = {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
};

export function useCreateUserMutation(options?: UserMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserCreateInput) => createUserWithAuth(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["educators"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useUpdateUserMutation(options?: UserMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UserUpdate }) => updateUser(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["user", "auth_user_id", data.id],
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useDeleteUserMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
