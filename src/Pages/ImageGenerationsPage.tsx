import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/Shared/components/ui/button";
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
} from "@/Features/ImageGenerations/query-options";
import { ROUTES, imageGenerationDetail } from "@/Shared/utils/routes.util";

export default function ImageGenerationsPage() {
  const { data: generations = [], isLoading } = useQuery(getImageGenerationsQueryOptions());
  const { data: assetCounts = {} } = useQuery(
    getImageGenerationAssetCountsQueryOptions(generations.map((g) => g.id))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Image generations</h1>
        <Button asChild>
          <Link to={ROUTES.IMAGE_GENERATIONS_NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Generate image links
          </Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Context</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : generations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No image generations yet. Create one to get mock image links.
                </TableCell>
              </TableRow>
            ) : (
              generations.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="max-w-md truncate">{g.context}</TableCell>
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
