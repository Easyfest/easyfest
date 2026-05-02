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
- Login Pamela, `/regie/.../planning`
- Filtrer par nom → si bénévole avec compte actif (pas pre-) trouvé : drag → drop sur équipe → "✓ Sauvegardé"
- F5 (refresh) → vérifier que la carte est restée dans la nouvelle équipe
- Si tous pre-volunteers : utilise T4 d'abord pour activer un compte
- Test menu desktop : right-click sur carte → menu équipes → choisir équipe

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

### T17 — Force-set-password 1er login (potentiellement non implémenté)
- Créer un user via T4 invite → click magic-link → arrive sur `/hub`
- ✅ Attendu : redirect forcé `/account/setup-password` si `user_metadata.password_set !== true`
- Si pas de redirect : BUG impl manquante (à confirmer dans le code)

### T18 — Mail-tester deliverability
- Mailinator → ne convient pas pour mail-tester. Plutôt :
- Sur https://www.mail-tester.com → récupérer une adresse jetable type `test-XXX@mail-tester.com`
- Login Pamela → applications → manual signup avec cet email → bouton Inviter
- Sur mail-tester.com → vérifier le score
- ✅ Critère : 9+/10. Si moins : templates Supabase Auth dashboard pas brandés.

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

# PHASE 4 (OPTIONNELLE) — RE-TEST POST CLAUDE CODE

Si le user te dit plus tard « Claude Code a fini, retest » :
- Re-roule uniquement les tests qui avaient échoué (T{X} échoués)
- Capture nouveaux screenshots
- Mets à jour `BUGS_AUDIT_EXTREME.md` en marquant chaque bug `✅ FIXED` ou `❌ STILL BROKEN`
- Si tout vert : `git tag audit-extreme-validated-{date}` + push
