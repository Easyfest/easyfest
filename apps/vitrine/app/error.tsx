"use client";

/**
 * Boundary d'erreur App Router — capture les erreurs runtime des routes/composants.
 * Next.js render cette page si une route children throw avant ou pendant render.
 * Critique pour que le prerender ne fail pas en build avec Sentry wrap conditionnel.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En dev : log console. En prod : Sentry est wrap conditionnellement et capture
    // les errors via son intégration Next.js (sans nécessiter d'appel manuel ici).
    // eslint-disable-next-line no-console
    console.error("[App error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-6xl">😵</div>
      <h1 className="font-display text-3xl font-bold">Quelque chose a cassé</h1>
      <p className="mt-3 text-sm text-brand-ink/70">
        Le festival continue, mais cette page a rencontré un imprévu. L'équipe technique a été
        notifiée.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-brand-ink/40">ref: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-brand-coral px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="rounded-xl border border-brand-ink/15 bg-white px-6 py-3 font-medium text-brand-ink/80 transition hover:bg-brand-ink/5"
        >
          Accueil
        </a>
      </div>
    </main>
  );
}
