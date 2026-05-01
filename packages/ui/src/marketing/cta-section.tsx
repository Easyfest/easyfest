import * as React from "react";

import { cn } from "../utils/cn";

interface CTASectionProps {
  title: React.ReactNode;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: "coral" | "ink" | "cream";
  className?: string;
}

/**
 * Bandeau CTA final avant le footer.
 *
 * @example
 * <CTASection
 *   title="Prêt·e à organiser ton festival sans stresser ?"
 *   subtitle="Compte gratuit en 30 secondes. Aucune carte bleue requise."
 *   primaryCta={{ label: "Commencer maintenant", href: "/commencer" }}
 *   secondaryCta={{ label: "Réserver une démo", href: "/demo" }}
 * />
 */
export function CTASection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = "coral",
  className,
}: CTASectionProps) {
  const variantClass = {
    coral: "bg-gradient-to-br from-brand-coral to-brand-amber text-white",
    ink: "bg-brand-ink text-brand-cream",
    cream: "bg-brand-cream text-brand-ink",
  }[variant];

  return (
    <section className={cn("relative overflow-hidden px-6 py-20 md:py-28", variantClass, className)}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className={cn("font-display text-3xl font-bold leading-tight md:text-5xl", variant === "cream" ? "text-brand-ink" : "")}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mx-auto mt-4 max-w-xl text-base md:text-lg", variant === "cream" ? "text-brand-ink/70" : "opacity-90")}>
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={primaryCta.href}
            className={cn(
              "rounded-xl px-8 py-4 font-display text-base font-semibold shadow-glow transition hover:scale-105",
              variant === "coral" || variant === "ink"
                ? "bg-white text-brand-ink hover:bg-brand-cream"
                : "bg-brand-coral text-white hover:bg-brand-coral/90",
            )}
          >
            {primaryCta.label} →
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className={cn(
                "rounded-xl border px-8 py-4 font-display text-base font-semibold transition",
                variant === "coral" || variant === "ink"
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-brand-ink/15 text-brand-ink hover:bg-brand-ink/5",
              )}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
