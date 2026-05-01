import * as React from "react";

import { cn } from "../utils/cn";

interface PricingPlan {
  name: string;
  priceMonthly?: number;
  priceYearly?: number;
  priceLabel?: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  popular?: boolean;
  enterprise?: boolean;
}

interface PricingTableProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  className?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Free",
    priceLabel: "0 €",
    description: "Pour les petites assos qui débutent",
    features: [
      "1 événement / an",
      "Jusqu'à 50 bénévoles",
      "100 entrées scannées",
      "Charte + convention RGPD",
      "Support communautaire",
    ],
    cta: { label: "Commencer gratuitement", href: "/commencer" },
  },
  {
    name: "Crew",
    priceMonthly: 29,
    priceYearly: 290,
    description: "Pour les festivals locaux",
    features: [
      "2 événements / an",
      "Jusqu'à 200 bénévoles",
      "1 000 entrées scannées",
      "Sponsors CRM",
      "Pack préfecture export",
      "Support email 48h",
    ],
    cta: { label: "Choisir Crew", href: "/commencer?plan=crew" },
  },
  {
    name: "Festival",
    priceMonthly: 99,
    priceYearly: 990,
    description: "Pour les festivals moyens",
    features: [
      "5 événements / an",
      "Jusqu'à 1 000 bénévoles",
      "5 000 entrées scannées",
      "Module Artistes (rider, contrat)",
      "Module Sécurité (SDIS)",
      "Support prioritaire 24h",
    ],
    cta: { label: "Choisir Festival", href: "/commencer?plan=festival" },
    popular: true,
  },
  {
    name: "Pro",
    priceMonthly: 299,
    priceYearly: 2990,
    description: "Pour les gros festivals + agences",
    features: [
      "Événements illimités",
      "Bénévoles illimités",
      "Multi-organisations",
      "API publique",
      "White-label disponible",
      "Account manager dédié",
    ],
    cta: { label: "Choisir Pro", href: "/commencer?plan=pro" },
  },
];

export function PricingTable({
  title = "Choisis ton format",
  subtitle = "Sans engagement. Bascule de palier quand tu veux. Free est gratuit pour toujours.",
  plans = DEFAULT_PLANS,
  className,
}: PricingTableProps) {
  return (
    <section className={cn("bg-brand-cream px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-ink md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-brand-ink/70 md:text-lg">{subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 transition",
                plan.popular
                  ? "border-brand-coral shadow-glow scale-[1.03] ring-2 ring-brand-coral/30"
                  : "border-brand-ink/10",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-coral px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  ⭐ Populaire
                </span>
              )}
              <div>
                <h3 className="font-display text-xl font-bold text-brand-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-brand-ink/60">{plan.description}</p>
              </div>
              <div className="my-6">
                {plan.priceMonthly !== undefined ? (
                  <>
                    <p className="font-display text-4xl font-bold text-brand-ink">
                      {plan.priceMonthly}€
                      <span className="text-sm font-normal text-brand-ink/50">/mois</span>
                    </p>
                    <p className="text-xs text-brand-ink/50">
                      ou {plan.priceYearly}€ /an (-17%)
                    </p>
                  </>
                ) : (
                  <p className="font-display text-4xl font-bold text-brand-ink">{plan.priceLabel}</p>
                )}
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-ink/80">
                    <span className="mt-0.5 text-brand-coral">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.cta.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-center font-display text-sm font-semibold transition",
                  plan.popular
                    ? "bg-brand-coral text-white hover:bg-brand-coral/90"
                    : "border border-brand-ink/15 bg-white text-brand-ink hover:bg-brand-ink/5",
                )}
              >
                {plan.cta.label}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-brand-ink/60">
          Tu as une demande spécifique ? <a href="/contact" className="text-brand-coral underline">Parle-nous d'Enterprise</a>.
        </p>
      </div>
    </section>
  );
}

export { DEFAULT_PLANS };
