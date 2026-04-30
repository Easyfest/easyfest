# 🎪 README démo Pam — dimanche

**URL prod** : https://easyfest-rdl-2026.netlify.app

---

## 🔑 Comptes de test

Tous avec mot de passe `easyfest-demo-2026` (sauf le tien)

| Email | Rôle | URL après login |
|---|---|---|
| `gaetancarlo1@gmail.com` | direction (vrai compte) | `/regie/icmpaca/rdl-2026` |
| `pam@easyfest.test` | direction | `/regie/icmpaca/rdl-2026` |
| `sandy@easyfest.test` | volunteer_lead + mediator | `/r/icmpaca/rdl-2026` |
| `dorothee@easyfest.test` | volunteer_lead | `/r/icmpaca/rdl-2026` |
| `mahaut@easyfest.test` | post_lead Bar | `/r/icmpaca/rdl-2026` |
| `antoine@easyfest.test` | staff_scan + entry_scanner | `/staff/icmpaca/rdl-2026` |
| `lucas@easyfest.test` | volunteer Bar | `/v/icmpaca/rdl-2026` |

---

## 📋 SQL à coller dans Supabase Studio (ordre)

1. **`MIGRATIONS_J3_FIX_PAM.sql`** — toutes les migrations BDD du J3 (already done if "success")
2. **`IMPORT_PAM_INSCRITS.sql`** — 51 vrais inscrits Pam comme `volunteer_applications` validées
3. **`IMPORT_PAM_PREFERENCES.sql`** — ajoute leurs 3 souhaits de postes parsés (preferred_position_slugs)

URL Studio : https://supabase.com/dashboard/project/wsmehckdgnpbzwjvotro/sql/new

---

## 📧 Templates emails à coller dans Supabase Auth

URL : https://supabase.com/dashboard/project/wsmehckdgnpbzwjvotro/auth/templates

| Onglet | Source HTML |
|---|---|
| Magic Link | `apps/vitrine/templates/email/magic-link.html` |
| Confirm signup | `apps/vitrine/templates/email/confirm-signup.html` |
| Reset password | `apps/vitrine/templates/email/recovery.html` |

Subjects à mettre :
- `Ta connexion à Easyfest 🎟️`
- `Confirme ton email Easyfest`
- `Nouveau mot de passe Easyfest 🔑`

---

## 🎯 Parcours démo recommandé pour Pam

### Acte 1 : "Voici ton dashboard"
1. Connecte-toi en `pam@easyfest.test`
2. Sur `/hub`, clique "Je suis régie"
3. Tu arrives sur `/regie/icmpaca/rdl-2026` → vue d'ensemble
4. Montre les compteurs en haut (51 candidatures, X conventions signées, etc.)

### Acte 2 : "Voici tes vrais bénévoles"
1. Onglet **Candidatures** → liste de 51 personnes (les vraies inscrites de cette année)
2. Clique sur une (ex: Pamela Giordanengo) → fiche complète
3. Si tu veux, valide-en quelques-unes (déjà validated mais le bouton existe)

### Acte 3 : "Voici comment tu les places dans les équipes"
1. Onglet **Planning** (vue par défaut = équipes)
2. Tu vois le pool de 51 bénévoles avec :
   - Leurs photos (quand uploadées)
   - Leurs **3 souhaits de postes** (pastilles slugs)
   - Badge ⏳ pour ceux qui n'ont pas encore créé leur compte
3. Drag&drop d'un bénévole vers une équipe → la pastille devient ✓ vert si tu respectes son 1er choix
4. Filtre par nom/email pour retrouver vite quelqu'un

### Acte 4 : "Voici la timeline pour spotter les trous"
1. En haut, lien **📊 Timeline →**
2. Tu vois la grille horaire des shifts par équipe sur les 4 jours du festival
3. Blocs verts = complets, ambres = partiels, rouges = vides (alerte)
4. Tooltip sur chaque bloc = horaire + qui est là

### Acte 5 : "Voici ce que voient tes équipiers"
1. Logout → relog en `sandy@easyfest.test` (volunteer_lead)
2. Elle voit la même chose que toi sur les bénévoles, mais pas le budget/sponsors
3. Logout → relog en `mahaut@easyfest.test` (post_lead Bar)
4. Elle ne voit QUE l'équipe Bar
5. Logout → relog en `antoine@easyfest.test` (staff_scan)
6. Il voit la page scanner full-screen

### Acte 6 : "Voici l'expérience bénévole"
1. Logout → relog en `lucas@easyfest.test`
2. Il arrive sur son dashboard `/v/icmpaca/rdl-2026`
3. Il voit son prochain créneau, son QR pour scanner à l'arrivée
4. **Encart amber : "Convention de bénévolat à signer (obligatoire)"** → clique
5. Page convention avec les 7 articles ZIK en PACA + 2 cases à cocher → signe
6. Retour dashboard → encart devient vert "✓ Convention signée le 30/04/2026"

---

## 📚 Tutos par rôle

Dans `docs/tutos/` :
- [TUTO_DIRECTION.md](docs/tutos/TUTO_DIRECTION.md) — pour Pam
- [TUTO_VOLUNTEER_LEAD.md](docs/tutos/TUTO_VOLUNTEER_LEAD.md) — pour Sandy
- [TUTO_POST_LEAD.md](docs/tutos/TUTO_POST_LEAD.md) — pour Mahaut (Bar)
- [TUTO_STAFF_SCAN.md](docs/tutos/TUTO_STAFF_SCAN.md) — pour Antoine

---

## 🐛 Si ça crash pendant la démo

| Symptôme | Fix immédiat |
|---|---|
| 503 sur le site | Quota Netlify Free dépassé (trop de tests) → upgrade plan ou attendre minuit UTC |
| "Convention crash à la signature" | Migration SQL pas appliquée → MIGRATIONS_J3_FIX_PAM.sql |
| "Photo upload échoue" | Bucket avatars pas créé → MIGRATIONS_J3_FIX_PAM.sql |
| "Pool Planning vide" | IMPORT_PAM_INSCRITS.sql pas exécuté |
| "Pas de souhaits sur les cartes" | IMPORT_PAM_PREFERENCES.sql pas exécuté |
| "Mail magic-link en anglais moche" | Templates pas customisés → SETUP_EMAIL_TEMPLATES.md |

---

*Build Captain · 30 avril 2026 · 06:30*
