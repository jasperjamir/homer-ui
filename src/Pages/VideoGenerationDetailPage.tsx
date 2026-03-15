import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  getVideoGenerationQueryOptions,
  getVideoGenerationAssetsQueryOptions,
  useGenerateMockVideoLinksMutation,
} from "@/Features/VideoGenerations/query-options";
import { ROUTES, videoGenerationDetail, videoGenerationStoryboard } from "@/Shared/utils/routes.util";
import { toast } from "sonner";

export default function VideoGenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: generation, isLoading: genLoading } = useQuery(
    getVideoGenerationQueryOptions(id ?? "")
  );
  const { data: assets = [], isLoading: assetsLoading } = useQuery(
    getVideoGenerationAssetsQueryOptions(id ?? "")
  );

  const generateLinksMutation = useGenerateMockVideoLinksMutation(id ?? "", {
    onSuccess: () => toast.success("Video links generated (mock)"),
    onError: (e) => toast.error(e.message),
  });

  const hasAnyLinks = assets.some((a) => a.asset_url);

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={videoGenerationDetail(id)}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Video generation</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Context</CardTitle>
          <p className="text-muted-foreground text-sm">{generation.context}</p>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Generate video from storyboard</CardTitle>
          <p className="text-muted-foreground text-sm">
            Generate mock video links from the storyboard. Replace with real API later.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => generateLinksMutation.mutate()}
              disabled={generateLinksMutation.isPending || hasAnyLinks}
            >
              {generateLinksMutation.isPending
                ? "Generating…"
                : hasAnyLinks
                  ? "Already generated"
                  : "Generate video links (mock)"}
            </Button>
            <Button variant="outline" asChild>
              <Link to={videoGenerationStoryboard(id)}>Edit storyboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Video links ({assets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <p className="text-muted-foreground">Loading assets...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-lg border p-2 space-y-2">
                  {asset.asset_url ? (
                    <video
                      src={asset.asset_url}
                      controls
                      className="w-full aspect-video object-cover rounded"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                      Pending
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">#{asset.index}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Button asChild>
        <Link to={ROUTES.UPLOAD}>Go to Upload (map to platforms)</Link>
      </Button>
    </div>
  );
}
