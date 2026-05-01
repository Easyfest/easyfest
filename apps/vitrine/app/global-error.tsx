"use client";

/**
 * Boundary d'erreur racine — fallback ultime quand même `app/error.tsx` ne peut pas
 * render (erreur dans le layout root par exemple).
 * Doit définir <html> et <body> elle-même car remplace le root layout.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[Global error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main
          style={{
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100vh",
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>💥</div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Erreur critique</h1>
          <p style={{ marginTop: 12, opacity: 0.7 }}>
            La racine de l'application n'a pas pu se charger. Recharge la page ou contacte le
            support.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 11, opacity: 0.4, fontFamily: "monospace" }}>
              ref: {error.digest}
            </p>
          )}
          <a
            href="/"
            style={{
              marginTop: 32,
              padding: "12px 24px",
              background: "#FF5E5B",
              color: "white",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Accueil
          </a>
        </main>
      </body>
    </html>
  );
}
