# 🎪 EASYFEST — Tour produit complet
*Pour Pam & Gaëtan · v1.0 · 30 avril 2026*

> Document de référence : ce que fait Easyfest aujourd'hui, comment les rôles s'imbriquent, et le parcours utilisateur de bout en bout.

---

## 🏗️ TABLE DES MATIÈRES

1. [Vue d'ensemble](#1-vue-densemble)
2. [Les 5 rôles d'Easyfest](#2-les-5-rôles-deasyfest)
3. [Architecture multi-tenant](#3-architecture-multi-tenant)
4. [Parcours organisateur (de zéro à festival qui tourne)](#4-parcours-organisateur)
5. [Parcours bénévole (de l'inscription au scan retour)](#5-parcours-bénévole)
6. [Parcours régie (suivi temps réel)](#6-parcours-régie)
7. [Toutes les features en place](#7-toutes-les-features-en-place)
8. [Architecture technique synthétique](#8-architecture-technique-synthétique)

---

## 1. Vue d'ensemble

**Easyfest** est une app SaaS multi-tenant qui permet à des associations d'organiser des festivals/événements culturels avec leurs bénévoles, sans Excel + WhatsApp + Drive éparpillés.

Une seule app : 5 rôles, 1 base de données par festival, 1 URL personnalisée.

**Public cible** : associations, festivals indépendants (50-5000 personnes), salons, foires, manifestations sportives, événements culturels.

**Promesse** : "Le festival pro, sans le prix pro." Ce qu'un Weezevent + Sourcil + Trello + Slack font à 5000€/an, Easyfest le fait à partir de 0€ pour les petites assos.

---

## 2. Les 5 rôles d'Easyfest

```
              ┌─ direction ──────── tout (régie + sponsors + budget + plan + safer)
              │     │
              │     └─ peut switcher en vue d'un autre rôle pour vérifier
              │
   asso/event ─┼─ volunteer_lead ──── bénévoles + planning + safer + messages
              │     │
              │     └─ ex: Sandy ou Dorothée
              │
              ├─ post_lead ────────── UNIQUEMENT son équipe (ex: Bar)
              │     │                  voit ses bénévoles, fait les pauses, valide arrivées
              │     └─ ex: Mahaut sur le poste Bar
              │
              ├─ staff_scan ───────── écran scanner plein-écran (entrée festival)
              │     │
              │     └─ ex: Antoine à l'accueil
              │
              └─ volunteer ────────── son espace perso : planning, QR, conv, plan, profil
                    │
                    └─ tout bénévole inscrit (ex: Lucas)
```

### Détail par rôle

#### 🎛️ direction (Pam, ou tout présidente d'asso)
- **URL** : `/regie/[org]/[event]`
- **Voit** : TOUT
- **Peut faire** : valider/refuser candidatures, créer sponsors, modifier sponsors, uploader plan du site, exporter pack préfecture, voir audit log, gérer paramètres

#### 📋 volunteer_lead (Sandy, responsable bénévoles)
- **URL** : `/r/[org]/[event]`
- **Voit** : tous les bénévoles + planning + safer space
- **Peut faire** : valider candidatures, drag&drop affectations, inviter par mail, voir rapports wellbeing, modérer alertes
- **Ne voit pas** : sponsors, budget, contrats

#### 🧑‍🤝‍🧑 post_lead (Mahaut, responsable Bar)
- **URL** : `/r/[org]/[event]` filtré sur SON poste
- **Voit** : uniquement les bénévoles affectés à son équipe (Bar)
- **Peut faire** : valider arrivées, gérer pauses repas, signaler incidents, chat équipe
- **Ne voit pas** : autres équipes, sponsors, budget

#### 📷 staff_scan (Antoine, scanner entrée)
- **URL** : `/staff/[org]/[event]` (mode plein écran mobile-first)
- **Voit** : caméra QR + indicateurs (qui arrive, qui est attendu)
- **Peut faire** : scanner les bénévoles à leur prise de poste, scanner les festivaliers, valider entrées manuelles en cas de QR cassé
- **Mode hors-ligne** : continue à scanner et sync quand wifi revient

#### 🎟️ volunteer (Lucas, bénévole simple)
- **URL** : `/v/[org]/[event]`
- **Voit** : son prochain créneau, son QR perso, sa convention, le plan, son profil
- **Peut faire** : signer la convention, déclarer son bien-être (vert/jaune/rouge), uploader sa photo, modifier ses infos, demander un changement de poste

---

## 3. Architecture multi-tenant

```
                    ┌──────────────────────────────────────┐
                    │       BASE EASYFEST GLOBALE          │
                    │                                      │
                    │  ┌─organizations────────────────┐    │
                    │  │  ZIK en PACA                 │    │
                    │  │  ├─ events                   │    │
                    │  │  │   ├─ Roots du Lac 2026    │    │
                    │  │  │   ├─ Frégus Reggae 2026   │    │
                    │  │  │   └─ ...                  │    │
                    │  │  ├─ memberships              │    │
                    │  │  └─ sponsors                 │    │
                    │  └──────────────────────────────┘    │
                    │  ┌─organizations────────────────┐    │
                    │  │  Asso Vinyl Trip (autre)     │    │
                    │  │  └─ events: Vinyl Festival   │    │
                    │  └──────────────────────────────┘    │
                    │                                      │
                    │  RLS Postgres : un user d'une asso   │
                    │  ne voit JAMAIS les données d'une    │
                    │  autre asso. Étanchéité totale.      │
                    └──────────────────────────────────────┘
```

**Une seule BDD Supabase Postgres**, mais avec 60+ politiques RLS (Row Level Security) qui font que :
- Pam de ZIK en PACA ne voit JAMAIS les bénévoles de Vinyl Trip
- Un sponsor n'apparaît que pour les responsables de SA propre organisation
- L'isolation est garantie au niveau base, pas applicatif (sécurité by design)

**Avantages** :
- 1 seule maintenance, 1 seule DB à backup
- Coût marginal d'un nouveau festival = €0 (juste un INSERT)
- Onboarding nouveau client en 10 min (créer org + event + admin)

---

## 4. Parcours organisateur

### Étape 0 — Le client (asso/orga) prend contact
Pam contacte Easyfest (formulaire site, recommandation, événement…).

### Étape 1 — Setup initial (5 min)
1. On crée son organisation dans Easyfest (slug, logo, adresse légale, SIRET, président)
2. On crée son 1er event (nom, dates, lieu, slug URL)
3. On lui envoie un magic-link → elle se connecte → elle est direction de son asso

→ À partir de là, elle a accès à tout en autonomie.

### Étape 2 — Pam configure son festival (30 min)
1. **Postes** : elle crée ses équipes (Bar, Catering, Loge, Backline, Brigade verte, Billetterie, etc.) avec couleur + icône + besoin par défaut
2. **Shifts** : pour chaque poste, elle définit les créneaux horaires (vendredi 14-18h, 18-22h, etc.)
3. **Charte** : elle uploade sa charte ou utilise le template (Astropolis-like) — modal scroll-locked
4. **Plan du site** : elle uploade ses 2 plans (jour + nuit)
5. **Sponsors** (optionnel) : elle commence à tracker ses partenaires
6. **Settings** : elle valide ses infos juridiques (SIRET, adresse, président)

### Étape 3 — Bénévoles s'inscrivent (en continu)
Pam diffuse l'URL d'inscription : `https://[event].easyfest.app/inscription` (ou sous-domaine custom).

Les inscriptions arrivent automatiquement dans son onglet **Candidatures**.

### Étape 4 — Pam valide & invite (1h en pic)
1. Onglet **Candidatures** → liste des inscrits avec photo + souhaits
2. Pour chaque : bouton vert **Valider** (ou rouge **Refuser** avec motif)
3. Si validé : bouton **📧 Inviter** → envoie magic-link au bénévole
4. Le bénévole reçoit le mail, clique, son compte est créé automatiquement

### Étape 5 — Pam construit le planning
1. Onglet **Planning** → vue par équipes (drag & drop)
2. Pool en haut (51 bénévoles à placer) → chaque carte montre les souhaits
3. Drag-drop vers une équipe → ✓ vert si match souhait, ◇ orange sinon
4. Vue alternative **Timeline** pour spotter les trous d'effectif sur les créneaux chauds

### Étape 6 — Pam invite ses responsables (5 min)
1. Settings → Permissions → ajoute Sandy comme `volunteer_lead`, Mahaut comme `post_lead Bar`, Antoine comme `staff_scan`
2. Ils reçoivent un magic-link, se connectent, voient leur dashboard restreint

### Étape 7 — J-7 : Pam envoie les détails
Mail auto à tous les bénévoles validés via Edge Function "send_jminus7_briefing" :
- Heure + lieu + équipe assignée
- Lien vers leur app (avec QR)
- Lien convention à signer
- Plan du site

### Étape 8 — J0 → Festival
- Bénévole arrive → scan son QR à l'entrée (Antoine)
- Pam suit en temps réel : combien sont là, qui manque, alertes safer
- Mahaut gère ses pauses Bar
- Si incident → bouton 🚨 alerte → Pam + Sandy notifiées
- Repas servis = compteur décrémenté auto

### Étape 9 — J+1 : pack préfecture & post-mortem
- Click **📦 Pack préfecture** → ZIP avec tout (bénévoles, sponsors, conventions, récap)
- Bénévoles reçoivent un mail de remerciement + lien sondage satisfaction
- Stats : taux satisfaction, nb incidents, nb repas servis, etc.

### Étape 10 — Préparer 2027
- Settings → "Cloner cet événement" → tout est dupliqué (postes, shifts, sponsors)
- Bénévoles 2026 reçoivent invite "tu reviens cette année ?" → pré-inscription en 1 clic

---

## 5. Parcours bénévole

### Étape 1 — Découverte (Lucas voit l'affiche du festival)
Il scanne le QR / clique le lien → atterrit sur `https://[festival]/inscription`.

### Étape 2 — Inscription (5 min, formulaire 5 étapes)
1. **Identité** : prénom, nom, email, tel, naissance, photo
2. **Logistique** : dates arrivée/départ, montage/démontage oui/non, T-shirt, régime alimentaire, allergies, covoiturage
3. **Postes** : choisit ses 3 postes préférés par ordre (Bar, Catering, Loge…)
4. **Compétences** : bio, skills, limitations physiques
5. **Engagements** : coche les 4 cases obligatoires (charte, anti-harcèlement, RGPD, +1 image optionnelle)

→ Confirmation "candidature envoyée, on revient vers toi" + mail confirmation.

### Étape 3 — Validation (Pam valide en 24-72h)
Lucas reçoit un mail "ta candidature est validée 🎉" avec un lien magique.

### Étape 4 — 1ère connexion (1 click)
Click magic-link → /hub → Lucas voit la carte "Je suis bénévole" → click → son dashboard.

**Onboarding auto** : derrière, Easyfest a créé son profil + son membership en 1 sec.

### Étape 5 — Signature de la convention
Encart amber sur dashboard "📝 Convention de bénévolat à signer (obligatoire)".
Click → page convention avec les 7 articles formels (asso, non-rémunération, assurance, engagements, droit image, RGPD, validité).
Coche 2 cases → signature électronique avec horodatage + IP.

### Étape 6 — Avant le festival
Lucas peut voir/modifier sur son app :
- 👤 Son profil (photo, infos)
- 🗺️ Le plan du site
- 📜 Re-relire la charte
- 🎟️ Son planning prévisionnel (quand Pam a fini d'affecter)

### Étape 7 — J-7 : briefing
Reçoit un mail récap : tes créneaux, ton équipe, ton lieu de RDV.

### Étape 8 — J0 : arrivée
- Ouvre son app → voit "Prochain créneau dans 1h" + bouton "Afficher mon QR"
- Va à l'accueil → Antoine scan son QR → 🟢 OK
- Va à son poste → check-in son équipe (post_lead Mahaut le voit arriver)

### Étape 9 — Pendant le créneau
- Si trop chaud / fatigue : bouton 💚 Wellbeing → vert/jaune/rouge → si rouge, Sandy est notifiée
- Si incident grave : bouton 🚨 Alerte → safer space activé
- Repas : Mahaut scan son QR au catering → ticket décrémenté

### Étape 10 — Fin du créneau
- Mahaut valide la fin de poste
- Lucas peut consulter son prochain créneau ou rentrer

### Étape 11 — Post-festival
- Reçoit mail "Merci 💛 + sondage satisfaction"
- Peut télécharger sa convention signée (PDF) pour ses archives
- Reçoit invite "tu reviens en 2027 ?" 6 mois plus tard

---

## 6. Parcours régie

### Cycle journalier de Pam pendant le festival

**6h00** — Réveil. Ouvre l'app sur son téléphone.
- Dashboard : combien sont déjà arrivés, alertes safer, créneaux du jour
- Inbox messages : Sandy a 2 trucs à signaler
- Regarde la météo intégrée (alerte orage à 18h ?)

**9h00** — Briefing leads.
- Switch en vue Sandy → vérifie son planning du jour
- Switch en vue Mahaut → vérifie le Bar a son monde
- Tout OK → vert pour le go

**14h00** — Crise.
- Notif "Bénévole Lana absente créneau 14-18h Bar"
- Va sur Planning → drag un bénévole du pool vers Bar
- Mahaut reçoit la mise à jour en temps réel

**18h00** — Soir.
- Stats live : 1240 entrées, 280 bénévoles présents, 320 repas servis
- 1 alerte safer (rouge) → click → ouvre la fiche, contacte la victime, escalade si besoin

**Minuit** — Bar ferme. 
- Compteur incidents = 2 (mineurs)
- Compteur entrées = 2100 / 2500 (capacity)
- Pam dort sereine.

**J+3** — Post-festival.
- Click 📦 Pack préfecture → envoie à la mairie
- Sondage satisfaction reçu par 187/280 bénévoles (67%)
- Stats sponsors : 6000€ négociés, 5500€ déjà encaissés
- Décide qui inviter en priorité l'an prochain (les bénévoles fidèles ★)

---

## 7. Toutes les features en place

### 🎫 Module Inscription bénévole
- Formulaire 5 étapes sécurisé (Turnstile anti-bot)
- Photo upload bénévole (max 5 Mo)
- Validation Zod côté client + serveur
- Stockage RGPD-compliant (consentements horodatés + version)
- Anti-doublon par email
- Mode "import manuel" pour la régie

### 👥 Gestion bénévoles
- Validation/refus candidatures (avec motif)
- Tags : `pending`, `validated`, `refused`, `reserve`, `pre_selected`
- Bouton "Inviter par mail" → magic-link auto
- Bénévoles fidèles (★) identifiés
- Auto-onboarding au 1er login (profil + membership créés)

### 📅 Planning
- **Vue par équipes** : drag & drop, pool central, pastilles souhaits
- **Vue par créneaux** : ancien tableau gantt par shift
- **Vue timeline** : gantt horizontal jour-par-jour, blocs colorés selon couverture
- Filtres nom/email
- Création shift fallback automatique si position sans shift défini

### 📜 Module Engagements
- **Charte du festival** : modal scroll-locked, 11 sections (intro, inclusivité, sécurité, violences, soutien Albatros/Consentis, écoresponsabilité, autorisé/interdit, infos pratiques, clôture)
- **Convention bénévolat** : 7 articles formels signables électroniquement (horodatage + IP)
- **Anti-harcèlement** : engagement séparé
- **Droit à l'image** : optionnel, séparable

### 🛡️ Module Safer Space
- Wellbeing reports : vert/jaune/rouge
- Safer alerts : signalements anonymes ou nommés
- Modération : workflow d'approbation (X validations requises pour un ban)
- Bans : avec audit log immuable
- Médiateurs identifiés (flag is_mediator sur membership)

### 📷 Scan & QR
- QR signés JWT HMAC SHA-256 (anti-fraude)
- Scanner mobile plein-écran
- Mode hors-ligne avec sync auto
- Validation manuelle en cas de QR cassé
- Stats temps réel par scanner

### 🍽️ Catering
- Tickets repas auto (1 par créneau >4h)
- Décrémentés au scan
- Régimes alimentaires structurés (végé, végan, sans gluten, sans porc)
- Allergies en data sensible (accès limité catering)

### 🤝 Sponsors CRM
- Statuts : prospect → in_discussion → pending_signature → signed → paid
- Tiers : bronze / silver / gold / platinum / partner
- Montants + apports en nature
- Contreparties promises (tracking)
- Prochaine action + date
- KPIs : total négocié vs encaissé

### 📦 Exports & Conformité
- **Pack préfecture** : ZIP avec récap + 3 CSV (bénévoles, sponsors, conventions)
- **Liste mineurs** : identifiés automatiquement
- **Trace audit** : conventions signées avec IP/horodatage/version
- **Export RGPD** : à venir (DSAR sur demande)

### 🗺️ Plan du site
- Upload jour + nuit + caption
- Visible côté bénévole avec repères clés (Bar, Loge, Camping, etc.)
- Bucket Storage public-read

### 📧 Notifications
- 4 templates email FR brandés (magic-link, confirm signup, reset password, validation candidature)
- Edge Functions Resend pour envoi
- Rate limit configurable

### 🔐 Auth
- Magic-link (passwordless) ou password
- @supabase/ssr v0.5 avec cookie chunking (JWT > 4KB supporté)
- Middleware protection toutes les routes /v, /r, /staff, /regie, /admin, /hub
- RLS Postgres au niveau BDD (35+ policies)

### 🎨 Design
- Palette earth-tones (corail #FF5E5B, ambre, sable, ink)
- Pas de bleu (volonté Pam)
- Mobile-first
- Tailwind + shadcn/ui
- Font display custom

---

## 8. Architecture technique synthétique

```
                ┌─────────────────────────────────┐
                │       UTILISATEURS              │
                │  (web, mobile responsive)       │
                └─────────────┬───────────────────┘
                              │ HTTPS
                              ▼
       ┌──────────────────────────────────────────────┐
       │            NETLIFY (CDN edge)                │
       │   apps/vitrine = Next.js 14 App Router       │
       │   Server Components + Server Actions         │
       │   Middleware Auth + Multi-tenant             │
       └─────────────┬────────────────────┬───────────┘
                     │                    │
                     ▼                    ▼
       ┌─────────────────────┐  ┌─────────────────────┐
       │  SUPABASE EU (Paris) │  │  RESEND (SMTP)      │
       │  Postgres 17.6      │  │  Mails magic-link   │
       │  + Storage + Auth   │  │  + validation       │
       │  + Edge Functions   │  └─────────────────────┘
       │  + RLS 35+ policies │
       └─────────────────────┘

   STACK
   - Frontend  : Next.js 14, React 18, TypeScript strict, Tailwind, shadcn/ui
   - Backend   : Supabase (Postgres + Auth + Storage + Edge Functions Deno)
   - Mailing   : Resend
   - Hosting   : Netlify (vitrine), Supabase EU (BDD)
   - CI/CD     : GitHub Actions
   - Monorepo  : pnpm + Turborepo
   - Mobile    : Expo (à venir)
```

---

*Document v1.0 · Build Captain · 30 avril 2026*
