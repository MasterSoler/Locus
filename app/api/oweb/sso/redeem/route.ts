/* ─── Locus · POST redeem OWeb launch token (server-only) ─── */

import { NextResponse } from "next/server";
import { isSsoRedeemConfigured, redeemEcosystemLaunchToken } from "@/lib/oweb/redeem-launch-token";

export async function POST(request: Request) {
  if (!isSsoRedeemConfigured()) {
    return NextResponse.json({ error: "sso_not_configured" }, { status: 503 });
  }

  let launchToken = "";
  try {
    const body = (await request.json()) as { launchToken?: string };
    launchToken = typeof body.launchToken === "string" ? body.launchToken : "";
  } catch {
    return NextResponse.json({ error: "missing_launch_token" }, { status: 400 });
  }

  try {
    const result = await redeemEcosystemLaunchToken(launchToken);
    return NextResponse.json(result);
  } catch (e) {
    const code = e instanceof Error ? e.message : "invalid_launch_token";
    const status = code === "missing_launch_token" ? 400 : 401;
    return NextResponse.json({ error: code }, { status });
  }
}
