# PROMPT 1/2 — COWORK (Claude desktop, browser easy_fest)

> Ce prompt fait l'audit E2E browser ULTRA-rigoureux + screenshots commercial systématiques + génère la liste des bugs et la liste des traces BDD à nettoyer. Ne touche pas au code. À lancer EN PREMIER. Quand fini, lance le PROMPT 2/2 dans Claude Code.

## Context déjà appliqué (rien à faire pour toi user, je sais tout)

- **Repo** : `E:\Easy_Fest\Easy_Fest\easyfest` branch `main` au commit `02fea9c`
- **Vercel** `easyfest.app` : SUPABASE_SERVICE_ROLE_KEY déjà bon (`sb_secret_xOLCr…`), redeploy fait
- **Supabase** `wsmehckdgnpbzwjvotro` (compte easyfest@outlook.fr), 7 Edge Functions ACTIVE
- **Tag backup** : `backup-before-edge-fns-J26` poussé
- **Comptes demo** :
  - `pam@easyfest.test` / `easyfest-demo-2026` (direction RDL)
  - `sandy@easyfest.test` / `easyfest-demo-2026` (volunteer + volunteer_lead RDL + volunteer_lead Frégus, is_mediator)
  - `dorothee@easyfest.test` / `easyfest-demo-2026`
  - `mahaut@easyfest.test` / `easyfest-demo-2026` (post_lead Bar)
  - `lucas@easyfest.test` / `easyfest-demo-2026` (volunteer Bar)
  - `antoine@easyfest.test` / `easyfest-demo-2026` (staff_scan)
- **URLs prod** : `https://easyfest.app`, slugs `icmpaca` / `rdl-2026`
- **Mailinator pour TOUS les emails de test** : `https://www.mailinator.com/v4/public/inboxes.jsp?to=<inbox>`

## Tes consignes opérationnelles

- **Browser** : exclusivement `easy_fest` (deviceId `db77c452-d089-4857-8676-1ba3c51e995b`), thème rosâtre. Le user l'a explicité plusieurs fois.
- **Pas de yoyo** : si un test échoue, capture l'évidence puis passe au suivant. Tu reportes les bugs à la fin, tu ne les fixes pas (c'est le job du PROMPT 2/2 Claude Code).
- **Pas de contournement** : si une fonctionnalité ne marche pas, c'est un bug. Pas de "ça marche techniquement" ou "non bloquant".
- **Pas d'autorisation user en cours** : toutes les actions browser sont pré-autorisées par ce prompt. Mailinator et navigation easyfest.app sont publiques. Login avec comptes demo. Aucun mot de passe à demander.

---

# 🚨 PRIORITÉ ABSOLUE — VALIDER LE FIX DnD POST-INVITE (BUG #1)

> Cette section prime sur tout le reste. Le user a constaté en LIVE que les bénévoles **invités via le bouton 📧** (Anaïs, etc.) reçoivent bien le mail magic-link, atterrissent sur `/hub`, mais **ne peuvent pas être assignés à une équipe via drag-and-drop côté régie** : le système persiste à dire « Compte pas encore créé, invitez d'abord ce bénévole » alors qu'il EST déjà invité ET connecté. Symétriquement, côté volontaire, ils restent en « En attente d'attribution de rôle ». Ce bug est inacceptable à J-26 et doit être validé fixé en priorité 0 avant tout autre test.

## SCÉNARIO E2E DnD POST-INVITE — VALIDATION UNIVERSAL FIX

À exécuter EN PREMIER, avant T1, après le backup PHASE 0 :

### Setup
1. Browser easy_fest, login Pamela `pam@easyfest.test` / `easyfest-demo-2026`
2. `/regie/icmpaca/rdl-2026/applications/manual-signup` → créer une candidature avec :
   - email : `easyfest-extreme-dnd-{ts}@mailinator.com`
   - nom : `Anaïs Test DnD J26`
   - téléphone : `+33611111111`
   - check toutes les CGU/RGPD (utilise `computer.left_click` sur les checkboxes, pas `form_input`)
