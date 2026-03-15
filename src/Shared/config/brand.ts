/**
 * Brand configuration. Copy is hardcoded; logo URLs can be overridden via PUBLIC_* env.
 */

const env = import.meta.env;

// Logo URLs. Always use Clay asset unless a non-empty PUBLIC_* env is set.
const DEFAULT_LOGO_URL = "https://assets.clayventureslab.com/clay/square-logo.png";
const useLogoUrl = (v: string | undefined) =>
  (typeof v === "string" && v.trim() !== "" ? v.trim() : null) ?? DEFAULT_LOGO_URL;
export const LOGO_SQUARE_URL = useLogoUrl(env.PUBLIC_LOGO_SQUARE_URL as string | undefined);
export const LOGO_HORIZONTAL_URL = useLogoUrl(env.PUBLIC_LOGO_HORIZONTAL_URL as string | undefined);
const loginUrlRaw = env.PUBLIC_LOGO_LOGIN_URL as string | undefined;
export const LOGO_LOGIN_URL =
  typeof loginUrlRaw === "string" && loginUrlRaw.trim() !== ""
    ? loginUrlRaw.trim()
    : LOGO_HORIZONTAL_URL;

// Copy (hardcoded for now)
export const APP_TITLE = "Clay | Ventures Lab";
export const LOGIN_WELCOME_TITLE = "Welcome to Clay Ventures Lab";
export const LOGIN_WELCOME_DESCRIPTION =
  "Login with your account to continue with your learning journey";
export const SIDEBAR_TEAM_NAME = "Clay Ventures Lab";
export const SIDEBAR_PLAN = "Management";
