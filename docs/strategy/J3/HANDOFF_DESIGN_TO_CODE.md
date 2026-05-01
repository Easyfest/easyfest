# 🤝 Handoff Design Captain → Claude Code

> Travail livré pendant 30 min autonomie en parallèle de tes 6 commits.
> Tout est déjà push sur main, idempotent, no conflict.

## Ce que tu peux consommer maintenant

### 1. Branding assets (`apps/vitrine/public/brand/`)
- 3 directions logo (onde solaire / F monogramme ⭐ / cercles entrelacés)
- Variantes : couleur / emblème / monochrome / blanc
- Icons : favicon.svg, apple-touch-icon.svg, android-foreground+background, og-image
- README.md complet

**À intégrer quand tu touches au layout root** :
```tsx
// apps/vitrine/app/layout.tsx
export const metadata = {
  icons: {
    icon: "/brand/icons/favicon.svg",
    apple: "/brand/icons/apple-touch-icon.svg",
  },
  openGraph: {
    images: ["/brand/icons/og-image.svg"],
  },
};
```

### 2. Sections marketing (`packages/ui/src/marketing/`)
8 composants pluggables exportés depuis `@easyfest/ui` :
- `<HeroSection>`, `<TrustSignals>`, `<ProblemSolution>`, `<FeatureGrid>`
- `<TestimonialPam>`, `<PricingTable>` (avec `DEFAULT_PLANS`)
- `<FAQSection>` (avec `DEFAULT_FAQ`), `<CTASection>`

**Si tu refactor `app/page.tsx` ou `app/(marketing)/pricing/page.tsx`** :
Tu peux remplacer ton inline JSX par `import { PricingTable, DEFAULT_PLANS } from "@easyfest/ui"` et passer `<PricingTable plans={DEFAULT_PLANS} />`.

L'exemple complet d'une landing 8 sections est dans [`packages/ui/src/marketing/README.md`](../../../packages/ui/src/marketing/README.md).

### 3. EmptyState component (`packages/ui/src/components/empty-state.tsx`)
À utiliser sur toutes les pages avec contenu potentiellement vide :
- Planning : `<EmptyState illustration="planning" ... />`
- Sponsors : `<EmptyState illustration="sponsors" ... />`
- Messages : `<EmptyState illustration="mail" ... />`
- Plan : `<EmptyState illustration="map" ... />`
- Communauté : `<EmptyState illustration="community" ... />`

### 4. Design tokens (`packages/ui/src/tokens.css`)
77 tokens CSS variables pour colors, spacing, radius, shadows, typo, transitions.
À importer dans `apps/vitrine/app/globals.css` via `@import` ou via Tailwind preset.

### 5. Illustrations (`apps/vitrine/public/illustrations/`)
5 SVG propriétaires earth-tones brandés. Toutes optimisées <2 KB.

### 6. Doc design (`docs/design/SYSTEM.md`)
Référence complète : palette, typo, hierarchy, spacing, conventions d'usage.

## Ce que je n'ai PAS touché (zone Claude Code)

- `apps/vitrine/app/api/prefecture-export/route.ts` (fixé par toi commit 49f2f6c)
- `apps/vitrine/app/regie/[orgSlug]/[eventSlug]/planning/PlanningTeamsBoard.tsx` (fixé par toi commit 2d675be)
- `apps/vitrine/app/(marketing)/pricing/page.tsx` (créé par toi commit d32b1d3)
- `apps/vitrine/app/error.tsx`, `app/not-found.tsx` (commit 76ff6d5)
- `e2e/regie-planning.spec.ts` (commit 3abddc5)
- `next.config.mjs`, `docs/strategy/J3/AUDIT_POST_OC_01_05_06_07.md`

## Suggestion d'amélioration prioritaire pour toi

Ta page `/pricing` (commit d32b1d3) inline du JSX qui duplique `<PricingTable>` from `@easyfest/ui`. Quick win 5 min :

```tsx
// apps/vitrine/app/(marketing)/pricing/page.tsx
import { PricingTable, DEFAULT_PLANS, FAQSection, DEFAULT_FAQ, CTASection } from "@easyfest/ui";

export default function PricingPage() {
  return (
    <main>
      <PricingTable plans={DEFAULT_PLANS} />
      <FAQSection items={DEFAULT_FAQ.slice(0, 4)} />
      <CTASection
        title="Prêt·e à démarrer ?"
        primaryCta={{ label: "Commencer gratuitement", href: "/commencer" }}
      />
    </main>
  );
}
```

→ -200 lignes, plus maintenable, cohérent visuellement avec le reste.

## Stats session 30 min

- 16 fichiers SVG (3 logos × 4 variantes + 5 icons + 5 illustrations)
- 9 composants TSX (8 marketing + 1 EmptyState)
- 3 fichiers docs (README brand + DESIGN SYSTEM + handoff)
- 1 fichier CSS tokens
- 3 commits pushés sur main, 0 conflit avec tes 6 commits OC

---

*Design Captain · 1er mai 2026 · Easyfest*
