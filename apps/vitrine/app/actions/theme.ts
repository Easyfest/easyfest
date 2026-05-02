"use server";

import { revalidatePath } from "next/cache";

import {
  THEME_PRESET_SLUGS,
  isValidHexColor,
  type ThemePresetSlug,
} from "@easyfest/shared";

import { createServerClient } from "@/lib/supabase/server";

interface ApplyPresetInput {
  organizationId: string;
  presetSlug: string;
  orgSlug: string;
  eventSlug: string;
}

interface ActionResult {
  ok: boolean;
  error?: string;
}

function isAllowedPresetSlug(slug: string): slug is ThemePresetSlug {
  return (THEME_PRESET_SLUGS as readonly string[]).includes(slug);
}

function revalidateTenantSurfaces(orgSlug: string, eventSlug: string) {
  revalidatePath(`/regie/${orgSlug}/${eventSlug}`, "layout");
  revalidatePath(`/v/${orgSlug}/${eventSlug}`, "layout");
  revalidatePath(`/staff/${orgSlug}/${eventSlug}`, "layout");
  revalidatePath(`/poste/${orgSlug}/${eventSlug}`, "layout");
  revalidatePath(`/${orgSlug}/${eventSlug}`, "layout");
}

export async function applyThemePreset(input: ApplyPresetInput): Promise<ActionResult> {
  if (!isAllowedPresetSlug(input.presetSlug)) {
    return { ok: false, error: "Preset inconnu" };
  }

  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  const { error } = await supabase
    .from("organization_themes")
    .upsert(
      {
        organization_id: input.organizationId,
        preset_slug: input.presetSlug,
        applied_at: new Date().toISOString(),
        primary_color: null,
        accent_color: null,
        surface_color: null,
        text_color: null,
      },
      { onConflict: "organization_id" },
    );

  if (error) return { ok: false, error: error.message };

  revalidateTenantSurfaces(input.orgSlug, input.eventSlug);
  return { ok: true };
}

interface SaveCustomThemeInput {
  organizationId: string;
  orgSlug: string;
  eventSlug: string;
  primary: string;
  accent: string;
  surface: string;
  text: string;
}

export async function saveCustomTheme(input: SaveCustomThemeInput): Promise<ActionResult> {
  for (const color of [input.primary, input.accent, input.surface, input.text]) {
    if (!isValidHexColor(color)) {
      return { ok: false, error: "Format couleur invalide (attendu #RRGGBB)" };
    }
  }

  const supabase = createServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Non authentifié" };

  const { error } = await supabase
    .from("organization_themes")
    .upsert(
      {
        organization_id: input.organizationId,
        primary_color: input.primary,
        accent_color: input.accent,
        surface_color: input.surface,
        text_color: input.text,
        applied_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" },
    );

  if (error) return { ok: false, error: error.message };

  revalidateTenantSurfaces(input.orgSlug, input.eventSlug);
  return { ok: true };
}
