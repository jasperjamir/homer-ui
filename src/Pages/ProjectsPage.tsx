import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/Shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/Shared/components/ui/field";
import { Input } from "@/Shared/components/ui/input";
import { Textarea } from "@/Shared/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
import type { Project } from "@/Features/Projects/models";
import {
  getProjectsQueryOptions,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/Features/Projects/query-options";
import { projectSchema, type ProjectFormData } from "@/Features/Projects/schemas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Shared/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery(getProjectsQueryOptions());
  const [editing, setEditing] = useState<Project | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const createMutation = useCreateProjectMutation({
    onSuccess: () => {
      toast.success("Project created");
      setCreateOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useUpdateProjectMutation({
    onSuccess: () => {
      toast.success("Project updated");
      setEditing(null);
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useDeleteProjectMutation({
    onSuccess: () => {
      toast.success("Project deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", prompt_text: "", logo_url: "" },
  });

  const openEdit = (p: Project) => {
    setEditing(p);
    form.reset({
      name: p.name,
      prompt_text: p.prompt_text ?? "",
      logo_url: p.logo_url ?? "",
    });
  };
  const openCreate = () => {
    setCreateOpen(true);
    form.reset({ name: "", prompt_text: "", logo_url: "" });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Project context and prompts for Ideate.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add project
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead className="w-[100px]">Logo</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No projects yet. Add one to use in generations.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={p.prompt_text ?? undefined}>
                    {p.prompt_text || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.logo_url ? (
                      <img
                        src={p.logo_url}
                        alt={`${p.name} logo`}
                        className="h-9 w-9 rounded-md border object-cover"
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(p)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add project</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((data) => {
              createMutation.mutate({
                name: data.name,
                prompt_text: data.prompt_text?.trim() || null,
                logo_url: data.logo_url?.trim() || null,
              });
            })}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...form.register("name")} placeholder="e.g. Project A" />
              <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
            </Field>
            <Field>
              <FieldLabel>Prompt text</FieldLabel>
              <Textarea {...form.register("prompt_text")} rows={3} className="resize-none max-h-48 overflow-y-auto" placeholder="Optional project-level prompt" />
              <FieldError errors={form.formState.errors.prompt_text ? [form.formState.errors.prompt_text] : undefined} />
            </Field>
            <Field>
              <FieldLabel>Logo URL</FieldLabel>
              <Input
                {...form.register("logo_url")}
                type="url"
                inputMode="url"
                placeholder="https://..."
              />
              <FieldError errors={form.formState.errors.logo_url ? [form.formState.errors.logo_url] : undefined} />
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={form.handleSubmit((data) => {
                updateMutation.mutate({
                  id: editing.id,
                  updates: {
                    name: data.name,
                    prompt_text: data.prompt_text?.trim() || null,
                    logo_url: data.logo_url?.trim() || null,
                  },
                });
              })}
              className="space-y-4"
            >
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...form.register("name")} />
                <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
              </Field>
              <Field>
                <FieldLabel>Prompt text</FieldLabel>
                <Textarea
                  {...form.register("prompt_text")}
                  rows={3}
                  className="resize-none max-h-48 overflow-y-auto"
                  placeholder="Optional project-level prompt"
                />
                <FieldError
                  errors={form.formState.errors.prompt_text ? [form.formState.errors.prompt_text] : undefined}
                />
              </Field>
              <Field>
                <FieldLabel>Logo URL</FieldLabel>
                <Input
                  {...form.register("logo_url")}
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                />
                <FieldError errors={form.formState.errors.logo_url ? [form.formState.errors.logo_url] : undefined} />
              </Field>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Generations using this project will keep it as reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
