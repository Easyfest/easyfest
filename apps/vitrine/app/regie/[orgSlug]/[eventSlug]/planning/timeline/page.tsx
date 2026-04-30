import Link from "next/link";

import { createServerClient } from "@/lib/supabase/server";
import { TimelineBoard } from "./TimelineBoard";

interface PageProps {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
}

export default async function PlanningTimelinePage({ params }: PageProps) {
  const { orgSlug, eventSlug } = await params;
  const supabase = createServerClient();

  const { data: ev } = await supabase
    .from("events")
    .select("id, name, starts_at, ends_at")
    .eq("slug", eventSlug)
    .maybeSingle();
  if (!ev) return null;

  const { data: positions } = await supabase
    .from("positions")
    .select("id, name, slug, color, icon, display_order")
    .eq("event_id", ev.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const { data: shifts } = await supabase
    .from("shifts")
    .select(`
      id, starts_at, ends_at, needs_count, notes,
      position:position_id (id, name, color, icon, event_id),
      assignments:assignments (id, status, volunteer_user_id)
    `)
    .order("starts_at", { ascending: true });

  const eventShifts = (shifts ?? []).filter((s: any) => s.position?.event_id === ev.id);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Planning timeline</h2>
          <p className="text-sm text-brand-ink/60">
            Vue gantt des shifts par équipe · spotter les conflits horaires et créneaux non-couverts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/regie/${orgSlug}/${eventSlug}/planning`}
            className="rounded-lg border border-brand-ink/15 px-3 py-1.5 font-medium text-brand-ink/80 hover:bg-brand-ink/5"
          >
            ← Vue par équipes
          </Link>
          <Link
            href={`/regie/${orgSlug}/${eventSlug}/planning/shifts`}
            className="rounded-lg border border-brand-ink/15 px-3 py-1.5 font-medium text-brand-ink/80 hover:bg-brand-ink/5"
          >
            Vue par créneaux →
          </Link>
        </div>
      </header>

      <TimelineBoard
        eventStart={ev.starts_at}
        eventEnd={ev.ends_at}
        positions={(positions ?? []) as any}
        shifts={eventShifts as any}
      />
    </div>
  );
}
