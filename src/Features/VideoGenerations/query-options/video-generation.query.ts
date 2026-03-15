import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VideoGenerationInsert } from "@/Features/VideoGenerations/models";
import {
  createVideoGenerationWithMockStoryboard,
  deleteVideoGeneration,
  generateMockVideoLinks,
  getVideoGenerationAssets,
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

export function getVideoGenerationAssetsQueryOptions(videoGenerationId: string) {
  return queryOptions({
    queryKey: ["video-generation-assets", videoGenerationId],
    queryFn: () => getVideoGenerationAssets(videoGenerationId),
    enabled: !!videoGenerationId,
  });
}

export function useCreateVideoGenerationMutation(options?: {
  onSuccess?: (id: string) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: VideoGenerationInsert) => createVideoGenerationWithMockStoryboard(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["video-generations"] });
      qc.invalidateQueries({ queryKey: ["video-generation", data.id] });
      qc.invalidateQueries({ queryKey: ["video-generation-storyboard", data.id] });
      qc.invalidateQueries({ queryKey: ["video-generation-assets", data.id] });
      options?.onSuccess?.(data.id);
    },
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

export function useGenerateMockVideoLinksMutation(videoGenerationId: string, options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => generateMockVideoLinks(videoGenerationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video-generation-assets", videoGenerationId] });
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
      options?.onSuccess?.();
    },
  });
}
