import type { ConnectedPlatformAccount } from "@/Features/Accounts/models";
import type { GetAccountsResponse } from "@/Features/Accounts/models/account.type";
import { api } from "@/Shared/services/api";

export async function getAccounts(): Promise<ConnectedPlatformAccount[]> {
  const { data } = await api.get<GetAccountsResponse>("/accounts");
  return data.items ?? [];
}
