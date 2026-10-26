# Locus — OWeb satellite

Locus can run as an **OWeb constellation satellite** on Vercel (One Web LLC team), sharing **One OS Supabase Auth** with `oweb.one`.

## Production URL

- **Vercel (OWeb team):** https://locus-oweb.vercel.app
- **`app_id`:** `locus`

## Environment

Copy from `.env.example`. For satellite mode you need:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Shared One OS project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only SSO token redemption |
| `NEXT_PUBLIC_OWEB_SATELLITE=on` | Enables Continue with OWeb + shared auth storage key |
| `NEXT_PUBLIC_OWEB_APP_URL` | Control plane origin (default `https://oweb.one`) |
| `NEXT_PUBLIC_LOCUS_PUBLIC_URL` | This app's public URL (SSO redirects, docs) |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for auth email redirects |

Locus keeps its own `workspaces` / `teams` / `issues` schema. OWeb SSO establishes the **session**; workspace onboarding inside Locus is unchanged.

**Cookie name:** With `NEXT_PUBLIC_OWEB_SATELLITE=on`, browser, middleware, and RSC all use the `ao-supabase-auth` Supabase SSR cookie name (via `lib/supabase/ssr-cookie-options.ts`). If login succeeds in the browser but you bounce back unsigned-in, this alignment was missing.

## Auth flows

1. **Native** — `/login` with the same email + password as OWeb (shared Auth).
2. **App Store** — `oweb.one` mints a launch token → `{LOCUS_PUBLIC_URL}/sso?launch_token=…` → server redeems → session → `/onboarding`.
3. **Continue with OWeb** — `/login?launch=locus` handoff via OWeb login.

See OWeb [`SATELLITE_AUTH_RETURN.md`](https://github.com/MasterSoler/OWeb/blob/main/docs/SATELLITE_AUTH_RETURN.md) and [`SATELLITE_ONBOARDING_KIT.md`](https://github.com/MasterSoler/OWeb/blob/main/docs/SATELLITE_ONBOARDING_KIT.md).

## Deploy (Vercel)

Connect `MasterSoler/Locus` to a project on the **oweb** team (e.g. `locus-oweb`), framework **Next.js**, production branch `main`. Set the environment variables above for **Production** and **Preview**.
