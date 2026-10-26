/* ─── Locus · OWeb SSO error copy (fixed strings only) ─── */

const SSO_ERROR_MESSAGES: Record<string, string> = {
  missing_launch_token: "Missing launch token. Open Locus from the OWeb App Store.",
  invalid_launch_token: "This sign-in link is invalid or has expired. Try launching Locus again from OWeb.",
  launch_token_consumed: "This sign-in link was already used. Launch Locus again from the OWeb App Store.",
  launch_token_expired: "This sign-in link has expired. Launch Locus again from the OWeb App Store.",
  launch_token_wrong_app: "This sign-in link is for a different app. Open Locus from the OWeb App Store.",
  sso_not_configured: "OWeb SSO is not configured on this deployment. Contact your workspace admin.",
};

export function formatSsoError(code: string): string {
  return SSO_ERROR_MESSAGES[code] ?? "Could not complete sign-in from OWeb. Try again from the App Store.";
}
