import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import { getAccountsQueryOptions } from "@/Features/Accounts/query-options";
import { Button } from "@/Shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";

export default function PlatformsPage() {
  const { data: connectedAccounts = [], isLoading } = useQuery(getAccountsQueryOptions());
  const formatConnectedPlatform = (platform: string): string => {
    const map: Record<string, string> = {
      tiktok: "TikTok",
      instagram: "Instagram",
    };
    return map[platform] ?? platform;
  };

  const handleAddPlatforms = useCallback(() => {
    window.open("https://my.blotato.com/", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Connected accounts</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Connected accounts used for the Launch step poster.
          </p>
        </div>
        <Button onClick={handleAddPlatforms}>
          <Plus className="mr-2 h-4 w-4" />
          Add platforms
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Full name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : connectedAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  No connected accounts yet.
                </TableCell>
              </TableRow>
            ) : (
              connectedAccounts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{formatConnectedPlatform(a.platform)}</TableCell>
                  <TableCell>
                    {a.username || <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell>
                    {a.fullname || <span className="text-muted-foreground">N/A</span>}
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
