import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UploadPlatform,
  UploadPlatformInsert,
  UploadPlatformUpdate,
} from "@/Features/UploadPlatforms/models";
import {
  createUploadPlatform,
  deleteUploadPlatform,
  getUploadPlatformById,
  getUploadPlatformCount,
  getUploadPlatforms,
  updateUploadPlatform,
} from "@/Features/UploadPlatforms/services";

export function getUploadPlatformsQueryOptions() {
  return queryOptions({
    queryKey: ["upload-platforms"],
    queryFn: getUploadPlatforms,
    staleTime: 1000 * 60,
  });
}

export function getUploadPlatformQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["upload-platform", id],
    queryFn: () => getUploadPlatformById(id),
    enabled: !!id,
  });
}

export function getUploadPlatformCountQueryOptions() {
  return queryOptions({
    queryKey: ["upload-platforms", "count"],
    queryFn: getUploadPlatformCount,
  });
}

export function useCreateUploadPlatformMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UploadPlatformInsert) => createUploadPlatform(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upload-platforms"] });
      qc.invalidateQueries({ queryKey: ["upload-platforms", "count"] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateUploadPlatformMutation(options?: {
  onSuccess?: (data: UploadPlatform) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UploadPlatformUpdate }) =>
      updateUploadPlatform(id, updates),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["upload-platforms"] });
      qc.invalidateQueries({ queryKey: ["upload-platform", data.id] });
      options?.onSuccess?.(data);
    },
  });
}

export function useDeleteUploadPlatformMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUploadPlatform(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["upload-platforms"] });
      qc.invalidateQueries({ queryKey: ["upload-platforms", "count"] });
      options?.onSuccess?.();
    },
  });
}
