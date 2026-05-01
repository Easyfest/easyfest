import Link from "next/link";

export const metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU Easyfest — règles d'utilisation de la plateforme SaaS pour organisateurs de festivals associatifs.",
};

export default function CGUPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-sm prose-headings:font-display prose-headings:text-brand-ink prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-a:text-brand-coral prose-a:no-underline hover:prose-a:underline">
      <h1>Conditions Générales d'Utilisation (CGU)</h1>
      <p className="text-sm text-brand-ink/60">Version 1.0 · Effective au 1er mai 2026</p>

      <p className="not-prose rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>⚠️ Avis :</strong> ces CGU sont rédigées par l'équipe Easyfest et destinées à être
        relues par un juriste avant V1 GA (juin 2026). Pour toute question, écris à{" "}
        <a href="mailto:legal@easyfest.app" className="text-amber-900 underline">legal@easyfest.app</a>.
      </p>

      <h2>1. Présentation du service</h2>
      <p>
        <strong>Easyfest</strong> (ci-après « le Service ») est un logiciel SaaS multi-tenant édité
        par <strong>Easyfest SAS</strong> (en cours d'immatriculation), accessible via l'URL{" "}
        <a href="https://easyfest.app">https://easyfest.app</a> et ses sous-domaines associés.
      </p>
      <p>
        Le Service est destiné aux organisateurs d'événements (associations loi 1901, mairies,
        agences événementielles, structures privées) pour gérer leurs bénévoles, planning,
        partenaires, conventions et obligations légales.
      </p>

      <h2>2. Acceptation des CGU</h2>
      <p>
        L'utilisation du Service implique l'acceptation pleine et entière des présentes CGU. En
        créant un compte ou en utilisant le Service à quelque titre que ce soit, l'Utilisateur
        reconnaît avoir lu, compris et accepté ces CGU.
      </p>
      <p>
        Easyfest se réserve le droit de modifier les CGU à tout moment. Les utilisateurs seront
        notifiés des modifications substantielles par email au moins 30 jours avant leur entrée en
        vigueur.
      </p>

      <h2>3. Création de compte et accès</h2>
      <p>
        L'inscription au Service est gratuite pour le palier <em>Free</em>. La création d'un compte
        nécessite la fourniture d'un email valide et l'acceptation des présentes CGU.
      </p>
      <p>
        L'Utilisateur s'engage à :
      </p>
      <ul>
        <li>Fournir des informations exactes et à jour</li>
        <li>Préserver la confidentialité de ses identifiants</li>
        <li>Notifier sans délai toute utilisation non autorisée de son compte</li>
        <li>Ne pas créer plusieurs comptes pour contourner les limites du palier gratuit</li>
      </ul>

      <h2>4. Utilisation autorisée et interdite</h2>
      <h3>4.1 Utilisations autorisées</h3>
      <ul>
        <li>Gestion d'événements culturels, associatifs, sportifs, professionnels</li>
        <li>Collecte de candidatures bénévoles avec consentement éclairé</li>
        <li>Coordination d'équipes et planning de tâches</li>
        <li>Suivi de partenariats et sponsors</li>
        <li>Génération de documents légaux (conventions, exports préfecture)</li>
      </ul>

      <h3>4.2 Utilisations strictement interdites</h3>
      <ul>
        <li>Spam, démarchage massif non sollicité</li>
        <li>Collecte de données sans consentement (RGPD)</li>
        <li>Tentative de contournement des limites techniques ou commerciales</li>
        <li>Attaques DDoS, scraping massif, exploitation de failles</li>
        <li>Diffusion de contenus illégaux, haineux, discriminants</li>
        <li>Usurpation d'identité ou impersonation d'organisations</li>
        <li>Activités contraires à l'ordre public ou aux bonnes mœurs</li>
      </ul>

      <h2>5. Tarification et paiement</h2>
      <p>
        Les tarifs en vigueur sont disponibles sur la page <Link href="/pricing">/pricing</Link>.
        Le paiement s'effectue mensuellement ou annuellement selon le palier choisi, par carte
        bancaire ou virement SEPA.
      </p>
      <p>
        <strong>Free</strong> : gratuit pour 50 bénévoles, 1 événement/an. Sans carte bancaire requise.
      </p>
      <p>
        <strong>Plans payants</strong> (Crew, Festival, Pro) : facturation récurrente, sans
        engagement de durée. L'Utilisateur peut annuler à tout moment depuis son tableau de bord.
        Le service reste actif jusqu'à la fin de la période payée.
      </p>
      <p>
        En cas d'impayé, le compte sera basculé en mode lecture seule après 7 jours de relance, puis
        suspendu après 30 jours. Les données sont conservées pendant 60 jours supplémentaires avant
        purge définitive (sauf demande de suppression anticipée par l'Utilisateur).
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Easyfest reste seule propriétaire du Service, de son code source, de sa marque, de son
        identité visuelle et de l'ensemble des éléments qui le composent.
      </p>
      <p>
        L'Utilisateur conserve la pleine propriété des données qu'il importe ou crée via le Service
        (liste de bénévoles, plannings, contrats, etc.). Easyfest ne dispose d'aucune licence
        d'exploitation commerciale sur ces données.
      </p>
      <p>
        L'Utilisateur peut exporter ses données à tout moment au format JSON via la page{" "}
        <Link href="/account/privacy">/account/privacy</Link> (article 15 RGPD).
      </p>

      <h2>7. Données personnelles et RGPD</h2>
      <p>
        Le traitement des données personnelles est régi par notre{" "}
        <Link href="/legal/privacy">Politique de confidentialité</Link> (RGPD-conforme). Easyfest
        agit en qualité de <strong>sous-traitant</strong> au sens de l'article 28 RGPD pour le
        compte de l'Utilisateur (responsable de traitement).
      </p>
      <p>Un Data Processing Agreement (DPA) est signé avec chaque client professionnel. Le DPA est
        disponible en annexe des CGU sur demande à <a href="mailto:dpo@easyfest.app">dpo@easyfest.app</a>.
      </p>

      <h2>8. Disponibilité et maintenance</h2>
      <p>
        Easyfest s'engage à maintenir un taux de disponibilité raisonnable (objectif 99,5% hors
        maintenance planifiée pour les paliers Free/Crew/Festival, 99,9% contractuel pour Pro avec SLA).
      </p>
      <p>
        Les opérations de maintenance peuvent entraîner des interruptions temporaires. Elles sont
        annoncées au moins 48h à l'avance par email aux administrateurs des organisations concernées.
      </p>
      <p>
        Easyfest n'est pas responsable des indisponibilités résultant de :
      </p>
      <ul>
        <li>Cas de force majeure (événements imprévisibles et irrésistibles)</li>
        <li>Défaillance du fournisseur d'accès Internet de l'Utilisateur</li>
        <li>Mauvaise utilisation du Service par l'Utilisateur</li>
        <li>Maintenance programmée annoncée</li>
      </ul>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        Easyfest s'engage à fournir le Service avec diligence et selon les règles de l'art. Elle ne
        garantit toutefois pas que le Service soit exempt de toute anomalie, erreur ou bogue.
      </p>
      <p>
        La responsabilité d'Easyfest est limitée au montant payé par l'Utilisateur au cours des 12
        derniers mois, dans la limite du préjudice direct et certain. Easyfest ne saurait être tenue
        responsable des préjudices indirects (perte de chance, perte de chiffre d'affaires, perte
        d'image).
      </p>
      <p>
        En particulier, Easyfest n'est pas responsable des :
      </p>
      <ul>
        <li>Erreurs commises par les utilisateurs eux-mêmes (mauvaise saisie, etc.)</li>
        <li>Conséquences juridiques des contenus partagés via le Service</li>
        <li>Conformité RGPD du traitement opéré par l'Utilisateur (qui reste responsable de traitement)</li>
        <li>Sécurité de l'événement physique organisé</li>
      </ul>

      <h2>10. Suspension et résiliation</h2>
      <p>
        L'Utilisateur peut résilier son compte à tout moment depuis l'interface. Aucune
        justification n'est requise.
      </p>
      <p>
        Easyfest se réserve le droit de suspendre ou résilier sans préavis tout compte qui :
      </p>
      <ul>
        <li>Enfreint les présentes CGU</li>
        <li>Présente une activité frauduleuse, malveillante ou anormale</li>
        <li>Reste impayé plus de 60 jours</li>
        <li>Compromet la sécurité ou la stabilité du Service</li>
      </ul>
      <p>
        En cas de résiliation, les données peuvent être exportées dans un délai de 30 jours via la
        procédure RGPD article 15. Au-delà, elles sont définitivement supprimées (article 17 RGPD).
      </p>

      <h2>11. Modifications du service</h2>
      <p>
        Easyfest se réserve le droit de faire évoluer le Service. Les fonctionnalités peuvent être
        ajoutées, modifiées ou retirées. En cas de retrait d'une fonctionnalité majeure, les
        Utilisateurs seront prévenus 60 jours à l'avance.
      </p>

      <h2>12. Loi applicable et juridiction</h2>
      <p>
        Les présentes CGU sont soumises au <strong>droit français</strong>. Tout litige relatif à
        leur interprétation ou exécution sera, à défaut d'accord amiable, soumis aux tribunaux
        compétents de Paris (France).
      </p>
      <p>
        Conformément à l'article L.612-1 du Code de la consommation, l'Utilisateur consommateur peut
        recourir à un médiateur de la consommation en cas de litige.
      </p>

      <h2>13. Contact</h2>
      <ul>
        <li><strong>Questions générales :</strong> <a href="mailto:contact@easyfest.app">contact@easyfest.app</a></li>
        <li><strong>Données personnelles / DPO :</strong> <a href="mailto:dpo@easyfest.app">dpo@easyfest.app</a></li>
        <li><strong>Légal :</strong> <a href="mailto:legal@easyfest.app">legal@easyfest.app</a></li>
        <li><strong>Sécurité (vulnérabilités) :</strong> <a href="mailto:security@easyfest.app">security@easyfest.app</a></li>
      </ul>

      <h2>14. Mentions légales</h2>
      <p>
        Le Service est édité par <strong>Easyfest SAS</strong> (en cours d'immatriculation),
        siège social en France, France. Hébergement : Supabase EU (Paris) +
        Netlify (Edge CDN).
      </p>

      <hr />
      <p className="text-xs text-brand-ink/50">
        Dernière mise à jour : 1er mai 2026 · v1.0 ·{" "}
        <Link href="/legal/privacy">Politique de confidentialité</Link> ·{" "}
        <Link href="/">Retour à l'accueil</Link>
      </p>
    </main>
  );
}
