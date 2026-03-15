import { queryOptions } from "@tanstack/react-query";
import { getUserProfile } from "@/Features/Auth/services";

export const getProfileQueryOptions = queryOptions({
  queryKey: ["profile"],
  queryFn: () => getUserProfile(),
  staleTime: 1000 * 60 * 1,
  retry: 1,
});
