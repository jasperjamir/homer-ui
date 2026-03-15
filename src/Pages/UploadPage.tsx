import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { JourneyStepper, getImageJourneySteps, getVideoJourneySteps } from "@/Shared/components/JourneyStepper";
import { MediaPreviewDialog } from "@/Shared/components/MediaPreviewDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { Checkbox } from "@/Shared/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
import { getImageGenerationsQueryOptions } from "@/Features/ImageGenerations/query-options";
import { getVideoGenerationsQueryOptions } from "@/Features/VideoGenerations/query-options";
import { getUploadPlatformsQueryOptions } from "@/Features/UploadPlatforms/query-options";
import { getPlatformTypesQueryOptions } from "@/Features/PlatformTypes/query-options";
import type { PoolAsset } from "@/Features/Upload/models";
import { getAssetsInRange, uploadSelectedAssets } from "@/Features/Upload/services";

const TIME_FILTER_OPTIONS = [
  { value: "hour", label: "Last hour", since: () => new Date(Date.now() - 60 * 60 * 1000) },
  { value: "24h", label: "Last 24 hours", since: () => new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { value: "all", label: "All assets", since: () => undefined },
] as const;

const VIDEO_PREFIX = "video:";

function useAssetsQuery(filterValue: string) {
  const isGenerationId = filterValue && !TIME_FILTER_OPTIONS.some((o) => o.value === filterValue);
  const since = useMemo(() => {
    if (isGenerationId) return undefined;
    const opt = TIME_FILTER_OPTIONS.find((o) => o.value === filterValue);
    return opt?.since();
  }, [filterValue, isGenerationId]);
  const videoGenerationId = isGenerationId && filterValue.startsWith(VIDEO_PREFIX)
    ? filterValue.slice(VIDEO_PREFIX.length)
    : undefined;
  const imageGenerationId = isGenerationId && !videoGenerationId ? filterValue : undefined;
  return useQuery({
    queryKey: ["upload-assets", filterValue, since?.toISOString()],
    queryFn: () =>
      getAssetsInRange({
        since,
        limit: 200,
        ...(videoGenerationId ? { videoGenerationId } : imageGenerationId ? { imageGenerationId } : {}),
      }),
    staleTime: 1000 * 30,
  });
}

function key(asset: PoolAsset, platformId: string): string {
  return `${asset.type}:${asset.id}:${platformId}`;
}

export default function UploadPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const generationIdFromUrl = searchParams.get("generation-id");
  const timeFromUrl = searchParams.get("time");
  const timeValue =
    timeFromUrl === "hour" || timeFromUrl === "24h" ? timeFromUrl : "all";
  const filterValue = generationIdFromUrl ?? timeValue;

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const handleFilterChange = (value: string) => {
    if (value === "all" || value === "hour" || value === "24h") {
      setSearchParams(value === "all" ? {} : { time: value });
    } else {
      setSearchParams({ "generation-id": value });
    }
  };

  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const { data: imageGenerations = [] } = useQuery(getImageGenerationsQueryOptions());
  const { data: videoGenerations = [] } = useQuery(getVideoGenerationsQueryOptions());
  const { data: assets = [], isLoading: assetsLoading } = useAssetsQuery(filterValue);
  const { data: platforms = [], isLoading: platformsLoading } = useQuery(
    getUploadPlatformsQueryOptions()
  );
  const { data: platformTypes = [] } = useQuery(getPlatformTypesQueryOptions());

  const isGenerationFilter = filterValue && !TIME_FILTER_OPTIONS.some((o) => o.value === filterValue);
  const isVideoGenerationFilter = isGenerationFilter && filterValue.startsWith(VIDEO_PREFIX);

  const toggle = (asset: PoolAsset, platformId: string) => {
    const k = key(asset, platformId);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleUpload = async () => {
    if (platformTypes.length === 0 || platforms.length === 0) {
      toast.error("Platforms or platform types not loaded");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadSelectedAssets(
        assets,
        platforms,
        platformTypes,
        checked,
      );
      const total = result.success + result.failed;
      if (result.failed === 0) {
        toast.success(
          `Finished uploading ${result.success} item${result.success === 1 ? "" : "s"} to your platforms`,
        );
      } else if (result.success > 0) {
        toast.warning(
          `Uploaded ${result.success} of ${total}; ${result.failed} failed. ${result.errors.slice(0, 2).join(" ")}`,
        );
      } else {
        toast.error(result.errors[0] ?? "Upload failed");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const imageGenId = isGenerationFilter && !isVideoGenerationFilter ? filterValue : null;
  const videoGenId = isVideoGenerationFilter ? filterValue.replace(/^video:/, "") : null;
  const uploadJourneySteps = isVideoGenerationFilter
    ? getVideoJourneySteps({ videoGenerationId: videoGenId })
    : getImageJourneySteps({ imageGenerationId: imageGenId });
  const uploadJourneyCurrentIndex = isVideoGenerationFilter ? 3 : 2;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">LAUNCH</h1>
      <p className="text-muted-foreground text-sm max-w-2xl">
        {uploadJourneySteps[uploadJourneyCurrentIndex].description}
      </p>

      <JourneyStepper steps={uploadJourneySteps} currentStepIndex={uploadJourneyCurrentIndex} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <Select value={filterValue} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
                {imageGenerations.length > 0 && (
                  <>
                    {imageGenerations.map((g) => (
                      <SelectItem key={`img-${g.id}`} value={g.id}>
                        Image: {new Date(g.createdAt).toLocaleString()}
                      </SelectItem>
                    ))}
                  </>
                )}
                {videoGenerations.length > 0 && (
                  <>
                    {videoGenerations.map((g) => (
                      <SelectItem key={`vid-${g.id}`} value={`${VIDEO_PREFIX}${g.id}`}>
                        Video: {new Date(g.createdAt).toLocaleString()}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {platformsLoading ? (
            <p className="text-muted-foreground">Loading platforms...</p>
          ) : platforms.length === 0 ? (
            <p className="text-muted-foreground">
              Add platforms in the Platforms config first (max 10).
            </p>
          ) : assetsLoading ? (
            <p className="text-muted-foreground">Loading assets...</p>
          ) : assets.length === 0 ? (
            <p className="text-muted-foreground">
              {isGenerationFilter
                ? isVideoGenerationFilter
                  ? "No videos in this generation yet."
                  : "No images in this generation yet."
                : "No assets in this range. Generate some images or videos first."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Asset</TableHead>
                    {platforms.map((p) => (
                      <TableHead key={p.id} className="text-center w-24">
                        {p.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={`${asset.type}-${asset.id}`}>
                      <TableCell className="font-medium">
                        {asset.asset_url ? (
                          <button
                            type="button"
                        onClick={() => setPreviewMedia({ url: asset.asset_url!, type: asset.type })}
                            className="flex items-center gap-2 text-left w-full text-foreground hover:text-accent-blue transition-colors"
                          >
                            {asset.type === "image" && (
                              <img
                                src={asset.asset_url}
                                alt=""
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            {asset.type === "video" && (
                              <video
                                src={asset.asset_url}
                                className="h-10 w-10 rounded object-cover"
                                muted
                                playsInline
                                preload="metadata"
                                aria-hidden
                              />
                            )}
                            <span>
                              {asset.type} #{asset.index} ({new Date(asset.created_at).toLocaleString()})
                            </span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>
                              {asset.type} #{asset.index} ({new Date(asset.created_at).toLocaleString()})
                            </span>
                          </div>
                        )}
                      </TableCell>
                      {platforms.map((p) => (
                        <TableCell key={p.id} className="text-center">
                          <Checkbox
                            checked={checked.has(key(asset, p.id))}
                            onCheckedChange={() => toggle(asset, p.id)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <MediaPreviewDialog
            open={!!previewMedia}
            onOpenChange={(open) => !open && setPreviewMedia(null)}
            media={previewMedia}
          />
          {assets.length > 0 && (
            <div className="mt-4">
              <Button
                onClick={handleUpload}
                disabled={checked.size === 0 || uploading}
              >
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
