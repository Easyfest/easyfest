# 🔍 EASYFEST — Audit Hermès J3 (30 avril 2026, 06h)

> **Méthode** : 10 comités d'experts examinent l'état du produit en parallèle, se challengent, fusion dans une vue unique.
> **Public** : Build Captain (Gaëtan), advisor (Pam), futur tour de table.
> **Format** : verdicts froids, pas de complaisance.

---

# PARTIE I — POINT COMPLET PROJET

## 📊 1.1 Métriques produit

| KPI | État J3 | Cible J7 (Pam test dimanche) | Cible V1 GA (juin 2026) |
|-----|---------|------------------------------|--------------------------|
| **Build status** | ✅ Vert | ✅ Vert | ✅ Vert |
| **Lignes de code TS/TSX** | ~14 800 | ~16 000 | ~25 000 |
| **Routes Next.js** | 32 | 35 | 60+ |
| **Tables SQL** | 22 | 22 | 30+ |
| **Politiques RLS** | 60+ | 60+ | 100+ |
| **Migrations appliquées** | 12 | 12 | 25+ |
| **Server Actions** | 14 | 16 | 40+ |
| **Couverture tests** | 0% | 0% (volontaire) | 60%+ |
| **Comptes démo seed** | 7 | 7 | 7 |
| **Bénévoles réels en BDD (51 imports + 31 démos)** | 82 | 82+ | N/A |
| **Sponsors RDL seedés** | 3 | 3 | N/A |
| **Templates emails FR** | 4 | 4 | 8+ |
| **Tutos rôles** | 4 docs | 4 docs | 4 docs + vidéos |
| **Plans festival** | 2 (jour+nuit) | 2 | N/A |

## 🎯 1.2 Couverture fonctionnelle

| Module | Statut | Note /10 | Note attendue Pam |
|--------|--------|----------|-------------------|
| Auth (magic-link + password) | ✅ Live | 9 | 9 |
| Inscription bénévole 5 étapes | ✅ Live | 8.5 | 9 |
| Photo upload | ✅ Live | 8 | 8 |
| Validation/Refus candidature | ✅ Live | 8 | 9 |
| Bouton "Inviter par mail" | ✅ Live | 9 | 9 (effet wow) |
| Convention bénévolat signable | ✅ Live | 9 | 10 (juridique conforme) |
| Charte scroll-locked | ✅ Live | 9 | 10 |
| Planning vue équipes drag&drop | ✅ Live | 9 | 9 |
| Planning timeline gantt | ✅ Live | 8 | 7 (gadget pour elle) |
| Sponsors CRM | ✅ Live | 8 | 7 |
| Pack préfecture export | ✅ Live | 9 | 10 (gain temps énorme) |
| Plan du site | ✅ Live | 7 | 8 |
| Profil bénévole | ✅ Live | 7 | 7 |
| Onboarding auto | ✅ Live | 9 | 9 (transparent = bon) |
| QR scan staff | ✅ Live (J0) | 7 | 8 |
| Wellbeing reports | ✅ Live (J0) | 6 | 7 |
| Safer space alerts | ✅ Live (J0) | 7 | 8 |
| Catering tickets repas | ✅ Live (J0) | 6 | 7 |
| Messages chat | ⚠️ Squelette | 3 | 7 |
| Mobile app (Expo) | ❌ Pas commencé | 0 | 6 (web responsive OK) |

## 🚦 1.3 Statut technique global

```
   FRONTEND (Next.js 14)        BACKEND (Supabase EU)        EMAILING (Resend)
   ────────────────────         ─────────────────────         ──────────────────
   ✅ Build OK                  ✅ Postgres 17.6              ✅ SMTP configuré
   ✅ Middleware Auth           ✅ 22 tables                  ⚠️ Templates à coller
   ✅ RLS multi-tenant          ✅ 60+ policies RLS           ⚠️ Domaine custom à
   ✅ Server Actions            ✅ Storage 2 buckets             configurer (DKIM)
   ✅ ssr 0.5 cookie chunking   ✅ Edge Functions Deno
   ✅ Mobile-responsive         ✅ Triggers updated_at
   ⚠️ 0 tests E2E               ⚠️ Edge fn pas déployées     HOSTING (Netlify)
   ⚠️ Pas de monitoring         ⚠️ Backups par défaut         ──────────────────
                                                              ⚠️ Quota Free saturé
                                                              ⚠️ Domaine .netlify
                                                              ❌ Pas de Sentry
```

---

# PARTIE II — AUDIT PAR LES 10 COMITÉS

## 🏛️ COMITÉ 1 — PRODUCT & SaaS

> Composition : Product Manager Senior, Head of SaaS Growth, UX Strategist, Customer Success Lead

### Verdict
**Note globale : 7,5/10**. On a un MVP solide pour 1 client (ZIK en PACA), mais on n'est pas un produit SaaS — on est un build sur-mesure déguisé.

### Forces
- Couverture fonctionnelle large (20 modules)
- Multi-rôles bien pensé (5 rôles claires)
- Time-to-value bénévole < 2 min (inscription → confirmation)

### Faiblesses critiques
1. **❌ Aucun parcours d'onboarding new tenant** — comment une 2e asso s'inscrit ? Aucun flux self-service. Aujourd'hui = SQL manuel par toi.
2. **❌ Pas de pricing visible** — pas de page /pricing, pas de CTA "Commencer gratuitement"
3. **❌ Pas de page produit** — la landing existe mais ne vend pas (pas de captures, pas de témoignages, pas de social proof)
4. **❌ Pas d'analytics** (PostHog mentionné en CSP mais pas implémenté → tu ne sais pas qui clique quoi)
5. **❌ Pas de feedback loop** (pas de bouton "Je signale un bug")

### Recommandations P0 (avant V1)
- Ajouter `/pricing` avec les 4 paliers
- Ajouter `/inscription-organisation` self-service (créer org + admin user en 2 clics)
- Implémenter PostHog ou Plausible pour analytics
- Ajouter un widget feedback (Crisp ou intercom-like)

### Recommandations P1
- Quickstart wizard pour nouvel admin (créer 1er event en 5 étapes guidées)
- Dashboard "santé du festival" avec score 0-100 (combien complété ?)
- Templates d'événements pré-faits ("Festival reggae 1500 pers", "Foire associative", "Salon BD")

---

## 🏛️ COMITÉ 2 — MÉTIER ÉVÉNEMENTIEL

> Composition : Directeur de festival, Président d'asso, Régisseur général, Coordinateur bénévoles, Responsable billetterie, Responsable partenariats

### Verdict
**Note globale : 8/10**. On a écouté la réalité terrain (Pam) — c'est rare et précieux. Mais on a des angles morts.

### Forces
- Convention bénévolat conforme attestation 2021 ✓
- Charte scroll-locked = vraie protection juridique ✓
- 51 inscrits réels parsés depuis Google Form = on traite la friction "transition de l'outil ancien" ✓
- Vue Planning par équipes avec souhaits = le **vrai** besoin métier (pas un gantt débile)

