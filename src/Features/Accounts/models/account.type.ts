export interface ConnectedPlatformAccount {
  account_id: string;
  id: string;
  platform: string;
  fullname: string;
  username: string;
}

export interface GetAccountsResponse {
  items: ConnectedPlatformAccount[];
}
