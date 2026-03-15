import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  MarketingPrompt,
  MarketingPromptInsert,
  MarketingPromptUpdate,
} from "@/Features/MarketingPrompts/models";
import {
  createMarketingPrompt,
  deleteMarketingPrompt,
  getMarketingPromptById,
  getMarketingPrompts,
  updateMarketingPrompt,
} from "@/Features/MarketingPrompts/services";

export function getMarketingPromptsQueryOptions() {
  return queryOptions({
    queryKey: ["marketing-prompts"],
    queryFn: getMarketingPrompts,
    staleTime: 1000 * 60,
  });
}

export function getMarketingPromptQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["marketing-prompt", id],
    queryFn: () => getMarketingPromptById(id),
    enabled: !!id,
  });
}

export function useCreateMarketingPromptMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MarketingPromptInsert) => createMarketingPrompt(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["marketing-prompts"] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateMarketingPromptMutation(options?: {
  onSuccess?: (data: MarketingPrompt) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MarketingPromptUpdate }) =>
      updateMarketingPrompt(id, updates),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["marketing-prompts"] });
      qc.invalidateQueries({ queryKey: ["marketing-prompt", data.id] });
      options?.onSuccess?.(data);
    },
  });
}

export function useDeleteMarketingPromptMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMarketingPrompt(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["marketing-prompts"] });
      options?.onSuccess?.();
    },
  });
}