### Faiblesses critiques
1. **⚠️ Absence du module Artistes** — pas de gestion contrats, riders, hébergements, transports, défraiements. C'est un GROS sujet pour les festivals musique. Pour Pam qui fait du reggae, c'est central.
2. **⚠️ Absence du module Sécurité événementielle** — pas de plan d'évacuation interactif, pas de check-list SDIS, pas de gestion du dispositif sécurité (agents, postes, talkies).
3. **⚠️ Absence du module Dons & Subventions** — les assos vivent à 30-50% de subventions publiques. Pas de tracking dossiers (CNV, DRAC, mairie, région).
4. **⚠️ Absence du module Communication** — pas de gestion des newsletters, pas de génération d'affiches/flyers, pas de programmation réseaux sociaux.
5. **⚠️ Catering trop simpliste** — un seul ticket repas/créneau ne prend pas en compte les régimes par jour, les horaires de service, les rotations cuisine.

### Recommandations P0 (avant juin 2026)
- Module Artistes minimal : nom, contrat oui/non, rider stocké (PDF), horaire passage, défraiement, hébergement
- Module Sécurité minimal : check-list SDIS importable, contact pompiers/police, plan évacuation upload

### Recommandations P1
- Module Subventions : suivi dossiers (déposé/reçu/refusé/décaissé) avec dates et montants
- Module Communication : générateur d'affiches via template

### Quote terrain
> "Le festival, c'est 80% de logistique invisible. Si vous gérez juste les bénévoles, vous remplacez WhatsApp. Si vous gérez tout le reste, vous remplacez 5 outils." — Régisseur général

---

## 🏛️ COMITÉ 3 — TECH & ARCHITECTURE

> Composition : CTO SaaS, Lead Developer Full Stack, Architecte Cloud, Expert Mobile, Expert IA/Automatisation

### Verdict
**Note globale : 7/10**. Architecture saine, mais dette technique en accumulation.

### Forces
- Stack moderne (Next.js 14 App Router + Supabase + TypeScript strict)
- Multi-tenant via RLS Postgres (gold standard sécurité)
- Server Actions = moins d'API REST à maintenir
- pnpm + Turborepo monorepo correctement structuré
- Migrations versionnées et idempotentes

