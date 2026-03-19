import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { MediaPreviewDialog } from "@/Shared/components/MediaPreviewDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { Skeleton } from "@/Shared/components/ui/skeleton";
import { Clock3, VideoOff } from "lucide-react";
import {
  getVideoAssetStatusPollingQueryOptions,
  getVideoGenerationAssetsListQueryOptions,
  getVideoGenerationQueryOptions,
} from "@/Features/VideoGenerations/query-options";
import type { VideoGenerationPolledAsset } from "@/Features/VideoGenerations/models";
import { Badge } from "@/Shared/components/ui/badge";
import { VIDEO_MODEL_LABELS } from "@/Features/ImageGenerations/schemas";
import { PLATFORM_TYPE_LABELS } from "@/Shared/models/platform.type";
import { JourneyStepper, getVideoJourneySteps } from "@/Shared/components/JourneyStepper";
import { uploadWithVideoGenerationId } from "@/Shared/utils/routes.util";

/** Video aspect ratio: Instagram Reels and TikTok both use 9:16 */
const VIDEO_ASPECT_CLASS = "aspect-[9/16]";

function NoVideoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-muted rounded text-muted-foreground ${className ?? ""}`}
      role="img"
      aria-label="No video available"
    >
      <VideoOff className="size-12" />
      <span className="text-sm font-medium">No video available</span>
    </div>
  );
}

export default function VideoGenerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [polledAssetsById, setPolledAssetsById] = useState<
    Record<string, VideoGenerationPolledAsset>
  >({});
  const { data: generation, isLoading: genLoading } = useQuery(
    getVideoGenerationQueryOptions(id ?? "")
  );
  const {
    data: generationAssetsData,
    isLoading: assetsListLoading,
    isError: assetsListError,
  } = useQuery({
    ...getVideoGenerationAssetsListQueryOptions(id ?? ""),
    enabled: !!id && !!generation,
  });

  useEffect(() => {
    setPolledAssetsById({});
  }, [generationAssetsData?.id]);

  const mergedAssets = (generationAssetsData?.assets ?? []).map(
    (asset) => polledAssetsById[asset.id] ?? asset
  );
  const nextAssetToPoll = mergedAssets.find((asset) => {
    const status = asset.status ?? "queued";
    return status !== "success" && status !== "failed" && status !== "expired";
  });
  const {
    data: currentAssetStatus,
    isError: currentAssetStatusError,
  } = useQuery({
    ...getVideoAssetStatusPollingQueryOptions(nextAssetToPoll?.id ?? ""),
    enabled: !!nextAssetToPoll?.id,
    initialData: nextAssetToPoll,
  });
  useEffect(() => {
    if (!currentAssetStatus) return;
    setPolledAssetsById((prev) => ({
      ...prev,
      [currentAssetStatus.id]: currentAssetStatus,
    }));
  }, [
    currentAssetStatus?.id,
    currentAssetStatus?.status,
    currentAssetStatus?.assetUrl,
    currentAssetStatus?.pollingRequestId,
  ]);

  const readyCount = mergedAssets.filter((asset) => asset.status === "success").length;
  const assetsByIndex = new Map(mergedAssets.map((asset) => [asset.index, asset]));
  const assetCount = generation?.assetCount ?? 0;
  const assetSlots = Array.from({ length: assetCount }, (_, idx) => {
    const index = idx + 1;
    const asset = assetsByIndex.get(index);
    return {
      id: asset?.id ?? `slot-${index}`,
      index,
      status: asset?.status ?? "queued",
      assetUrl: asset?.assetUrl ?? null,
    };
  });
  const steps = getVideoJourneySteps();

  if (!id) return <div className="p-6">Missing generation ID</div>;
  if (genLoading || !generation) return <div className="p-6">Generating...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Validate</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and validate your generated videos.</p>
        </div>
        <JourneyStepper steps={steps} currentStepIndex={2} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="mb-0">Video links</CardTitle>
              {generation.platformType && (
                <Badge variant="secondary">
                  {PLATFORM_TYPE_LABELS[generation.platformType]}
                </Badge>
              )}
              {generation.model && generation.model in VIDEO_MODEL_LABELS && (
                <Badge variant="outline">{VIDEO_MODEL_LABELS[generation.model as keyof typeof VIDEO_MODEL_LABELS]}</Badge>
              )}
            </div>
            <span className="font-medium tabular-nums text-sm">
              {readyCount}/{generation.assetCount}
            </span>
          </div>
          <div
            className="flex gap-1"
            role="progressbar"
            aria-valuenow={readyCount}
            aria-valuemin={0}
            aria-valuemax={generation.assetCount}
            aria-label={`${readyCount} of ${generation.assetCount} assets ready`}
          >
            {Array.from({ length: generation.assetCount }, (_, i) => {
              const slot = assetSlots[i];
              const isComplete = slot?.status === "success";
              const isInProgress = slot?.status === "queued" || slot?.status === "in_progress";
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
          {assetsListLoading && !generationAssetsData ? (
            <p className="text-muted-foreground">Loading video assets...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {assetSlots.map((asset) => (
                  <div key={asset.id} className="rounded-lg border p-2 space-y-2">
                    {asset.status === "success" && asset.assetUrl?.trim() ? (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(asset.assetUrl)}
                        className={`relative w-full ${VIDEO_ASPECT_CLASS} rounded overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                      >
                        <video
                          src={asset.assetUrl}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
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
                          <NoVideoPlaceholder className="!bg-transparent" />
                        </div>
                        <span
                          className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                          aria-hidden
                        >
                          {asset.index}
                        </span>
                      </button>
                    ) : asset.status === "failed" || asset.status === "expired" ? (
                      <div className={`relative w-full ${VIDEO_ASPECT_CLASS} rounded overflow-hidden`}>
                        <Skeleton className="absolute inset-0 rounded opacity-30" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <VideoOff className="size-6" />
                          <span className="text-xs font-medium">
                            {asset.status === "failed"
                              ? `Video ${asset.index} failed`
                              : `Video ${asset.index} expired`}
                          </span>
                        </div>
                        <span
                          className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                          aria-hidden
                        >
                          {asset.index}
                        </span>
                      </div>
                    ) : asset.status === "in_progress" ? (
                      <div className={`relative w-full ${VIDEO_ASPECT_CLASS} rounded overflow-hidden`}>
                        <Skeleton className="absolute inset-0 rounded" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <div className="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                          <span className="text-xs font-medium">
                            Generating video {asset.index}…
                          </span>
                        </div>
                        <span
                          className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                          aria-hidden
                        >
                          {asset.index}
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`relative w-full ${VIDEO_ASPECT_CLASS} rounded overflow-hidden border border-dashed border-muted-foreground/30 bg-muted/20`}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Clock3 className="size-6" />
                          <span className="text-xs font-medium">
                            Queued video {asset.index}
                          </span>
                        </div>
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
              </div>
              {(assetsListError || currentAssetStatusError) && (
                <p className="mt-4 text-sm text-destructive">
                  Unable to refresh video generation status.
                </p>
              )}
              <MediaPreviewDialog
                open={!!previewUrl}
                onOpenChange={(open) => !open && setPreviewUrl(null)}
                media={previewUrl ? { url: previewUrl, type: "video" } : null}
              />
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button asChild>
          <Link to={uploadWithVideoGenerationId(id)}>Upload videos</Link>
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}
