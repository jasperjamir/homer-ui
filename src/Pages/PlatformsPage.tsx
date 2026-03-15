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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
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
import type { UploadPlatform } from "@/Features/UploadPlatforms/models";
import { getPlatformTypesQueryOptions } from "@/Features/PlatformTypes/query-options";
import {
  getUploadPlatformCountQueryOptions,
  getUploadPlatformsQueryOptions,
  useCreateUploadPlatformMutation,
  useDeleteUploadPlatformMutation,
  useUpdateUploadPlatformMutation,
} from "@/Features/UploadPlatforms/query-options";
import {
  uploadPlatformSchema,
  type UploadPlatformFormData,
} from "@/Features/UploadPlatforms/schemas";

const MAX_PLATFORMS = 10;

export default function PlatformsPage() {
  const { data: platforms = [], isLoading } = useQuery(getUploadPlatformsQueryOptions());
  const { data: platformTypes = [] } = useQuery(getPlatformTypesQueryOptions());
  const { data: count = 0 } = useQuery(getUploadPlatformCountQueryOptions());
  const [editing, setEditing] = useState<UploadPlatform | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UploadPlatform | null>(null);

  const defaultPlatformTypeId = platformTypes[0]?.id ?? "";

  const form = useForm<UploadPlatformFormData>({
    resolver: zodResolver(uploadPlatformSchema),
    defaultValues: { name: "", platform_type_id: "" },
  });

  const createMutation = useCreateUploadPlatformMutation({
    onSuccess: () => {
      toast.success("Platform added");
      setCreateOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useUpdateUploadPlatformMutation({
    onSuccess: () => {
      toast.success("Platform updated");
      setEditing(null);
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useDeleteUploadPlatformMutation({
    onSuccess: () => {
      toast.success("Platform deleted");
      setDeleteTarget(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const canAdd = count < MAX_PLATFORMS && platformTypes.length > 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Upload platforms</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure platforms (e.g. Instagram, TikTok) for the Launch step.</p>
        </div>
        <Button onClick={() => { setCreateOpen(true); form.reset({ name: "", platform_type_id: defaultPlatformTypeId }); }} disabled={!canAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add platform {count >= MAX_PLATFORMS ? `(max ${MAX_PLATFORMS})` : ""}
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
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
            ) : platforms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No platforms yet. Add up to {MAX_PLATFORMS} for the Upload step.
                </TableCell>
              </TableRow>
            ) : (
              platforms.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{platformTypes.find((t) => t.id === p.platform_type_id)?.name ?? p.platform_type_id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(p); form.reset({ name: p.name, platform_type_id: p.platform_type_id }); }}
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
            <DialogTitle>Add platform</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((data) =>
              createMutation.mutate({ name: data.name, platform_type_id: data.platform_type_id })
            )}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...form.register("name")} placeholder="e.g. IG Main" />
              <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
            </Field>
            <Field>
              <FieldLabel>Platform type</FieldLabel>
              <Select
                value={form.watch("platform_type_id")}
                onValueChange={(v) => form.setValue("platform_type_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {platformTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Edit platform</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={form.handleSubmit((data) =>
                updateMutation.mutate({
                  id: editing.id,
                  updates: { name: data.name, platform_type_id: data.platform_type_id },
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
                <FieldLabel>Platform type</FieldLabel>
                <Select
                  value={form.watch("platform_type_id")}
                  onValueChange={(v) => form.setValue("platform_type_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <AlertDialogTitle>Delete platform?</AlertDialogTitle>
            <AlertDialogDescription>This will remove it from any upload mappings.</AlertDialogDescription>
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
