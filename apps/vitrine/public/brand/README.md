# 🎨 Easyfest — Brand assets

> Pack identité visuelle généré par Design Captain · 1er mai 2026

## 3 directions de logo

### Direction 1 — `01-onde-solaire`
**Symbole** : onde sonore + soleil levant.
**Symbolique** : musique + ouverture + horizon (festival open-air).
**Style** : géométrique simple, monoligne, gradient corail→ambre.
**Quand l'utiliser** : festivals musique en plein air, événements open-air.
**Note marketing** : ★★★★ (chaleureux, immédiat à lire).

### Direction 2 — `02-f-monogramme` ⭐ recommandée
**Symbole** : carré arrondi corail avec F custom (3 traits + point déliant).
**Symbolique** : sobriété tech + élégance, modulaire, scalable.
**Style** : flat design moderne, contraste max corail/cream.
**Quand l'utiliser** : favicon, app icon, tout contexte multi-tenant (le logo reste fort sur fond varié).
**Note marketing** : ★★★★★ (lisible 16x16, scalable, pro).

### Direction 3 — `03-cercles-entrelaces`
**Symbole** : 5 cercles imbriqués (les 5 rôles : direction, lead, post-lead, scan, bénévole).
**Symbolique** : collectif, écosystème, équipe qui tient ensemble.
**Style** : organique, courbes douces, multi-couleurs.
**Quand l'utiliser** : pages communauté, témoignages, sponsors collaboratifs.
**Note marketing** : ★★★ (joli mais charge cognitive plus élevée).

## Variantes par direction

| Variante | Suffixe fichier | Usage |
|---|---|---|
| Logo couleur horizontal | `.svg` | Header site, signature mail |
| Emblème seul (carré 1:1) | `-emblem.svg` | Avatar, app icon, favicon source |
| Monochrome ink | `-mono.svg` | Impression noir et blanc, fax, journal |
| Inversé (sur fond sombre) | `-blanc.svg` | Hero photo, dark mode |

## Icons (basés sur Direction 2)

| Fichier | Format | Usage |
|---|---|---|
| `icons/favicon.svg` | SVG | `<link rel="icon">` |
| `icons/apple-touch-icon.svg` | SVG (à exporter en PNG 180x180) | iOS home screen |
| `icons/android-foreground.svg` + `android-background.svg` | SVG (à packager via studio) | Android adaptive icon |
| `icons/og-image.svg` | SVG (à exporter en PNG 1200x630) | OpenGraph, Twitter card |

## Recommandation finale

**Direction 2 (F monogramme)** pour la production :
- ✅ Scalable parfaite (16x16 → 1200x1200)
- ✅ Mémorable (forme carrée + F + point unique)
- ✅ Compatible iOS adaptive icon
- ✅ Premier feedback chaleureux mais pro
- ✅ Distinctif vs concurrents (Sourcil = bleu sage / Weezevent = orange terne)

**Direction 1 (Onde solaire)** en backup pour les contextes festival pur (affiches, programmes).

## Conversion SVG → PNG

```bash
# Avec ImageMagick
convert -background none -resize 32x32 favicon.svg favicon-32.png
convert -background none -resize 192x192 favicon.svg favicon-192.png
convert -background none -resize 512x512 favicon.svg favicon-512.png

# Avec rsvg-convert (mieux pour la précision pixel)
rsvg-convert -w 180 -h 180 apple-touch-icon.svg -o apple-touch-icon.png
rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png
```

## Palette officielle

| Token | Valeur | Usage |
|---|---|---|
| `--brand-coral` | `#FF5E5B` | Signature, CTA |
| `--brand-amber` | `#F4B860` | Accent secondaire |
| `--brand-ink` | `#1A1A1A` | Texte body |
| `--brand-cream` | `#FFF8F0` | Fond principal |
| `--brand-pine` | `#2D5F4F` | Accent vert (success, écoresponsable) |

## Typographie

- **Display** (titres) : `font-display` configurable, fallback `'Segoe UI', system-ui`
- **Body** : `-apple-system`, `Segoe UI`, sans-serif
- **Mono** : `JetBrains Mono`, `Consolas`

---

*Pour préview les SVG en local : ouvre directement dans ton navigateur ou drag-and-drop sur https://yoksel.github.io/url-encoder/*
