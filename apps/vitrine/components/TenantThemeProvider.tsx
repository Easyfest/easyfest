import type { CSSProperties, ReactNode } from "react";

import {
  DEFAULT_THEME_PRESET,
  resolveThemePreset,
  isValidHexColor,
  type ThemePreset,
} from "@easyfest/shared";

import { createServerClient } from "@/lib/supabase/server";

interface TenantThemeProviderProps {
  organizationId?: string | null;
  organizationSlug?: string | null;
  children: ReactNode;
  fullHeight?: boolean;
}

interface ResolvedTokens {
  slug: string;
  primary: string;
  primaryText: string;
  accent: string;
  surface: string;
  text: string;
}

function tokensFromPreset(preset: ThemePreset): ResolvedTokens {
  return {
    slug: preset.slug,
    primary: preset.primary,
    primaryText: preset.primaryText,
    accent: preset.accent,
    surface: preset.surface,
    text: preset.text,
  };
}

async function resolveThemeTokens(args: {
  organizationId?: string | null;
  organizationSlug?: string | null;
}): Promise<ResolvedTokens> {
  const fallback = resolveThemePreset(DEFAULT_THEME_PRESET);

  try {
    const supabase = createServerClient();
    let orgId = args.organizationId ?? null;

    if (!orgId && args.organizationSlug) {
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("slug", args.organizationSlug)
        .maybeSingle();
      orgId = org?.id ?? null;
    }

    if (!orgId) return tokensFromPreset(fallback);

    const { data: theme } = await supabase
      .from("organization_themes")
      .select(
        "preset_slug, primary_color, accent_color, surface_color, text_color, is_premium",
      )
      .eq("organization_id", orgId)
      .maybeSingle();

    if (!theme) return tokensFromPreset(fallback);

    const preset = resolveThemePreset(theme.preset_slug);
    let primary = preset.primary;
    let accent = preset.accent;
    let surface = preset.surface;
    let text = preset.text;

    if (theme.is_premium) {
      if (theme.primary_color && isValidHexColor(theme.primary_color)) {
        primary = theme.primary_color;
      }
      if (theme.accent_color && isValidHexColor(theme.accent_color)) {
        accent = theme.accent_color;
      }
      if (theme.surface_color && isValidHexColor(theme.surface_color)) {
        surface = theme.surface_color;
      }
      if (theme.text_color && isValidHexColor(theme.text_color)) {
        text = theme.text_color;
      }
    }

    return {
      slug: preset.slug,
      primary,
      primaryText: preset.primaryText,
      accent,
      surface,
      text,
    };
  } catch {
    return tokensFromPreset(fallback);
  }
}

export async function TenantThemeProvider({
  organizationId,
  organizationSlug,
  children,
  fullHeight = false,
}: TenantThemeProviderProps) {
  const tokens = await resolveThemeTokens({ organizationId, organizationSlug });

  const style = {
    "--theme-primary": tokens.primary,
    "--theme-primary-text": tokens.primaryText,
    "--theme-accent": tokens.accent,
    "--theme-surface": tokens.surface,
    "--theme-text": tokens.text,
  } as CSSProperties;

  return (
    <div
      data-theme={tokens.slug}
      className={fullHeight ? "min-h-screen" : undefined}
      style={style}
    >
      {children}
    </div>
  );
}
