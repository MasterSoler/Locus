"use client";
/* ─── Locus · /sso — redeem OWeb App Store launch tokens ─── */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { activateLocusApp } from "@/lib/oweb/app-activation";
import { formatSsoError } from "@/lib/oweb/sso-errors";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SsoPage() {
  const searchParams = useSearchParams();
  const launchToken = searchParams.get("launch_token")?.trim() ?? "";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!launchToken) {
      setError(formatSsoError("missing_launch_token"));
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/oweb/sso/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ launchToken }),
        });
        const payload = (await res.json()) as {
          error?: string;
          accessToken?: string;
          refreshToken?: string | null;
        };
        if (!res.ok) throw new Error(payload.error ?? "invalid_launch_token");
        if (cancelled) return;

        const { error: sessionError } = await supabase().auth.setSession({
          access_token: payload.accessToken!,
          refresh_token: payload.refreshToken ?? "",
        });
        if (sessionError) throw sessionError;

        const { data: userData } = await supabase().auth.getUser();
        if (userData.user) await activateLocusApp(userData.user.id, "sso_launch");

        window.location.assign("/onboarding");
      } catch (e) {
        if (cancelled) return;
        const raw = e instanceof Error ? e.message : "invalid_launch_token";
        setError(formatSsoError(raw));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [launchToken]);

  return (
    <AuthCard
      title={error ? "Could not sign you in" : "Signing you in…"}
      subtitle={error ? error : "Completing secure handoff from OWeb."}
      plain
    >
      {error && (
        <p className="text-center text-[13px]">
          <Link href="/login" className="text-accent hover:underline">Back to sign in</Link>
        </p>
      )}
    </AuthCard>
  );
}
