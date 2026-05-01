import * as React from "react";

import { cn } from "../utils/cn";

interface Metric {
  value: string;
  label: string;
}

interface TrustSignalsProps {
  metrics: Metric[];
  partners?: string[];
  className?: string;
}

/**
 * Section social proof : 3-4 chiffres clés + logos partenaires.
 *
 * @example
 * <TrustSignals
 *   metrics={[
 *     { value: "82", label: "bénévoles gérés" },
 *     { value: "100%", label: "RGPD-compliant" },
 *     { value: "EU", label: "données hébergées" },
 *     { value: "30s", label: "pour signer une convention" },
 *   ]}
 *   partners={["ZIK en PACA", "Mairie de Montauroux", "Brasserie de la Côte"]}
 * />
 */
export function TrustSignals({ metrics, partners, className }: TrustSignalsProps) {
  return (
    <section className={cn("border-y border-brand-ink/5 bg-white px-6 py-12 md:py-16", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl font-bold text-brand-coral md:text-5xl">{m.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-brand-ink/60 md:text-sm">
                {m.label}
              </p>
            </div>
          ))}
        </div>
        {partners && partners.length > 0 && (
          <div className="mt-12 border-t border-brand-ink/5 pt-8">
            <p className="text-center text-xs uppercase tracking-widest text-brand-ink/40">
              Ils nous font confiance
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {partners.map((p, i) => (
                <span key={i} className="font-display text-sm font-semibold text-brand-ink/50">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
