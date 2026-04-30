import { createServerClient } from "@/lib/supabase/server";
import { SponsorsBoard } from "./SponsorsBoard";

interface PageProps {
  params: Promise<{ orgSlug: string; eventSlug: string }>;
}

export default async function SponsorsPage({ params }: PageProps) {
  const { eventSlug } = await params;
  const supabase = createServerClient();

  const { data: ev } = await supabase
    .from("events")
    .select("id, name")
    .eq("slug", eventSlug)
    .maybeSingle();
  if (!ev) return null;

  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("*")
    .eq("event_id", ev.id)
    .order("amount_eur", { ascending: false });

  // Stats
  const all = sponsors ?? [];
  const totalAmount = all.reduce((sum, s: any) => sum + Number(s.amount_eur ?? 0), 0);
  const signedAmount = all
    .filter((s: any) => ["signed", "paid"].includes(s.status))
    .reduce((sum, s: any) => sum + Number(s.amount_eur ?? 0), 0);
  const paidAmount = all
    .filter((s: any) => s.status === "paid")
    .reduce((sum, s: any) => sum + Number(s.amount_eur ?? 0), 0);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Sponsors & Partenaires</h2>
          <p className="text-sm text-brand-ink/60">
            CRM des partenaires financiers, en nature et institutionnels.
          </p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Sponsors total" value={all.length.toString()} icon="🤝" />
        <KPI
          label="Montant total"
          value={`${(totalAmount / 1000).toFixed(1)}k€`}
          icon="💰"
        />
        <KPI
          label="Signés"
          value={`${(signedAmount / 1000).toFixed(1)}k€`}
          icon="✓"
          tone="emerald"
        />
        <KPI
          label="Encaissés"
          value={`${(paidAmount / 1000).toFixed(1)}k€`}
          icon="💵"
          tone="emerald"
        />
      </div>

      <SponsorsBoard sponsors={all} eventId={ev.id} />
    </div>
  );
}

function KPI({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "emerald" | "amber" | "red";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50"
        : tone === "red"
          ? "border-red-200 bg-red-50"
          : "border-brand-ink/10 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-2xl">{icon}</p>
      <p className="mt-1 font-display text-xl font-bold leading-tight">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-widest text-brand-ink/50">
        {label}
      </p>
    </div>
  );
}