3. Status doit passer à `validated` automatiquement (manual-signup auto-valide)
4. Sur la liste, retrouver la candidature → cliquer 📧 Inviter → confirm dialog → confirmer
5. Toast attendu : `Mail envoyé à easyfest-extreme-dnd-{ts}@mailinator.com`

### Vérif côté volontaire
6. Ouvrir https://www.mailinator.com/v4/public/inboxes.jsp?to=easyfest-extreme-dnd-{ts} (sans @mailinator.com dans le param)
7. Attendre le mail magic-link `Easyfest — Confirme ta candidature` (max 60s)
8. Cliquer le lien → doit aboutir sur `/auth/callback?next=/hub` puis `/hub`
9. ✅ Critère intermédiaire : la session est posée (vérifier `document.cookie` contient `sb-…-auth-token`)
10. ✅ Critère intermédiaire : la membership volunteer est auto-créée (le `/hub` affiche la carte RDL 2026 et pas une page vide)

### Vérif fix DnD côté régie
11. Logout, relogin Pamela → `/regie/icmpaca/rdl-2026/planning`
12. Filtrer ou scroller jusqu'à la carte `Anaïs Test DnD J26` dans le pool « Bénévoles à placer »
13. Drag la carte → drop sur l'équipe `Bar` (ou n'importe quelle équipe)
14. ✅ **Critère final BUG #1 RÉSOLU** : toast `✓ Sauvegardé`, la carte se retrouve dans la colonne Bar
15. F5 → vérifier persistance (la carte reste dans Bar après refresh)
16. ❌ Si toast d'erreur `Compte pas encore créé. Invitez d'abord ce bénévole` ou `Permission refusée` : BUG #1 PAS FIXÉ → noter dans `BUGS_AUDIT_EXTREME.md` avec sévérité 🔴 Bloquant et **STOP la PHASE 1**, alerter le user en chat avant de continuer.

### Vérif côté volontaire après assignation
17. Logout, relogin avec `easyfest-extreme-dnd-{ts}@mailinator.com` via magic-link Mailinator
18. `/v/icmpaca/rdl-2026/qr` → ✅ doit afficher le QR
19. `/v/icmpaca/rdl-2026/planning` → ✅ doit afficher l'équipe Bar (pas « En attente d'attribution »)

### Test menu-mobile + clavier (accessibilité fix)
20. Resize 412×915 (mobile)
21. Login Pamela → planning → tap court sur la carte d'un autre pre-volunteer (s'il en reste un avec un compte invité) → menu d'équipes → choisir équipe → ✓ Sauvegardé
22. Desktop : right-click sur la carte → menu desktop → équipe → ✓ Sauvegardé

**Si tous les critères 14, 15, 18, 19 sont ✅ : BUG #1 RÉSOLU → noter dans BUGS_AUDIT_EXTREME.md `## BUG #1 — onboardCurrentUser RLS membership creation` avec statut `✅ FIXED`.**

---

# 📋 RÉFÉRENCE — AUDIT CODE OFFICIEL (51/100, 8 agents)

