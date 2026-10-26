"use client";
/* ─── Locus · browser Supabase client (singleton) ─── */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, owebSatelliteEnabled } from "@/lib/env";
import { SUPABASE_AUTH_STORAGE_KEY } from "@/lib/oweb/constants";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 20 } },
      ...(owebSatelliteEnabled
        ? { auth: { storageKey: SUPABASE_AUTH_STORAGE_KEY } }
        : {}),
    });
  }
  return client;
}
