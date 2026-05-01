/**
 * POST /api/account/restore — annule une suppression Art.17 si encore dans la fenêtre 30j.
 * L'utilisateur doit être authentifié (la session reste valide tant que auth.users existe).
 */
import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { data: restored, error } = await (supabase as any).rpc("rgpd_restore_self");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!restored) {
    return NextResponse.json({ error: "no_pending_deletion" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
