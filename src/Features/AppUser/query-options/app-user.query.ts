import {
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AppUser } from "@/Shared/models";
import { getAppUser } from "@/Features/AppUser/services";

export function getAppUserQueryOptions<TData = AppUser | null, TError = Error>(
  id: string | null,
  options?: Omit<
    UseQueryOptions<AppUser | null, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    queryKey: ["app_user", id],
    queryFn: () => (id ? getAppUser(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 1000 * 60,
    ...options,
  });
}
