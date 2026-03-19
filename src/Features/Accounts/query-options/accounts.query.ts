import { queryOptions } from "@tanstack/react-query";
import { getAccounts } from "@/Features/Accounts/services";

export function getAccountsQueryOptions() {
  return queryOptions({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    staleTime: 1000 * 30,
  });
}
