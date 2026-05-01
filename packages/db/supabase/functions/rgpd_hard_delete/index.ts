/**
 * Edge Function : rgpd_hard_delete
 * Cron quotidien — purge hard les comptes dont la fenêtre soft-delete 30j est échue.
 * Indépendant de rgpd_purge (qui anonymise les comptes inactifs > 12 mois).
 *
 * Auth : header X-Cron-Secret matchant CRON_SECRET (même pattern que rgpd_purge).
 *
 * Logique :
 *   1. Cibler volunteer_profiles where deleted_at <= now()
 *   2. Pour chaque user : auth.admin.deleteUser(user_id)
 *      → cascade FK supprime profile, memberships, applications, assignments
 *   3. Audit log de chaque suppression
 */
// deno-lint-ignore-file no-explicit-any
import { createServiceClient } from "../_shared/supabase.ts";

const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("method_not_allowed", { status: 405 });
  }

  const cronHeader = req.headers.get("x-cron-secret") ?? "";
  if (!CRON_SECRET || cronHeader !== CRON_SECRET) {
    return new Response("unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const stats = {
    processed: 0,
    deleted: 0,
    errors: 0,
    cutoff_date: new Date().toISOString(),
  };

  // 1. Lister les comptes échus
  const { data: targets, error: listError } = await supabase
    .from("volunteer_profiles")
    .select("user_id, deleted_at")
    .lte("deleted_at", stats.cutoff_date);

  if (listError) {
    return new Response(
      JSON.stringify({ ok: false, error: listError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  stats.processed = targets?.length ?? 0;

  // 2. Suppression idempotente compte par compte
  for (const row of targets ?? []) {
    const userId = (row as any).user_id as string;
    const scheduledFor = (row as any).deleted_at as string;

    const { error: delErr } = await (supabase as any).auth.admin.deleteUser(userId);

    if (delErr) {
      stats.errors++;
      await supabase.from("audit_log").insert({
        user_id: userId,
        action: "rgpd.deletion.error",
        payload: { error: delErr.message, scheduled_for: scheduledFor } as any,
      } as any);
      continue;
    }

    stats.deleted++;
    await supabase.from("audit_log").insert({
      user_id: null,
      action: "rgpd.deletion.completed",
      payload: { former_user_id: userId, scheduled_for: scheduledFor } as any,
    } as any);
  }

  return new Response(JSON.stringify({ ok: true, stats }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
