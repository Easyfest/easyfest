import * as React from "react";

import { cn } from "../utils/cn";

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

interface FAQSectionProps {
  badge?: string;
  title?: string;
  items: FAQItem[];
  className?: string;
}

/**
 * FAQ avec details/summary natifs (accessible + SEO).
 * Ouvre/ferme sans JS.
 *
 * @example
 * <FAQSection
 *   title="Tu te poses ces questions ?"
 *   items={[
 *     { q: "Mes données m'appartiennent ?", a: "Oui. Tu peux exporter tout en JSON depuis ton dashboard à tout moment (article 15 RGPD)." },
 *     // ...
 *   ]}
 * />
 */
export function FAQSection({ badge, title = "Questions fréquentes", items, className }: FAQSectionProps) {
  return (
    <section className={cn("bg-white px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          {badge && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-coral">
              {badge}
            </p>
          )}
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-ink md:text-5xl">
            {title}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-brand-ink/10 bg-brand-cream/30 p-5 transition hover:border-brand-coral/30 hover:bg-brand-cream/50"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base font-semibold text-brand-ink md:text-lg">
                {item.q}
                <span className="mt-1 flex-none text-brand-coral transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-brand-ink/70 md:text-base">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const DEFAULT_FAQ: FAQItem[] = [
  {
    q: "Mes données m'appartiennent ?",
    a: "Oui, à 100%. Tu peux exporter tout en JSON depuis ton dashboard à tout moment (article 15 RGPD). Et tu peux supprimer ton compte avec restauration possible pendant 30 jours (article 17).",
  },
  {
    q: "Easyfest est-il conforme RGPD ?",
    a: "Oui : hébergement Supabase EU (Paris), DPA signé, consentements granulaires, audit log immuable, data minimization. Le DPIA est dispo sur demande.",
  },
  {
    q: "Quelle assistance si ça plante en plein festival ?",
    a: "Selon ton plan : Free = communauté Discord, Crew/Festival = email 24-48h, Pro = account manager dédié + hotline weekend.",
  },
  {
    q: "Combien de temps pour onboarder mon asso ?",
    a: "10 minutes pour créer ton organisation + 1er événement via le wizard `/commencer`. Tu peux importer tes bénévoles existants depuis un CSV (10 sec).",
  },
  {
    q: "Easyfest gère la billetterie ?",
    a: "Pas encore (V1.5). Pour 2026, on s'intègre avec Weezevent / HelloAsso via webhook pour récupérer les billets vendus.",
  },
  {
    q: "Multi-événements dans une même asso ?",
    a: "Oui sur tous les plans payants. Tu crées plusieurs events sous la même organisation, tu peux cloner la config d'une édition à l'autre.",
  },
  {
    q: "Les bénévoles ont besoin de télécharger une app ?",
    a: "Non. Easyfest est web-first et mobile-responsive. Aucune install. L'app native iOS/Android arrive en V1.5 pour le mode hors-ligne.",
  },
  {
    q: "Comment sont gérés les mineurs ?",
    a: "Détection automatique via la date de naissance, alerte à la régie, demande d'autorisation parentale obligatoire (PDF signé) avant validation.",
  },
];
