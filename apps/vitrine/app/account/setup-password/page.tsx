import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase/server";

import SetupPasswordForm from "./SetupPasswordForm";

export const metadata = { title: "Définir mon mot de passe — Easyfest" };
export const dynamic = "force-dynamic";

export default async function SetupPasswordPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/account/setup-password");

  if (user.user_metadata?.["password_set"] === true) {
    redirect("/hub");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-coral">Easyfest</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Définis ton mot de passe</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Connecté·e sous {user.email}. Pour sécuriser ton compte avant l'ouverture du festival,
        choisis un mot de passe d'au moins 12 caractères.
      </p>
      <SetupPasswordForm />
    </main>
  );
}
