/**
 * Brand configuration. Logo URLs can be overridden via PUBLIC_* env.
 */

const env = import.meta.env;

const DEFAULT_LOGO_URL = "https://cdn.ed3ninternal.com/ed3n-website/svgs/nav-logo.svg";
const useLogoUrl = (v: string | undefined) =>
  (typeof v === "string" && v.trim() !== "" ? v.trim() : null) ?? DEFAULT_LOGO_URL;
export const LOGO_SQUARE_URL = useLogoUrl(env.PUBLIC_LOGO_SQUARE_URL as string | undefined);
export const LOGO_HORIZONTAL_URL = useLogoUrl(env.PUBLIC_LOGO_HORIZONTAL_URL as string | undefined);
const loginUrlRaw = env.PUBLIC_LOGO_LOGIN_URL as string | undefined;
export const LOGO_LOGIN_URL =
  typeof loginUrlRaw === "string" && loginUrlRaw.trim() !== ""
    ? loginUrlRaw.trim()
    : LOGO_HORIZONTAL_URL;

export const APP_TITLE = "Homer AI";
export const LOGIN_WELCOME_TITLE = "Welcome to Homer - Your AI Content Creation Partner";
export const LOGIN_WELCOME_DESCRIPTION = "Sign in to continue";
export const SIDEBAR_TEAM_NAME = "Homer AI";
export const SIDEBAR_PLAN = "";
