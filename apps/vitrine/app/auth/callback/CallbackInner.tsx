"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Inner client component pour /auth/callback.
 *
 * Supporte les 2 flows que Supabase peut produire selon la config dashboard :
 *  - PKCE (`?code=...`) : exchangeCodeForSession() côté browser pour poser
 *    les cookies @supabase/ssr.
 *  - Implicit (`#access_token=...&refresh_token=...`) : setSession() côté
 *    browser. Le hash fragment n'étant jamais envoyé au serveur, ce flow
 *    DOIT être traité côté client.
 *
 * `next` (ou `redirect` pour rétro-compat) cible la destination post-session.
 * Toujours ramené à un chemin local pour éviter open-redirect.
 */
function isSafeRedirect(target: string): boolean {
  return target.startsWith("/") && !target.startsWith("//");
}

export default function CallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const next = sp.get("next") ?? sp.get("redirect") ?? "/hub";
    const safeNext = isSafeRedirect(next) ? next : "/hub";

    const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
    const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
    if (!url || !anonKey) {
      setStatus("error");
      setErrorMsg("Configuration Supabase manquante");
      return;
    }

    const sb = createBrowserClient(url, anonKey);

    async function run() {
      // 1. Implicit flow : tokens dans le hash fragment
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.substring(1)
        : "";
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await sb.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setStatus("error");
            setErrorMsg(error.message);
            return;
          }
          window.location.href = safeNext;
          return;
        }
        const hashErr = params.get("error_description") ?? params.get("error");
        if (hashErr) {
          setStatus("error");
          setErrorMsg(decodeURIComponent(hashErr));
          return;
        }
      }

      // 2. PKCE flow : `?code=...`
      const code = sp.get("code");
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setErrorMsg(error.message);
          return;
        }
        window.location.href = safeNext;
        return;
      }

      // 3. Aucun token reçu — peut-être F5 après session déjà posée.
      window.location.href = safeNext;
    }

    run();
  }, [router, sp]);

  if (status === "error") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-red-600">Erreur</p>
        <h1 className="mt-1 font-display text-2xl font-bold">Connexion impossible</h1>
        <p className="mt-2 text-sm text-brand-ink/70">{errorMsg || "Lien invalide ou expiré."}</p>
        <a
          href="/auth/login"
          className="mt-6 rounded-xl bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-brand-coral/90"
        >
          Réessayer la connexion
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-coral">Easyfest</p>
      <h1 className="mt-1 font-display text-2xl font-bold">Connexion en cours…</h1>
      <p className="mt-2 text-sm text-brand-ink/70">Un instant, on prépare ta session.</p>
    </main>
  );
}
