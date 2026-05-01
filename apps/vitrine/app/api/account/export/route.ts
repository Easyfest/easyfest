/**
 * GET /api/account/export — RGPD Art.15 (droit d'accès et portabilité).
 * Retourne un JSON complet des données personnelles de l'utilisateur courant.
 * Fonctionne même si le compte est en cours de soft-delete (Art.15 prévaut).
 */
import { NextResponse } from "next/server";

import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const userId = user.id;
  const userEmail = user.email ?? "";

  // Service client pour bypass RLS — Art.15 doit fonctionner même si soft-deleted.
  // L'identité de l'utilisateur est validée juste au-dessus via getUser().
  const admin: any = createServiceClient();

  const [profile, applications, memberships, assignments, engagements, notifications] =
    await Promise.all([
      admin.from("volunteer_profiles").select("*").eq("user_id", userId).maybeSingle(),
      userEmail
        ? admin.from("volunteer_applications").select("*").eq("email", userEmail.toLowerCase())
        : Promise.resolve({ data: [] }),
      admin.from("memberships").select("*").eq("user_id", userId),
      admin.from("assignments").select("*").eq("volunteer_user_id", userId),
      admin.from("signed_engagements").select("*").eq("user_id", userId),
      admin.from("notification_log").select("*").eq("user_id", userId),
    ]);

  // Audit (best-effort, non bloquant)
  await admin
    .from("audit_log")
    .insert({
      user_id: userId,
      action: "rgpd.export.requested",
      payload: {
        rows: {
          applications: applications.data?.length ?? 0,
          memberships: memberships.data?.length ?? 0,
          assignments: assignments.data?.length ?? 0,
          engagements: engagements.data?.length ?? 0,
          notifications: notifications.data?.length ?? 0,
        },
      },
    })
    .then(
      () => undefined,
      () => undefined,
    );

  const payload = {
    exported_at: new Date().toISOString(),
    article: "RGPD Art.15 — droit d'accès et à la portabilité",
    notice:
      "Ce fichier contient l'intégralité de tes données personnelles stockées par Easyfest. " +
      "Les données anonymisées (statistiques agrégées) ne sont pas incluses car non rattachées à ton identité.",
    user: {
      id: userId,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile: profile.data,
    applications: applications.data ?? [],
    memberships: memberships.data ?? [],
    assignments: assignments.data ?? [],
    signed_engagements: engagements.data ?? [],
    notification_log: notifications.data ?? [],
  };

  const today = new Date().toISOString().slice(0, 10);
  const filename = `easyfest-export-${userId.slice(0, 8)}-${today}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
