import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectInsert, ProjectUpdate } from "@/Features/Projects/models";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "@/Features/Projects/services";

export function getProjectsQueryOptions() {
  return queryOptions({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 1000 * 60,
  });
}

export function getProjectQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
}

export function useCreateProjectMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInsert) => createProject(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateProjectMutation(options?: { onSuccess?: (data: Project) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProjectUpdate }) =>
      updateProject(id, updates),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["project", data.id] });
      options?.onSuccess?.(data);
    },
  });
}

export function useDeleteProjectMutation(options?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      options?.onSuccess?.();
    },
  });
}
