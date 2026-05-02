import { redirect } from "next/navigation";

import { THEME_PRESETS, THEME_PRESET_SLUGS, DEFAULT_THEME_PRESET } from "@easyfest/shared";

import { createServerClient } from "@/lib/supabase/server";

import { ThemePicker } from "./ThemePicker";

interface PageProps {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ThemeSettingsPage({ params }: PageProps) {
  const { orgSlug, eventSlug } = await params;
  const supabase = createServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect(`/auth/login?redirect=/regie/${orgSlug}/${eventSlug}/settings/theme`);
  }

  const { data: ev } = await supabase
    .from("events")
    .select("id, slug, name, organization:organization_id (id, slug, name)")
    .eq("slug", eventSlug)
    .maybeSingle();

  if (!ev || (ev as any).organization?.slug !== orgSlug) {
    redirect("/hub");
  }

  const orgId = (ev as any).organization.id as string;

  const { data: theme } = await supabase
    .from("organization_themes")
    .select("preset_slug, primary_color, accent_color, surface_color, text_color, is_premium")
    .eq("organization_id", orgId)
    .maybeSingle();

  const currentSlug = theme?.preset_slug && (THEME_PRESET_SLUGS as readonly string[]).includes(theme.preset_slug)
    ? theme.preset_slug
    : DEFAULT_THEME_PRESET;

  const presets = THEME_PRESET_SLUGS.map((slug) => THEME_PRESETS[slug]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--theme-primary, #FF5E5B)" }}
        >
          Personnalisation
        </p>
        <h1 className="mt-1 font-display text-2xl font-black sm:text-3xl">
          Choisis le thème de ton festival
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-ink/70 sm:text-base">
          5 ambiances signées Easyfest — change l&apos;identité visuelle de tes pages bénévoles, régie et accueil
          en 1 clic. Mode premium pour des couleurs 100 % sur mesure.
        </p>
      </header>

      <ThemePicker
        organizationId={orgId}
        orgSlug={orgSlug}
        eventSlug={eventSlug}
        presets={presets}
        currentSlug={currentSlug}
        isPremium={Boolean(theme?.is_premium)}
        customPrimary={theme?.primary_color ?? null}
        customAccent={theme?.accent_color ?? null}
        customSurface={theme?.surface_color ?? null}
        customText={theme?.text_color ?? null}
      />
    </main>
  );
}
