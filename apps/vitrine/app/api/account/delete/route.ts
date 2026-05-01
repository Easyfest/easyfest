/**
 * POST /api/account/delete — RGPD Art.17 (droit à l'effacement).
 * Soft-delete 30j (SLA produit Easyfest, pas une exigence légale).
 * La purge hard est exécutée par l'edge function `rgpd_hard_delete` (cron quotidien).
 *
 * Body attendu : { "confirm": "DELETE" } (anti-clic accidentel).
 */
import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || (body as { confirm?: unknown }).confirm !== "DELETE") {
    return NextResponse.json({ error: "missing_confirmation" }, { status: 400 });
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data: recoveryUntil, error } = await (supabase as any).rpc("rgpd_request_self_delete");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sign-out — l'utilisateur ne reste pas connecté sur un compte en cours de suppression.
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true, recovery_until: recoveryUntil });
}
