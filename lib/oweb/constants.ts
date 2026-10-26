/* ─── Locus · OWeb constellation identity ─── */

export const LOCUS_APP_ID = "locus" as const;

export const LOCUS_DEFAULT_PUBLIC_URL = "https://locus-oweb.vercel.app";

/** Supabase auth localStorage key — must match OWeb when sharing Auth. */
export const SUPABASE_AUTH_STORAGE_KEY = "ao-supabase-auth";

export function getOwebAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_OWEB_APP_URL;
  return (fromEnv || "https://oweb.one").replace(/\/$/, "");
}

export function getLocusPublicUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_LOCUS_PUBLIC_URL;
  return (fromEnv || LOCUS_DEFAULT_PUBLIC_URL).replace(/\/$/, "");
}

export function owebLoginUrl(options?: { launch?: boolean; redirect?: string }): string {
  const base = getOwebAppUrl();
  const url = new URL("/login", base);
  if (options?.launch) url.searchParams.set("launch", LOCUS_APP_ID);
  if (options?.redirect) url.searchParams.set("redirect", options.redirect);
  return url.toString();
}
