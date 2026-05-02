# Post-RDL TODO — items différés

Items détectés pendant l'audit J-26 mais non urgents. À traiter après le festival 2026.

## QR display — vérifier rendering en conditions réelles

Le composant `apps/vitrine/components/qr-display.tsx` utilise `qrcode.toCanvas`
(canvas, pas SVG) avec `errorCorrectionLevel: "H"` et `width: 280`. Code revue
J-26 : pas de bug évident.

**À re-tester après Cowork audit-extrême** :

- Sur iPhone Safari hors-ligne, le QR doit s'afficher sans "carré blanc"
- Sur Android Chrome low-end, vérifier que la bgColor `#FFF4E6` (sand) ne
  trompe pas un scanner qui attendrait `#FFFFFF` pur
- Si bug confirmé par Cowork : passer en SVG via `QRCode.toString(token, { type: 'svg' })`
  pour rendu SSR-safe et meilleure portabilité

## Templates email Supabase — push via Management API

Les 4 templates HTML (confirm-signup, magic-link, recovery, application-validated)
sont à jour dans `apps/vitrine/templates/email/`. Pour les pousser dans Supabase
Auth dashboard programmatically, il faut un script utilisant
`PATCH https://api.supabase.com/v1/projects/{ref}/config/auth` avec
`SUPABASE_ACCESS_TOKEN`. Bloqué tant que `.env.deploy.local` n'est pas
disponible côté Claude Code.

Voir `docs/SETUP_EMAIL_TEMPLATES.md` pour le pas-à-pas manuel actuel.

## Bugs Cowork audit-extrême

À traiter quand `BUGS_AUDIT_EXTREME.md` sera généré (relancer Cowork avec
`PROMPT_AUDIT_EXTREME_COWORK.md`).

## DB cleanup post-audit

À traiter quand `CLEANUP_DB_AUDIT.md` sera généré et `.env.deploy.local`
disponible. Voir Phase 5 du `PROMPT_AUDIT_EXTREME_CODE.md`.
