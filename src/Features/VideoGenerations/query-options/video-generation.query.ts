import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateVideoStoryboardRequest,
  GenerateVideoFromStoryboardRequest,
} from "@/Features/VideoGenerations/models";
import {
  createVideoStoryboard,
  deleteVideoGeneration,
  generateVideoFromStoryboard,
  getVideoAssetStatusById,
  getVideoGenerationAssetCounts,
  getVideoGenerationAssets,
  getVideoGenerationAssetsByGenerationId,
  getVideoGenerationById,
  getVideoGenerationStoryboard,
  getVideoGenerations,
  updateVideoGenerationStoryboard,
} from "@/Features/VideoGenerations/services";

export function getVideoGenerationsQueryOptions() {
  return queryOptions({
    queryKey: ["video-generations"],
    queryFn: getVideoGenerations,
    staleTime: 1000 * 30,
  });
}

export function getVideoGenerationAssetCountsQueryOptions(videoGenerationIds: string[]) {
  return queryOptions({
    queryKey: ["video-generation-asset-counts", videoGenerationIds.sort().join(",")],
    queryFn: () => getVideoGenerationAssetCounts(videoGenerationIds),
    enabled: videoGenerationIds.length > 0,
    staleTime: 1000 * 30,
  });
}

export function getVideoGenerationQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["video-generation", id],
    queryFn: () => getVideoGenerationById(id),
    enabled: !!id,
  });
}

export function getVideoGenerationStoryboardQueryOptions(videoGenerationId: string) {
  return queryOptions({
    queryKey: ["video-generation-storyboard", videoGenerationId],
    queryFn: () => getVideoGenerationStoryboard(videoGenerationId),
    enabled: !!videoGenerationId,
  });
}

/** Storyboard query with polling until a storyboard exists */
export function getVideoGenerationStoryboardWithPollingQueryOptions(
  videoGenerationId: string
) {
  return queryOptions({
    queryKey: ["video-generation-storyboard", videoGenerationId],
    queryFn: () => getVideoGenerationStoryboard(videoGenerationId),
    enabled: !!videoGenerationId,
    refetchInterval: (query) => {
      if (query.state.data != null) return false;
      return 2000; // poll every 2 seconds until storyboard exists
    },
  });
}

export function getVideoGenerationAssetsQueryOptions(videoGenerationId: string) {
  return queryOptions({
    queryKey: ["video-generation-assets", videoGenerationId],
    queryFn: () => getVideoGenerationAssets(videoGenerationId),
    enabled: !!videoGenerationId,
  });
}

/** One-shot query for stable asset IDs per generation. */
export function getVideoGenerationAssetsListQueryOptions(
  videoGenerationId: string
) {
  return queryOptions({
    queryKey: ["video-generation-assets-list", videoGenerationId],
    queryFn: () => getVideoGenerationAssetsByGenerationId(videoGenerationId),
    enabled: !!videoGenerationId,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/** Per-asset polling query; stop when asset reaches terminal status. */
export function getVideoAssetStatusPollingQueryOptions(assetId: string) {
  return queryOptions({
    queryKey: ["video-asset-status", assetId],
    queryFn: () => getVideoAssetStatusById(assetId),
    enabled: !!assetId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "success" || status === "failed" || status === "expired") return false;
      return 10000;
    },
  });
}

export function useCreateVideoGenerationMutation(options?: {
  onSuccess?: (id: string) => void;
  onError?: (error: Error) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVideoStoryboardRequest) => createVideoStoryboard(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["video-generations"] });
      qc.invalidateQueries({ queryKey: ["video-generation", data.id] });
      qc.invalidateQueries({ queryKey: ["video-generation-storyboard", data.id] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets", data.id] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets-list", data.id] });
      options?.onSuccess?.(data.id);
    },
    onError: options?.onError,
  });
}

export function useGenerateVideoFromStoryboardMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateVideoFromStoryboardRequest) =>
      generateVideoFromStoryboard(input),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["video-generation-assets", variables.videoGenerationId] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets-list", variables.videoGenerationId] });
      qc.invalidateQueries({ queryKey: ["video-asset-status"] });
      qc.invalidateQueries({ queryKey: ["video-generation-asset-counts"] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useUpdateStoryboardMutation(videoGenerationId: string, options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: Record<string, unknown>) =>
      updateVideoGenerationStoryboard(videoGenerationId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video-generation-storyboard", videoGenerationId] });
      options?.onSuccess?.();
    },
  });
}

export function useDeleteVideoGenerationMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVideoGeneration(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video-generations"] });
      qc.invalidateQueries({ queryKey: ["video-generation-asset-counts"] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets"] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets-list"] });
      qc.invalidateQueries({ queryKey: ["video-asset-status"] });
      qc.invalidateQueries({ queryKey: ["video-generation-storyboard"] });
      qc.invalidateQueries({ queryKey: ["upload-assets"] });
      options?.onSuccess?.();
    },
  });
}
