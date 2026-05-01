import * as React from "react";

import { cn } from "../utils/cn";

interface Stat {
  before: string;
  after: string;
  label: string;
}

interface TestimonialProps {
  authorName: string;
  authorRole: string;
  authorOrg: string;
  quote: string;
  stats?: Stat[];
  videoUrl?: string;
  photoUrl?: string;
  className?: string;
}

/**
 * Témoignage client avec photo + quote + 3 stats avant/après.
 * Conçu pour le cas Pam (ZIK en PACA / Roots du Lac).
 *
 * @example
 * <TestimonialPam
 *   authorName="Pamela Giordanengo"
 *   authorRole="Présidente"
 *   authorOrg="ZIK en PACA · Roots du Lac"
 *   quote="On gérait nos 51 bénévoles avec un Excel et 3 WhatsApp. Easyfest a remplacé ça en 30 minutes."
 *   stats={[
 *     { before: "5h", after: "30 min", label: "pour gérer les inscriptions" },
 *     { before: "3 outils", after: "1 outil", label: "pour tout coordonner" },
 *     { before: "0%", after: "100%", label: "conventions signées tracées" },
 *   ]}
 * />
 */
export function TestimonialPam({
  authorName,
  authorRole,
  authorOrg,
  quote,
  stats,
  videoUrl,
  photoUrl,
  className,
}: TestimonialProps) {
  return (
    <section className={cn("bg-gradient-to-br from-brand-cream to-brand-coral/5 px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral">
            Cas client
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-ink md:text-4xl">
            Comment {authorName.split(" ")[0]} a réduit sa charge de 80% pour {authorOrg.split("·")[1]?.trim() ?? authorOrg}
          </h2>
        </div>

        {/* Quote bloc */}
        <blockquote className="rounded-2xl bg-white p-8 shadow-soft md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {photoUrl && (
              <img
                src={photoUrl}
                alt={authorName}
                className="h-20 w-20 flex-none rounded-full object-cover ring-4 ring-brand-coral/20 md:h-24 md:w-24"
              />
            )}
            <div className="flex-1">
              <p className="font-display text-xl leading-relaxed text-brand-ink md:text-2xl">
                « {quote} »
              </p>
              <footer className="mt-4 text-sm">
                <p className="font-semibold text-brand-ink">{authorName}</p>
                <p className="text-brand-ink/60">{authorRole} · {authorOrg}</p>
              </footer>
            </div>
          </div>
          {videoUrl && (
            <div className="mt-6 overflow-hidden rounded-xl bg-brand-ink">
              <iframe
                src={videoUrl}
                title={`Témoignage ${authorName}`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </blockquote>

        {/* Stats avant/après */}
        {stats && stats.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl bg-white/80 p-6 text-center shadow-soft">
                <div className="flex items-center justify-center gap-3 font-display">
                  <span className="text-xl text-brand-ink/40 line-through">{s.before}</span>
                  <span className="text-brand-coral">→</span>
                  <span className="text-3xl font-bold text-brand-coral">{s.after}</span>
                </div>
                <p className="mt-2 text-sm text-brand-ink/70">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
