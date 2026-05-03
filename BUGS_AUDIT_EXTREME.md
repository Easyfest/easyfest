# Bugs trouvés audit extrême — 2 mai 2026 (Cowork)

## BUG #1 — 🔴 BLOQUANT J-26 — onboardCurrentUser ne crée PAS la membership volunteer (RLS bloque)

- **Test** : T2 + T17 + investigation live signalée par user (cas Anaïs Bayart)
- **Sévérité** : 🔴 BLOQUANT — empêche TOUS les 79 bénévoles RDL2026 d'être placés sur le planning
- **URL** : `/hub` (déclenché à chaque login post magic-link)
- **Compte** : tous les volunteers (Anaïs Bayart `anaisbayart@outlook.fr` confirmé en live)
- **Reproduction** :
  1. Utilisateur Régie : valider une candidature (statut `validated`)
  2. Utilisateur Régie : cliquer 📧 Inviter → Supabase signInWithOtp envoie magic-link
  3. Bénévole : reçoit le mail, click le lien → arrive sur `/hub`
  4. `/hub` (page.tsx) appelle `await onboardCurrentUser()` au début
  5. `onboardCurrentUser` trouve l'application validée → tente d'INSERT `memberships {user_id, event_id, role: 'volunteer', is_active: true}`
  6. **RLS policy `memberships_insert_lead` rejette l'insert** car `has_role_at_least('volunteer_lead')` est false (le user est volunteer, pas lead)
  7. Erreur est swallow par `if (!memErr) upgraded++` (silencieux)
  8. Bénévole se retrouve sur `/hub` avec **AUCUNE membership** → "Tu n'as pas encore d'affectation active"
  9. Côté régie `/regie/.../planning` → bénévole apparaît comme pre-volunteer (badge ⏳, prefix `pre-`)
  10. DnD du bénévole → action retourne "Compte pas encore créé — invite ce bénévole d'abord" (alors qu'il a déjà été invité ET cliqué le lien !)
- **Évidence** :
  - JS DOM inspect (live) : 82/82 bénévoles ont badge `⏳` pending_account
  - Anaïs Bayart visible dans pool avec ⏳ alors qu'elle a cliqué son magic-link
  - Drag Anaïs → Bar → message "⏳ Compte pas encore créé"
  - Code `apps/vitrine/app/actions/onboard.ts` ligne 21 : `createServerClient()` (user-context)
  - Code `apps/vitrine/app/actions/onboard.ts` ligne 88 : `supabase.from("memberships").insert(...)` SANS service-role
  - Code `packages/db/supabase/migrations/20260430000007_rls_policies.sql` ligne 72-75 : seul volunteer_lead+ peut insérer
- **Root cause** : `onboardCurrentUser` utilise le client SSR user-context. La RLS `memberships_insert_lead` n'autorise que les volunteer_lead+ à insérer une membership. Un volunteer ne peut donc pas s'auto-créer sa membership lors de l'onboarding magic-link.
- **Fichiers à modifier** :
  - `apps/vitrine/app/actions/onboard.ts` (utiliser service client pour les inserts memberships ET propager les erreurs au retour)
  - `packages/db/supabase/migrations/20260503000001_rls_membership_self_volunteer.sql` (NOUVELLE migration : ajouter une policy `memberships_insert_self_volunteer` qui autorise un user à créer sa propre membership volunteer SI une volunteer_application validated correspond à son email)
- **Fix proposé** :

  Solution A (rapide, recommandée) — utiliser service client dans onboardCurrentUser :
  ```typescript
  // apps/vitrine/app/actions/onboard.ts
  import { createServerClient, createServiceClient } from "@/lib/supabase/server";

  export async function onboardCurrentUser() {
    const userClient = createServerClient();
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) return { ok: false, error: "Non authentifié" };

    // SERVICE client pour bypass RLS sur les inserts (le user volunteer ne peut pas s'auto-créer sa membership)
    const admin = createServiceClient();

    // ... lookup applications via admin client ...
    // ... insert volunteer_profiles + memberships via admin client ...

    // SÉCURITÉ : on vérifie d'abord que l'application VALIDÉE existe pour cet email,
    // sinon n'importe quel user authentifié pourrait demander à se créer une membership.
    const { data: apps } = await admin
      .from("volunteer_applications")
      .select("...")
      .eq("email", userEmail)
      .eq("status", "validated");

    // Insert avec admin client (bypass RLS)
    if (!existingMembership) {
      const { error: memErr } = await admin.from("memberships").insert({...});
      if (memErr) {
        // FAIL FAST : remonter l'erreur au lieu de la swallow
        return { ok: false, error: `Membership creation failed: ${memErr.message}` };
      }
      upgraded++;
    }
  }
  ```

  Solution B (plus propre long-terme) — nouvelle RLS policy :
  ```sql
  -- 20260503000001_rls_membership_self_volunteer.sql
  create policy "memberships_insert_self_volunteer" on public.memberships
    for insert with check (
      user_id = auth.uid()
      and role = 'volunteer'
      and exists (
        select 1 from public.volunteer_applications va
        join auth.users au on au.email = va.email
        where va.event_id = memberships.event_id
          and va.status = 'validated'
          and au.id = auth.uid()
      )
    );
  ```

  **Recommandation** : appliquer A + B (defense in depth). A débloque immédiatement, B sécurise pour le futur.

- **FIX** (Claude Code · 3 mai 2026, après commit) :
  - **A appliqué** : `apps/vitrine/app/actions/onboard.ts` utilise `createServiceClient()` pour les inserts `volunteer_profiles` + `memberships` + `audit_log` et la lookup `volunteer_applications`. Erreur sur insert membership = retour `{ ok: false, error }` (fail-fast au lieu de swallow). Contrat de sécurité : on insère uniquement pour les `event_id` où une `volunteer_application` `status='validated'` existe avec l'email authentifié.
  - **B appliqué** : nouvelle migration `packages/db/supabase/migrations/20260503000001_rls_membership_self_volunteer.sql` ajoute la policy `memberships_insert_self_volunteer` (autorise `user_id = auth.uid() AND role = 'volunteer' AND is_active = true AND public.user_has_validated_application(event_id, auth.uid())`). La fonction `user_has_validated_application` est `security definer` pour éviter récursion RLS sur volunteer_applications et accès direct à `auth.users`.
  - Migration à appliquer en prod après push (via `supabase db push` ou auto-deploy).

- **Critère de validation après fix** :
  1. Login Régie, créer une candidature manuelle test mailinator, valider, inviter
  2. Click magic-link mail → arrive sur `/hub`
  3. Vérifier `/hub` affiche la carte "Je suis bénévole · ZIK PACA · Roots du Lac 2026" (et NON "Tu n'as pas encore d'affectation active")
  4. Login Pamela `/regie/.../planning` : le bénévole nouvellement onboardé doit apparaître **SANS badge ⏳** (pas pre-volunteer)
  5. Drag du bénévole vers une équipe → "✓ Sauvegardé" (pas "Compte pas encore créé")
  6. F5 refresh → bénévole reste dans la nouvelle équipe (persistence DB)

---

> **Note pour Claude Code** : ce bug bloque 79 bénévoles RDL2026 le 28-30 mai. Priorité absolue. À fixer EN PREMIER avant tous les autres.

**TODO** : autres bugs T2-T18 à compléter par session Cowork suivante (T1 finalize click pas testé, T2-T18 non testés car investigation bug live a pris la priorité).

---

## BUG #2 — 🔴 BLOQUANT — Magic-link callback ne crée pas la session côté Next.js

- **Test** : T17 + critère P0 du Bug #1 (impossible de valider sans ce fix)
- **Sévérité** : 🔴 BLOQUANT — empêche tout onboarding bénévole via magic-link
- **URL** : `/auth/login#access_token=...`
- **Compte** : tous les nouveaux users créés via `inviteVolunteer` ou `manual-signup`
- **Reproduction** :
  1. Régie : créer une candidature manual-signup avec mailinator (`easyfest-extreme-bug1-verify@mailinator.com`)
  2. Mail magique reçu sur Mailinator (preuve `send_validation_mail` Edge fn OK ✅)
  3. Click le lien dans le mail → URL `https://wsmehckdgnpbzwjvotro.supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=https://easyfest.app/v/icmpaca/rdl-2026`
  4. Supabase verify le token et redirige vers `https://easyfest.app/v/icmpaca/rdl-2026#access_token=eyJ...&refresh_token=...&type=signup`
  5. **MAIS** : Next.js middleware sur `/v/...` détecte qu'il n'y a pas de cookie session (le hash est côté client) → redirige sur `/auth/login?redirect=/v/icmpaca/rdl-2026#access_token=...`
  6. Le hash JWT reste dans l'URL mais aucun client `@supabase/ssr` n'est attaché à `/auth/login` pour le parser et créer les cookies session
  7. User reste anonyme → impossible d'arriver sur `/hub` → `onboardCurrentUser` jamais appelé → aucune membership créée
- **Évidence** :
  - URL après click magic-link : `https://easyfest.app/auth/login?redirect=%2Fv%2Ficmpaca%2Frdl-2026#access_token=...`
  - JS attempt `window.location.href = '/auth/callback?...'` → redirect homepage anonyme (pas de page `/auth/callback` qui process le hash)
  - Côté planning régie : compteur passe de 82 → 83 (candidature ajoutée) mais nouveau user reste avec badge ⏳
- **Root cause** : Pas de page `/auth/callback` qui parse le hash JWT et set les cookies session via `supabase.auth.exchangeCodeForSession` ou `setSession`. Le flow Supabase Auth implicit (#access_token=) nécessite un handler client côté Next.js.
- **Fichiers à modifier** :
  - **Créer** `apps/vitrine/app/auth/callback/page.tsx` (route client component qui parse le hash + appelle `supabase.auth.setSession({access_token, refresh_token})` + redirect vers `next` query param)
  - **Modifier** `apps/vitrine/app/actions/applications-admin.ts` (action `inviteVolunteer`) : changer `emailRedirectTo` pour pointer vers `${baseUrl}/auth/callback?next=/hub` au lieu de `${baseUrl}/hub`
  - **Modifier** Supabase Auth config : ajouter `https://easyfest.app/auth/callback*` dans `additional_redirect_urls`
- **Fix proposé** :
  ```tsx
  // apps/vitrine/app/auth/callback/page.tsx
  "use client";
  import { useEffect } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import { createBrowserClient } from "@supabase/ssr";

  export default function AuthCallback() {
    const router = useRouter();
    const sp = useSearchParams();
    useEffect(() => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (!access_token || !refresh_token) {
        router.replace("/auth/login?error=missing_token");
        return;
      }
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      sb.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          router.replace("/auth/login?error=" + encodeURIComponent(error.message));
        } else {
          const next = sp.get("next") || "/hub";
          router.replace(next);
        }
      });
    }, []);
    return <main className="flex min-h-screen items-center justify-center"><p>Connexion en cours…</p></main>;
  }
  ```
  + dans `inviteVolunteer` : `emailRedirectTo: \`${baseUrl}/auth/callback?next=/hub\``
- **Critère de validation après fix** :
  1. Régie : créer candidature manual-signup mailinator → email reçu
  2. Click magic-link → URL `https://easyfest.app/auth/callback?next=/hub#access_token=...`
  3. Page "Connexion en cours…" affichée brièvement
  4. Redirect automatique vers `/hub` avec session active
  5. **Combiné avec Bug #1 fix** : la carte "Je suis bénévole · ZIK PACA · RDL2026" apparaît directement (membership auto-créée)
  6. Côté régie planning : nouveau bénévole sans badge ⏳ + drag → "✓ Sauvegardé" + persistence F5

- **FIX** (Claude Code · 3 mai 2026, après commit) :
  - **Page client** : `apps/vitrine/app/auth/callback/page.tsx` (server wrapper avec `<Suspense>`) + `apps/vitrine/app/auth/callback/CallbackInner.tsx` (client component) qui gère les 2 flows :
    - PKCE (`?code=…`) → `exchangeCodeForSession(code)`
    - Implicit (`#access_token=…&refresh_token=…`) → `setSession({ access_token, refresh_token })`
    - Open-redirect protection via `isSafeRedirect()` (chemins locaux uniquement).
  - **Suppression** `apps/vitrine/app/auth/callback/route.ts` (route handler server-only — incompatible avec `page.tsx` au même path, et la nouvelle page client couvre l'ex flow PKCE via createBrowserClient qui pose les cookies @supabase/ssr).
  - **Update** `apps/vitrine/app/actions/applications-admin.ts:127` : `emailRedirectTo: ${baseUrl}/auth/callback?next=/hub` (au lieu de `${baseUrl}/hub`).
  - **Update** Edge fn `packages/db/supabase/functions/send_validation_mail/index.ts:232` : `redirectTo = ${APP_URL}/auth/callback?next=/hub&event=...&org=...` (au lieu de `/v/${orgSlug}/${eventSlug}` direct).
  - **À REDEPLOY** côté humain : Edge fn (Claude Code n'a pas la permission systeme pour `supabase functions deploy` en prod). Commande : `pnpm exec supabase functions deploy send_validation_mail --project-ref wsmehckdgnpbzwjvotro` après `supabase login` + `supabase link`.

---

## BUG #3 — 🟡 UX — Force-set-password redirige même quand le password est inchangé

- **Test** : T17 (validation E2E)
- **Sévérité** : 🟡 UX (workaround possible : taper un nouveau password)
- **URL** : `/account/setup-password`
- **Compte** : Pamela demo (`pam@easyfest.test`) en l'occurrence
- **Reproduction** :
  1. Login compte demo Pamela
  2. Middleware redirige vers `/account/setup-password` (correct, comportement T17 implémenté)
  3. Saisir le même password actuel (`easyfest-demo-2026`) dans les 2 champs → cliquer Enregistrer
  4. **BUG** : la page se recharge sur `/account/setup-password` (le metadata `password_set: true` n'a pas été persisté car Supabase Auth refuse l'update si nouveau password = ancien)
  5. Workaround : taper un password différent (`easyfest-demo-2026-v2`) → save OK → redirect /hub
- **Root cause** : la server action `setPassword` ne distingue pas (a) l'erreur Supabase "password unchanged" (b) un vrai succès. Si Supabase retourne une erreur, le metadata `password_set: true` n'est pas updaté.
- **Fix proposé** : dans la server action, si `supabase.auth.updateUser({password})` retourne une erreur du genre "New password should be different", traiter comme succès SI le password était déjà set (i.e. user.user_metadata.password_set vaut déjà true) OU forcer l'update du metadata `password_set: true` indépendamment du résultat update password.
- **Critère** : Pamela demo peut re-confirmer son password actuel sans devoir le changer.

- **FIX** (Claude Code · 3 mai 2026, après commit) :
  - `apps/vitrine/app/actions/auth.ts` `setupPassword` détecte le pattern d'erreur Supabase Auth "should be different / unchanged / identical" et fait un second `updateUser({ data: { password_set: true } })` (sans password) pour aligner le metadata. L'utilisateur est ensuite redirigé vers `/hub` normalement. Les autres erreurs (validation, session expirée, etc.) restent fail-fast.

⚠️ **Note importante** : pour les comptes demo (Pamela en particulier), le password actuel est maintenant `easyfest-demo-2026-v2` (modifié pendant cet audit). À documenter ou reset SQL pour la prochaine session.

---

## BUG #4 — 🟡 UX — Badges ⏳ pour TOUS les bénévoles seedés (planning régie)

- **Test** : T5
- **Sévérité** : 🟡 UX — affecte la lisibilité du planning mais n'empêche pas le DnD une fois Bug #1+#2 fixés
- **URL** : `/regie/icmpaca/rdl-2026/planning`
- **Compte** : Pamela direction
- **Reproduction** :
  1. Login Pamela → planning
  2. Tous les 83 bénévoles affichent badge ⏳ (pre-volunteer)
- **Root cause** : Les seeds SQL (`20260430000009_seed_volunteers_shifts.sql`) créent les `volunteer_applications` avec `status='validated'` mais ne créent PAS les `memberships` correspondantes. Donc tous les seeded users restent pre-volunteer dans le pool planning.
- **Fix proposé** : modifier le seed SQL pour créer aussi les `memberships role='volunteer' is_active=true` pour les applications validated. OU créer une migration one-shot `20260503000002_backfill_seed_memberships.sql` qui INSERT les memberships manquantes pour les applications validated existantes.
- **Critère** : Login Pamela → planning → bénévoles seedés affichent SANS badge ⏳, drag-and-drop direct fonctionne sans avoir à passer par le flow invite/onboard.

- **FIX** (Claude Code · 3 mai 2026, après commit) :
  - Nouvelle migration `packages/db/supabase/migrations/20260503000002_backfill_seed_memberships.sql` : `INSERT … SELECT` qui crée les memberships volunteer manquantes pour toutes les `volunteer_applications` `validated` dont l'email matche un `auth.users` (case-insensitive). Idempotente (LEFT JOIN exclut les memberships existantes + `ON CONFLICT DO NOTHING`).
  - **Appliquée en prod via Management API** : 5 memberships créées (correspondent aux 5 apps dont l'email = compte demo `@easyfest.test` déjà dans `auth.users`). Recount post-migration : `still_missing_memberships = 0` ✓
  - Les 79 autres applications validées seront automatiquement converties en memberships via le flow normal `inviteVolunteer → magic-link → /auth/callback → /hub → onboardCurrentUser` (débloqué par les fix Bug #1 + Bug #2).

---

## TODO restant (autres tests T2-T18 non exécutés)

T2 (QR SVG visual), T3 (ALERTE GRAVE inter-rôles complet), T4 (Inviter mail+click chaîné), T5 (drag persistence F5), T6 (Broadcast → fil Lucas), T7 (Plan upload), T8 (ZIP Préfecture), T9 (Sponsors CRUD), T10 (Theme switcher), T11 (Static pages × 5), T12 (RGPD export), T13 (Wellbeing red counter), T14 (Cross-tenant), T15 (Multi-event Sandy Frégus), T16 (Mobile DnD), T18 (Mail-tester score).

À faire dans une **nouvelle session Cowork** après que Claude Code ait fixé Bug #2 (auth callback) et Bug #4 (seed memberships). Bug #1 sera alors testable end-to-end.

---

## Ce qui a été VALIDÉ pendant cette session

- ✅ Manual-signup régie : envoie le mail magique (Edge fn `send_validation_mail` OK, mail brandé "Bienvenue à bord, Audit." reçu sur mailinator)
- ✅ Setup-password forcé (T17 partiel — middleware actif et fonctionnel pour password différent)
- ✅ Login Pamela password OK
- ✅ Filtre planning fonctionne
- ✅ Bug #1 fix code-side validé (commit `5c231ae` + RLS migration appliquée), mais **non validé E2E à cause de Bug #2 qui bloque le flow magic-link login**.
