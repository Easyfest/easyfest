"use server";

import { revalidatePath } from "next/cache";

import { createServerClient } from "@/lib/supabase/server";

/**
 * À appeler quand un user vient de se connecter pour la 1ère fois.
 * Upgrade automatiquement les volunteer_applications validées correspondant
 * à son email en :
 * 1. volunteer_profile (créé si manquant)
 * 2. membership (role=volunteer is_active=true) sur l'event correspondant
 *
 * Si la photo a été uploadée à l'inscription, elle est recopiée dans le profil.
 */
export async function onboardCurrentUser(): Promise<{
  ok: boolean;
  upgradedApps?: number;
  error?: string;
}> {
  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  const userId = userData.user.id;
  const userEmail = (userData.user.email ?? "").toLowerCase();
  if (!userEmail) return { ok: false, error: "Email manquant" };

  // 1. Trouver les applications validées non-encore-onboardées pour cet email
  const { data: apps } = await supabase
    .from("volunteer_applications")
    .select("id, event_id, full_name, first_name, last_name, birth_date, is_minor, gender, phone, profession, address_street, address_city, address_zip, size, diet_notes, has_vehicle, driving_license, available_setup, available_teardown, diet_type, carpool, preferred_position_slugs, skills, limitations, bio, is_returning, avatar_url")
    .eq("email", userEmail)
    .eq("status", "validated");

  if (!apps || apps.length === 0) {
    return { ok: true, upgradedApps: 0 };
  }

  // 2. Vérifier si profil existe déjà
  const { data: existingProfile } = await supabase
    .from("volunteer_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  // 3. Créer profile si manquant (à partir de la dernière application)
  if (!existingProfile) {
    const lastApp = apps[0]; // les applications sont datées, on prend la 1ère
    await supabase.from("volunteer_profiles").insert({
      user_id: userId,
      full_name: lastApp.full_name ?? userEmail,
      first_name: lastApp.first_name,
      last_name: lastApp.last_name,
      birth_date: lastApp.birth_date,
      gender: lastApp.gender,
      phone: lastApp.phone,
      email: userEmail,
      address_street: lastApp.address_street,
      address_city: lastApp.address_city,
      address_zip: lastApp.address_zip,
      profession: lastApp.profession,
      size: lastApp.size,
      diet_notes: lastApp.diet_notes,
      diet_type: lastApp.diet_type,
      carpool: lastApp.carpool,
      available_setup: lastApp.available_setup,
      available_teardown: lastApp.available_teardown,
      skills: lastApp.skills ?? [],
      limitations: lastApp.limitations ?? [],
      bio: lastApp.bio,
      avatar_url: lastApp.avatar_url,
      is_returning: lastApp.is_returning ?? false,
    });
  }

  // 4. Pour chaque application, créer membership si manquant
  let upgraded = 0;
  for (const app of apps) {
    const { data: existingMembership } = await supabase
      .from("memberships")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", app.event_id)
      .maybeSingle();

    if (!existingMembership) {
      const { error: memErr } = await supabase.from("memberships").insert({
        user_id: userId,
        event_id: app.event_id,
        role: "volunteer",
        is_active: true,
      });
      if (!memErr) upgraded++;
    }
  }

  // 5. Audit
  if (upgraded > 0) {
    await supabase.from("audit_log").insert({
      user_id: userId,
      action: "user.onboarded",
      payload: { upgraded_applications: upgraded, email: userEmail },
    });
  }

  revalidatePath("/hub");
  revalidatePath("/v", "layout");
  return { ok: true, upgradedApps: upgraded };
}
