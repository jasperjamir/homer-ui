import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import type { MarketingPrompt } from "@/Features/MarketingPrompts/models";
import {
  getMarketingPromptsQueryOptions,
  useCreateMarketingPromptMutation,
  useDeleteMarketingPromptMutation,
  useUpdateMarketingPromptMutation,
} from "@/Features/MarketingPrompts/query-options";
import {
  marketingPromptSchema,
  type MarketingPromptFormData,
} from "@/Features/MarketingPrompts/schemas";

export default function MarketingPromptsPage() {
  const { data: prompts = [], isLoading } = useQuery(getMarketingPromptsQueryOptions());
  const [editing, setEditing] = useState<MarketingPrompt | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MarketingPrompt | null>(null);

  const form = useForm<MarketingPromptFormData>({
    resolver: zodResolver(marketingPromptSchema),
    defaultValues: { name: "", prompt_text: "" },
  });

  const createMutation = useCreateMarketingPromptMutation({
    onSuccess: () => {
      toast.success("Marketing prompt created");
      setCreateOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useUpdateMarketingPromptMutation({
    onSuccess: () => {
      toast.success("Marketing prompt updated");
      setEditing(null);
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useDeleteMarketingPromptMutation({
    onSuccess: () => {
      toast.success("Marketing prompt deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Marketing prompts</h1>
        <Button onClick={() => { setCreateOpen(true); form.reset({ name: "", prompt_text: "" }); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add marketing prompt
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Prompt text</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : prompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No marketing prompts yet.
                </TableCell>
              </TableRow>
            ) : (
              prompts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{p.prompt_text ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(p); form.reset({ name: p.name, prompt_text: p.prompt_text ?? "" }); }}
                      >
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
            <DialogTitle>Add marketing prompt</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((data) =>
              createMutation.mutate({ name: data.name, prompt_text: data.prompt_text ?? null })
            )}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...form.register("name")} placeholder="e.g. Prompt A" />
              <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
            </Field>
            <Field>
              <FieldLabel>Prompt text (optional)</FieldLabel>
              <Textarea {...form.register("prompt_text")} rows={3} className="resize-none max-h-48 overflow-y-auto" />
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
            <DialogTitle>Edit marketing prompt</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={form.handleSubmit((data) =>
                updateMutation.mutate({
                  id: editing.id,
                  updates: { name: data.name, prompt_text: data.prompt_text ?? null },
                })
              )}
              className="space-y-4"
            >
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...form.register("name")} />
                <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
              </Field>
              <Field>
                <FieldLabel>Prompt text (optional)</FieldLabel>
                <Textarea {...form.register("prompt_text")} rows={3} className="resize-none max-h-48 overflow-y-auto" />
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
            <AlertDialogTitle>Delete marketing prompt?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
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
