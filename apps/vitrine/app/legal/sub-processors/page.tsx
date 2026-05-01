import Link from "next/link";

export const metadata = {
  title: "Sous-traitants ultérieurs (DPA)",
  description: "Liste des sous-traitants ultérieurs Easyfest conformément à l'article 28 RGPD.",
};

const SUB_PROCESSORS = [
  {
    name: "Supabase Inc.",
    purpose: "Hébergement backend, base de données PostgreSQL, authentification, stockage fichiers",
    location: "EU (Paris, France) — région eu-west-3",
    dataCategories: "Données utilisateurs, contenus métier, logs, sessions auth",
    dpaUrl: "https://supabase.com/legal/dpa",
    certifications: "SOC2 Type II, ISO 27001",
  },
  {
    name: "Netlify, Inc.",
    purpose: "CDN Edge, hébergement frontend Next.js, terminaisons SSL",
    location: "Multi-régions (EU + Global)",
    dataCategories: "Logs requêtes HTTP, IP, user-agent (anonymisés sous 30 jours)",
    dpaUrl: "https://www.netlify.com/legal/dpa/",
    certifications: "SOC2 Type II, ISO 27001",
  },
  {
    name: "Resend, Inc.",
    purpose: "Envoi des emails transactionnels (magic-link, validation candidature, notifications)",
    location: "USA + EU",
    dataCategories: "Email destinataire, contenu mail, logs envoi",
    dpaUrl: "https://resend.com/legal/dpa",
    certifications: "SOC2 Type II",
  },
  {
    name: "Cloudflare Inc. (Turnstile)",
    purpose: "Protection anti-bot des formulaires publics",
    location: "Multi-régions",
    dataCategories: "Token de challenge, IP (éphémère < 1h)",
    dpaUrl: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    certifications: "SOC2 Type II, ISO 27001, ISO 27018",
  },
  {
    name: "Sentry (Functional Software, Inc.)",
    purpose: "Monitoring d'erreurs applicatives (avec consentement)",
    location: "EU (Frankfurt) sur demande",
    dataCategories: "Stack traces, contexte technique anonymisé",
    dpaUrl: "https://sentry.io/legal/dpa/",
    certifications: "SOC2 Type II",
  },
  {
    name: "PostHog Ltd.",
    purpose: "Analytics produit anonymes (avec consentement opt-in)",
    location: "EU (Frankfurt)",
    dataCategories: "Événements anonymes (page vues, clics), aucun PII",
    dpaUrl: "https://posthog.com/dpa",
    certifications: "SOC2 Type II",
  },
];

export default function SubProcessorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="prose prose-sm prose-headings:font-display prose-headings:text-brand-ink prose-h1:text-3xl prose-h1:font-bold prose-a:text-brand-coral">
        <h1>Sous-traitants ultérieurs (DPA)</h1>
        <p className="text-sm text-brand-ink/60">
          Conformément à l'article 28 §2 RGPD · Mise à jour : 1er mai 2026
        </p>
        <p>
          La liste ci-dessous présente l'ensemble des sous-traitants ultérieurs intervenant dans le
          fonctionnement d'Easyfest. Toute modification fait l'objet d'une notification par email aux
          clients pro avec un préavis de 30 jours, leur permettant de s'opposer au changement.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-brand-ink/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream/50 text-left text-xs uppercase tracking-wider text-brand-ink/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Sous-traitant</th>
              <th className="px-4 py-3 font-semibold">Finalité</th>
              <th className="px-4 py-3 font-semibold">Localisation</th>
              <th className="px-4 py-3 font-semibold">Catégories de données</th>
              <th className="px-4 py-3 font-semibold">Certifications</th>
              <th className="px-4 py-3 font-semibold">DPA</th>
            </tr>
          </thead>
          <tbody>
            {SUB_PROCESSORS.map((sp, i) => (
              <tr key={i} className="border-t border-brand-ink/5 align-top">
                <td className="px-4 py-3 font-semibold text-brand-ink">{sp.name}</td>
                <td className="px-4 py-3 text-brand-ink/80">{sp.purpose}</td>
                <td className="px-4 py-3 text-xs text-brand-ink/70">{sp.location}</td>
                <td className="px-4 py-3 text-xs text-brand-ink/70">{sp.dataCategories}</td>
                <td className="px-4 py-3 text-xs text-brand-ink/70">{sp.certifications}</td>
                <td className="px-4 py-3">
                  <a href={sp.dpaUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-coral hover:underline">
                    Voir →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 prose prose-sm">
        <h2>Sous-traitants de niveau 2 (utilisés par nos sous-traitants)</h2>
        <p>
          Nos sous-traitants principaux peuvent eux-mêmes faire appel à des prestataires (ex:
          AWS pour Supabase). La liste détaillée est consultable dans les DPA respectifs ci-dessus.
        </p>

        <h2>Sortie d'un sous-traitant</h2>
        <p>
          En cas de cessation du contrat avec un sous-traitant, Easyfest s'engage à migrer les
          données vers un autre prestataire équivalent (ou à les rapatrier en interne) dans un
          délai maximal de 30 jours, sans interruption de service supérieure à 4 heures.
        </p>

        <h2>Vous opposer à un changement</h2>
        <p>
          Si vous êtes client pro et souhaitez vous opposer à l'ajout d'un nouveau sous-traitant,
          contactez-nous dans les 30 jours suivant la notification :{" "}
          <a href="mailto:dpo@easyfest.app">dpo@easyfest.app</a>.
        </p>

        <hr />
        <p className="text-xs text-brand-ink/50">
          ·{" "}
          <Link href="/legal/cgu">CGU</Link> ·{" "}
          <Link href="/legal/privacy">Confidentialité</Link> ·{" "}
          <Link href="/legal/mentions">Mentions légales</Link>
        </p>
      </div>
    </main>
  );
}
