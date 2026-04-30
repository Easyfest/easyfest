# 💰 EASYFEST — Modèles économiques (proposition pour Pam & Gaëtan)

> Document stratégique · v1.0 · 30 avril 2026
> Objectif : choisir un (ou un mix) de modèles économiques pour Easyfest, en gardant l'esprit "le festival pro, sans le prix pro".

---

## 🎯 Marché & contexte

### Qui sont nos clients potentiels ?
- **20 000 associations culturelles** en France (loi 1901)
- **3 000 festivals** organisés chaque année (musique, arts, sport, culture)
- **30 000 événements locaux** (fêtes de village, marchés artisanaux, foires)
- **5 000 organismes** (mairies, OT, agences événementielles)

### Ce que paient déjà ces clients (concurrence indirecte)
| Outil | Coût annuel | Limite |
|---|---|---|
| Weezevent (billetterie) | 1-3% par billet + frais | Pas de gestion bénévoles |
| Sourcil (bénévolat) | 990€/an | Vieillissant, pas mobile |
| Bénévalibre (asso) | Gratuit mais limité | Pas de planning, pas de safer |
| Excel + WhatsApp + Drive | 0€ | Chaos, perte d'info, pas RGPD |
| Cogilis (gros) | 5000-15000€/an | Cher, complexe, surdimensionné |

### Notre positionnement
**Easyfest = la solution intégrée bénévoles + planning + safer + sponsors + conformité, à un prix accessible aux petits.** On vise les 80% du marché qui n'ont rien aujourd'hui ou qui paient des outils éparpillés.

---

## 💡 5 modèles possibles (analyse comparative)

### MODÈLE A — Freemium SaaS (notre option par défaut)

**Principe** : 4 paliers selon taille festival

| Plan | Prix /an | Limites | Cible |
|---|---|---|---|
| **Free** | 0€ | 1 event/an, max 50 bénévoles, 100 entrées | Petites assos, premier essai |
| **Crew** | 290€ | 2 events/an, 200 bénévoles, 1000 entrées | Petits festivals locaux |
| **Festival** | 990€ | 5 events/an, 1000 bénévoles, 5000 entrées | Festivals moyens |
| **Pro** | 2 990€ | Illimité events + bénévoles + scan, multi-orga | Gros festivals, agences |
| **Enterprise** | Sur devis | + SLA + custom + onboarding dédié | Collectivités, gros groupes |

**Revenus prévus an 1** (objectif raisonnable) :
- 50 Free (acquisition) → 0€
- 30 Crew → 8 700€
- 10 Festival → 9 900€
- 2 Pro → 5 980€
- **Total an 1 : ~24 580€** (puis x3-5 an 2-3)

**Avantages** :
- Modèle classique, prévisible, scalable
- Free = canal d'acquisition gratuit (PLG = product-led growth)
- Upgrade naturel quand le festival grossit
- Récurrent → valorisable (multiple x4-8 ARR pour une revente)

**Risques** :
- Concurrence sur le free (la BDD coûte 25€/mois Supabase Pro à terme)
- Acquisition lente (faut faire du marketing)

---

### MODÈLE B — % sur la billetterie (modèle Weezevent)

**Principe** : Easyfest gratuit MAIS on prend 1-2% sur chaque billet vendu via la plateforme.

**Exemple** : festival 1500 billets à 35€ → 1500 × 35 × 1.5% = **787€**.

**Revenus prévus an 1** (10 festivals moyens × 1500 billets × 35€ × 1.5%) :
- **~7 800€** + montée en flèche an 2 quand on a +50 festivals

**Avantages** :
- Aligné incitations (on gagne quand le client gagne)
- Aucune barrière à l'entrée (zéro setup fee)
- Volume potentiel énorme (Weezevent = 1 milliard € de GMV)

**Risques** :
- Notre infra doit gérer billetterie (gros chantier dev)
- Concurrence frontale Weezevent / Yurplan / HelloAsso
- Marge fine, dépend du volume
- Si client préfère sa propre billetterie → on ne gagne rien

---

### MODÈLE C — Marketplace bénévoles (commission sur les missions)

**Principe** : Easyfest devient le LinkedIn/Indeed des bénévoles. Les festivals publient leurs missions, on gagne 5-15€ par bénévole effectivement présent.

**Exemple** : festival recrute 200 bénévoles via Easyfest → 200 × 10€ = **2 000€**.

**Revenus prévus an 1** (10 festivals × 200 bénévoles × 10€) :
- **~20 000€**

