/* ─── Locus · OneID app activation telemetry ─── */

import { supabase } from "@/lib/supabase/client";
import { LOCUS_APP_ID } from "@/lib/oweb/constants";

export async function activateLocusApp(userId: string, activationKind: "sso_launch" | "sign_in" = "sign_in"): Promise<void> {
  const { error } = await supabase().rpc("ao_upsert_app_activation", {
    p_app_id: LOCUS_APP_ID,
    p_user_id: userId,
    p_activation_kind: activationKind,
  });
  if (error) console.warn("[locus] app activation failed", error.message);
}
