# 🍻 Tuto Mahaut — Responsable Bar (post_lead)

> **Pour qui** : Mahaut (rôle `post_lead` sur le poste **Bar**)
> **Compte démo** : `mahaut@easyfest.test` / `easyfest-demo-2026`
> **URL d'entrée** : `/r/icmpaca/rdl-2026` (vue restreinte à TON poste)

---

## 🎯 Ton rôle en 3 phrases

Tu gères **uniquement l'équipe Bar**. Tu vois ton planning, tes bénévoles, leurs présences.
Tu remplaces toi-même les absents (en demandant à Sandy de drag&drop si elle veut superviser).
Tu coordonnes les pauses, les réassorts.

---

## 🚪 Connexion

Pareil que les autres : `/auth/login` → email + password ou magic-link.
Au Hub, tu vois la carte **"Je suis responsable Bar"** → click.

---

## 📋 Ton parcours type

### Avant J-1
1. **Page d'accueil** : récap de TON équipe Bar
   - Effectif total
   - Trous dans le planning (créneaux pas couverts)
   - Bénévoles qui ont annulé / besoin de remplacement
2. **Onglet Planning** → tu vois la grille horaire spécifique au Bar
   - 4 créneaux par jour : 14-18h, 18-22h, 22-02h, 02-fin
   - Glisse-dépose pour déplacer un bénévole d'un créneau à un autre

### Pendant le festival
1. **Avant chaque créneau** :
   - Check qui est censé venir (liste avec photo + tel)
   - Si quelqu'un n'a pas scanné son arrivée à H+10 → tu l'appelles
   - Si pas joignable → tu remontes à Sandy via le chat Messages

2. **Pendant le créneau** :
   - Tu valides l'arrivée des gens via QR scan (page Scan)
   - Tu déclares les pauses repas (chaque bénévole a 1 ticket repas/créneau, géré dans l'app)
   - Tu peux signaler un incident via le bouton 🚨 "Alerte"

3. **Après le créneau** :
   - Tu valides la fin de poste (1 click dans la liste)
   - Tu peux laisser un commentaire (rating 1-5 + note libre, visible seulement par toi et Sandy)

---

## 🛠️ Outils spécifiques au post_lead

### Liste de présence
- Photo + prénom + nom + tel
- Statut : 🟢 Présent / 🟡 En route / 🔴 Absent
- Bouton "Appeler" → tel:// direct
- Bouton "SMS rappel" → ouvre le SMS pré-rempli

### Tickets repas
- Chaque bénévole a 1 ticket par créneau de >4h
- Tu valides en scannant son QR au catering, OU en cliquant sur sa fiche

### Communication
- Chat de groupe avec ton équipe (canal Bar)
- Chat avec Sandy (canal régie bénévoles)

---

## 🚨 Cas relous fréquents

### "Un bénévole est saoul et pose problème"
→ Bouton 🚨 "Alerte Safer Space" en haut à droite → ça notifie direction + Sandy.
Tu peux mettre le bénévole en `non-présent` après pour qu'il ne soit pas affecté la prochaine fois.

### "On manque de monde, le bar va exploser"
→ Onglet Messages → demande à Sandy d'envoyer un SOS aux bénévoles du pool dispo
→ OU tu notes ça dans l'onglet "Retours d'expérience" pour que Pam ajuste les effectifs l'an prochain.

### "Mon bénévole veut partir plus tôt"
→ Tu valides la fin de poste manuellement (bouton "Libérer"), ça génère un audit log
→ S'il a déjà mangé, son ticket reste consommé.

---

*Tuto Build Captain · 30 avril 2026*
