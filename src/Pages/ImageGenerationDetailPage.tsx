import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getImageGenerationQueryOptions, getImageGenerationAssetsQueryOptions } from "@/Features/ImageGenerations/query-options";
import { ROUTES, imageGenerationDetail } from "@/Shared/utils/routes.util";

export default function ImageGenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: generation, isLoading: genLoading } = useQuery(
    getImageGenerationQueryOptions(id ?? "")
  );
  const { data: assets = [], isLoading: assetsLoading } = useQuery(
    getImageGenerationAssetsQueryOptions(id ?? "")
  );

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={ROUTES.IMAGE_GENERATIONS}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Image generation</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Context</CardTitle>
          <p className="text-muted-foreground text-sm">{generation.context}</p>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Image links ({assets.length})</CardTitle>
          <p className="text-muted-foreground text-sm">
            Mock links for MVP. Use the Upload page to map these to platforms.
          </p>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <p className="text-muted-foreground">Loading assets...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-lg border p-2 space-y-2">
                  {asset.assetUrl ? (
                    <img
                      src={asset.assetUrl}
                      alt={`Asset ${asset.index}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                      No link
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground truncate" title={asset.assetUrl ?? ""}>
                    #{asset.index}
                  </p>
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
