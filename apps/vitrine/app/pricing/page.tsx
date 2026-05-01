import Link from "next/link";

export const metadata = {
  title: "Tarifs — Easyfest",
  description:
    "Tarifs Easyfest pour festivals associatifs et culturels. Free, Crew (290€), Festival (990€), Pro (2 990€). Sans engagement.",
};

type Plan = {
  slug: string;
  name: string;
  price: string;
  priceSubtitle: string;
  jauge: string;
  features: string[];
  highlight?: boolean;
  cta: string;
};

const PLANS: Plan[] = [
  {
    slug: "free",
    name: "Free",
    price: "0 €",
    priceSubtitle: "à vie, jusqu'à 50 bénévoles",
    jauge: "Petits événements associatifs",
    features: [
      "Jusqu'à 50 candidatures bénévoles",
      "1 événement en simultané",
      "Planning par créneaux",
      "Charte + droit d'image RGPD-clean",
      "Communauté Slack",
    ],
    cta: "Commencer gratuitement",
  },
  {
    slug: "crew",
    name: "Crew",
    price: "290 €",
    priceSubtitle: "par festival ponctuel",
    jauge: "Festival ≤ 500 personnes",
    features: [
      "Jusqu'à 200 bénévoles",
      "1 événement, équipe complète",
      "Drag & drop équipes ↔ bénévoles",
      "Convention bénévolat signée e-signature",
      "Pack préfecture (CSV + récap)",
      "Support email 48h",
    ],
    cta: "Commencer gratuitement",
  },
  {
    slug: "festival",
    name: "Festival",
    price: "990 €",
    priceSubtitle: "par édition annuelle",
    jauge: "500 – 2 000 personnes",
    features: [
      "Bénévoles illimités",
      "Multi-event (3 éditions/an)",
      "Communication multi-canal (push, mail, SMS)",
      "Safer Space + alertes graves",
      "Sponsors CRM + suivi conventions",
      "Onboarding accompagné",
      "Support 24h",
    ],
    highlight: true,
    cta: "Commencer gratuitement",
  },
  {
    slug: "pro",
    name: "Pro",
    price: "2 990 €",
    priceSubtitle: "par an, festivals > 2 000 pers.",
    jauge: "Festivals pro et fédérations",
    features: [
      "Tout Festival + multi-tenant",
      "Multi-festivals illimités",
      "API + intégrations sur-mesure",
      "SLA 99.9% + DPA dédié",
      "Account manager dédié",
      "Branding white-label",
      "Onboarding + formation équipe (2j)",
    ],
    cta: "Demander un devis",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-coral">Tarifs</p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight">
          Le festival pro, sans le prix pro.
        </h1>
        <p className="mt-3 text-brand-ink/70">
          4 paliers, sans engagement, basés sur la taille de ton festival. Tu commences gratuitement
          et tu paies seulement quand tu dépasses 50 bénévoles ou que tu veux les modules pro.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <article
            key={plan.slug}
            data-testid={`plan-${plan.slug}`}
            className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-soft transition hover:shadow-glow ${
              plan.highlight
                ? "border-brand-coral ring-2 ring-brand-coral/20"
                : "border-brand-ink/10"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-coral px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Le plus choisi
              </span>
            )}
            <header>
              <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-brand-ink/50">{plan.jauge}</p>
            </header>
            <p className="mt-4 font-display text-4xl font-bold leading-none">{plan.price}</p>
            <p className="mt-1 text-xs text-brand-ink/60">{plan.priceSubtitle}</p>

            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span aria-hidden className="mt-0.5 text-emerald-500">
                    ✓
                  </span>
                  <span className="text-brand-ink/80">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.slug === "pro" ? "mailto:contact@easyfest.app?subject=Devis%20Pro" : "/commencer"}
              className={`mt-8 block rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                plan.highlight
                  ? "bg-brand-coral text-white shadow-soft hover:opacity-90"
                  : "border border-brand-coral/40 text-brand-coral hover:bg-brand-coral/5"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-6 rounded-2xl bg-brand-ink/5 p-8 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-semibold">📦 Tout est inclus</h3>
          <p className="mt-1 text-sm text-brand-ink/70">
            Pas de surprise. Hébergement, RGPD, sécurité, accompagnement — tout est dans le prix
            indiqué.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">🇪🇺 Données en Europe</h3>
          <p className="mt-1 text-sm text-brand-ink/70">
            Supabase Paris (eu-west-3). DPA signé, sous-traitants listés, anonymisation 12 mois auto.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">↩️ Sans engagement</h3>
          <p className="mt-1 text-sm text-brand-ink/70">
            Tu arrêtes quand tu veux. Tu récupères toutes tes données en 1 clic via{" "}
            <Link href="/account/privacy" className="underline">
              /account/privacy
            </Link>{" "}
            (Art.15 RGPD).
          </p>
        </div>
      </section>

      <footer className="mt-16 text-center text-sm text-brand-ink/60">
        <p>
          Un cas particulier ? Multi-festival, white-label, intégration billettique ?{" "}
          <a href="mailto:contact@easyfest.app" className="underline">
            On en parle
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
