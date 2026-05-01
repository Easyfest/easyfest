import * as React from "react";

import { cn } from "../utils/cn";

interface PS {
  emoji: string;
  text: string;
}

interface ProblemSolutionProps {
  badge?: string;
  problemTitle: string;
  problems: PS[];
  solutionTitle: string;
  solutions: PS[];
  className?: string;
}

/**
 * Section problème → solution en 2 colonnes.
 * Avant : chaos d'outils. Après : Easyfest.
 *
 * @example
 * <ProblemSolution
 *   problemTitle="Aujourd'hui, organiser un festival, c'est..."
 *   problems={[
 *     { emoji: "📊", text: "Un Excel partagé qui se casse à chaque modif" },
 *     { emoji: "💬", text: "5 groupes WhatsApp qui se contredisent" },
 *     { emoji: "📂", text: "Un Drive avec 14 versions du planning" },
 *   ]}
 *   solutionTitle="Avec Easyfest, c'est..."
 *   solutions={[
 *     { emoji: "🎟️", text: "Un dashboard unique pour tes 51 bénévoles" },
 *     { emoji: "📱", text: "Une app que chaque rôle utilise (régie, scan, équipe)" },
 *     { emoji: "✓", text: "1 source de vérité, 0 conflits, RGPD-clean" },
 *   ]}
 * />
 */
export function ProblemSolution({
  badge,
  problemTitle,
  problems,
  solutionTitle,
  solutions,
  className,
}: ProblemSolutionProps) {
  return (
    <section className={cn("bg-brand-cream px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        {badge && (
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-brand-coral">
            {badge}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Problème */}
          <div className="rounded-2xl border border-brand-ink/10 bg-white p-8">
            <h3 className="font-display text-xl font-bold text-brand-ink md:text-2xl">
              {problemTitle}
            </h3>
            <ul className="mt-6 space-y-4">
              {problems.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-brand-ink/70 line-through opacity-70">
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-sm md:text-base">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="rounded-2xl border-2 border-brand-coral bg-gradient-to-br from-brand-coral/5 to-brand-amber/5 p-8 shadow-glow">
            <h3 className="font-display text-xl font-bold text-brand-ink md:text-2xl">
              {solutionTitle}
            </h3>
            <ul className="mt-6 space-y-4">
              {solutions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-brand-ink">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-sm font-medium md:text-base">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
