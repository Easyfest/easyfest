import * as React from "react";

import { cn } from "../utils/cn";

interface EmptyStateProps {
  illustration?: "planning" | "sponsors" | "mail" | "map" | "community";
  customSrc?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; onClick: () => void };
  className?: string;
}

const ILLUSTRATIONS: Record<NonNullable<EmptyStateProps["illustration"]>, string> = {
  planning: "/illustrations/empty-planning.svg",
  sponsors: "/illustrations/empty-sponsors.svg",
  mail: "/illustrations/mail-sent.svg",
  map: "/illustrations/festival-map.svg",
  community: "/illustrations/community-circle.svg",
};

/**
 * Empty state élégant avec illustration propriétaire.
 * À utiliser dans toute page vide (planning, candidatures, sponsors, messages...).
 *
 * @example
 * <EmptyState
 *   illustration="planning"
 *   title="Tous les bénévoles sont placés !"
 *   description="Plus rien à drag, équipe complète. Tu peux passer à la suite."
 *   cta={{ label: "Voir la timeline →", href: "./timeline" }}
 * />
 *
 * @example
 * <EmptyState
 *   illustration="sponsors"
 *   title="Aucun sponsor pour l'instant"
 *   description="Ajoute tes partenaires pour suivre les contrats et contreparties."
 *   secondaryCta={{ label: "+ Ajouter un sponsor", onClick: () => setOpen(true) }}
 * />
 */
export function EmptyState({
  illustration,
  customSrc,
  title,
  description,
  cta,
  secondaryCta,
  className,
}: EmptyStateProps) {
  const src = customSrc ?? (illustration ? ILLUSTRATIONS[illustration] : null);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-ink/15 bg-brand-cream/30 px-6 py-12 text-center md:py-16",
        className,
      )}
    >
      {src && (
        <img src={src} alt="" aria-hidden className="h-40 w-auto md:h-48" />
      )}
      <div className="max-w-md">
        <h3 className="font-display text-xl font-bold text-brand-ink md:text-2xl">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-brand-ink/60 md:text-base">{description}</p>
        )}
      </div>
      {(cta || secondaryCta) && (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-3">
          {cta && (
            <a
              href={cta.href}
              className="rounded-xl bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-coral/90"
            >
              {cta.label}
            </a>
          )}
          {secondaryCta && (
            <button
              type="button"
              onClick={secondaryCta.onClick}
              className="rounded-xl border border-brand-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-ink/5"
            >
              {secondaryCta.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
