# 📱 Tuto Antoine — Staff Scan (entrée festival)

> **Pour qui** : Antoine (rôle `staff_scan` + `entry_scanner`)
> **Compte démo** : `antoine@easyfest.test` / `easyfest-demo-2026`
> **URL d'entrée** : `/staff/icmpaca/rdl-2026`

---

## 🎯 Ton rôle en 1 phrase

Tu scannes les QR codes des **bénévoles** à leur arrivée pour valider leur prise de poste,
et des **festivaliers** à l'entrée pour valider leur billet.

---

## 🚪 Connexion

Idem : email + password ou magic-link.
Au Hub : carte **"Je suis staff entrée / scan"** → click.
Tu arrives sur la page **Scanner** plein écran (mobile-first).

---

## 📋 Ton parcours type

### Mode "Scan bénévole" (par défaut)
1. Le bénévole te montre son QR (sur son téléphone, dans son app Easyfest)
2. Tu pointes la caméra → ça beep
3. Affichage instantané :
   - 🟢 **OK** → photo + prénom + équipe + créneau → "Bonne mission !"
   - 🟡 **À l'avance** → "Tu prends ton poste dans 25 min, tu peux attendre ou prendre un café au catering"
   - 🔴 **Refusé** → raison affichée (pas dans l'équipe, créneau pas dispo, banni)

### Mode "Scan billet festival" (pour les jours public)
1. Toggle en haut → "Festival" au lieu de "Bénévole"
2. Scan = validation ticket, vérif duplicata
3. Compteur en temps réel : combien de personnes sont entrées, capacity restante

---

## 🛠️ Outils spécifiques

### Stats temps réel (en bas de l'écran)
- Bénévoles arrivés ce créneau : X / Y attendus
- Festivaliers entrés au total : X / capacity Y
- Si on passe 90% capacity → alerte rouge en haut

### Mode hors-ligne
- Si le wifi déconne, l'app continue à scanner et stocke localement
- Quand tu retrouves du réseau → sync auto, ça remonte
- Indicateur en haut : 🟢 Online / 🟡 Offline (sync en attente)

### Anti-fraude
- Un même QR scanné 2× → alerte rouge "déjà entré"
- Bouton "Forcer entrée" → demande raison (passation, urgence, etc.) + log

---

## 🚨 Cas relous fréquents

### "Mon scanner reconnaît pas le QR"
→ Augmente la luminosité de l'écran du bénévole
→ Demande-lui d'agrandir son QR (zoom)
→ Si ça marche pas : entre son nom dans la barre de recherche → "Valider manuellement"

### "Quelqu'un veut entrer sans QR (perdu, batterie, etc.)"
→ Tu cherches son nom dans la barre → si trouvé, "Valider manuellement avec raison"
→ Si pas trouvé → renvoyer voir l'accueil régie

### "L'app crashe / freeze"
→ Tu peux reprendre sur n'importe quel autre tablette/phone connecté avec ton compte
→ Tes scans déjà faits sont sauvegardés côté serveur

---

*Tuto Build Captain · 30 avril 2026*
