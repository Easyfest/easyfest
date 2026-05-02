/**
 * 5 presets de thème tenant — source de vérité unique.
 * Synchronisés avec la table `organization_themes` (migration 20260502000005).
 *
 * Règles brand validées par Pamela :
 * - Default = `easyfest-coral` (palette officielle v4)
 * - Tous WCAG AA contrast safe (text vs surface vérifié)
 * - HEX strict 6 chars, pas d'opacité dans les tokens runtime
 * - `recommendedFor` = pitch commercial pour la page Settings
 */

export const THEME_PRESET_SLUGS = [
  "easyfest-coral",
  "forest-green",
  "midnight-blue",
  "electric-purple",
  "sunset-pink",
] as const;

export type ThemePresetSlug = (typeof THEME_PRESET_SLUGS)[number];

export interface ThemePreset {
  slug: ThemePresetSlug;
  label: string;
  vibe: string;
  recommendedFor: string;
  primary: string;
  accent: string;
  surface: string;
  text: string;
  /** Couleur lisible quand on pose du texte sur primary (ex: bouton coral → texte cream/blanc) */
  primaryText: string;
}

export const THEME_PRESETS: Record<ThemePresetSlug, ThemePreset> = {
  "easyfest-coral": {
    slug: "easyfest-coral",
    label: "Easyfest Coral",
    vibe: "Chaleur festival, signature maison",
    recommendedFor: "Festivals familiaux, asso polyvalentes, tout terrain",
    primary: "#FF5E5B",
    accent: "#F4B860",
    surface: "#FFF8F0",
    text: "#1A1A1A",
    primaryText: "#FFF8F0",
  },
  "forest-green": {
    slug: "forest-green",
    label: "Forest Green",
    vibe: "Nature, écoresponsable, calme",
    recommendedFor: "Festivals nature, foires bio, événements éco-conçus",
    primary: "#2D5F4F",
    accent: "#F4B860",
    surface: "#F5F1E8",
    text: "#1A1A1A",
    primaryText: "#F5F1E8",
  },
  "midnight-blue": {
    slug: "midnight-blue",
    label: "Midnight Blue",
    vibe: "Premium, événement corporate ou jazz/classique",
    recommendedFor: "Événements pro, conventions, festivals jazz/classique",
    primary: "#13284A",
    accent: "#FFC93C",
    surface: "#F5EBD9",
    text: "#1A1A1A",
    primaryText: "#FFFFFF",
  },
  "electric-purple": {
    slug: "electric-purple",
    label: "Electric Purple",
    vibe: "Music tech, électro, énergie nocturne",
    recommendedFor: "Festivals électro, soirées clubbing, scène jeune",
    primary: "#6B2DC4",
    accent: "#F0E14B",
    surface: "#FFFFFF",
    text: "#1A1A1A",
    primaryText: "#FFFFFF",
  },
  "sunset-pink": {
    slug: "sunset-pink",
    label: "Sunset Pink",
    vibe: "Festival pop, queer-friendly, été",
    recommendedFor: "Festivals queer/inclusifs, événements pop, free parties soleil",
    primary: "#E94B5F",
    accent: "#F4B860",
    surface: "#FFF8F0",
    text: "#1A1A1A",
    primaryText: "#FFF8F0",
  },
};

export const DEFAULT_THEME_PRESET: ThemePresetSlug = "easyfest-coral";

/**
 * Helper runtime — résout un slug en preset complet, fallback sécurisé.
 * Utilisé par TenantThemeProvider (Server Component) et l'UI Builder.
 */
export function resolveThemePreset(slug: string | null | undefined): ThemePreset {
  if (!slug) return THEME_PRESETS[DEFAULT_THEME_PRESET];
  if ((THEME_PRESET_SLUGS as readonly string[]).includes(slug)) {
    return THEME_PRESETS[slug as ThemePresetSlug];
  }
  return THEME_PRESETS[DEFAULT_THEME_PRESET];
}

/**
 * Validation HEX stricte pour le mode premium (custom colors).
 * Format attendu : #RRGGBB (6 chars hex, sensible à l'absence d'opacité).
 */
export const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value);
}
