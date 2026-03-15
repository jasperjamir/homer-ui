export const ROUTE_BASE = {
  ROOT: "/",
  ACCOUNT: "account",
  LOGIN: "login",
  HOME: "home",
  NOT_FOUND: "*",
} as const;

export const ROUTES = {
  LOGIN: `/${ROUTE_BASE.ACCOUNT}/${ROUTE_BASE.LOGIN}`,
  HOME: `/${ROUTE_BASE.HOME}`,
} as const;
