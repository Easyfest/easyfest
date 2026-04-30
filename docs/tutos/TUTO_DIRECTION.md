# 🎛️ Tuto Pam — Direction (vue régie complète)

> **Pour qui** : Pam (rôle `direction` — accès total)
> **Compte démo** : `pam@easyfest.test` / `easyfest-demo-2026`
> **URL d'entrée** : `/regie/icmpaca/rdl-2026`

---

## 🎯 Ton rôle en 1 phrase

Tu pilotes l'événement : tu vois TOUT (bénévoles, sponsors, budget, sécurité, programmation),
tu prends les décisions stratégiques, tu valides les changements importants.

---

## 🚪 Connexion

`/auth/login` → email + password ou magic-link.
Au Hub : tu vois plusieurs cartes :
- **Je suis régie** → ton dashboard direction (le principal)
- Tu peux aussi switcher en vue Sandy (volunteer_lead) ou Mahaut (post_lead Bar) pour vérifier ce qu'elles voient

---

## 📋 Ton dashboard direction (5 sections)

### 1. **Vue d'ensemble** (page d'accueil)
- KPIs en cartes : nb bénévoles validés, taux remplissage planning, conventions signées,
  candidatures en attente, alertes Safer Space ouvertes
- Compte à rebours J-X avant le festival
- Liste des **3 prochaines actions urgentes** suggérées par l'IA :
  - "Tu as 8 candidatures > 48h non traitées → valider"
  - "L'équipe Bar est sous-effectif sur le créneau samedi 22h"
  - "Le sponsor Heineken n'a pas encore signé son contrat"

### 2. **Candidatures** (`/regie/.../applications`)
- Liste filtrable par statut (pending / validated / refused)
- Tri par date, score IA (matching avec besoins)
- Actions rapides : valider, refuser, mass-action
- Export CSV pour sponsors / collectivités

### 3. **Planning** (`/regie/.../planning`)
- Vue par défaut = **équipes** (la nouvelle vue avec drag&drop + souhaits)
- Sous-vue accessible : **par créneaux** (gantt horizontal)
- Stats par équipe : effectif vs besoin, % couverture, conflits horaires

### 4. **Safer Space** (`/regie/.../safer`)
- Module sensibles : alertes anti-harcèlement, signalements, bans en cours
- Workflow d'approbation : un ban demande X validations (configurable)
- Tracé complet des actions modération (audit log immuable)

### 5. **Messages** (`/regie/.../messages`)
- Inbox centralisée : messages des bénévoles, des sponsors, des partenaires
- Tu peux répondre directement
- Templates pré-faits pour les questions récurrentes

---

## 🛠️ Outils direction-only

### Sponsors & Partenaires
- CRM des sponsors (statut contrat, montant, contreparties promises)
- Suivi des activations (le stand Heineken est-il en place ? la bâche est-elle posée ?)

### Budget
- Vue budget vs réel par poste (cachet artiste, sécurité, catering, etc.)
- Alertes en cas de dépassement
- Export pour la trésorerie de l'asso

### Conformité & Légal
- Suivi des conventions signées par tes bénévoles (51 inscrits, X/51 signés)
- Conformité RGPD (consentements collectés, demandes d'accès/suppression)
- Export pour la mairie / préfecture (déclaration manifestation, dossier sécurité)

---

## 🚨 Cas relous fréquents

### "J'ai un bénévole qui menace de tout balancer sur les réseaux"
→ Onglet Safer Space → bouton 🚨 "Alerte exécutive" → notifie ton conseil d'admin
→ Tu peux le bannir préventivement et te défendre après

### "La préfecture demande tous mes docs avant 18h"
→ Onglet Conformité → bouton "Pack préfecture" → ZIP avec :
  - Liste bénévoles + numéros sécu
  - Conventions signées
  - Plan d'évacuation
  - Attestations assurance

### "Je veux dupliquer mon festival pour l'an prochain"
→ Onglet Settings → "Cloner cet événement" → choisis ce qui se duplique :
  - Équipes / postes (oui)
  - Bénévoles fidèles invités à re-postuler (oui)
  - Sponsors (à check au cas par cas)
  - Planning shifts (template à adapter)

---

## ❓ Quand contacter le support Easyfest

- Bug bloquant pendant le festival
- Question juridique RGPD
- Demande de feature critique pour ton event spécifique

→ Bouton "Aide" en bas à droite → chat direct avec nous (réponse < 1h en heures ouvrées,
< 4h en weekend festival)

---

*Tuto Build Captain · 30 avril 2026*
