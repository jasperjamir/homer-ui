import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { getAccountsQueryOptions } from "@/Features/Accounts/query-options";
import { getImageGenerationsQueryOptions } from "@/Features/ImageGenerations/query-options";
import type { PoolAsset } from "@/Features/Upload/models";
import { getAssetsInRange, uploadSelectedAssets } from "@/Features/Upload/services";
import { getVideoGenerationsQueryOptions } from "@/Features/VideoGenerations/query-options";
import {
  getImageJourneySteps,
  getVideoJourneySteps,
  JourneyStepper,
} from "@/Shared/components/JourneyStepper";
import { MediaPreviewDialog } from "@/Shared/components/MediaPreviewDialog";
import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Checkbox } from "@/Shared/components/ui/checkbox";
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
  const videoGenerationId =
    isGenerationId && filterValue.startsWith(VIDEO_PREFIX)
      ? filterValue.slice(VIDEO_PREFIX.length)
      : undefined;
  const imageGenerationId = isGenerationId && !videoGenerationId ? filterValue : undefined;
  return useQuery({
    queryKey: ["upload-assets", filterValue, since?.toISOString()],
    queryFn: () =>
      getAssetsInRange({
        since,
        limit: 200,
        ...(videoGenerationId
          ? { videoGenerationId }
          : imageGenerationId
            ? { imageGenerationId }
            : {}),
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
  const timeValue = timeFromUrl === "hour" || timeFromUrl === "24h" ? timeFromUrl : "all";
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
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: "image" | "video" } | null>(
    null,
  );
  const { data: imageGenerations = [] } = useQuery(getImageGenerationsQueryOptions());
  const { data: videoGenerations = [] } = useQuery(getVideoGenerationsQueryOptions());
  const { data: assets = [], isLoading: assetsLoading } = useAssetsQuery(filterValue);
  const { data: connectedAccounts = [], isLoading: accountsLoading } = useQuery(
    getAccountsQueryOptions(),
  );

  const formatConnectedPlatform = (platform: string): string => {
    const map: Record<string, string> = {
      tiktok: "TikTok",
      instagram: "Instagram",
    };
    return map[platform] ?? platform;
  };

  const getAccountColumnLabel = (a: { platform: string; username: string }) => {
    const handle = a.username?.trim().replace(/^@/, "");
    if (handle) return handle;
    return formatConnectedPlatform(a.platform);
  };

  const isGenerationFilter =
    filterValue && !TIME_FILTER_OPTIONS.some((o) => o.value === filterValue);
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
    if (connectedAccounts.length === 0) {
      toast.error("No connected accounts loaded");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadSelectedAssets(assets, connectedAccounts, checked);
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

  const uploadJourneySteps = isVideoGenerationFilter
    ? getVideoJourneySteps()
    : getImageJourneySteps();
  const uploadJourneyCurrentIndex = isVideoGenerationFilter ? 3 : 2;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Launch</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
            {uploadJourneySteps[uploadJourneyCurrentIndex].description}
          </p>
        </div>
        <JourneyStepper steps={uploadJourneySteps} currentStepIndex={uploadJourneyCurrentIndex} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center justify-start gap-4">
                <CardTitle className="mb-0">Select assets to publish</CardTitle>
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
                    {imageGenerations.length > 0 &&
                      imageGenerations.map((g) => (
                        <SelectItem key={`img-${g.id}`} value={g.id}>
                          Image: {new Date(g.createdAt).toLocaleString()}
                        </SelectItem>
                      ))}
                    {videoGenerations.length > 0 &&
                      videoGenerations.map((g) => (
                        <SelectItem key={`vid-${g.id}`} value={`${VIDEO_PREFIX}${g.id}`}>
                          Video: {new Date(g.createdAt).toLocaleString()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <p className="text-muted-foreground">Loading connected accounts...</p>
              ) : connectedAccounts.length === 0 ? (
                <p className="text-muted-foreground">
                  Connect accounts in the Platforms config first.
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
                        {connectedAccounts.map((a) => (
                          <TableHead key={a.id} className="w-24 text-center">
                            {a.username
                              ? getAccountColumnLabel(a)
                              : formatConnectedPlatform(a.platform)}
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
                                onClick={() =>
                                  asset.asset_url &&
                                  setPreviewMedia({ url: asset.asset_url, type: asset.type })
                                }
                                className="flex w-full items-center gap-2 text-left text-foreground transition-colors hover:text-accent-blue"
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
                                  {asset.type} #{asset.index} (
                                  {new Date(asset.created_at).toLocaleString()})
                                </span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span>
                                  {asset.type} #{asset.index} (
                                  {new Date(asset.created_at).toLocaleString()})
                                </span>
                              </div>
                            )}
                          </TableCell>
                          {connectedAccounts.map((a) => (
                            <TableCell key={a.id} className="text-center">
                              <Checkbox
                                checked={checked.has(key(asset, a.id))}
                                onCheckedChange={() => toggle(asset, a.id)}
                                aria-label={`Select ${asset.type} #${asset.index} for ${formatConnectedPlatform(a.platform)}`}
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
                    disabled={checked.size === 0 || uploading || connectedAccounts.length === 0}
                  >
                    {uploading ? "Uploading…" : "Upload"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
