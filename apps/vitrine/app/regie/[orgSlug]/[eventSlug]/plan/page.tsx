import { createServerClient } from "@/lib/supabase/server";
import { PlanUploadForm } from "./PlanUploadForm";

interface PageProps {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
}

export default async function RegiePlanPage({ params }: PageProps) {
  const { eventSlug } = await params;
  const supabase = createServerClient();

  const { data: ev } = await supabase
    .from("events")
    .select("id, name, site_plan_url, site_plan_dark_url, site_plan_caption")
    .eq("slug", eventSlug)
    .maybeSingle();

  if (!ev) return null;

  return (
    <div className="space-y-4">
      <header>
        <h2 className="font-display text-2xl font-bold">Plan du site</h2>
        <p className="text-sm text-brand-ink/60">
          Upload le plan officiel de ton festival. Il sera visible par tous les bénévoles dans leur app.
        </p>
      </header>

      <PlanUploadForm
        eventId={ev.id}
        currentPlanUrl={ev.site_plan_url}
        currentDarkUrl={ev.site_plan_dark_url}
        currentCaption={ev.site_plan_caption}
      />

      {ev.site_plan_url && (
        <section className="space-y-3">
          <h3 className="font-display text-lg font-semibold">Aperçu actuel (mode jour)</h3>
          <img
            src={ev.site_plan_url}
            alt="Plan jour"
            className="w-full rounded-2xl border border-brand-ink/10 bg-white shadow-soft"
          />
        </section>
      )}

      {ev.site_plan_dark_url && (
        <section className="space-y-3">
          <h3 className="font-display text-lg font-semibold">Aperçu actuel (mode nuit)</h3>
          <img
            src={ev.site_plan_dark_url}
            alt="Plan nuit"
            className="w-full rounded-2xl border border-brand-ink/10 bg-brand-ink shadow-soft"
          />
        </section>
      )}
    </div>
  );
}
