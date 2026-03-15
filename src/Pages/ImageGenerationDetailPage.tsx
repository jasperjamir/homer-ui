import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { MediaPreviewDialog } from "@/Shared/components/MediaPreviewDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { Skeleton } from "@/Shared/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import {
  getImageGenerationAssetsWithPollingQueryOptions,
  getImageGenerationQueryOptions,
} from "@/Features/ImageGenerations/query-options";
import { Badge } from "@/Shared/components/ui/badge";
import { IMAGE_MODEL_LABELS } from "@/Features/ImageGenerations/schemas";
import { PlatformType, PLATFORM_TYPE_LABELS } from "@/Shared/models/platform.type";
import { JourneyStepper, getImageJourneySteps } from "@/Shared/components/JourneyStepper";
import { uploadWithGenerationId } from "@/Shared/utils/routes.util";

/** Aspect ratio classes: Instagram 4:5, TikTok 9:16 */
function getAspectClass(platformType: PlatformType | null): string {
  return platformType === PlatformType.TIKTOK ? "aspect-[9/16]" : "aspect-[4/5]";
}

function NoImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-muted rounded text-muted-foreground ${className ?? ""}`}
      role="img"
      aria-label="No image available"
    >
      <ImageOff className="size-12" />
      <span className="text-sm font-medium">No image available</span>
    </div>
  );
}

export default function ImageGenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: generation, isLoading: genLoading } = useQuery(
    getImageGenerationQueryOptions(id ?? "")
  );
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    ...getImageGenerationAssetsWithPollingQueryOptions(
      id ?? "",
      generation?.assetCount ?? 0
    ),
    enabled: !!id && !!generation,
  });

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Generating...</div>;

  const aspectClass = getAspectClass(generation.platformType);
  const steps = getImageJourneySteps();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Validate</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and validate your generated images.</p>
        </div>
        <JourneyStepper steps={steps} currentStepIndex={1} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="mb-0">Image links</CardTitle>
              {generation.platformType && (
                <Badge variant="secondary">
                  {PLATFORM_TYPE_LABELS[generation.platformType]}
                </Badge>
              )}
              {generation.model && generation.model in IMAGE_MODEL_LABELS && (
                <Badge variant="outline">{IMAGE_MODEL_LABELS[generation.model as keyof typeof IMAGE_MODEL_LABELS]}</Badge>
              )}
            </div>
            <span className="font-medium tabular-nums text-sm">
              {assets.length}/{generation.assetCount}
            </span>
          </div>
          <div
            className="flex gap-1"
            role="progressbar"
            aria-valuenow={assets.length}
            aria-valuemin={0}
            aria-valuemax={generation.assetCount}
            aria-label={`${assets.length} of ${generation.assetCount} assets ready`}
          >
            {Array.from({ length: generation.assetCount }, (_, i) => {
              const isComplete = i < assets.length;
              const isInProgress =
                i === assets.length && assets.length < generation.assetCount;
              return (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    isComplete
                      ? "bg-primary/50"
                      : isInProgress
                        ? "animate-pulse bg-primary/35"
                        : "bg-primary/15"
                  }`}
                />
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <p className="text-muted-foreground">Generating assets...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="rounded-lg border p-2 space-y-2">
                    {asset.assetUrl?.trim() ? (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(asset.assetUrl)}
                        className={`relative w-full ${aspectClass} rounded overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                      >
                        <img
                          src={asset.assetUrl}
                          alt={`Image ${asset.index}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div
                          className="absolute inset-0 hidden flex-col items-center justify-center bg-muted"
                          style={{ display: "none" }}
                        >
                          <NoImagePlaceholder className="!bg-transparent" />
                        </div>
                        <span
                          className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                          aria-hidden
                        >
                          {asset.index}
                        </span>
                      </button>
                    ) : (
                      <div className={`relative w-full ${aspectClass} rounded overflow-hidden`}>
                        <NoImagePlaceholder className={`w-full ${aspectClass}`} />
                        <span
                          className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                          aria-hidden
                        >
                          {asset.index}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {assets.length < generation.assetCount && (
                  <div className="rounded-lg border border-dashed border-muted-foreground/30 p-2">
                    <div className={`relative w-full ${aspectClass} rounded overflow-hidden`}>
                      <Skeleton className="absolute inset-0 rounded" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                        <span className="text-xs font-medium">
                          Generating image {assets.length + 1}…
                        </span>
                      </div>
                      <span
                        className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                        aria-hidden
                      >
                        {assets.length + 1}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <MediaPreviewDialog
                open={!!previewUrl}
                onOpenChange={(open) => !open && setPreviewUrl(null)}
                media={previewUrl ? { url: previewUrl, type: "image" } : null}
                imageAspectClass={aspectClass}
              />
            </>
          )}
        </CardContent>
      </Card>
      <Button asChild>
        <Link to={uploadWithGenerationId(id)}>Upload images</Link>
      </Button>
        </div>
      </div>
    </div>
  );
}
