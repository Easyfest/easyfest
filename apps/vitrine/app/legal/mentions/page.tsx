import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Easyfest, conformément à l'article 6-III de la LCEN.",
};

export default function MentionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-sm prose-headings:font-display prose-headings:text-brand-ink prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-a:text-brand-coral prose-a:no-underline hover:prose-a:underline">
      <h1>Mentions légales</h1>
      <p className="text-sm text-brand-ink/60">Conformément à la LCEN article 6-III · Mai 2026</p>

      <h2>Éditeur du site</h2>
      <p>
        <strong>Easyfest SAS</strong> (en cours d'immatriculation)<br />
        Société par Actions Simplifiée<br />
        Capital social : à venir<br />
        SIREN : à venir<br />
        Siège social : France<br />
        Email : <a href="mailto:contact@easyfest.app">contact@easyfest.app</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>
        Le directeur de la publication est le représentant légal de la société Easyfest SAS.
      </p>

      <h2>Hébergement</h2>
      <p>
        <strong>Backend & base de données :</strong>{" "}
        Supabase Inc. (Region EU-West-3, Paris, France)<br />
        Adresse : 970 Toa Payoh North #07-04, Singapore 318992<br />
        Site : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>
      </p>
      <p>
        <strong>Frontend (CDN edge) :</strong>{" "}
        Netlify, Inc.<br />
        Adresse : 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA<br />
        Site : <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">netlify.com</a>
      </p>
      <p>
        <strong>Email transactionnel :</strong>{" "}
        Resend, Inc.<br />
        Site : <a href="https://resend.com" target="_blank" rel="noopener noreferrer">resend.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur le site (textes, images, vidéos, logos, charte
        graphique, illustrations, animations, code source) est la propriété exclusive d'Easyfest
        SAS, sauf mention contraire.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation totale ou
        partielle de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans
        l'autorisation écrite préalable d'Easyfest SAS.
      </p>
      <p>
        Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient
        sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux
        dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        Le site Easyfest peut contenir des liens vers d'autres sites web. Easyfest SAS n'exerce
        aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est régi par notre{" "}
        <Link href="/legal/privacy">Politique de confidentialité</Link>. Pour toute question
        relative aux données personnelles, contactez notre DPO :{" "}
        <a href="mailto:dpo@easyfest.app">dpo@easyfest.app</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise uniquement des cookies strictement nécessaires au fonctionnement (auth,
        anti-bot) et, avec votre consentement, des cookies d'analyse anonyme (PostHog EU). Aucun
        cookie publicitaire ou de tracking tiers n'est utilisé.
      </p>

      <h2>Crédits</h2>
      <p>
        <strong>Conception et développement :</strong> Equipe Easyfest<br />
        <strong>Design system :</strong> Earth-tones palette propriétaire<br />
        <strong>Typographie :</strong> Source Serif Pro (Google Fonts), -apple-system<br />
        <strong>Icônes :</strong> Lucide Icons (MIT), emojis Apple/Google natifs
      </p>

      <hr />
      <p className="text-xs text-brand-ink/50">
        Dernière mise à jour : 1er mai 2026 ·{" "}
        <Link href="/legal/cgu">CGU</Link> ·{" "}
        <Link href="/legal/privacy">Confidentialité</Link> ·{" "}
        <Link href="/">Retour à l'accueil</Link>
      </p>
    </main>
  );
}
