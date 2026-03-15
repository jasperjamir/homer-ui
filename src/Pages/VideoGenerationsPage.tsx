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
import { getVideoGenerationsQueryOptions } from "@/Features/VideoGenerations/query-options";
import { ROUTES, videoGenerationDetail, videoGenerationStoryboard } from "@/Shared/utils/routes.util";

export default function VideoGenerationsPage() {
  const { data: generations = [], isLoading } = useQuery(getVideoGenerationsQueryOptions());

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Video generations</h1>
        <Button asChild>
          <Link to={ROUTES.VIDEO_GENERATIONS_NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Create storyboard
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
              <TableHead className="w-[180px]">Actions</TableHead>
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
                  No video generations yet. Create a storyboard to get started.
                </TableCell>
              </TableRow>
            ) : (
              generations.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="max-w-md truncate">{g.context}</TableCell>
                  <TableCell>{g.assetCount}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(g.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={videoGenerationStoryboard(g.id)}>Storyboard</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={videoGenerationDetail(g.id)}>View</Link>
                      </Button>
                    </div>
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
