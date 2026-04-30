# 📧 Setup templates emails Supabase (FR + brand Easyfest)

> **But** : remplacer les templates anglais par défaut Supabase par nos versions FR brandées.

⏱ **Temps : 4 min** (3 templates à coller)

---

## 📍 URL directe

**https://supabase.com/dashboard/project/wsmehckdgnpbzwjvotro/auth/templates**

---

## 1. Magic Link

Onglet **"Magic Link"** → remplace tout le HTML par celui de :
[`apps/vitrine/templates/email/magic-link.html`](../apps/vitrine/templates/email/magic-link.html)

**Subject** : `Ta connexion à Easyfest 🎟️`

---

## 2. Confirm signup

Onglet **"Confirm signup"** → remplace par :
[`apps/vitrine/templates/email/confirm-signup.html`](../apps/vitrine/templates/email/confirm-signup.html)

**Subject** : `Confirme ton email Easyfest`

---

## 3. Reset password

Onglet **"Reset password"** → remplace par :
[`apps/vitrine/templates/email/recovery.html`](../apps/vitrine/templates/email/recovery.html)

**Subject** : `Nouveau mot de passe Easyfest 🔑`

---

## 4. Application validée (mail custom)

Le 4ème template (`application-validated.html`) n'est PAS un template Supabase Auth.
C'est un mail envoyé par notre Edge Function `send_validation_mail` quand on valide
manuellement une candidature dans `/regie/.../applications`.

Variables disponibles :
- `{{ .FirstName }}` → prénom du bénévole
- `{{ .EventName }}` → nom du festival (ex: "Roots du Lac 2026")
- `{{ .OrgName }}` → nom de l'asso (ex: "ZIK en PACA")
- `{{ .LoginURL }}` → URL magic-link `/auth/login?email=...`

---

## 5. Variables Supabase (rappel)

Dans tous les templates Auth, tu peux utiliser :
- `{{ .ConfirmationURL }}` → le lien magique
- `{{ .Token }}` → OTP 6 chiffres (si tu veux le mode token au lieu de magic-link)
- `{{ .SiteURL }}` → ton URL de prod
- `{{ .Email }}` → l'email du destinataire
- `{{ .SiteName }}` → "Easyfest" (configurable dans Auth Settings → Site Name)

---

*Doc Build Captain · 30 avril 2026*
