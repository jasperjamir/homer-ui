import { useQuery } from "@tanstack/react-query";
import { getAccountsQueryOptions } from "@/Features/Accounts/query-options";
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

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg border">
        <div className="space-y-2 p-4">
          <h1 className="font-semibold text-2xl">Connected accounts</h1>
          <p className="text-muted-foreground text-sm">
            Connected accounts used for the Launch step poster.
          </p>
        </div>
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
