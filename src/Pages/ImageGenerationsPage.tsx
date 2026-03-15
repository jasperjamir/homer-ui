import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "@/Shared/components/ui/button";
import { Checkbox } from "@/Shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
import {
  getImageGenerationAssetCountsQueryOptions,
  getImageGenerationsQueryOptions,
  useDeleteImageGenerationMutation,
} from "@/Features/ImageGenerations/query-options";
import { IMAGE_MODEL_LABELS } from "@/Features/ImageGenerations/schemas";
import { Badge } from "@/Shared/components/ui/badge";
import { PLATFORM_TYPE_LABELS } from "@/Shared/models/platform.type";
import { ROUTES, imageGenerationDetail } from "@/Shared/utils/routes.util";

export default function ImageGenerationsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: generations = [], isLoading } = useQuery(getImageGenerationsQueryOptions());
  const { data: assetCounts = {} } = useQuery(
    getImageGenerationAssetCountsQueryOptions(generations.map((g) => g.id))
  );
  const deleteMutation = useDeleteImageGenerationMutation({
    onSuccess: () => {
      setSelected(new Set());
      toast.success("Generation(s) deleted");
    },
  });

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === generations.length) setSelected(new Set());
    else setSelected(new Set(generations.map((g) => g.id)));
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    try {
      for (const id of selected) {
        await deleteMutation.mutateAsync(id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Image ideations</h1>
          <p className="text-muted-foreground text-sm mt-1">Your image generations. Select one to validate or go to IDEATE to create more.</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selected.size})
            </Button>
          )}
          <Button asChild>
            <Link to={ROUTES.IMAGE_GENERATIONS_NEW}>
              <Plus className="mr-2 h-4 w-4" />
              Generate images
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={generations.length > 0 && selected.size === generations.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Generating...
                </TableCell>
              </TableRow>
            ) : generations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No image generations yet. Create one to get mock image links.
                </TableCell>
              </TableRow>
            ) : (
              generations.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="w-10">
                    <Checkbox
                      checked={selected.has(g.id)}
                      onCheckedChange={() => toggleOne(g.id)}
                      aria-label={`Select ${g.id}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-md truncate">{g.context}</TableCell>
                  <TableCell>
                    {g.model && g.model in IMAGE_MODEL_LABELS ? (
                      <Badge variant="secondary">{IMAGE_MODEL_LABELS[g.model as keyof typeof IMAGE_MODEL_LABELS]}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {g.platformType && g.platformType in PLATFORM_TYPE_LABELS ? (
                      <Badge variant="outline">{PLATFORM_TYPE_LABELS[g.platformType as keyof typeof PLATFORM_TYPE_LABELS]}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(assetCounts[g.id] ?? 0)}/{g.assetCount}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(g.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={imageGenerationDetail(g.id)}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
