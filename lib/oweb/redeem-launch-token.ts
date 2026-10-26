/* ─── Locus · redeem OWeb ecosystem launch tokens (server-only) ─── */

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { LOCUS_APP_ID } from "@/lib/oweb/constants";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

export type RedeemLaunchTokenResult = {
  accessToken: string;
  refreshToken: string | null;
  orgId: string;
  userId: string;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !SUPABASE_URL) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Redeem a one-time OWeb ecosystem launch token. Requires service role + shared One OS database. */
export async function redeemEcosystemLaunchToken(launchToken: string): Promise<RedeemLaunchTokenResult> {
  const trimmed = launchToken.trim();
  if (!trimmed) throw new Error("missing_launch_token");

  const supabaseAdmin = adminClient();
  if (!supabaseAdmin) throw new Error("sso_not_configured");

  const tokenHash = hashToken(trimmed);
  const now = new Date().toISOString();

  const { data: row, error } = await supabaseAdmin
    .from("ao_ecosystem_launch_tokens")
    .select("id, app_id, org_id, user_id, access_token, refresh_token, expires_at, consumed_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!row) throw new Error("invalid_launch_token");
  if (row.consumed_at) throw new Error("launch_token_consumed");
  if (row.expires_at <= now) throw new Error("launch_token_expired");
  if (row.app_id !== LOCUS_APP_ID) throw new Error("launch_token_wrong_app");

  const { error: consumeError } = await supabaseAdmin
    .from("ao_ecosystem_launch_tokens")
    .update({ consumed_at: now })
    .eq("id", row.id)
    .is("consumed_at", null);

  if (consumeError) throw new Error(consumeError.message);

  return {
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    orgId: row.org_id,
    userId: row.user_id,
  };
}

/** Whether SSO redemption can run on this deployment. */
export function isSsoRedeemConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && SUPABASE_URL && SUPABASE_ANON_KEY);
}
