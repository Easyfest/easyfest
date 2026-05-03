import { Suspense } from "react";

import CallbackInner from "./CallbackInner";

export const metadata = { title: "Connexion — Easyfest" };
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackFallback() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-coral">Easyfest</p>
      <h1 className="mt-1 font-display text-2xl font-bold">Connexion en cours…</h1>
      <p className="mt-2 text-sm text-brand-ink/70">Un instant.</p>
    </main>
  );
}