> Le 2 mai 2026 a été conduit par 8 agents (CTO, Lead Dev, Mobile, IA/Auto, RSSI, Pentester, RGPD, QA Lead) un audit code de 12 modules backend + 6 modules frontend. Verdict : **51/100 — pas prêt pour J-26 sans interventions P0**.
>
> 15 Critiques + 25 Hautes documentés dans le PROMPT 2/2 (Claude Code). Tu n'as **pas** à corriger ces points (c'est le job de Claude Code), mais tu dois savoir qu'ils existent pour comprendre certains comportements observés en E2E. Liste pour information :
>
> - **C1** : RPC SQL côté client (createServerClient) sans validation membership → fuite cross-tenant possible
> - **C2** : `validateApplication` ne vérifie pas la membership de l'admin → n'importe quel direction peut valider
> - **C3** : magic-link callback `/auth/callback` parse hash JWT côté client uniquement (Bug #2)
> - **C4** : `setup-password` rejette même password (Bug #3)
> - **C5** : `inviteVolunteer` ne crée pas la membership volunteer en pré-flight (Bug #1 root cause)
> - **F1** : DnD planning ne permet pas l'assignation aux pre-volunteers même invités
> - **F2** : aucun ARIA-live sur les toasts (a11y)
> - **F3** : Tailwind classes via JS template strings (CSP risk)
> - **O1-O2** : Sentry pas activé en prod, audit_log incomplet
> - **Q1-Q5** : 0 test E2E auto, 0 test unitaire RLS
> - **I1** : SUPABASE_SERVICE_ROLE_KEY exposée dans `.env.deploy.local` commité
>
> Pour TOI Cowork, retiens : si tu observes un comportement bizarre côté UI, **screenshot + console + network** dans `BUGS_AUDIT_EXTREME.md` et passe au suivant. Claude Code rapatriera tout ça dans la PR de fix sprint suivant.

---

# PHASE 0 — BACKUP SAFE NET (1 min)

Lance via `mcp__workspace__bash` :

```bash
cd /sessions/*/mnt/Easy_Fest/easyfest 2>/dev/null || cd /sessions/modest-magical-faraday/mnt/Easy_Fest/easyfest
git tag backup-pre-extreme-cowork-$(date +%Y%m%d-%H%M)
git push origin --tags 2>&1 | tail -5
```

Si erreur : alerte le user via le chat et **STOP**. Sinon, continue.

---

# PHASE 1 — AUDIT E2E BROWSER (45-60 min)

## Setup initial

1. Liste browsers, sélectionne `easy_fest`
2. Crée 3 onglets : un pour easyfest.app (login user), un pour mailinator, un pour screenshots/inspections
3. Crée un dossier `E:\Easy_Fest\Easy_Fest\easyfest\marketing\screenshots\` (via `Write` un fichier README dedans suffit pour créer le dossier, ou via bash mkdir)

## Convention screenshots commercial

Pour CHAQUE écran significatif visité, capture le screenshot avec `save_to_disk: true` puis copie le résultat dans `marketing/screenshots/<num>_<role>_<page>_<action>.png`. Numérotation à 3 chiffres.

Exemples :
- `001_anonymous_homepage_hero.png`
- `002_anonymous_demande-festival_step-toi.png`
- ...
- `015_pamela_regie_dashboard_kpis.png`
- `024_lucas_v_qr_visible.png`
- `032_sandy_safer_acknowledge.png`

Capture minimum 50 screenshots couvrant :
- Toutes les pages publiques (homepage, /demande-festival × 5 étapes, /icmpaca, /icmpaca/rdl-2026, /icmpaca/rdl-2026/inscription, /pricing, /legal/*)
- Le hub multi-rôles (Pamela 1 carte, Sandy 3 cartes, Lucas 1 carte)
- Toutes les pages régie (dashboard avec KPIs, applications, planning vide + planning peuplé, sponsors avec data, plan, safer, messages, prefecture, theme)
- Vue post_lead Bar (Mahaut)
- Vue volunteer (Lucas) toutes pages : accueil, qr, planning, wellbeing avant/après submit, feed, safer si is_mediator
- Vues mobile (resize 412×915) des principales pages
- Cycle ALERTE GRAVE complet (4 screenshots minimum : Lucas envoi, Sandy reception, acknowledge, résolu)

**But** : ces screenshots serviront pour le book commercial Pamela + tutoriels bénévoles + landing page marketing. Sois soigneux (pas de modale ouverte, pas de texte flou, taille raisonnable).

## Tests obligatoires (ordre)

> Pour CHAQUE test : si échec, ne stoppe pas. Note l'échec dans `BUGS_AUDIT_EXTREME.md` (fichier à créer à la racine du repo) avec sévérité, repro, évidence, et passe au test suivant.

### T1 — /demande-festival end-to-end avec FINALIZE click
- Wizard 5 étapes complet (utilise nom asso `audit-extreme-T1-asso`, festival `audit-extreme-T1-fest`, dates 15-17 nov 2026, mailinator `easyfest-extreme-T1-{ts}@mailinator.com`)
- Submit → "Vérifie ta boîte mail"
- Mailinator → mail magique doit ARRIVER dans 30s. Si pas reçu après 60s : BUG bloquant (Edge fn `send_validation_mail`).
- Si reçu : click le lien finalize → page `/onboarding/finalize?token=...` → vérifier création org + redirect dashboard
- ✅ Critère final : connecté en direction du nouveau festival

### T2 — /v/qr SVG visuel rendering
- Login Lucas, `/v/icmpaca/rdl-2026/qr`
- Inspecter via `mcp__Claude_in_Chrome__javascript_tool` : `JSON.stringify({hasQR: !!document.querySelector('main svg'), svgSize: document.querySelector('main svg')?.getBBox?.()})`
- ✅ Critère : SVG QR visible (pas carré blanc)
- Si carré blanc : BUG front (Edge fn OK mais rendering React cassé)

### T3 — ALERTE GRAVE end-to-end multi-rôles + audit_log
- 3a. Lucas → Wellbeing → ALERTE GRAVE Harcèlement → "Alerte envoyée"
- 3b. Logout, Login Pamela → `/regie/safer` → vérifier l'alerte visible (read-only ou avec actions)
- 3c. Logout, Login Sandy → `/v/safer` → "Prendre en charge" → "Marquer résolue" + notes
- 3d. Login Pamela → `/regie/safer` → vérifier audit_log timeline (si UI affiche audit_log) OU via `mcp__Claude_in_Chrome__javascript_tool` faire un fetch sur l'API admin

### T4 — Bouton 📧 Inviter via mailinator complet
- Login Sandy, `/regie/icmpaca/rdl-2026/applications`
- Si pas d'application avec mailinator : `/regie/.../applications/manual-signup` → créer une candidature avec `easyfest-extreme-T4@mailinator.com`
- Cliquer 📧 Inviter → confirm dialog → confirmer
- Mailinator → mail doit arriver. Click le lien → page `/hub` du nouveau user → membership volunteer auto-créée
- ✅ Critère : boucle complète d'onboarding

### T5 — DnD réel Planning + persistence DB
- ⚠️ Si la SECTION PRIORITÉ ABSOLUE en haut a déjà couvert ce test avec succès, T5 est satisfait. Sinon :
- Login Pamela, `/regie/.../planning`
- Filtrer par nom → si bénévole avec compte actif (pas pre-) trouvé : drag → drop sur équipe → "✓ Sauvegardé"
- F5 (refresh) → vérifier que la carte est restée dans la nouvelle équipe
- Si tous pre-volunteers : utilise T4 d'abord pour activer un compte
- Test menu desktop : right-click sur carte → menu équipes → choisir équipe
- **Critère universel post-fix Bug #1** : aucun toast d'erreur "Compte pas encore créé" ne doit apparaître sur un pre-volunteer dont l'application est `validated` ET qui possède un auth.users (c.-à-d. invité ou ayant cliqué le magic-link). Le code Claude Code a pour mission d'auto-créer la membership dans ce cas.

### T6 — Broadcast Pamela → Lucas /v/feed
- Login Pamela `/regie/messages` → cibler Bar → texte test → Diffuser
- Logout, Login Lucas, `/v/feed` → message visible

### T7 — Plan upload PNG + visualisation
- Login Pamela `/regie/plan`
- Upload une PNG de test (récupère `apps/vitrine/public/illustrations/festival-map.svg` ou utilise n'importe quelle PNG dans `marketing/screenshots/`)
- Sauvegarder
- Logout, Login Lucas → vérifier que le plan est visible dans la rubrique appropriée

### T8 — ZIP Préfecture export
- Login Pamela `/regie/prefecture` → bouton "Pack préfecture"
- Vérifier qu'un fichier ZIP est téléchargé
- Inspecter via bash : `unzip -l <download>` doit lister recap PDF + conventions + CSV

### T9 — Sponsors CRUD complet
- Login Pamela `/regie/sponsors`
- Add sponsor "Audit Extreme Sponsor" Bronze 1500€ contact `easyfest-extreme-T9@mailinator.com`
- Edit → status "Signé"
- Delete

### T10 — Theme switcher
- Login Pamela `/regie/settings/theme` → cliquer Forest Green → vérifier primary color change
- `/v/...` côté Lucas → vérifier propagation
- Restaurer Easyfest Coral

### T11 — Static pages publiques
- Pour chaque URL : `/`, `/legal/cgu`, `/legal/mentions`, `/legal/privacy`, `/legal/sub-processors`, `/pricing` → screenshot + vérifier qu'aucune n'affiche 404/500

### T12 — Account privacy RGPD
- Login Lucas `/account/privacy` → bouton Exporter mes données → JSON download → contenu non-vide
- Bouton Supprimer mon compte → SE PRÉPARE PAS À CLIQUER, juste vérifier visibilité + warning rouge

### T13 — Wellbeing rouge → counter régie dashboard
- Login Lucas `/v/wellbeing` → "J'ai besoin d'aide" rouge
- Logout, Login Pamela `/regie/dashboard` → vérifier counter "BIEN-ÊTRE ROUGE" augmenté

### T14 — Cross-tenant security
- Login Lucas (org A : icmpaca)
- Tenter URL `/regie/zik-rouen/festival-x` (autre org si elle existe) ou créer un faux slug
- ✅ Critère : redirect /hub (pas de fuite cross-tenant)

### T15 — Multi-event Sandy (Frégus)
- Login Sandy `/hub` → vérifier 3 cartes
- Cliquer Frégus → tour régie OK + isolation données

### T16 — Mobile responsive
- Resize browser 412×915 (Pixel 7 Pro)
- Login Pamela `/regie/.../planning` → vérifier sticky chips bar mobile
- Tap court → menu d'équipes
- Hold + swipe → DnD mobile

### T17 — Force-set-password 1er login + idempotence (Bug #3)
- Créer un user via T4 invite → click magic-link → arrive sur `/hub`
- ✅ Attendu : redirect forcé `/account/setup-password` si `user_metadata.password_set !== true`
- Si pas de redirect : BUG impl manquante (à confirmer dans le code)
- **Test idempotence (Bug #3)** : sur la page setup-password, saisir DEUX FOIS le même password (cas réel : Pamela qui re-saisit son mot de passe demo) → ne doit PAS afficher d'erreur Supabase Auth `New password should be different from the old password`. Le server action doit court-circuiter le call Supabase si le password est égal au current.
- **Si erreur affichée** : BUG #3 PAS FIXÉ → noter dans BUGS_AUDIT_EXTREME.md.

### T18 — Mail-tester deliverability
- Mailinator → ne convient pas pour mail-tester. Plutôt :
- Sur https://www.mail-tester.com → récupérer une adresse jetable type `test-XXX@mail-tester.com`
- Login Pamela → applications → manual signup avec cet email → bouton Inviter
- Sur mail-tester.com → vérifier le score
- ✅ Critère : 9+/10. Si moins : templates Supabase Auth dashboard pas brandés.

### T19 — Magic-link callback session (Bug #2)
- Créer un user via manual-signup → bouton 📧 Inviter
- Mailinator → cliquer le lien magic-link
- ✅ Attendu : URL transitionne vers `/auth/callback?next=/hub` puis `/hub` avec session active (cookie `sb-…-auth-token` présent)
- Inspecter via `mcp__Claude_in_Chrome__javascript_tool` : `JSON.stringify({cookies: document.cookie.split(';').map(c => c.trim().split('=')[0])})` → doit contenir un cookie commençant par `sb-`
- ❌ Si redirect vers `/auth/login` ou si session vide : BUG #2 PAS FIXÉ → noter dans BUGS_AUDIT_EXTREME.md.

### T20 — Seeds memberships présents (Bug #4)
- Login Sandy `sandy@easyfest.test` → `/hub` doit afficher 3 cartes (RDL volunteer + RDL volunteer_lead + Frégus volunteer_lead)
- Login Mahaut `mahaut@easyfest.test` → `/hub` doit afficher 1 carte (Bar post_lead)
- Login Lucas `lucas@easyfest.test` → `/hub` doit afficher 1 carte (Bar volunteer)
- Login Antoine `antoine@easyfest.test` → `/hub` doit afficher 1 carte (staff_scan)
- ❌ Si une carte manquante : BUG #4 seed memberships → noter dans BUGS_AUDIT_EXTREME.md (corrigeable via `pnpm db:seed` côté Claude Code).

---

# PHASE 2 — GÉNÉRATION DES 2 FICHIERS DE HAND-OFF

À la racine du repo, crée :

### A. `BUGS_AUDIT_EXTREME.md`

Format strict pour que Claude Code puisse parser :

```markdown
# Bugs trouvés audit extrême — {date}

## BUG #1 — <titre court>
- **Test** : T{X}
- **Sévérité** : 🔴 Bloquant | 🟡 UX | 🟢 Mineur
- **URL** : <url>
- **Compte** : <user>
- **Reproduction** : <étapes numérotées>
- **Évidence** :
  - Screenshot : `marketing/screenshots/NNN_xxx.png`
  - Console : <erreurs JS>
  - Network : <requêtes failed>
- **Root cause hypothèse** : <ce que tu penses>
- **Fichiers à modifier (suggérés)** : `apps/vitrine/...`
- **Fix proposé** : <description courte>
- **Critère de validation après fix** : <comment retester>

## BUG #2 — ...
```

### B. `CLEANUP_DB_AUDIT.md`

Liste exhaustive des traces de tests à supprimer, par table. Format :

```markdown
# Cleanup BDD post-audit — {date}

## Organisations à supprimer (cascade events + memberships + applications)
- slug = `audit-extreme-T1-asso`
- slug = `audit-final-asso`
- slug = `audit-j26-asso`
- slug = `audit10-asso`

## Volunteer applications à supprimer (par email pattern)
- email LIKE `easyfest-extreme-%@mailinator.com`
- email LIKE `easyfest-audit-%@mailinator.com`

## Auth users à supprimer (orphelins après applications cleanup)
- email LIKE `easyfest-extreme-%@mailinator.com`
- email LIKE `easyfest-audit-%@mailinator.com`

## Sponsors à supprimer
- name = "Audit Extreme Sponsor"

## Safer alerts à supprimer
- description LIKE `%Test E2E audit%`
- description LIKE `%audit fictive%`

## Messages broadcasts à supprimer
- content LIKE `%Test E2E audit%`
- content LIKE `%audit extrême%`

## Wellbeing reports à supprimer
- created_at > {timestamp_début_audit}
  AND reporter_user_id IN (Lucas, Sandy)
  AND comment LIKE `%audit%` (si applicable)

## Pending festival requests à supprimer
- email LIKE `easyfest-extreme-%@mailinator.com`
- org_slug LIKE `audit-%`
```

⚠️ **Important** : ne génère PAS de SQL toi-même. Donne juste les patterns/critères. Claude Code générera et exécutera le SQL via Supabase Management API ou psql.

---

# PHASE 3 — RAPPORT FINAL COWORK

À la fin, dans le chat, écris au user :
1. Récap : X tests passés / Y tests échoués
2. Lien vers `BUGS_AUDIT_EXTREME.md` et `CLEANUP_DB_AUDIT.md`
3. Lien vers le dossier `marketing/screenshots/` (compter le nombre)
4. **Instruction unique au user** : « Lance maintenant le PROMPT 2/2 dans Claude Code (fichier `PROMPT_AUDIT_EXTREME_CODE.md` à la racine du repo). Tu n'as rien d'autre à faire. »

---

# PHASE 4 — RE-TEST POST CLAUDE CODE (couvre les 4 Bugs + audit code 51/100)

Quand le user dit « Claude Code a fini, retest » ou « Phase 4 retest extrême » :

### Pré-flight
1. `git pull origin main` (via bash) → vérifier que le commit Claude Code est bien présent
2. Vérifier les migrations appliquées : Supabase Studio ou bash `supabase db remote list`
3. Recréer un compte propre via manual-signup → invite (workflow type Anaïs) pour tester l'ENSEMBLE de la chaîne post-fix

### Tests prioritaires à re-rouler (ordre)
- **D'abord** : SCÉNARIO PRIORITÉ ABSOLUE DnD POST-INVITE (en haut du prompt) — c'est le test santé n°1
- Puis dans l'ordre : T19 (Bug #2 callback) → T20 (Bug #4 seeds) → T17 (Bug #3 idempotent) → T1 (festival end-to-end avec finalize) → T4 (invite mailinator) → T5 (DnD universal) → T2 (QR SVG) → T3 (alerte grave)
- Re-rouler tous les autres tests (T6→T18) seulement si les 8 prioritaires passent

### Critères de validation BUGS

Pour CHAQUE bug du fichier BUGS_AUDIT_EXTREME.md, modifier le statut :
- ✅ `FIXED` : le scénario de repro ne reproduit PLUS le bug ET le critère de validation est rempli
- ⚠️ `PARTIALLY FIXED` : le bug ne se reproduit pas mais une régression annexe est apparue (à reporter)
- ❌ `STILL BROKEN` : le bug se reproduit avec le scénario initial → re-screenshot + re-console + re-network → ré-ouvrir le bug

### Critères de validation AUDIT CODE 51/100

Si Claude Code a livré la PR de sprint P0 (C1 à C5 + F1 à F3 + I1) :
- Vérifier en E2E : pas de fuite cross-tenant (T14), pas d'admin pirate qui valide une autre asso (test ad hoc T14b à inventer), CSP headers présents (`mcp__Claude_in_Chrome__javascript_tool` : `fetch('/').then(r => Array.from(r.headers).filter(([k]) => k.toLowerCase().includes('content-security')))`)
- Vérifier Sentry actif : recharger la prod, faire une erreur volontaire (ex. naviguer vers `/regie/null/null/planning`) puis demander à Claude Code dans la chat « confirme l'event Sentry ID = … »
- Vérifier que `.env.deploy.local` n'est PLUS commit (bash `git ls-files | grep deploy.local` doit être vide) et que le secret a été rotated (Claude Code aura redéployé avec un nouveau `sb_secret_…`)

### Validation finale & cleanup

Si TOUTES les validations sont vertes :
1. Re-screenshots commerciaux (50+ fresh screens dans `marketing/screenshots/post-fix/`)
2. `git tag audit-extreme-validated-$(date +%Y%m%d-%H%M)` + `git push origin --tags`
3. Mettre à jour `BUGS_AUDIT_EXTREME.md` en haut : `# 🟢 AUDIT EXTRÊME VALIDÉ — DATE — TOUS BUGS FIXED`
4. Mettre à jour `CLEANUP_DB_AUDIT.md` avec les nouveaux comptes mailinator créés pendant la Phase 4
5. Annoncer au user : « Phase 4 finished. {N} bugs fixed, {M} screenshots commercial frais. Le repo est `audit-extreme-validated-{tag}`. Tu peux annoncer la production J-26 RDL2026 sereinement. »

Si AU MOINS UN bug reste rouge : re-générer un PROMPT_AUDIT_EXTREME_CODE_v2.md avec UNIQUEMENT les bugs restants + les régressions découvertes en Phase 4, et demander au user de relancer Claude Code.
