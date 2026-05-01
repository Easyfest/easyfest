# BACKLOG J3 — 6 chantiers OC

> Date de rédaction : 2026-05-01
> Stack : monorepo pnpm/turbo, Next.js 14 vitrine (Netlify), Expo mobile (EAS), Supabase 10 migrations + RLS + 6 edge functions, Sentry/PostHog déjà déclarés
> Référentiel produit : voir `Easyfest_Cahier_Technique_v1.md` et `Easy_Fest_Strategie_Master_v1.md`

---

## Conventions

- **Priorité** : P0 = sprint J3, P1 = sprint J4, P2 = backlog froid
- **Estimation** : jours.homme idéaux (1 dev senior, sans interruption)
- **Statut** : `À faire` / `En cours` / `Bloqué (voir Issues ouvertes)` / `Fait`
- **AC** = critères d'acceptation (Definition of Done explicite)
- **Deps** = dépendances bloquantes vers d'autres OC ou setup tiers
- Cadence commits : 1 commit + 1 push par OC complet (jamais par fichier)

---

## OC-04 + OC-05 — RGPD endpoints (export Art.15 + suppression Art.17 soft-delete 30j)

- **Priorité** : P0
- **Estimation** : 1.5 j
- **Statut** : ✅ **Fait** (commit `cbd245a`, 2026-05-01) — version JSON unique. Voir OC-04bis pour ZIP/email/restore-by-token.
- **Deps** : aucune (Supabase + helpers déjà en place)

### Contexte

L'edge function `rgpd_purge` existante anonymise les données après 12 mois d'inactivité. Elle reste indépendante. **Ce chantier ajoute** l'auto-service utilisateur :

- **Art.15 — Droit d'accès / portabilité** : l'utilisateur télécharge un export JSON complet de ses données.
- **Art.17 — Droit à l'effacement** : l'utilisateur demande la suppression. Soft-delete 30 jours (fenêtre de récupération produit, **pas légale**), puis purge hard via cron.

### Acceptance criteria

- [ ] Migration `0010_rgpd_soft_delete.sql` :
  - colonne `deleted_at timestamptz null` ajoutée à `volunteer_profiles` et `auth.users` via colonne miroir sur `volunteer_profiles`
  - colonne `deletion_requested_at timestamptz null` sur `volunteer_profiles`
  - index partial `idx_vp_deletion_pending` sur `(deletion_requested_at)` where `deleted_at is null`
  - RLS update : `vp_select_self` et `vp_update_self` filtrent `deleted_at is null` (compte soft-deleted = invisible sauf via Art.15 / restauration)
