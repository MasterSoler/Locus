/* ─── Locus · shared Supabase SSR cookie name (OWeb satellite) ─── */

import { owebSatelliteEnabled } from "@/lib/env";
import { SUPABASE_AUTH_STORAGE_KEY } from "@/lib/oweb/constants";

/** Cookie / auth storage key — must match on browser + middleware + RSC when satellite mode is on. */
export function supabaseSsrCookieOptions(): { cookieOptions: { name: string } } | undefined {
  if (!owebSatelliteEnabled) return undefined;
  return { cookieOptions: { name: SUPABASE_AUTH_STORAGE_KEY } };
}