### Faiblesses critiques
1. **❌ Aucun test** (E2E, intégration, unit). Régression silencieuse possible à chaque commit.
2. **❌ ignoreBuildErrors=true** dans next.config.mjs → les erreurs TS sont étouffées. Bombe à retardement.
3. **❌ Edge Functions Supabase mentionnées mais pas déployées** (`send_validation_mail` invoke échoue silencieusement → l'utilisateur croit que le mail part)
4. **❌ Pas de CI/CD** (GitHub Actions absent → push = déploiement direct sans gate)
5. **❌ Pas de monitoring** (pas de Sentry, pas de logs centralisés)
6. **⚠️ Pas de mobile app native** (Expo dans roadmap mais pas commencé)
7. **⚠️ Pas de cache** (chaque request DB tape la BDD)
8. **⚠️ JSZip côté serveur Next.js = lourd** (pourrait être Edge Function Supabase)
9. **⚠️ Plans festival servis depuis /public/** = couplé au déploiement (pas multi-tenant)

### Recommandations P0
- Activer TypeScript strict (retirer ignoreBuildErrors)
- Déployer les Edge Functions (`send_validation_mail`, `send_qr_jminus7`)
- Setup Sentry (gratuit jusqu'à 5K events/mois)
- 1 test E2E Playwright critique : inscription → validation → connexion → signature convention

### Recommandations P1
- Migrer plans festival vers Storage Supabase (pas /public)
- App mobile Expo (1 mois de dev solo)
- Setup GitHub Actions : tests + lint + preview deploys
- Cache Redis (Upstash gratuit) pour queries lourdes (planning, dashboard direction)

### Schéma cible 6 mois
```
   Web (Next.js)    Mobile (Expo)    Marketing (Astro statique)
        │                │                    │
        └────────────────┼────────────────────┘
                         │
                ┌────────▼────────┐
                │  Supabase EU    │ ← cache Upstash Redis
                │  (Postgres+RLS) │
                │  + Edge Fns     │
                └─────────────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
        Resend      Sentry        PostHog
        (mails)     (logs)        (analytics)
```

---

## 🏛️ COMITÉ 4 — SÉCURITÉ & CONFORMITÉ

> Composition : RSSI, Pentester, Expert RGPD, Juriste numérique, Auditeur risques

### Verdict
**Note globale : 6,5/10**. Bons fondamentaux, mais des trous à boucher avant production réelle.

### Forces
- RLS Postgres = isolation forte au niveau BDD
- Magic-link = pas de mot de passe à protéger
- HTTPS + HSTS + CSP configurés (Netlify)
- Cookies SameSite Strict (via Next.js par défaut)
- Audit log table présente sur événements critiques
- Convention signée avec horodatage + IP (preuve juridique)

### Faiblesses critiques
1. **❌ Pas de DPIA** (analyse d'impact RGPD obligatoire pour data sensibles : santé, mineurs)
2. **❌ Pas de DPO désigné** (obligatoire >250 employés OU traitement régulier de data sensibles)
3. **❌ Pas de page /confidentialité ni /cgu**
4. **❌ Pas de DSAR flow** (Demande d'Accès aux Données — RGPD article 15)
5. **❌ Pas de droit à l'oubli implémenté** (article 17)
6. **❌ Pas de consentement granulaire** (case "j'accepte tout" vs cases séparées)
7. **❌ Pas de chiffrement at-rest des champs sensibles** (allergies, limitations, photos mineurs)
8. **⚠️ dev-login route = backdoor potentielle** même gated par secret env var
9. **⚠️ Pas de rate limit côté app** (juste Supabase Auth) → DDoS possible sur form public
10. **⚠️ Pas d'audit régulier des permissions** (un user direction qui quitte ? son membership reste actif)

### Recommandations P0 (avant prod réelle)
- Pages CGU + Politique de confidentialité (générées + relues par juriste)
- Endpoint /api/account/export (RGPD article 15)
- Endpoint /api/account/delete (article 17)
- Désigner un DPO (peut être Pam si elle est formée)
- DPIA simplifié (template CNIL)
- Supprimer la route /auth/dev-login pour V1 GA

### Recommandations P1
- Chiffrement at-rest pour `volunteer_profiles.diet_notes`, `limitations`, `parental_auth_url`
- Rate limit Cloudflare Turnstile sur formulaires publics
- Workflow d'expiration auto memberships après event
- 2FA pour rôle direction

### Risque #1 absolu
Si un mineur déclare une allergie à arachide → notre catering ne sait pas, il fait une réaction → on est en faute. **Faut un escalation flow alimentaire mineur**.

---

## 🏛️ COMITÉ 5 — AUDIT GLOBAL & QUALITÉ

> Composition : QA Lead, Expert Process, Analyste Performance, Auditeur Produit, Spécialiste support client

### Verdict
**Note globale : 6/10**. Le produit fonctionne mais beaucoup d'angles morts UX et zero process opérationnel.

### Forces
- Cohérence visuelle (palette earth-tones partout)
- Mobile-first respecté
- Erreurs gérées avec messages user-friendly

### Faiblesses critiques
1. **❌ 0 documentation utilisateur visible dans l'app** (les tutos sont dans /docs sur GitHub, inaccessibles aux users)
2. **❌ 0 onboarding interactif** (un user débarque sur /regie pour la 1ère fois → écran vide, pas de guide)
3. **❌ Empty states pauvres** (page Sponsors vide = juste un texte, pas d'illustration)
4. **❌ Pas de skeleton loaders** (UX en attente de SSR = pages blanches)
5. **❌ Pas de notifications in-app** (les alertes safer arrivent comment chez Pam ?)
6. **❌ Pas de search globale** (Pam veut trouver Stéphanie Taramino → faut aller sur Candidatures, filtrer, etc.)
7. **❌ Pas de raccourcis clavier** (Ctrl+K pour search, etc.)
8. **❌ Pas de mode hors-ligne pour responsables** (et si le wifi tombe en plein festival ?)
9. **⚠️ Pas de tests d'accessibilité** (WCAG AA = obligation légale en France pour services publics)
10. **⚠️ Charge cognitive dashboard direction** (6 KPI + sponsors + planning + safer = trop pour un mobile)

### Recommandations P0
- Empty states avec illustration + CTA pour chaque page (Sponsors, Candidatures, Planning)
- Tour guidé interactif (intro.js ou similaire) pour 1ère connexion direction
- Search globale Cmd+K (shadcn/ui Command Palette)

### Recommandations P1
- Notifications in-app (toaster + bell icon + page /notifications)
- Skeleton loaders sur toutes les pages
- Mode hors-ligne via service worker (fait pour scan staff, à étendre)
- Audit Lighthouse + WAVE pour score accessibilité

---

## 🏛️ COMITÉ 6 — MARKETING & CROISSANCE

> Composition : CMO Startup, Copywriter conversion, Expert acquisition, Brand Strategist, Community Builder

### Verdict
**Note globale : 4/10**. On a un bon produit mais pas de stratégie d'acquisition. Pour l'instant on est un "open-source-déguisé-en-SaaS".

### Forces
- Cas d'usage Pam = future étude de cas marketing en or
- Domaine niche bien défini (assos / festivals)
- Différenciation claire ("le festival pro, sans le prix pro")

### Faiblesses critiques
1. **❌ Pas de site marketing** (la home / est juste une landing minimale)
2. **❌ Pas de SEO** (pas de blog, pas de pages SEO type "logiciel bénévolat festival", "alternative Sourcil")
3. **❌ Pas de pages cas d'usage** ("Pour les festivals reggae", "Pour les associations culturelles", "Pour les petits événements")
4. **❌ Pas de stratégie content** (zéro article publié, zéro newsletter)
5. **❌ Pas de réseaux sociaux** (Easyfest n'existe pas sur LinkedIn, X, Insta)
6. **❌ Pas de communauté** (pas de Discord/Slack pour les early users)
7. **❌ Pas de programme partenaire** (assos faîtières, OT, mairies)
8. **❌ Pas de témoignages** (Pam pas encore captée en vidéo)
9. **❌ Pas de SEA budget** (zéro Google Ads / Meta Ads)

### Recommandations P0 (premier mois)
- Site marketing avec landing /pricing /produit /cas-clients /blog
- Capter Pam en vidéo 2-3 min après son test (témoignage chaleureux)
- Lancer LinkedIn page Easyfest
- 1 article SEO/semaine (10 articles en 3 mois → 5K visites mensuelles)

### Recommandations P1
- Programme partenaire avec Mouvement Associatif, FFML, ADCEP, Centre National de la Musique
- Discord communauté (les early users discutent entre eux, ils deviennent ambassadeurs)
- Newsletter mensuelle "Le journal des organisateurs"

### Plan d'acquisition réaliste 12 mois
- M1-M3 : étude de cas Pam + SEO + LinkedIn = 50 leads, 5 conversions
- M4-M6 : ads ciblées + témoignages = 200 leads, 25 conversions
- M7-M12 : programme partenaire + bouche-à-oreille = 1000 leads, 100 conversions
- **Année 1 : 130 clients, ~30K€ ARR**

---

## 🏛️ COMITÉ 7 — BRANDING & DESIGN IDENTITÉ

> Composition : Chief Brand Officer, Product Strategist, Senior Logo Designer, UI/App Icon Specialist, Typography Expert, Color Psychology Designer, Motion Identity Designer

### Verdict
**Note globale : 5/10**. La direction visuelle est cohérente mais pas mémorable. On manque de personnalité forte.

### Forces
- Palette earth-tones bien choisie (corail #FF5E5B = chaleureux, distinctif)
- Pas-de-bleu = différenciation immédiate vs Weezevent / Yurplan
- Typographie display + sans-serif = bon contraste
- Mobile-first respecté

### Faiblesses critiques
1. **❌ Pas de logo officiel défini** (juste le mot "Easyfest" en texte, pas de symbole)
2. **❌ Pas de favicon distinctif**
3. **❌ Pas d'app icon** (iOS/Android)
4. **❌ Pas de design system documenté** (composants éparpillés, pas de Storybook)
5. **❌ Pas de motion identity** (zéro animation de marque, zéro micro-interactions signifiantes)
6. **❌ Pas d'illustrations propriétaires** (que des emojis)
7. **❌ Pas de templates marketing** (pas de social cards, pas d'OG image custom par page)
8. **⚠️ Le nom "Easyfest"** est OK mais générique. Risque trademark (10+ entreprises s'appellent comme ça mondialement).

### Recommandations P0 (prio absolue avant V1 GA)
- Système de logo : 3 directions à explorer
  1. **Onde sonore + soleil** (festival musique ouvert)
  2. **F monogramme ligaturé** (sobre tech + lifestyle)
  3. **Cercle d'amitié** (5 cercles entrelacés = bénévolat collectif)
- Favicon SVG + PNG 32/192/512
- App icon iOS + Android adaptive
- Vérifier disponibilité trademark "Easyfest" en France (INPI)

### Recommandations P1
- Design system Figma + Storybook
- Motion identity : 5 animations clés (loading, success, error, transition page, hover)
- Pack illustrations 12 scènes propriétaires (festival, bénévole, scan, etc.)
- OG images dynamiques par page

### Question stratégique
**Garder "Easyfest" ou pivoter sur un nom plus fort ?**
Alternatives : Gigaboo, Festinote, Crowdli, Eventeam, Festikit, Volunly, Backline.
Ma préférence : **Backline** (référence métier scène + double sens "soutien arrière des bénévoles" + .com dispo)

---

## 🏛️ COMITÉ 8 — RECHERCHE MARCHÉ & TENDANCES

> Composition : Competitive Intelligence Agent, Trend Analyst, Target Audience Researcher, Positioning Analyst, Consumer Psychologist, User Acquisition Analyst

### Verdict
**Note globale : 6/10**. On adresse un vrai marché mais on n'a pas fait l'analyse compétitive sérieuse.

### Forces
- Marché identifié (3 000 festivals + 30K évts locaux = ~150M€ d'opportunité française)
- Clients cibles identifiés (assos sous-équipées)
- Positionnement clair ("pro, pas le prix pro")

### Faiblesses critiques
1. **❌ Pas de benchmark concurrent rigoureux** — on cite Weezevent / Sourcil mais sans capture de leur produit, sans comparatif feature par feature
2. **❌ Pas de pricing study** — on a inventé 290/990/2990€ sans test marché
3. **❌ Pas d'interviews clients potentiels** au-delà de Pam (1 client = 1 anecdote, pas une stratégie)
4. **❌ Pas de positionnement vs marché US** (Eventbrite, Deputy, Sling)
5. **❌ Pas de SWOT formalisé**
6. **❌ Pas d'analyse signaux faibles** (montée des assos militantes, économie sociale et solidaire, RGPD strict, etc.)

### Recommandations P0
- 5 interviews qualitatives (autres organisateurs festival) → identifier patterns vs Pam
- Capture concurrentielle (Weezevent, Sourcil, Bénévalibre, HelloAsso) — screenshots, fonctionnalités, prix
- Test de prix sur landing : A/B "prix à partir de" 290 vs 490 vs 690

### Recommandations P1
- Benchmark international (Eventbrite, Deputy, Sling) pour identifier features oubliées
- Étude marché formelle avec OpinionWay ou Statista
- Veille active : RSS sur "festival management software", "volunteer management"

### Tendance à exploiter
**Verdir la programmation** — les festivals sont sous pression écologique (carte sortie chiffrée, label clean-fest). Easyfest pourrait calculer le bilan carbone des bénévoles (transport, repas) et générer un rapport RSE auto.

---

## 🏛️ COMITÉ 9 — HERMES (arbitrage)

> Mission : froid, brutal, priorise sans complaisance.

### Verdict global Hermès
**Note pondérée : 6,5/10**. C'est un beau MVP construit en sprint, mais c'est PAS un produit.
Pour devenir un produit, il faut traiter 3 décisions simultanément :
1. Renoncer aux 50% de fonctionnalités gadgets (timeline gantt, sponsors CRM complet, pack préfecture en ZIP) qui ne sont pas critiques
2. Traiter les 5 trous critiques : tests, monitoring, CGU/RGPD, onboarding self-service, analytics
3. Faire un choix stratégique : on optimise pour 1 client (Pam) ou pour 100 ?

### Top 3 décisions urgentes
1. **Pivoter de "build sur-mesure" vers "produit"** : créer le flux self-service organisation + landing /pricing
2. **Activer le rigueur production** : tests E2E + Sentry + CI/CD
3. **Conformité RGPD** : CGU + Politique conf + DSAR endpoints (avant 1er € de CA)

### Top 3 décisions à abandonner
1. **❌ Mobile Expo natif** — le web responsive suffit. Pas de ROI avant 100 clients.
2. **❌ Catering tickets repas v2** — gadget pour démo, pas critique métier
3. **❌ Module Wellbeing détaillé** — bien intentionné mais sur-anticipation. Bouton 🚨 alerte suffit.

### Top 3 décisions à amplifier
1. **✅ Convention bénévolat signable** — déclencheur d'achat clair (gain de temps + conformité juridique)
2. **✅ Vue Planning par équipes avec souhaits** — différenciation forte vs Excel
3. **✅ Sponsors CRM** — montée en gamme du panier moyen (festival paye plus parce qu'il a plus de valeur)

### Question piège que Pam va te poser dimanche
> "Et si demain je veux passer à un autre outil, je récupère mes données ?"

→ Réponse à préparer : un endpoint `/api/account/export-all` qui sort un JSON + CSV de TOUTES ses données.
**À implémenter avant dimanche** si possible.

---

## 🏛️ COMITÉ 10 — OPEN CODE (transformation en specs)

> Mission : transformer les recos des 9 autres comités en backlog exploitable.

### Backlog priorisé (post-démo Pam)

#### 🔴 P0 — Avant V1 GA (juin 2026)
| ID | Tâche | Effort | Owner |
|----|-------|--------|-------|
| OC-01 | Onboarding self-service organisation | 3j | Code |
| OC-02 | Page /pricing publique | 1j | Design + Code |
| OC-03 | CGU + Politique de confidentialité | 2j | Juriste + Code |
| OC-04 | Endpoint export RGPD `/api/account/export-all` | 1j | Code |
| OC-05 | Endpoint suppression `/api/account/delete` | 1j | Code |
| OC-06 | Test E2E Playwright "happy path" inscription→connexion | 2j | Code |
| OC-07 | Sentry + GitHub Actions CI | 1j | Code |
| OC-08 | Module Artistes minimal | 3j | Code |
| OC-09 | Logo officiel + favicon + app icons | 2j | Design |
| OC-10 | Landing marketing complète (5 pages) | 5j | Design + Code |
| OC-11 | Étude de cas Pam (article + vidéo témoignage) | 2j | Marketing |
| OC-12 | LinkedIn page + 5 posts | 1j | Marketing |
| OC-13 | Migrer plans festival vers Storage Supabase | 0.5j | Code |
| OC-14 | Cmd+K search globale | 2j | Code |
| OC-15 | Empty states sur toutes les pages | 2j | Design + Code |

#### 🟡 P1 — V1.5 (été 2026)
| ID | Tâche | Effort |
|----|-------|--------|
| OC-20 | Module Sécurité (check-list SDIS, plan évacuation) | 5j |
| OC-21 | Module Subventions (suivi dossiers) | 3j |
| OC-22 | App mobile Expo (iOS + Android) | 30j |
| OC-23 | Notifications in-app + bell icon | 2j |
| OC-24 | Mode hors-ligne avancé pour responsables | 5j |
| OC-25 | Programme partenaires (Mouvement Associatif…) | 5j |
| OC-26 | Tests d'accessibilité WCAG AA | 3j |
| OC-27 | Newsletter "Le journal des organisateurs" | 2j |
| OC-28 | Discord communauté + onboarding | 2j |

#### 🟢 P2 — V2 (automne 2026)
| ID | Tâche | Effort |
|----|-------|--------|
| OC-30 | Module Communication (générateur visuels IA) | 10j |
| OC-31 | Bilan carbone festival auto | 5j |
| OC-32 | Marketplace add-ons | 15j |
| OC-33 | White-label collectivités | 10j |
| OC-34 | API publique + documentation OpenAPI | 5j |
| OC-35 | Multilingue (anglais d'abord) | 7j |

---

# PARTIE III — PROMPTS POUR CLAUDE DESIGN

## 🎨 Prompt 1 — Logo officiel Easyfest (3 directions)

```
Tu es Senior Logo Designer chez une agence top-tier (Pentagram, Wolff Olins, Linear).

CONTEXTE
Easyfest est un SaaS pour organisateurs de festivals et associations culturelles.
Cible primaire : festivals indé 200-5000 personnes (musique, arts, foires).
Cible secondaire : associations sociales/culturelles, mairies, OT.
Promesse : "le festival pro, sans le prix pro".
Valeurs : chaleur humaine, professionnalisme, accessibilité, modernité durable.
Anti-valeurs : froid corporate, gadget tech, infantilisant.

PALETTE OBLIGATOIRE
- Corail #FF5E5B (signature)
- Ink #1A1A1A (text)
- Cream #FFF8F0 (background)
- Optionnel : ambre #F4B860, vert pin #2D5F4F
- INTERDIT : bleu

CONTRAINTES TECHNIQUES
- Lisible à 16x16 (favicon)
- Lisible en monochrome
- Reconnaissable en 1 seconde
- Adaptable horizontale + emblème seul
- Compatible iOS adaptive icon (rond, pas de coins coupés)
- Compatible Android adaptive icon (zone safe au centre)

MISSION
Génère 3 directions de logo (système complet : logotype + emblème + favicon + app icon).

Direction 1 — "Onde sonore solaire"
Symbole : une onde sonore qui devient un soleil levant, vagues progressives.
Symbolique : musique + soleil + horizon (festival open-air).
Style : géométrique simple, lignes épurées, traits monoligne.

Direction 2 — "F monogramme ligaturé"
Symbole : un F construit comme une signature, jouant sur les contrastes pleins/déliés.
Symbolique : sobriété tech + élégance lifestyle.
Style : custom typography, brutalism léger, modulaire (peut s'animer).

Direction 3 — "Cercles entrelacés"
Symbole : 5 cercles imbriqués (les 5 rôles : direction, lead, post-lead, scan, bénévole) formant un seul ensemble.
Symbolique : collectif, écosystème, équipe qui tient ensemble.
Style : organique, courbes douces, 5 nuances de corail.

LIVRABLES PAR DIRECTION
1. Vue d'ensemble (logotype horizontal + emblème + tagline "le festival pro, sans le prix pro")
2. Mock favicon 32x32
3. Mock iOS app icon 1024x1024
4. Mock Android adaptive icon (foreground + background séparés)
5. Variations couleurs (sombre, clair, monochrome noir, monochrome blanc)
6. Mock en context : sur un t-shirt bénévole, sur l'app mobile, sur une affiche
7. Émotion à transmettre : 1 phrase
8. Risque marché : 1 phrase (qui pourrait nous attaquer ?)
9. Note /10 sur 5 critères : mémorabilité, scalabilité, modernité, business fit, originalité

TEST FINAL
Pour chaque direction, simule la réaction de :
- Pam (présidente asso, 45 ans, raisonnée mais émotionnelle)
- Investisseur seed (rationnel, regarde la défensabilité)
- Bénévole de 22 ans (millenial qui aime ce qui est cool)
- Fonctionnaire municipal qui valide les subventions (méfiant, conservateur)
```

---

## 🎨 Prompt 2 — Landing marketing complète

```
Tu es Senior Web Designer + Conversion Copywriter avec 10 ans d'expérience SaaS B2B européen.

CONTEXTE
Easyfest a besoin d'une landing qui convertit les organisateurs de festivals.
Public : président·es d'asso loi 1901, organisateurs salariés de festivals indé,
animateurs culturels en mairie, responsables événementiel agences.
Profil : 35-55 ans, débordés, allergiques au jargon tech, pragmatiques.

OBJECTIF
Conversion : visiteurs → inscription gratuite (account creation).
Secondaire : récupération email pour newsletter.

STRUCTURE PROPOSÉE (à challenger)
1. Hero (above the fold)
   - Headline punchy 6-9 mots
   - Sous-headline 15-20 mots qui clarifie pour qui
   - CTA principal "Commencer gratuitement"
   - Visuel : capture du Planning par équipes drag&drop
   - Trust signals : "Utilisé par X festivals, Y bénévoles gérés"

2. Problème (que vit le client)
   - 3 piles d'outils éparpillés (Excel + WhatsApp + Drive + …) qui ne se parlent pas
   - Chiffres choc : "70% des assos perdent du temps à recopier les mêmes infos 5 fois"

3. Solution (Easyfest en 1 ligne)
   - Visualisation : avant (chaos) → après (1 outil)

4. 6 Features-bénéfices (pas features-features)
   - "Tu sais qui vient, qui ne vient pas, en 1 coup d'œil"
   - "Plus de Doodle qui se perd dans les mails"
   - "Tes bénévoles signent leur convention en 30 secondes"
   - "Ton pack préfecture en 1 clic, plus 3 jours de paperasse"
   - "Tes sponsors suivis sans faire un Notion en plus"
   - "Les retours bénévoles centralisés, pas dans 3 WhatsApp"

5. Cas client mis en avant : ZIK en PACA / Roots du Lac (Pam)
   - Quote vidéo Pam
   - Avant : "On gérait à l'arrache avec Excel et WhatsApp"
   - Après : "51 bénévoles gérés en 30 minutes, conventions signées en 1 click"

6. Pricing transparent (4 paliers : Free / Crew 290€ / Festival 990€ / Pro 2990€)
   - Comparatif clair
   - "Sans engagement, change quand tu veux"
   - "Free pour toujours pour les petites assos"

7. FAQ (10 questions)
   - "Qu'est-ce qui se passe quand je dépasse le palier free ?"
   - "Mes données m'appartiennent, je peux les récupérer ?"
   - "C'est conforme RGPD ?"
   - "Quelle assistance si ça plante en plein festival ?"
   - …

8. Footer (CGU, conf, qui sommes nous, blog, contact)

CONTRAINTES VISUELLES
- Palette stricte : corail #FF5E5B, ink #1A1A1A, cream #FFF8F0
- Typo display sur les headers, sans-serif sur le corps
- Aucun stock photo, que des illustrations propriétaires ou screenshots app
- Mobile-first (60% du trafic asso vient du mobile)
- Web vitals : LCP < 2.5s, CLS < 0.1

LIVRABLES
1. Wireframe basse fidélité de chaque section
2. Copywriting complet (headlines, sous-headlines, body, CTA)
3. Recommandations d'illustrations (3 par section)
4. Variations A/B à tester (3 hero différents)
5. Liste de 10 micro-interactions clés (hover, scroll, etc.)
6. Score attendu Lighthouse + plan d'optim
```

---

## 🎨 Prompt 3 — Système d'illustrations propriétaires (12 scènes)

```
Tu es Illustration Designer pour SaaS lifestyle (style Lottie / Storyset / Notion illustrations).

CONTEXTE
Easyfest a besoin d'un pack illustrations propriétaires pour remplacer les emojis et stocks dans :
- Empty states (page vide, aucune candidature, aucun sponsor, etc.)
- Sections marketing
- Onboarding écrans
- Confirmations d'action

STYLE
- Personnages diversifiés (genre, âge, ethnie, morphologie, handicap visible)
- Palette earth-tones (corail, ink, cream + ambre, vert pin, sable)
- Style flat avec ombres douces
- Pas de visage détaillé (style isométrique ou semi-abstrait)
- Animation possible (chaque illustration en SVG animable)

LES 12 SCÈNES À PRODUIRE
1. **Bénévole heureux qui scanne son QR à l'entrée** (empty state /qr)
2. **Personnes qui se passent la main pour la corvée vaisselle** (empty state catering vide)
3. **Tableau Kanban avec cartes qui flottent** (empty state planning)
4. **Mégaphone qui annonce une bonne nouvelle** (empty state messages)
5. **Coeur en cocon protecteur** (empty state safer space, aucun signalement)
6. **Cadenas avec cape de super-héros** (politique de confidentialité)
7. **Paysage festival vu de loin avec scène et tentes** (hero landing)
8. **Bouquet de mains levées qui s'applaudissent** (témoignages)
9. **Boîte de cadeau qui s'ouvre avec confetti** (post-inscription succès)
10. **Téléphone qui bip avec notif "ton planning est prêt"** (mail validation candidature)
11. **Carte au trésor avec marqueurs au lieu d'X** (plan du site festival)
12. **Cercle de personnages en discussion autour d'un feu** (page communauté Discord)

LIVRABLES PAR ILLUSTRATION
- SVG vectoriel (scalable)
- 3 tailles cibles : 200x200, 400x400, 800x800
- Variation dark mode
- Variation animée si possible (Lottie JSON ou CSS keyframes)
- Mood : 1 phrase
- Code couleur HEX utilisé
- Adaptation mobile (orientation portrait)
```

---

## 🎨 Prompt 4 — Motion identity système

```
Tu es Motion Designer / Brand Animator (Apple, Stripe, Linear).

CONTEXTE
Easyfest a besoin de 8 micro-interactions signature qui deviennent reconnaissables.

LES 8 ANIMATIONS
1. **Loading state** — pendant qu'on charge le planning : 5 cercles qui se forment en pulsant doucement (référence cercles entrelacés du logo dir 3)
2. **Success after action** — checkmark corail qui se dessine en 400ms avec un bounce léger
3. **Error subtle** — input rouge qui shake horizontal 3 oscillations 200ms
4. **Page transition** — fade-up 30px en 250ms ease-out
5. **Card hover** — lift 4px + shadow elevation 2 en 150ms
6. **Notification toast** — slide-in depuis bas-droite en 300ms cubic-bezier
7. **Magic-link sent** — enveloppe qui s'envole en arc en 600ms
8. **Onboarding step complete** — confettis discrets corail/ambre 1.2s

LIVRABLES PAR ANIMATION
- Spec en pseudocode (durée, easing, transformations)
- Code CSS keyframes / framer-motion equivalent
- Code Lottie JSON exportable
- Démo dans un Storybook
- Justification émotionnelle (pourquoi cette anim et pas une autre)
- A faire / À éviter
```

---

# PARTIE IV — PROMPTS POUR CLAUDE CODE

## 💻 Prompt 1 — Onboarding self-service organisation (OC-01)

```
Tu es Senior Full-Stack Developer Next.js + Supabase.

CONTEXTE
Easyfest est un SaaS multi-tenant. Aujourd'hui, créer une nouvelle org demande
un INSERT SQL manuel par moi. On veut un flux self-service.

OBJECTIF
Permettre à un nouvel organisateur (ex: une autre asso comme Vinyl Trip)
de créer son organisation + son 1er event en 5 étapes guidées.

STACK (existante)
- Next.js 14 App Router + Server Actions
- Supabase (Postgres + Auth + Storage)
- @supabase/ssr 0.5
- Tailwind + shadcn/ui
- TypeScript strict (mais ignoreBuildErrors=true à fixer plus tard)

FICHIERS EXISTANTS À RESPECTER
- /apps/vitrine/lib/supabase/server.ts (client SSR)
- /apps/vitrine/middleware.ts (auth check)
- /apps/vitrine/app/actions/* (Server Actions pattern)
- /packages/db/supabase/migrations/ (versioning SQL)

SPEC FONCTIONNELLE
Route publique : /commencer
Étapes du wizard :
1. Email + nom complet → magic-link envoyé
2. Confirmation magic-link → user créé dans auth.users
3. Étape 1 : Nom de l'asso + slug auto-généré (avec vérif unicité)
4. Étape 2 : Type (asso loi 1901 / SAS / SARL / Mairie / Autre) + SIRET (optionnel)
5. Étape 3 : 1er event (nom, dates, lieu) + slug auto
6. Étape 4 : choisir 1 template d'event (festival musique / asso culturelle / foire / blank)
   → préremplit les positions + shifts standard
7. Étape 5 : invite équipe (jusqu'à 5 emails) → leur envoie magic-link

À LA FIN
- Org créée avec créateur en rôle direction
- Event créé avec status='draft'
- Memberships créés pour les invités (rôle à choisir : volunteer_lead ou direction)
- Redirection vers /regie/[org]/[event] avec une banderole "🎉 Bienvenue, prochaine étape : valide tes positions"

FICHIERS À CRÉER
1. /apps/vitrine/app/commencer/page.tsx (Server Component avec stepper)
2. /apps/vitrine/app/commencer/OnboardingWizard.tsx (Client Component, state local)
3. /apps/vitrine/app/actions/onboarding.ts (Server Actions : checkSlug, createOrg, createEvent, applyTemplate, inviteTeam)
4. /packages/db/supabase/migrations/20260501000001_org_templates.sql (table event_templates)
5. /packages/db/supabase/seed/event-templates.sql (4 templates prêts)

SÉCURITÉ
- Rate limit côté Server Action (10 créations/heure/IP via Upstash ou simple compteur Postgres)
- Vérifier que slug n'existe pas déjà
- L'utilisateur ne peut créer qu'1 organisation par défaut (sauf flag is_premium)
- Audit log pour chaque création

UX
- Skeleton loaders pendant les checks
- Validation Zod côté client + Server
- Animations de transition entre étapes (framer-motion ou CSS)
- Mobile-first (barre de progression sticky en haut)
- Possibilité de quitter et reprendre (state localStorage + table draft_onboardings)

LIVRABLE
- Code complet des 5 fichiers
- Schema migration SQL
- 1 test E2E Playwright qui fait le parcours complet de bout en bout
- Documentation (commentaires JSDoc)
- Une checklist d'acceptation : 8 cas à valider avant merge
```

---

## 💻 Prompt 2 — Module Artistes minimal (OC-08)

```
Tu es Full-Stack Developer + Product Manager assistant.

CONTEXTE
Pour Pam (festival reggae Roots du Lac), gérer les artistes est critique :
contrat signé, rider, hébergement, défraiement, horaire passage.
Aujourd'hui zéro gestion artistes dans Easyfest.

OBJECTIF
Module Artistes minimal mais complet pour V1 GA.

SPEC
Page /regie/[org]/[event]/artistes
- Liste avec photo, nom de scène, statut, horaire passage, montant
- Bouton "Ajouter un artiste"
- Modal CRUD : nom, nom scène, photo, contact email/tel,
  statut (intéressé/pré-confirmé/contrat envoyé/signé/présent/payé),
  horaire (datetime), durée (minutes), cachet (€), défraiement (€),
  hébergement requis (boolean), nb chambres, transport requis (boolean),
  rider PDF (upload Storage), notes internes
- Vue calendrier (gantt mini par jour de festival)
- Export pack artistes (PDF avec rider + contact + plan accès)

DB
table artists (
  id, event_id, stage_name, real_name, photo_url,
  contact_email, contact_phone, manager_name, manager_phone,
  status (enum), genre, country,
  performance_starts_at, performance_duration_minutes,
  fee_eur, expenses_eur,
  needs_accommodation, accommodation_rooms,
  needs_transport, transport_notes,
  rider_url (Storage), tech_specs_url,
  internal_notes,
  created_by, created_at, updated_at
)

RLS : direction peut tout, volunteer_lead peut lire seulement.

FEATURES BONUS
- Conflit horaire détecté automatiquement (2 artistes au même créneau)
- Total cachet vs budget alloué (alerte si dépassement)
- Mail auto à J-7 pour les artistes : "rappel logistique" avec lien plan + contacts
- Lien public partageable "Programmation" (sans les infos sensibles type cachet)

LIVRABLES
- Migration SQL (table + RLS)
- Page server + composants client
- Server Actions CRUD
- Bouton export pack (route API qui génère un PDF par artiste)
- 1 test E2E (créer artiste → modifier → exporter pack)
- Doc utilisateur (1 page MD)
```

---

## 💻 Prompt 3 — RGPD endpoints (OC-04 + OC-05)

```
Tu es Full-Stack Developer + Privacy Engineer.

CONTEXTE
Easyfest collecte des data personnelles (bénévoles, conventions, photos).
On doit être conforme RGPD avant 1 € de CA pro.

OBJECTIF
Implémenter les 2 endpoints RGPD critiques :
1. Export des données (article 15)
2. Suppression du compte (article 17)

SPEC EXPORT (article 15 — DSAR)
Route : /api/account/export
Méthode : GET, authentifié
Réponse : ZIP avec :
- profile.json (toutes les data du user)
- events.json (events où il a un membership)
- applications.json (toutes ses candidatures)
- conventions.json (toutes les conventions signées)
- photos/ (folder avec ses avatars uploadés)
- README.md (explication du contenu + comment lire)
- audit-log.csv (toutes ses actions)

SPEC SUPPRESSION (article 17)
Route : /api/account/delete
Méthode : POST, authentifié, demande mot de passe pour confirmation
Workflow :
1. Soft delete (mark deleted_at) pour 30 jours
2. Email "Ton compte sera supprimé dans 30 jours, click ici pour annuler"
3. Pendant les 30 jours, l'utilisateur peut se reconnecter et annuler
4. Job cron quotidien qui hard-delete les comptes >30 jours
5. Hard-delete : pseudonymiser dans audit_log (remplace user_id par 'deleted-USR-XXX'),
   supprimer profile, applications, photos, memberships, signed_engagements
   (mais GARDER l'event histo pour traçabilité légale, juste sans les data perso)

CONTRAINTES LÉGALES
- L'export doit être livré sous 1 mois max (RGPD), idéalement immédiat
- Pas de data sensible en clair dans logs
- Conserver les data juridiques (factures, conventions) si obligation légale
  (durée = 5 ans après fin de relation contractuelle)
- Si user est co-auteur de data partagées (ex: messages chat),
  on pseudonymise pas on n'efface pas

FICHIERS
1. /apps/vitrine/app/api/account/export/route.ts
2. /apps/vitrine/app/api/account/delete/route.ts
3. /apps/vitrine/app/api/account/restore/route.ts
4. /packages/db/supabase/migrations/20260501000010_account_lifecycle.sql
   (ajoute deleted_at, deletion_scheduled_at, restore_token sur auth + profiles)
5. /packages/db/supabase/functions/cron_hard_delete_accounts/ (Edge Function quotidienne)

SÉCURITÉ
- Rate limit fort (1 export/24h max par user)
- Le delete demande mot de passe ou confirmation magic-link
- Notification email à chaque étape
- Audit log
- Pas d'export possible si compte freezé pour suspicion de fraude

LIVRABLES
- Code complet
- Documentation utilisateur (page /confidentialité avec FAQ)
- 2 tests E2E (export + delete avec restore)
- Email templates pour les confirmations (4 mails)
- Checklist d'acceptation : 12 cas
```

---

## 💻 Prompt 4 — Tests E2E Playwright + CI GitHub Actions (OC-06 + OC-07)

```
Tu es Senior QA + DevOps Engineer.

CONTEXTE
Easyfest n'a aucun test. Le moindre commit peut casser des features critiques sans qu'on le sache.

OBJECTIF
- Setup Playwright avec 5 tests E2E "happy path" critiques
- Setup GitHub Actions CI qui tourne ces tests sur chaque PR + main
- Setup Sentry pour erreurs prod
- Setup PostHog pour analytics

LES 5 TESTS E2E CRITIQUES
1. **Inscription bénévole 5 étapes** → atterrit sur "candidature envoyée"
2. **Validation candidature côté régie** → applic passe en validated, mail envoyé
3. **Bouton "Inviter par mail"** → application a invited_at non null
4. **Login magic-link → /hub → /regie** → middleware reconnaît, dashboard charge
5. **Signature convention bénévolat** → engagement créé en BDD avec IP + horodatage

STACK
- @playwright/test
- Supabase test instance (CLI : supabase start, branche locale)
- GitHub Actions matrix (Node 20, Ubuntu)
- Sentry SDK Next.js
- PostHog SDK

FICHIERS
1. /e2e/playwright.config.ts
2. /e2e/01-inscription.spec.ts
3. /e2e/02-validate-application.spec.ts
4. /e2e/03-invite-volunteer.spec.ts
5. /e2e/04-magic-link-login.spec.ts
6. /e2e/05-sign-convention.spec.ts
7. /e2e/fixtures/test-data.ts (helpers pour seed/cleanup)
8. /.github/workflows/ci.yml (lint + typecheck + tests + preview deploy)
9. /.github/workflows/migrate.yml (apply migrations to staging on merge)
10. /apps/vitrine/lib/sentry.ts + sentry.client.config.ts + sentry.server.config.ts
11. /apps/vitrine/lib/posthog.ts

CI GITHUB ACTIONS
Jobs :
- lint (eslint + prettier)
- typecheck (tsc --noEmit)
- unit (vitest si on en a)
- e2e (playwright avec serveur local Next.js + Supabase local)
- security audit (pnpm audit)
- preview deploy (Netlify preview URL pour les PR)

REQUIREMENTS
- Temps total CI < 8 min (sinon les devs vont l'éviter)
- Cache npm + Playwright browsers
- Logs structurés (échec → quel test → screenshot + video)
- Coverage rapport en commentaire de la PR

SECRETS À CONFIGURER (par toi)
- SUPABASE_TEST_URL
- SUPABASE_TEST_ANON_KEY
- SUPABASE_TEST_SERVICE_KEY
- NETLIFY_AUTH_TOKEN
- SENTRY_AUTH_TOKEN
- SENTRY_DSN
- POSTHOG_KEY

LIVRABLES
- Code des 11 fichiers
- README setup local (clone → tests passent en 1 commande)
- Documentation pour les contributeurs (comment ajouter un test)
- Justification : ROI en 1 paragraphe (pourquoi 5 tests et pas 50)
```

---

## 💻 Prompt 5 — Cmd+K Search globale (OC-14)

```
Tu es Full-Stack Developer + UX-focused.

CONTEXTE
Pam doit chercher Stéphanie Taramino → elle va sur Candidatures, filtre, trouve.
3 actions au lieu d'1. Cmd+K résoud ça partout.

OBJECTIF
Une command palette accessible depuis n'importe quelle page régie via Cmd+K (Mac) / Ctrl+K (Win).

CONTENU DE LA SEARCH
- Bénévoles (par nom, email, tel)
- Sponsors (par nom, contact)
- Candidatures (par nom, statut)
- Pages (Planning, Candidatures, Sponsors, Plan, Safer, Messages)
- Actions rapides (Inviter par mail, Exporter pack préfecture, Cloner event)

UI
- Modal centrée full-screen sur mobile, dialog 600px sur desktop
- Liste de résultats groupés par type (Bénévoles / Sponsors / Pages / Actions)
- Filtre fuzzy (fuse.js ou cmdk)
- Raccourcis : flèches, Enter, Esc
- Indicateur de chargement si data pas en cache

STACK
- shadcn/ui Command (déjà disponible via cdn.shadcn.com)
- cmdk (déjà inclus)
- React Server Components pour fetch initial
- Server Actions pour search server-side fuzzy si > 50 items

FICHIER PRINCIPAL
/apps/vitrine/components/CommandPalette.tsx (Client Component)

INVOCATION
Importé dans /apps/vitrine/app/regie/[orgSlug]/[eventSlug]/layout.tsx
Trigger : keyboard listener Cmd+K / Ctrl+K + bouton invisible focusable

PERMISSIONS
- direction voit tout
- volunteer_lead ne voit pas les sponsors dans search
- post_lead voit uniquement les bénévoles de son équipe

PERFORMANCE
- Fetch initial des 100 derniers bénévoles + 20 sponsors au mount
- Fuzzy local pour résultats instantanés
- Si user tape > 50 chars → query server avec full-text search

LIVRABLES
- Composant CommandPalette
- Server Action pour search étendue
- Indexes Postgres GIN sur full_name, email pour search rapide
- 1 test Playwright
- Demo GIF dans le commit
```

---

## 💻 Prompt 6 — Capture témoignage Pam vidéo + landing case study

```
Tu es Brand Storyteller + Front-end developer.

CONTEXTE
Après le test de Pam dimanche, on doit transformer son retour en arme marketing.

OBJECTIF
Construire une landing /cas-clients/zik-en-paca qui transforme le visiteur en lead.

PARCOURS
1. Tu prépares un guide vidéo pour Gaëtan : 8 questions à poser à Pam
2. Tu écris le script de la page landing avec quotes vidéo intégrées
3. Tu codes la page (Next.js App Router, MDX si content)

LES 8 QUESTIONS À PAM (vidéo 30s-2min chaque)
1. "Présente-toi en 30 secondes, ton festival, ton asso"
2. "Avant Easyfest, comment tu gérais tes 51 bénévoles ?"
3. "Quel a été le moment 'wow' quand tu as testé l'app ?"
4. "Qu'est-ce qui t'a fait le plus gagner du temps ?"
5. "Si tu devais en parler à un autre orga, qu'est-ce que tu lui dirais ?"
6. "Le truc que tu n'avais pas anticipé et que tu as découvert avec Easyfest ?"
7. "Si tu pouvais ajouter UNE feature, ce serait laquelle ?"
8. "Note de 0 à 10, et pourquoi ?"

PAGE STRUCTURE
- Hero : photo Pam + son nom + nom du festival + 1 chiffre choc ("51 bénévoles → 30 min")
- Vidéo principale (montage des 8 réponses) auto-play muted
- 3 chiffres clés (avant / après) :
  * "5h" → "30 min" pour gérer les inscriptions
  * "3 outils" → "1 outil" pour tout coordonner
  * "0%" → "100%" conventions signées et tracées
- Quote pleine largeur : la phrase la plus impactante de Pam
- 5 mini-vidéos clips par moment-clé (planning, conv, photo, scan, pack préfecture)
- Témoignage texte (extrait verbatim)
- CTA en bas : "Et toi, tu veux essayer ? — Commence gratuitement"

TECH
- Next.js App Router
- Vidéos hébergées sur YouTube non listé OU Mux (mieux car embed branding-free)
- MDX pour le contenu (facile à mettre à jour)
- OG image générée auto avec photo Pam + chiffre choc
- Schema.org Review markup pour SEO

LIVRABLES
- Guide tournage vidéo PDF (1 page) pour Gaëtan
- Script complet landing
- Code Next.js de la page
- Doc édito pour ajouter d'autres cas clients plus tard
- Liste de promotion : 5 endroits où poster (LinkedIn, Twitter, Reddit r/festivals, forums asso, Discord)
```

---

# PARTIE V — CHECKLIST D'EXÉCUTION

## ✅ Avant dimanche (test Pam) — 4h
- [ ] Coller `MIGRATIONS_J3_PHASE3.sql` dans Supabase
- [ ] Coller les 3 templates emails dans Auth → Templates
- [ ] Tester `/regie/icmpaca/rdl-2026/plan` (les 2 plans s'affichent)
- [ ] Tester `/regie/icmpaca/rdl-2026/sponsors` (3 sponsors visibles)
- [ ] Tester bouton **📧 Inviter** sur 1 candidature (sur ton perso pour vérifier que le mail arrive)
- [ ] Tester export pack préfecture (download d'un ZIP)
- [ ] Préparer le réponse à la question piège Pam : "et si je veux exporter mes données ?"

## ✅ Semaine prochaine — 5 jours
- [ ] Implémenter OC-04 + OC-05 (export RGPD + delete)
- [ ] Implémenter OC-01 (onboarding self-service org)
- [ ] Implémenter OC-06 + OC-07 (tests E2E + CI)
- [ ] Démarrer OC-09 (logo officiel — déléguer à Claude Design)

## ✅ Mois prochain — 4 semaines
- [ ] OC-02 (page /pricing) + OC-03 (CGU + conf)
- [ ] OC-08 (module Artistes)
- [ ] OC-10 (landing complète + cas client Pam)
- [ ] OC-11 + OC-12 (témoignage vidéo + LinkedIn)

---

*Audit Hermès J3 · 30 avril 2026 · Build Captain*
