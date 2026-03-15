import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateImageGenerationRequest,
  ImageGenerationAsset,
} from "@/Features/ImageGenerations/models";
import {
  createImageGeneration,
  deleteImageGeneration,
  getImageGenerationAssetCounts,
  getImageGenerationAssets,
  getImageGenerationById,
  getImageGenerations,
} from "@/Features/ImageGenerations/services";

export function getImageGenerationsQueryOptions() {
  return queryOptions({
    queryKey: ["image-generations"],
    queryFn: getImageGenerations,
    staleTime: 1000 * 30,
  });
}

export function getImageGenerationAssetCountsQueryOptions(imageGenerationIds: string[]) {
  return queryOptions({
    queryKey: ["image-generation-asset-counts", imageGenerationIds.sort().join(",")],
    queryFn: () => getImageGenerationAssetCounts(imageGenerationIds),
    enabled: imageGenerationIds.length > 0,
    staleTime: 1000 * 30,
  });
}

export function getImageGenerationQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["image-generation", id],
    queryFn: () => getImageGenerationById(id),
    enabled: !!id,
  });
}

export function getImageGenerationAssetsQueryOptions(imageGenerationId: string) {
  return queryOptions({
    queryKey: ["image-generation-assets", imageGenerationId],
    queryFn: () => getImageGenerationAssets(imageGenerationId),
    enabled: !!imageGenerationId,
  });
}

/** Assets query with polling while asset count < expected assetCount */
export function getImageGenerationAssetsWithPollingQueryOptions(
  imageGenerationId: string,
  expectedAssetCount: number
) {
  return queryOptions({
    queryKey: ["image-generation-assets", imageGenerationId],
    queryFn: () => getImageGenerationAssets(imageGenerationId),
    enabled: !!imageGenerationId && expectedAssetCount > 0,
    refetchInterval: (query) => {
      const assets = (query.state.data as ImageGenerationAsset[] | undefined) ?? [];
      if (assets.length >= expectedAssetCount) return false;
      return 2000; // poll every 2 seconds
    },
  });
}

export function useCreateImageGenerationMutation(options?: {
  onSuccess?: (id: string) => void;
  onError?: (error: Error) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateImageGenerationRequest) => createImageGeneration(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["image-generations"] });
      qc.invalidateQueries({ queryKey: ["image-generation", data.id] });
      qc.invalidateQueries({ queryKey: ["image-generation-assets", data.id] });
      qc.invalidateQueries({ queryKey: ["image-generation-asset-counts"] });
      options?.onSuccess?.(data.id);
    },
    onError: options?.onError,
  });
}

export function useDeleteImageGenerationMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteImageGeneration(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["image-generations"] });
      options?.onSuccess?.();
    },
  });
}
