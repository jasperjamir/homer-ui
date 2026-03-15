import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetAssetsInRangeOptions } from "@/Features/Upload/services";
import { getAssetsInRange, saveMappings, type SaveMappingsInput } from "@/Features/Upload/services";

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

export function useSaveMappingsMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveMappingsInput) => saveMappings(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upload-assets"] });
      options?.onSuccess?.();
    },
  });
}
