import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImageGenerationInsert } from "@/Features/ImageGenerations/models";
import {
  createImageGenerationWithMockLinks,
  deleteImageGeneration,
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

export function useCreateImageGenerationMutation(options?: {
  onSuccess?: (id: string) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ImageGenerationInsert) => createImageGenerationWithMockLinks(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["image-generations"] });
      qc.invalidateQueries({ queryKey: ["image-generation", data.id] });
      qc.invalidateQueries({ queryKey: ["image-generation-assets", data.id] });
      options?.onSuccess?.(data.id);
    },
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
