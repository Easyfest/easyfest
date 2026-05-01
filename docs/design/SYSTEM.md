# 🎨 Easyfest Design System

> v1.0 · 1er mai 2026 · Design Captain (autonomie 30 min Claude Opus)

## Identité visuelle

### Palette officielle

| Token CSS | HEX | RGB | Usage |
|---|---|---|---|
| `--brand-coral` | `#FF5E5B` | `255 94 91` | CTA, signature, focus rings |
| `--brand-amber` | `#F4B860` | `244 184 96` | Accent secondaire, highlights |
| `--brand-ink` | `#1A1A1A` | `26 26 26` | Body text, borders |
| `--brand-cream` | `#FFF8F0` | `255 248 240` | Background principal |
| `--brand-sand` | `#F0E8DC` | `240 232 220` | Background subtil (cards passives) |
| `--brand-pine` | `#2D5F4F` | `45 95 79` | Success, écoresponsable |

**Anti-palette** : interdit le bleu (volonté Pam, différenciation vs Sourcil/Weezevent).

### Typographie

```css
/* Display (titres, hero) */
font-family: "Source Serif Pro", "Georgia", serif;

/* Body */
font-family: -apple-system, "Segoe UI", system-ui, sans-serif;

/* Mono (code, IDs) */
font-family: "JetBrains Mono", Consolas, monospace;
```

Échelle : `text-xs` (12px) → `text-5xl` (56px) avec line-height auto-ajusté Tailwind.

### Border radius

- `rounded-sm` (8px) : boutons sm, badges
- `rounded-md` (12px) : inputs, dropdowns
- `rounded-lg` (16px) : cards
- `rounded-2xl` (24px) : sections, modals
- `rounded-full` : pills, avatars

### Ombres

- `shadow-soft` : pour les cards stables (low elevation)
- `shadow-md` : pour les éléments semi-actifs
- `shadow-glow` : pour les CTAs + cards highlight (couleur corail subtile)

## Logos

3 directions générées (`apps/vitrine/public/brand/logos/`) :
1. **Onde solaire** — festival open-air, chaleureux
2. **F monogramme** ⭐ recommandé — sobriété tech, scalable
3. **Cercles entrelacés** — communauté, 5 rôles ensemble

Chaque direction a 4 variantes : couleur / emblème / monochrome / inversé blanc.

Voir [`apps/vitrine/public/brand/README.md`](../../apps/vitrine/public/brand/README.md) pour le guide complet.

## Composants UI disponibles

### Atomes
- `<Button>` (5 variants × 4 sizes)
- `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`, `<CardFooter>`
- `<Badge>` (statuts, tags)
- `<EmptyState>` ⭐ NOUVEAU (5 illustrations propriétaires)

### Métier (Easyfest-specific)
- `<RoleCard>` (Hub picker bénévole/régie/staff_scan/etc.)
- `<WellbeingPicker>` (vert/jaune/rouge)
- `<SaferAlertButton>` (alerte 🚨)

### Marketing (landing, pricing, case study) ⭐ NOUVEAU
- `<HeroSection>` (above-the-fold)
- `<TrustSignals>` (4 metrics + logos partenaires)
- `<ProblemSolution>` (avant/après chaos vs Easyfest)
- `<FeatureGrid>` (6 features-bénéfices)
- `<TestimonialPam>` (cas client + 3 stats)
- `<PricingTable>` (4 paliers Free/Crew/Festival/Pro)
- `<FAQSection>` (8 questions)
- `<CTASection>` (3 variants)

## Illustrations propriétaires

5 SVG empty states dans `apps/vitrine/public/illustrations/` :
- `empty-planning.svg` — cards qui flottent
- `empty-sponsors.svg` — boîte cadeau ouverte
- `mail-sent.svg` — enveloppe qui s'envole en arc
- `festival-map.svg` — plan du site avec scène + bar + tentes
- `community-circle.svg` — feu central + 5 personnes autour

Tous brandés earth-tones, lisibles 200x200 → 800x800.

## Conventions d'usage

### CTAs
- **Primaire (corail)** : 1 par section MAX. Action principale.
- **Secondaire (outline ink)** : alternative non-bloquante.
- **Ghost** : action mineure (lien retour, dismiss).

### Hierarchy

```
H1 (font-display, 48-64px) — 1 par page
├─ H2 (font-display, 32-40px) — sections marketing
│  └─ H3 (font-display, 20-28px) — sub-sections
│     └─ H4 (sans, 18px) — cartes, items
└─ Body (sans, 14-16px)
   ├─ Lead (sans, 18-20px) — sous-headlines hero
   └─ Caption (sans, 12px, opacity 60%) — meta, footnotes
```

### Espacements

- **Sections marketing** : `py-20 md:py-28` (80px → 112px)
- **Cards** : `p-4` à `p-8` selon densité
- **Stack vertical** : `space-y-{2,3,4,6}`
- **Grid gaps** : `gap-3` (12px) à `gap-8` (32px)

## Tokens.css

Source de vérité dans [`packages/ui/src/tokens.css`](../../packages/ui/src/tokens.css).
Importe via `@import "@easyfest/ui/tokens.css"` dans `globals.css`.

## Conversion d'assets

```bash
# SVG → PNG (favicon, OG image)
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32.png
rsvg-convert -w 192 -h 192 favicon.svg -o favicon-192.png
rsvg-convert -w 512 -h 512 favicon.svg -o favicon-512.png
rsvg-convert -w 180 -h 180 apple-touch-icon.svg -o apple-touch-icon.png
rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png
```

## Roadmap design (V1.5+)

À ajouter quand on en aura besoin :
- [ ] Storybook pour preview tous les composants
- [ ] Tokens dark mode (déjà compatible avec inversion CSS)
- [ ] 7 illustrations supplémentaires (12 total prévu dans audit Hermès)
- [ ] Motion identity (Lottie animations)
- [ ] Pack social media templates (Insta posts, stories, LinkedIn)

---

*Doc Design Captain · 1er mai 2026 · Easyfest*
