import type { GetAssetsInRangeOptions } from "@/Features/Upload/services";
import { getAssetsInRange } from "@/Features/Upload/services";

export function getAssetsInRangeQueryKey(options?: GetAssetsInRangeOptions) {
  return ["upload-assets", options?.since?.toISOString(), options?.limit] as const;
}

export function useAssetsInRangeQuery(options?: GetAssetsInRangeOptions) {
  const since = options?.since?.toISOString();
  const limit = options?.limit ?? 500;
  return {
    queryKey: getAssetsInRangeQueryKey(options),
    queryFn: () => getAssetsInRange(options),
    staleTime: 1000 * 30,
    enabled: true,
  } as const;
}
