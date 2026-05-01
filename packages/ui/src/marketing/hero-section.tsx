import * as React from "react";

import { cn } from "../utils/cn";

interface HeroSectionProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  trustLine?: string;
  className?: string;
}

/**
 * Hero homepage / pricing / cas client.
 * Above-the-fold complet avec CTA + trust signals.
 *
 * @example
 * <HeroSection
 *   badge="● FIELD TEST 0.0.1 · LIVE"
 *   title={<>Le festival pro,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-coral to-brand-amber">sans le prix pro.</span></>}
 *   subtitle="Easyfest remplace ton tableau Excel partagé, ton WhatsApp et ton outil d'inscription par une seule app pensée pour les organisateurs de festivals associatifs."
 *   primaryCta={{ label: "Commencer gratuitement", href: "/commencer" }}
 *   secondaryCta={{ label: "Voir les tarifs", href: "/pricing" }}
 *   trustLine="Données EU · DPA Supabase signé · 100% RGPD"
 * />
 */
export function HeroSection({
  badge,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustLine,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-brand-cream px-6 py-20 md:py-32", className)}>
      <div className="mx-auto max-w-4xl text-center">
        {badge && (
          <p className="mb-6 inline-block rounded-full bg-brand-coral/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-coral">
            {badge}
          </p>
        )}
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-brand-ink md:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-ink/70 md:text-xl">{subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={primaryCta.href}
            className="rounded-xl bg-brand-coral px-8 py-4 font-display text-base font-semibold text-white shadow-glow transition hover:bg-brand-coral/90 hover:scale-105"
          >
            {primaryCta.label} →
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="rounded-xl border border-brand-ink/15 bg-white/80 px-8 py-4 font-display text-base font-semibold text-brand-ink transition hover:bg-white"
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
        {trustLine && (
          <p className="mt-8 text-xs text-brand-ink/50 md:text-sm">{trustLine}</p>
        )}
      </div>
      {/* Décor abstrait */}
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-brand-coral/20 to-brand-amber/20 blur-3xl" aria-hidden />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-coral/10 blur-3xl" aria-hidden />
    </section>
  );
}
