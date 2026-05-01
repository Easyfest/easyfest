/**
 * /account/privacy — auto-service RGPD utilisateur.
 *  • Art.15 : bouton "Télécharger mes données"
 *  • Art.17 : bouton "Supprimer mon compte" (soft-delete 30j, SLA produit)
 *           + bandeau "Annuler la suppression" si dans la fenêtre.
 */
import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase/server";

import PrivacyActions from "./PrivacyActions";

export const metadata = { title: "Mes données et vie privée — Easyfest" };
export const dynamic = "force-dynamic";

export default async function AccountPrivacyPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/privacy");
  }

  const { data: profile } = await (supabase as any)
    .from("volunteer_profiles")
    .select("deletion_requested_at, deleted_at, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const deletedAtRaw = profile?.deleted_at as string | null | undefined;
  const isPending = Boolean(deletedAtRaw && new Date(deletedAtRaw) > new Date());

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-brand-coral text-sm font-medium uppercase tracking-widest">Easyfest</p>
      <h1 className="font-display mt-1 text-3xl font-bold">Mes données et vie privée</h1>
      <p className="text-brand-ink/70 mt-2 text-sm">Connecté·e sous {user.email}</p>

      {isPending && deletedAtRaw && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm"
          data-testid="deletion-pending-banner"
        >
          <p className="text-brand-ink font-medium">Suppression programmée</p>
          <p className="text-brand-ink/70 mt-1">
            Ton compte sera définitivement supprimé le{" "}
            <strong>
              {new Date(deletedAtRaw).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </strong>
            . Tu peux annuler à tout moment avant cette date.
          </p>
        </div>
      )}

      <section className="mt-10 space-y-10">
        <article>
          <h2 className="font-display text-xl font-semibold">Article 15 — Accès et portabilité</h2>
          <p className="text-brand-ink/70 mt-2 text-sm">
            Télécharge l'intégralité de tes données personnelles au format JSON : profil,
            candidatures, affectations, engagements signés, logs de notifications. Le fichier est
            généré à la demande, sans intervention humaine.
          </p>
          <PrivacyActions mode="export" />
        </article>

        <article>
          <h2 className="font-display text-xl font-semibold">Article 17 — Effacement</h2>
          <p className="text-brand-ink/70 mt-2 text-sm">
            Une demande de suppression déclenche une{" "}
            <strong>fenêtre de récupération de 30 jours</strong> (SLA produit Easyfest). Au-delà,
            ton compte et tes données personnelles sont définitivement effacés. Les statistiques
            anonymisées (heures bénévolat, taux d'occupation par poste) peuvent être conservées sans
            rattachement à ton identité.
          </p>
          <PrivacyActions mode={isPending ? "restore" : "delete"} />
        </article>

        <article className="border-brand-ink/10 border-t pt-6">
          <p className="text-brand-ink/50 text-xs">
            Pour toute question :{" "}
            <a className="underline" href="mailto:dpo@easyfest.app">
              dpo@easyfest.app
            </a>
            . Voir aussi la{" "}
            <a className="underline" href="/legal/privacy">
              politique de confidentialité
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