- [ ] Route `GET /api/account/export` (Next route handler) :
  - auth requise (Supabase session)
  - retourne JSON avec : `profile`, `applications` (toutes events confondus), `memberships`, `assignments`, `signed_engagements`, `notification_log` (limité aux logs de l'user)
  - fonctionne même si compte soft-deleted (Art.15 prévaut)
  - log `audit_log` action `rgpd.export.requested`
  - réponse `Content-Type: application/json` avec `Content-Disposition: attachment; filename="easyfest-export-{userId}-{date}.json"`
- [ ] Route `POST /api/account/delete` :
  - auth requise
  - body : `{ confirm: "DELETE" }` (anti-clic accidentel)
  - SET `deletion_requested_at = now()`, `deleted_at = now() + interval '30 days'` sur `volunteer_profiles`
  - log `audit_log` action `rgpd.deletion.requested` avec `payload.recovery_until = deleted_at`
  - sign-out l'utilisateur côté cookies (Supabase auth)
- [ ] Route `POST /api/account/restore` :
  - auth requise
  - reset `deleted_at = null`, `deletion_requested_at = null` si `deleted_at > now()` (donc encore dans la fenêtre 30j)
  - log `audit_log` action `rgpd.deletion.cancelled`
- [ ] Edge function `rgpd_hard_delete` (cron quotidien) :
  - X-Cron-Secret guard (même pattern que `rgpd_purge`)
  - cible : `volunteer_profiles where deleted_at < now()`
  - suppression hard du `auth.users` (cascade sur memberships/applications via FK existantes)
  - log `audit_log` action `rgpd.deletion.completed`
- [ ] Page `/account/privacy` (vitrine) — UI minimaliste :
  - bouton "Télécharger mes données" → fetch `/api/account/export` → download
  - bouton "Supprimer mon compte" → modal de confirmation (saisir "DELETE") → POST + redirect `/legal/privacy`
  - si compte en cours de suppression : bandeau jaune "Votre compte sera supprimé le {date}" + bouton "Annuler la suppression"
- [ ] Lien dans `/hub` vers `/account/privacy`
- [ ] Mention dans `/legal/privacy` mise à jour : exercer Art.15 et Art.17 via `/account/privacy` (en plus du contact email existant)

### Fichiers touchés / créés

```
packages/db/supabase/migrations/20260501000010_rgpd_soft_delete.sql            [CREATE]
packages/db/supabase/functions/rgpd_hard_delete/index.ts                       [CREATE]
packages/db/supabase/functions/_shared/supabase.ts                             [READ — déjà partagé]
apps/vitrine/app/api/account/export/route.ts                                   [CREATE]
apps/vitrine/app/api/account/delete/route.ts                                   [CREATE]
apps/vitrine/app/api/account/restore/route.ts                                  [CREATE]
apps/vitrine/app/account/privacy/page.tsx                                      [CREATE]
apps/vitrine/app/account/privacy/PrivacyActions.tsx                            [CREATE — client component]
apps/vitrine/app/legal/privacy/page.tsx                                        [EDIT — ajout lien]
apps/vitrine/app/hub/page.tsx                                                  [EDIT — ajout lien menu]
apps/vitrine/e2e/rgpd.spec.ts                                                  [CREATE — happy path export+delete+restore]
```

### Risques / points de vigilance

- L'export Art.15 doit fonctionner **même si compte soft-deleted** — RLS spécifique nécessaire ou utiliser le service client côté route handler avec un filtre explicite par user_id de la session.
- La purge hard cron doit être **idempotente** (re-runnable sans erreur si row déjà supprimée).
- Coexistence avec `rgpd_purge` (anonymisation 12m) : le `deleted_at` court-circuite la purge anonymisation pour les comptes soft-deleted (sinon double-traitement). Documenté dans la migration.

---

## OC-01 — Onboarding self-service (wizard 5 étapes)

- **Priorité** : P0
- **Estimation** : 2 j
- **Statut** : ✅ **Fait** (commit `20820b7`, 2026-05-01)
- **Route canonique** : `/commencer` (FR — SEO + cohérence landing). `/onboarding` redirige 308.
- **Server actions** : `apps/vitrine/app/actions/org-creation.ts` (distinct de `actions/onboard.ts` = auto-upgrade bénévole).
- **Deps** : aucune (RLS `events_insert_authenticated` + `memberships_insert_lead` déjà en place ; on ajoute une exception `direction` auto-créée pour le créateur de l'org)

### Contexte

Aujourd'hui les nouveaux clients sont onboardés manuellement (B2B accompagné). OC-01 ouvre un canal **self-service** parallèle. **Additif** — ne casse aucun flow existant (auth, /hub, /regie/*).

### Acceptance criteria

- [ ] Migration `0011_onboarding.sql` :
  - table `event_templates` (id, slug, name, description, default_positions jsonb, default_shifts jsonb, default_event_settings jsonb, is_public boolean default true)
  - seed de 3 templates : `festival-musique-petite-jauge` (≤500 pers), `festival-musique-moyenne-jauge` (500-2000), `evenement-associatif` (générique)
  - RLS : `event_templates` lecture publique pour tous (insert/update via service role uniquement)
  - fonction `bootstrap_org_for_user(p_org_name text, p_org_slug text, p_event_name text, p_event_slug text, p_template_slug text)` security definer :
    - crée `organizations` row
    - crée `events` row (status `draft`)
    - crée `memberships` `(user_id=auth.uid(), event_id, role='direction')`
    - applique le template (insert positions + shifts depuis le `default_positions` JSON)
    - retourne `(org_id, event_id, event_slug)`
- [ ] Routes vitrine :
  - `/onboarding` (entry point — redirige vers étape 1 ou skip si l'user a déjà un membership direction/volunteer_lead)
  - `/onboarding/org` (étape 1 : nom asso + slug + logo optionnel)
  - `/onboarding/event` (étape 2 : nom event + slug + dates + lieu)
  - `/onboarding/template` (étape 3 : choisir un template parmi les 3 + preview)
  - `/onboarding/team` (étape 4 : inviter par email — multi-input, max 10, role obligatoire)
  - `/onboarding/done` (étape 5 : récap + CTA "Aller au régie dashboard")
- [ ] Server Action `createOnboardingOrg` (étape 1+2+3 batch) appelle `bootstrap_org_for_user`
- [ ] Server Action `inviteTeamMembers` (étape 4) :
  - pour chaque email : `auth.admin.inviteUserByEmail` (service role) + insert `memberships(role, event_id, invited_by, invited_at)` avec `is_active=false` jusqu'à acceptation
  - email envoyé via Resend (déjà en deps) avec lien magic-link vers `/auth/callback?invite=event_id`
- [ ] Composant `<WizardLayout currentStep={1..5} />` partagé (progress bar 5 dots)
- [ ] Validation Zod côté serveur sur chaque étape (slugs uniques, dates cohérentes, emails valides)
- [ ] Lien "Créer mon organisation" sur `/` (page d'accueil) si user non-loggué → `/auth/login?redirect=/onboarding`
- [ ] Skip auto si l'user a déjà un membership `direction` quelque part : redirect `/hub`

### Fichiers touchés / créés

```
packages/db/supabase/migrations/20260501000011_onboarding.sql                  [CREATE]
apps/vitrine/app/onboarding/layout.tsx                                         [CREATE]
apps/vitrine/app/onboarding/WizardLayout.tsx                                   [CREATE]
apps/vitrine/app/onboarding/page.tsx                                           [CREATE — gateway redirect]
apps/vitrine/app/onboarding/org/page.tsx                                       [CREATE]
apps/vitrine/app/onboarding/event/page.tsx                                     [CREATE]
apps/vitrine/app/onboarding/template/page.tsx                                  [CREATE]
apps/vitrine/app/onboarding/team/page.tsx                                      [CREATE]
apps/vitrine/app/onboarding/done/page.tsx                                      [CREATE]
apps/vitrine/app/onboarding/actions.ts                                         [CREATE — server actions]
apps/vitrine/app/page.tsx                                                      [EDIT — ajout CTA]
apps/vitrine/lib/onboarding/templates.ts                                       [CREATE — helpers JSON template→positions/shifts]
apps/vitrine/lib/onboarding/invite-email.ts                                    [CREATE — template Resend]
apps/vitrine/e2e/onboarding.spec.ts                                            [CREATE — happy path 5 étapes]
```

### Risques / points de vigilance

- `bootstrap_org_for_user` doit créer le `direction` membership en bypassant la policy `memberships_insert_lead` (qui exige déjà un `volunteer_lead+`) → security definer obligatoire.
- Slug org/event : collision possible. Validation server-side avec retry suggestion (`-2`, `-3`, …) plutôt que erreur dure.
- Les invitations équipe doivent être idempotentes (même email invité 2x = 1 seul membership).

---

## OC-04bis — Export ZIP + mail "tu as 30j" + restore-by-token signé

- **Priorité** : P1
- **Estimation** : 0.5–1 j
- **Statut** : À faire — **avant V1 GA juin 2026** (pas critique pour la démo Pam dimanche)
- **Deps** : OC-04+05 livré (commit `cbd245a`)

### Contexte

OC-04+05 livre un export Art.15 en JSON unique et un soft-delete sans email. Pour la V1 GA, l'expérience utilisateur attendue est plus aboutie :

1. **Export = ZIP** avec `profile.json`, `applications.json`, `photos/avatar.{jpg,png}` (binaires depuis Supabase Storage).
2. **Mail post-suppression** "tu as 30 jours pour annuler" avec lien restore signé.
3. **Restore-by-token URL-able** depuis le mail (pas seulement bouton UI sur `/account/privacy`).

### Acceptance criteria

- [ ] Dépendance `jszip` ajoutée à `apps/vitrine/package.json`.
- [ ] Route `/api/account/export` mise à jour :
  - retourne `Content-Type: application/zip`, `Content-Disposition: attachment; filename="easyfest-export-{userId}-{date}.zip"`
  - structure : `profile.json`, `applications.json`, `memberships.json`, `assignments.json`, `signed_engagements.json`, `notification_log.json`, `photos/avatar.<ext>` (téléchargé depuis bucket `avatars` Supabase Storage)
  - le bandeau "Art.15" du JSON principal explique la structure du ZIP.
- [ ] Token restore signé :
  - migration `0030_rgpd_restore_tokens.sql` : table `rgpd_restore_tokens (token text primary key, user_id uuid, expires_at timestamptz, used_at timestamptz null)`
  - server action génère un token `crypto.randomUUID()` lors de `/api/account/delete`, stocké avec `expires_at = deleted_at` (= now + 30j)
- [ ] Mail Resend post-delete :
  - template HTML simple : titre "Ton compte sera supprimé le {date}", paragraphe avec lien `https://easyfest.app/account/restore?token={token}`, signature DPO
  - envoyé en bg de `/api/account/delete` (best-effort, non bloquant pour le sign-out)
- [ ] Route `GET /account/restore?token=X` :
  - vérifie token valide (existe, pas expiré, pas déjà utilisé)
  - appelle `rgpd_restore_self()` (RPC existante)
  - marque token `used_at = now()` (anti-rejouage)
  - redirect `/auth/login?restored=1` avec bandeau de confirmation à la connexion suivante
- [ ] E2E `e2e/rgpd.spec.ts` étendu :
  - export retourne `application/zip`
  - body est un ZIP valide (signature `PK\x03\x04`)
  - `/account/restore?token=invalid` renvoie page d'erreur claire

### Fichiers touchés / créés

```
packages/db/supabase/migrations/20260615000010_rgpd_restore_tokens.sql        [CREATE]
apps/vitrine/app/api/account/export/route.ts                                  [REWRITE — ZIP au lieu de JSON]
apps/vitrine/app/api/account/delete/route.ts                                  [EDIT — génère token + envoie mail]
apps/vitrine/app/account/restore/route.ts                                     [CREATE — handler GET token]
apps/vitrine/lib/email/account-deletion-template.tsx                          [CREATE — template Resend]
apps/vitrine/package.json                                                     [EDIT — +jszip]
apps/vitrine/e2e/rgpd.spec.ts                                                 [EDIT — assertions ZIP + token]
```

---

## OC-06 + OC-07 — Tests E2E + CI (5 happy paths + GH Actions + Sentry + PostHog)

- **Priorité** : P0
- **Estimation** : 1.5 j
- **Statut** : À faire
- **Deps** : OC-04+05 et OC-01 livrés (tests les couvrent)

### Contexte

Playwright 1.43 + GH Actions déjà en place avec 1 happy path (signup vitrine). Sentry et PostHog **déclarés dans deps mais pas câblés** (pas d'init global, pas de DSN check). Ce chantier complète : 5 happy paths + matrix CI + Sentry init + PostHog opt-in init.

### Acceptance criteria

#### Tests E2E — 5 happy paths

- [ ] `e2e/signup.spec.ts` (existant) : Vitrine ICMPACA → festival → inscription wizard 5 étapes (déjà OK)
- [ ] `e2e/onboarding.spec.ts` (livré par OC-01) : créer org + event + template + skip team + done
- [ ] `e2e/rgpd.spec.ts` (livré par OC-04+05) : export → delete → restore avant 30j
- [ ] `e2e/regie-planning.spec.ts` (NEW) : volunteer_lead crée une position + shift + assigne un bénévole (utilise les seeds RDL 2026 existants)
- [ ] `e2e/staff-scan.spec.ts` (NEW) : staff_scan lit un QR (mock JWT signé) et marque l'entrée
- [ ] `playwright.config.ts` : `webServer` configuré pour démarrer `pnpm --filter @easyfest/vitrine dev` en CI, projets chromium + mobile-chrome (Pixel 5 viewport)

#### CI — GitHub Actions

- [ ] `.github/workflows/ci.yml` étendu :
  - matrix `node: [20]` (préparé pour 22 ultérieurement)
  - job `e2e` lance les 5 specs (pas seulement signup)
  - upload artifact `playwright-report` toujours (déjà en place)
  - nouveau job `sentry-sourcemaps` : upload sourcemaps via `@sentry/cli` sur push `main` uniquement (gardé par `if: github.ref == 'refs/heads/main'`)
- [ ] `SENTRY_AUTH_TOKEN` déclaré dans secrets repo (à demander à l'utilisateur — voir Issues ouvertes si non fourni)

#### Sentry

- [ ] `apps/vitrine/sentry.client.config.ts` : init `Sentry.init({ dsn, tracesSampleRate: 0.1, replaysSessionSampleRate: 0, replaysOnErrorSampleRate: 1.0 })`
- [ ] `apps/vitrine/sentry.server.config.ts` : init côté serveur, `tracesSampleRate: 0.2`
- [ ] `apps/vitrine/sentry.edge.config.ts` : init côté edge runtime (Next middleware)
- [ ] `apps/vitrine/next.config.mjs` : wrap avec `withSentryConfig` (silent en dev sans DSN)
- [ ] `instrumentation.ts` à la racine de `apps/vitrine` (Next 14 hook standard)
- [ ] DSN lu depuis `process.env.NEXT_PUBLIC_SENTRY_DSN` ; si absent en dev → init no-op (pas de throw)

#### PostHog

- [ ] `apps/vitrine/lib/analytics/posthog.ts` : init lazy (uniquement si cookie `analytics_consent=true`)
- [ ] Hook `usePostHog()` réutilisable dans les pages clés
- [ ] Capture des events critiques : `onboarding_started`, `onboarding_completed`, `account_export_downloaded`, `account_deletion_requested`, `account_deletion_cancelled`
- [ ] Banner cookie EU existant doit setter le cookie `analytics_consent` à `true/false` (vérifier que c'est déjà le cas, sinon corriger)

### Fichiers touchés / créés

```
apps/vitrine/sentry.client.config.ts                                           [CREATE]
apps/vitrine/sentry.server.config.ts                                           [CREATE]
apps/vitrine/sentry.edge.config.ts                                             [CREATE]
apps/vitrine/instrumentation.ts                                                [CREATE]
apps/vitrine/next.config.mjs                                                   [EDIT — wrap withSentryConfig]
apps/vitrine/lib/analytics/posthog.ts                                          [CREATE]
apps/vitrine/lib/analytics/usePostHog.ts                                       [CREATE]
apps/vitrine/components/CookieBanner.tsx                                       [EDIT — setter cookie]
apps/vitrine/playwright.config.ts                                              [EDIT — webServer + projects]
apps/vitrine/e2e/regie-planning.spec.ts                                        [CREATE]
apps/vitrine/e2e/staff-scan.spec.ts                                            [CREATE]
.github/workflows/ci.yml                                                       [EDIT — matrix + sourcemaps job]
.env.example                                                                   [EDIT — NEXT_PUBLIC_SENTRY_DSN, NEXT_PUBLIC_POSTHOG_KEY]
```

### Risques / points de vigilance

- Sentry sans DSN en dev : ne doit pas casser le build local. Init conditionnelle.
- PostHog sans consent : aucune requête ne doit partir (vérifier devtools network en E2E).
- E2E `staff-scan` nécessite un JWT QR signé : utiliser le secret `QR_HMAC_SECRET` côté test fixture, pas en prod.
- L'utilisateur n'a peut-être pas encore créé le projet Sentry / PostHog : si pas de DSN → ouvrir issue, livrer le code init avec fallback no-op et continuer.

---

## OC-08 — Module Artistes (table + page + CRUD + conflit horaire + export pack artistes)

- **Priorité** : P1
- **Estimation** : 1.5 j
- **Statut** : À faire
- **Deps** : aucune

### Acceptance criteria

- [ ] Migration `0012_artists.sql` :
  - table `artists` : `id`, `event_id` (FK), `name`, `stage_name`, `genre`, `country`, `contact_email`, `tech_rider_url`, `hospitality_rider_url`, `notes`
  - table `artist_performances` : `id`, `artist_id`, `event_id`, `stage` (text), `starts_at` (timestamptz), `ends_at` (timestamptz), `set_duration_min`
  - check constraint : `ends_at > starts_at`
  - exclusion constraint (btree_gist) : un même `(artist_id, tstzrange(starts_at, ends_at))` ne peut pas se chevaucher → empêche un artiste joué simultanément sur 2 scènes
  - RLS : lecture par membres event (via `memberships`), modif par `volunteer_lead+`
- [ ] Route `/regie/[orgSlug]/[eventSlug]/artists/page.tsx` (table + CRUD inline)
- [ ] Server actions `createArtist`, `updateArtist`, `deleteArtist`, `addPerformance`, `removePerformance`
- [ ] Détection conflits horaires : query SQL avec `tstzrange && tstzrange` retournant les overlap pour highlight UI rouge
- [ ] Export "pack artistes" : route `/regie/[orgSlug]/[eventSlug]/artists/export` retourne ZIP (JSZip côté serveur) avec :
  - 1 PDF par artiste (généré server-side avec `@react-pdf/renderer`) : fiche, riders, contact, performances
  - 1 CSV global de tous les artistes
- [ ] Page mobile read-only `/v/[orgSlug]/[eventSlug]/artists` (volontaires voient le programme, pas les contacts/riders)

### Fichiers touchés / créés

```
packages/db/supabase/migrations/20260501000012_artists.sql                     [CREATE]
apps/vitrine/app/regie/[orgSlug]/[eventSlug]/artists/page.tsx                  [CREATE]
apps/vitrine/app/regie/[orgSlug]/[eventSlug]/artists/ArtistsTable.tsx          [CREATE]
apps/vitrine/app/regie/[orgSlug]/[eventSlug]/artists/actions.ts                [CREATE]
apps/vitrine/app/regie/[orgSlug]/[eventSlug]/artists/export/route.ts           [CREATE]
apps/vitrine/app/v/[orgSlug]/[eventSlug]/artists/page.tsx                      [CREATE]
apps/vitrine/lib/pdf/artist-pack.tsx                                           [CREATE]
apps/vitrine/package.json                                                      [EDIT — +@react-pdf/renderer, +jszip]
```

---

## OC-14 — Cmd+K Search globale (shadcn/ui cmdk)

- **Priorité** : P1
- **Estimation** : 1 j
- **Statut** : À faire
- **Deps** : aucune (mais shadcn/ui pas installé — gros bootstrap)

### Acceptance criteria

- [ ] Bootstrap shadcn/ui dans `packages/ui` (init config `components.json`, ajout primitives `command`, `dialog`, `button`, `input`)
- [ ] Composant `<GlobalCommandPalette>` monté dans `apps/vitrine/app/layout.tsx`
- [ ] Raccourci `Cmd+K` (mac) / `Ctrl+K` (win/linux) ouvre la palette
- [ ] Catégories de résultats (selon rôle de l'user via `role_in_event`) :
  - **Navigation** : Hub, Régie, Mon planning, Charte, Vie privée
  - **Bénévoles** (si lead+) : recherche full-text sur `volunteer_profiles.full_name`
  - **Artistes** (si OC-08 livré) : recherche sur `artists.stage_name`
  - **Postes** : recherche sur `positions.name`
- [ ] Clic résultat → navigation Next router
- [ ] Recherche debounced 200ms, top 5 par catégorie
- [ ] Server action `searchGlobal(query: string, eventId?: uuid)` filtrée par RLS (utilise client serveur normal, pas service)

### Fichiers touchés / créés

```
packages/ui/components.json                                                    [CREATE]
packages/ui/src/components/command.tsx                                         [CREATE — shadcn cmdk]
packages/ui/src/components/dialog.tsx                                          [CREATE — shadcn]
packages/ui/src/components/button.tsx                                          [CREATE — shadcn]
packages/ui/package.json                                                       [EDIT — +cmdk, +@radix-ui/react-dialog]
apps/vitrine/components/GlobalCommandPalette.tsx                               [CREATE]
apps/vitrine/app/layout.tsx                                                    [EDIT — mount palette]
apps/vitrine/app/api/search/global/route.ts                                    [CREATE]
```

---

## OC-11 — Témoignage Pam (Roots du Lac) — guide tournage + script + landing case study

- **Priorité** : P2
- **Estimation** : 0.5 j (le code) + 0 j (le tournage est offline, pas dev)
- **Statut** : À faire
- **Deps** : aucune

> **Identité confirmée** : Pam = direction de **Roots du Lac**, festival ZIK en PACA. **Pas Astropolis.**

### Acceptance criteria

- [ ] `docs/marketing/case-study-pam-tournage-guide.md` :
  - 8 questions cadrées (problème avant Easyfest, friction principale, déclic, mise en place, premier moment "ça marche", impact mesurable, recommandation, citation finale)
  - Conseils techniques tournage (cadre, son, B-roll terrain, durée cible 90s + 30s pour social)
  - Script proposé en français (3-4 phrases par question, ton conversationnel)
- [ ] Page `/case-studies/roots-du-lac` (vitrine) :
  - Hero : photo Pam (placeholder en attendant tournage) + nom festival + métriques clés (placeholders : `{{X}} bénévoles`, `{{Y}} % no-show réduit`)
  - Section vidéo : `<video>` lazy-loaded (placeholder MP4 en attendant), fallback poster
  - 3 sections "Avant / Le déclic / Après" en blocs alternés
  - Citations Pam pull-out (style large)
  - CTA bas de page → `/onboarding`
- [ ] Lien "Témoignages" depuis `/` (footer ou nav)
- [ ] OG image générée (`/case-studies/roots-du-lac/opengraph-image.tsx`)

### Fichiers touchés / créés

```
docs/marketing/case-study-pam-tournage-guide.md                                [CREATE]
apps/vitrine/app/case-studies/roots-du-lac/page.tsx                            [CREATE]
apps/vitrine/app/case-studies/roots-du-lac/opengraph-image.tsx                 [CREATE]
apps/vitrine/app/case-studies/layout.tsx                                       [CREATE — wrapper marketing]
apps/vitrine/public/case-studies/roots-du-lac/video-poster.jpg                 [CREATE — placeholder]
apps/vitrine/app/page.tsx                                                      [EDIT — lien footer]
```

---

## Ordre d'exécution J3

Les 3 P0 dans l'ordre :

1. ✅ **OC-04 + OC-05** RGPD — livré commit `cbd245a` (version JSON, OC-04bis traite ZIP+mail+restore-by-token)
2. ✅ **OC-01** Onboarding — livré commit `20820b7`, route `/commencer` canonique
3. ⏳ **OC-06 + OC-07** Tests + CI — scaffolded, attend feu vert après tests fumée manuels

Total P0 livré : **3.5 j** (OC-04+05 + OC-01). Reste OC-06+07 : 1.5 j.

Backlog P1/P2 : **OC-04bis** (V1 GA juin 2026), OC-08 Artistes, OC-14 Cmd+K, OC-11 Témoignage Pam.

---

## ISSUES OUVERTES

(Aucune pour l'instant — sera mise à jour si un OC bloque pendant l'exécution.)

### Setup pré-requis non couverts par les OC

- **Pas de remote git détecté** : `easyfest/.git` est vide, pas de remote. Push impossible avant que l'utilisateur ait initialisé le repo et configuré l'origine GitHub. Action utilisateur requise avant le 1er commit.
- **DSN Sentry / clé PostHog** : non fournis. OC-06+07 livrera l'init avec fallback no-op si vars d'env absentes ; le câblage final attend les credentials.

---

## Notes contexte

- Pam = **Roots du Lac (ZIK en PACA)**, pas Astropolis. Les transcriptions Astropolis dans le dossier parent appartiennent à un autre client / contexte de discovery brand-voice.
- Soft-delete 30j = **SLA produit Easyfest**, pas une contrainte légale RGPD. L'art.17 exige "sans délai injustifié", la fenêtre 30j est un confort UX.
- OC-01 onboarding est **additif** : il ajoute un canal self-service ; les onboardings B2B accompagnés en cours ne sont pas impactés.
