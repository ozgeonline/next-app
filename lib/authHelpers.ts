type SameSiteType = "strict" | "lax" | "none";

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: SameSiteType;
  path: string;
  maxAge?: number;
  expires?: Date;
}

const SAME_SITE_SETTING: SameSiteType = (
  process.env.NODE_ENV === "production" ? "strict" : "lax"
) as SameSiteType;

// for signup and login
export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: SAME_SITE_SETTING,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

// for logout
export function getLogoutCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: SAME_SITE_SETTING,
    path: "/",
    expires: new Date(0)
  };
}