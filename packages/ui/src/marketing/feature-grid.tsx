import * as React from "react";

import { cn } from "../utils/cn";

interface Feature {
  emoji: string;
  title: string;
  body: string;
  highlight?: boolean;
}

interface FeatureGridProps {
  badge?: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  className?: string;
}

/**
 * Grid de features-bénéfices (3 colonnes desktop, 1 mobile).
 * Maximise l'impact en parlant bénéfice utilisateur, pas spec produit.
 *
 * @example
 * <FeatureGrid
 *   badge="POUR LES ORGANISATEURS"
 *   title="Tout ce dont tu as besoin, rien de superflu"
 *   features={[
 *     { emoji: "🎟️", title: "Bénévoles en 30 minutes", body: "Tu sais qui vient, qui ne vient pas, en 1 coup d'œil. Plus de Doodle qui se perd dans les mails." },
 *     // ...
 *   ]}
 * />
 */
export function FeatureGrid({ badge, title, subtitle, features, className }: FeatureGridProps) {
  return (
    <section className={cn("bg-white px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          {badge && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-coral">
              {badge}
            </p>
          )}
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-ink md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-brand-ink/70 md:text-lg">{subtitle}</p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border p-6 transition hover:scale-[1.02] hover:shadow-soft",
                f.highlight
                  ? "border-brand-coral bg-brand-coral/5 ring-2 ring-brand-coral/20"
                  : "border-brand-ink/10 bg-white",
              )}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-coral/10 text-2xl">
                {f.emoji}
              </div>
              <h3 className="font-display text-lg font-semibold leading-tight text-brand-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
