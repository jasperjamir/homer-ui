import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { getUploadPlatformsQueryOptions } from "@/Features/UploadPlatforms/query-options";
import { useSaveMappingsMutation } from "@/Features/Upload/query-options";
import type { PoolAsset } from "@/Features/Upload/models";
import { useQuery } from "@tanstack/react-query";
import { getAssetsInRange } from "@/Features/Upload/services";

const FILTER_OPTIONS = [
  { value: "hour", label: "Last hour", since: () => new Date(Date.now() - 60 * 60 * 1000) },
  { value: "24h", label: "Last 24 hours", since: () => new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { value: "all", label: "All assets", since: () => undefined },
] as const;

function useAssetsQuery(filter: "hour" | "24h" | "all") {
  const since = useMemo(() => {
    const opt = FILTER_OPTIONS.find((o) => o.value === filter);
    return opt?.since();
  }, [filter]);
  return useQuery({
    queryKey: ["upload-assets", filter, since?.toISOString()],
    queryFn: () => getAssetsInRange({ since, limit: 200 }),
    staleTime: 1000 * 30,
  });
}

function key(asset: PoolAsset, platformId: string): string {
  return `${asset.type}:${asset.id}:${platformId}`;
}

export default function UploadPage() {
  const [filter, setFilter] = useState<"hour" | "24h" | "all">("all");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const { data: assets = [], isLoading: assetsLoading } = useAssetsQuery(filter);
  const { data: platforms = [], isLoading: platformsLoading } = useQuery(
    getUploadPlatformsQueryOptions()
  );
  const saveMutation = useSaveMappingsMutation({
    onSuccess: () => {
      toast.success("Mappings saved");
    },
    onError: (e) => toast.error(e.message),
  });

  const toggle = (asset: PoolAsset, platformId: string) => {
    const k = key(asset, platformId);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleSave = () => {
    const image: Array<{ image_generation_asset_id: string; upload_platform_id: string }> = [];
    const video: Array<{ video_generation_asset_id: string; upload_platform_id: string }> = [];
    checked.forEach((k) => {
      const [type, assetId, platformId] = k.split(":");
      if (type === "image") image.push({ image_generation_asset_id: assetId, upload_platform_id: platformId });
      if (type === "video") video.push({ video_generation_asset_id: assetId, upload_platform_id: platformId });
    });
    saveMutation.mutate({ image, video });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Upload assets</h1>
      <p className="text-muted-foreground text-sm">
        Choose assets (from the pool) and map them to platforms. Filter by time, then check which asset goes to which platform.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Choose assets and platforms</CardTitle>
          <div className="flex items-center gap-4 pt-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as "hour" | "24h" | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSave} disabled={saveMutation.isPending || checked.size === 0}>
              {saveMutation.isPending ? "Saving…" : "Save mappings"}
            </Button>
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
            <p className="text-muted-foreground">No assets in this range. Generate some images or videos first.</p>
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
                        <div className="flex items-center gap-2">
                          {asset.asset_url && asset.type === "image" && (
                            <img
                              src={asset.asset_url}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span>
                            {asset.type} #{asset.index} ({new Date(asset.created_at).toLocaleString()})
                          </span>
                        </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
