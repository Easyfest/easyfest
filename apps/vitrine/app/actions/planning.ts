"use server";

import { revalidatePath } from "next/cache";

import { createServerClient } from "@/lib/supabase/server";

interface ReassignInput {
  assignmentId: string;
  targetShiftId: string | null; // null = retour au pool (assignment supprimée)
}

export async function reassignVolunteer(input: ReassignInput) {
  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  // 1. Récup l'affectation source
  const { data: source } = await supabase
    .from("assignments")
    .select("id, shift_id, volunteer_user_id, shift:shift_id (position:position_id (event_id))")
    .eq("id", input.assignmentId)
    .single();

  if (!source) return { ok: false, error: "Affectation introuvable" };
  const eventId = (source as any).shift?.position?.event_id;

  // 2. Si target shift = null, on supprime l'affectation
  if (!input.targetShiftId) {
    const { error } = await supabase.from("assignments").delete().eq("id", input.assignmentId);
    if (error) return { ok: false, error: error.message };
    await supabase.from("audit_log").insert({
      user_id: userData.user.id,
      event_id: eventId,
      action: "assignment.removed",
      payload: { assignment_id: input.assignmentId },
    });
    revalidatePath("/regie", "layout");
    return { ok: true };
  }

  // 3. Sinon update shift_id (ne change pas le bénévole)
  const { error } = await supabase
    .from("assignments")
    .update({ shift_id: input.targetShiftId, assigned_by: userData.user.id })
    .eq("id", input.assignmentId);

  if (error) return { ok: false, error: error.message };

  await supabase.from("audit_log").insert({
    user_id: userData.user.id,
    event_id: eventId,
    action: "assignment.reassigned",
    payload: {
      assignment_id: input.assignmentId,
      from_shift: source.shift_id,
      to_shift: input.targetShiftId,
    },
  });

  revalidatePath("/regie", "layout");
  return { ok: true };
}

export async function manualVolunteerSignup(input: {
  eventId: string;
  email: string;
  fullName: string;
  phone?: string;
  positionSlug?: string;
}) {
  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  const { data: app, error } = await supabase
    .from("volunteer_applications")
    .insert({
      event_id: input.eventId,
      email: input.email,
      full_name: input.fullName,
      phone: input.phone,
      preferred_position_slugs: input.positionSlug ? [input.positionSlug] : [],
      status: "validated",
      validated_by: userData.user.id,
      validated_at: new Date().toISOString(),
      source: "admin_manual",
      consent_pii_at: new Date().toISOString(),
      consent_charter_at: new Date().toISOString(),
      consent_anti_harass_at: new Date().toISOString(),
      privacy_policy_version_accepted: "1.0.0",
    })
    .select("id")
    .single();

  if (error || !app) return { ok: false, error: error?.message ?? "Insert failed" };

  // Trigger send_validation_mail
  await supabase.functions.invoke("send_validation_mail", {
    body: { application_id: app.id },
  });

  await supabase.from("audit_log").insert({
    user_id: userData.user.id,
    event_id: input.eventId,
    action: "application.manual_signup",
    payload: { application_id: app.id, email: input.email },
  });

  revalidatePath("/regie", "layout");
  return { ok: true, applicationId: app.id };
}

interface AssignToTeamInput {
  volunteerUserId: string;
  targetPositionId: string | null; // null = pool (retire toutes les assignments du bénévole sur cet event)
  eventId: string;
}

/**
 * Affecte un bénévole à une équipe (position) sur un event — 100% atomique côté SQL.
 *
 * Bug #5 fix (audit-extreme retest 3 mai 2026) : la séquence d'INSERTs précédente
 * (delete assignments + insert membership + insert profile + insert assignment +
 * insert audit_log) n'était pas transactionnelle. Une erreur à mi-parcours laissait
 * la BDD dans un état incohérent (membership sans assignment, ou assignment sans
 * shift). La nouvelle implémentation délègue tout à `assign_volunteer_atomic`
 * (cf. migration 20260503010000) qui fait l'ensemble dans une seule transaction
 * SECURITY DEFINER avec contrôle de permission direction|volunteer_lead.
 *
 * Le RPC supporte :
 * - `pre-<email>` : auto-création membership + profile si auth.users existe ET
 *   volunteer_application validated existe pour cet event_id (defense-in-depth)
 * - UUID direct : reassignement classique
 * - `targetPositionId === null` : retrait du planning (suppression assignments event)
 */
export async function assignVolunteerToTeam(input: AssignToTeamInput): Promise<{
  ok: boolean;
  error?: string;
  realUserId?: string;
}> {
  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  const { data, error } = await (supabase as any).rpc("assign_volunteer_atomic", {
    p_user_or_email: input.volunteerUserId,
    p_position_id: input.targetPositionId,
    p_event_id: input.eventId,
    p_actor_user_id: userData.user.id,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!data?.ok) {
    return { ok: false, error: data?.error ?? "Échec assignation" };
  }

  revalidatePath("/regie", "layout");
  return { ok: true, realUserId: data.real_user_id };
}
