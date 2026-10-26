"use client";
/* ─── Locus · secondary auth CTA — OWeb App Store launch ─── */

import { owebLoginUrl } from "@/lib/oweb/constants";
import { owebSatelliteEnabled } from "@/lib/env";
import { Button } from "@/components/primitives/controls";

type Props = {
  label?: string;
  className?: string;
  next?: string | null;
};

/**
 * Product CTAs link to OWeb login with `launch=locus` per SATELLITE_AUTH_RETURN.
 * Primary sign-in remains email + password on `/login`.
 */
export function ContinueWithOweb({ label = "Continue with OWeb", className = "", next }: Props) {
  if (!owebSatelliteEnabled) return null;

  const href = owebLoginUrl({ launch: true, redirect: next ?? undefined });

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className={`w-full ${className}`}
      onClick={() => {
        window.location.href = href;
      }}
    >
      {label}
    </Button>
  );
}