**Avantages** :
- Modèle "performance" (on est payé sur les résultats)
- Différenciation : on devient un canal d'acquisition bénévole
- Crée un écosystème stable (festivals s'abonnent au pool)

**Risques** :
- Faut faire grossir d'abord la base bénévoles (effet réseau)
- Risque de désintermédiation (un festival peut récupérer ses bénévoles et arrêter de payer)
- Modèle "double-side" complexe à amorcer

---

### MODÈLE D — Service sur-mesure + abonnement light

**Principe** : modèle agence/conseil. Easyfest fait l'onboarding clé-en-main du festival (3-5K€ setup), puis abonnement modeste (490€/an).

**Exemple** : 10 festivals × 4 000€ setup + 10 × 490€ = **44 900€ an 1**.

**Avantages** :
- Cash dès le début (pas besoin d'attendre 3 ans pour rentabiliser)
- Marge énorme sur le setup (tu factures 4 000€, tu fais 8h de boulot)
- Relation client forte (tu connais le festival intimement)

**Risques** :
- Pas scalable (chaque setup demande du temps humain)
- Faut vendre activement (cycle de vente long)
- Ressemble plus à du conseil qu'à du SaaS (valorisation 1-2x ARR au lieu de 5-8x)

---

### MODÈLE E — Mix "freemium SaaS + services premium" ⭐ RECOMMANDÉ

**Principe** : combiner les avantages de A et D.
- **Freemium SaaS** pour scaler le nombre de clients (pour les festivals petits/moyens en autonomie)
- **Services premium en option** : onboarding clé-en-main (1500€), formation équipe (500€/jour), pack logo + identité visuelle (800€), pack préfecture rédigé (300€), assistance live pendant le festival (1000€/event)

**Revenus prévus an 1** :
- 90 abos SaaS (mix Free→Pro) : ~25 000€ (cf. modèle A)
- 8 onboardings premium : 12 000€
- 4 packs logo : 3 200€
- 6 packs préfecture : 1 800€
- 3 assistances live : 3 000€
- **Total an 1 : ~45 000€**

**Avantages** :
- Cash flow rapide (services) + récurrent (abos)
- Premier festival = vitrine + référence
- Scalable (le SaaS croît tout seul, les services restent en option)
- On peut upsell les abonnés Free vers les services
- Apprentissage marché (on voit ce qui marche en service avant d'industrialiser)

**Risques** :
- Faut savoir se discipliner (ne pas devenir une agence)
- Marketing à 2 vitesses (acquisition SaaS + business dev services)

---

## 🎁 BONUS — Sources de revenus annexes (à activer plus tard)

### F. Place de marché add-ons
Les festivals peuvent acheter dans Easyfest :
- Templates de planning prêts à l'emploi (29€)
- Packs visuels (affiche + flyer + RS) générés via IA (49€/pack)
- Guides juridiques (RGPD, sécurité, alcool en concert) (19€/guide)

### G. Données agrégées (B2B insights)
On vend des rapports anonymisés sur les tendances bénévolat / festivals à :
- Mairies (étude impact économique culture)
- Sponsors (qui touche quel public)
- Agences événementielles (benchmark)

### H. Affiliations sponsors
On présente nos festivals à des marques (Heineken, Coca, Adidas, etc.) qui veulent sponsoriser. Commission 5-10% sur les contrats.

### I. White-label collectivités
On vend Easyfest aux mairies / OT pour leur propre programme événementiel. Forfait annuel 5-15K€ avec leur branding.

---

## 🎯 Ma reco : MODÈLE E (mix SaaS + services) avec démarrage progressif

### Phase 1 — Maintenant → juin 2026 (les 60 prochains jours)
- Festival ZIK en PACA = vitrine référence (gratuit pour Pam, mais on capte tout son retour)
- Pendant Roots du Lac, on enregistre tout : témoignage Pam vidéo, photos, stats (51 bénévoles gérés en 1 click, etc.)
- On utilise ce festival comme cas d'usage marketing

### Phase 2 — Été 2026 → septembre
- On lance **Free** + **Crew** (290€) en self-service
- Acquisition via SEO ("logiciel bénévolat festival"), forums associatifs, recommandations Pam
- On vise 20 inscriptions Free + 3-5 Crew payants

### Phase 3 — Automne 2026 → printemps 2027
- On lance **services premium** (onboarding 1500€, packs visuels) pour les festivals plus gros
- On présente Easyfest à 5-10 festivals bourgeois (Vinyl Trip, Astropolis, etc.) en proposant onboarding clé-en-main
- Objectif : 2-3 contrats Pro (2990€/an) + 5 onboardings (7500€)

### Phase 4 — Été 2027
- 50+ festivals utilisent Easyfest (mix Free/Crew/Festival/Pro)
- Revenus annuels : 60-100K€
- On embauche un dev + un commercial
- On démarche les collectivités (modèle white-label)

---

## 💵 Pour Pam : qu'est-ce que ça change concrètement ?

### Si Pam est partenaire/co-fondatrice (modèle proposé)
Vous partagez les revenus avec un système simple :
- **40% Pam / 60% Gaëtan** sur les 12 premiers mois (pour récompenser son apport métier + sa fonction de "client zéro" qui fait gagner 6 mois de R&D)
- Bascule à **30/70** à partir du mois 13 si elle reste impliquée (ambassadrice, retours produit, intro festivals)
- Bascule à **15/85** + bonus annuel si elle prend juste un rôle d'advisor

### Ou si Pam est juste cliente
- Festival 2026 = gratuit (notre cadeau, en échange de son cas d'usage + témoignage)
- Festival 2027+ = elle paie le tarif Crew (290€/an) ou Festival (990€/an)
- Réduction perpétuelle 50% comme "first customer" (149€/an Crew)

---

## 🔑 Points de décision pour Gaëtan & Pam

1. **Quel modèle on lance prioritairement ?** (E recommandé)
2. **Pam : partenaire ou cliente ?** (impacte la juridique : SAS avec 2 associés ou simple contrat de service)
3. **Quand on lance officiellement ?** (post Roots du Lac juin 2026 = bonne fenêtre)
4. **Capital initial besoin ?** (pour l'instant 0€, on peut bootstrapper. Plus tard, peut-être tour de seed 100-300K€ si on vise l'international)
5. **Statut juridique** ? (SAS unipersonnelle Gaëtan, ou SAS à 2 si Pam co-fonde)
6. **Branding marque** : on garde "Easyfest" ou on cherche un nom plus fort ? (Eventeam, Festikit, Crowdli…)

---

## 📊 Projections optimistes (modèle E)

| An | Free | Crew (290) | Festival (990) | Pro (2990) | Services | Total |
|----|------|------------|----------------|------------|----------|-------|
| 2026 | 50 | 5 (1450€) | 1 (990€) | 0 | 8000€ | **10 440€** |
| 2027 | 200 | 30 (8700€) | 8 (7920€) | 2 (5980€) | 25 000€ | **47 600€** |
| 2028 | 500 | 80 (23200€) | 25 (24750€) | 8 (23920€) | 60 000€ | **131 870€** |
| 2029 | 1000 | 150 (43500€) | 60 (59400€) | 20 (59800€) | 120 000€ | **282 700€** |

À l'année 4 = **283K€ de CA** avec une équipe de 2-3 personnes = **~80K€ de profit/personne/an** = vie correcte.

**Si on lève + on s'agressive sur le marketing** : x3-5 (ARR 1M€+ à 3 ans).

---

## 🛡️ Risques à mitiger

1. **Concurrence Weezevent** : ils peuvent racheter ou copier. Mitigation : focus segment qu'ils délaissent (petits festivals < 5000 personnes).
2. **Bénévalibre** (gratuit subventionné par l'État) : risque qu'ils deviennent gros. Mitigation : on est plus moderne + meilleur design + plus de features.
3. **Un client clé qui part** (ex: Pam fâchée → mauvaise pub). Mitigation : vraie relation, pas de surpromesse.
4. **Coût infra** (Supabase + Netlify scale) : aujourd'hui ~25€/mois. À 100 festivals actifs : ~200€/mois. Toujours marginal vs revenus.
5. **Burn-out solo founder** (toi). Mitigation : ne pas vouloir tout faire seul, déléguer rapidement (premier salarié = tech ou commercial selon ton profil).

---

## 🎬 Conclusion

**Recommandation finale** :
- Modèle **E (SaaS freemium + services premium)** ✅
- Roots du Lac 2026 = **client zéro vitrine** ✅
- Pam = **partenaire / advisor** avec part de revenu progressive (40→30→15%) ou cliente VIP perpétuelle ✅
- Lancement officiel **post-festival juin 2026** (en surfant sur le succès Roots du Lac)
- Objectif **1 an : 50K€ CA**, **3 ans : 280K€ CA**

À discuter ensemble sur :
- Quel statut juridique ?
- Quelle répartition Pam/Gaëtan ?
- Quel positionnement marketing (festivals reggae niche ? culture indé ? généraliste asso ?)

---

*Document v1.0 · Build Captain · 30 avril 2026 · à challenger ensemble*
