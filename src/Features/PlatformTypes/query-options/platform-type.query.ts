import { queryOptions } from "@tanstack/react-query";
import { getPlatformTypes } from "@/Features/PlatformTypes/services";

export function getPlatformTypesQueryOptions() {
  return queryOptions({
    queryKey: ["platform-types"],
    queryFn: getPlatformTypes,
    staleTime: 1000 * 60 * 5, // 5 min - reference data
  });
}
