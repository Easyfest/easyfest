"use client";

import { useMemo, useState } from "react";

interface Position {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  icon: string | null;
  display_order: number;
}

interface Shift {
  id: string;
  starts_at: string;
  ends_at: string;
  needs_count: number;
  notes: string | null;
  position: { id: string; name: string; color: string | null };
  assignments: { id: string; status: string; volunteer_user_id: string }[];
}

interface Props {
  eventStart: string;
  eventEnd: string;
  positions: Position[];
  shifts: Shift[];
}

const HOUR_PX = 40; // largeur d'une heure dans la timeline

export function TimelineBoard({ eventStart, eventEnd, positions, shifts }: Props) {
  const start = useMemo(() => new Date(eventStart), [eventStart]);
  const end = useMemo(() => new Date(eventEnd), [eventEnd]);

  // Génère les heures du festival (par tranches de 6h pour les ticks)
  const totalHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const totalWidth = totalHours * HOUR_PX;

  // Génère les jours
  const days: { date: Date; label: string; offsetHours: number }[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    const offsetHours = (cursor.getTime() - start.getTime()) / (1000 * 60 * 60);
    days.push({
      date: new Date(cursor),
      label: cursor.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }),
      offsetHours,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  // Génère les ticks 6h
  const ticks: { hour: number; label: string; offsetHours: number }[] = [];
  for (let h = 0; h <= totalHours; h += 6) {
    const date = new Date(start.getTime() + h * 3600 * 1000);
    ticks.push({
      hour: date.getHours(),
      label: `${date.getHours().toString().padStart(2, "0")}h`,
      offsetHours: h,
    });
  }

  function shiftStyle(shift: Shift) {
    const sStart = new Date(shift.starts_at);
    const sEnd = new Date(shift.ends_at);
    const offsetHours = (sStart.getTime() - start.getTime()) / (1000 * 60 * 60);
    const durationHours = (sEnd.getTime() - sStart.getTime()) / (1000 * 60 * 60);
    return {
      left: `${offsetHours * HOUR_PX}px`,
      width: `${Math.max(durationHours * HOUR_PX - 2, 30)}px`,
    };
  }

  function shiftFillStatus(shift: Shift): "complete" | "partial" | "empty" {
    const validated = shift.assignments.filter((a) => ["pending", "validated"].includes(a.status)).length;
    if (validated >= shift.needs_count) return "complete";
    if (validated > 0) return "partial";
    return "empty";
  }

  const rowHeight = 56;

  return (
    <div className="rounded-2xl border border-brand-ink/10 bg-white shadow-sm">
      {/* Légende */}
      <div className="flex flex-wrap items-center gap-3 border-b border-brand-ink/10 px-4 py-2 text-xs">
        <span className="font-semibold text-brand-ink/70">Légende :</span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" /> Complet
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-amber-400" /> Partiel
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border-2 border-red-400 bg-red-50" /> Vide (alerte)
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Header jours */}
          <div className="sticky top-0 z-10 flex border-b border-brand-ink/10 bg-white">
            <div className="w-40 flex-none border-r border-brand-ink/10 bg-brand-cream/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-ink/60">
              Équipe
            </div>
            <div className="relative" style={{ width: `${totalWidth}px`, minHeight: "44px" }}>
              {days.map((d, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l-2 border-brand-coral/30 pl-2 text-xs font-bold text-brand-ink"
                  style={{ left: `${d.offsetHours * HOUR_PX}px` }}
                >
                  {d.label}
                </div>
              ))}
              {ticks.map((t, i) => (
                <div
                  key={`tick-${i}`}
                  className="absolute bottom-0 text-[9px] text-brand-ink/40"
                  style={{ left: `${t.offsetHours * HOUR_PX + 2}px` }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Une ligne par position */}
          {positions.map((pos, i) => {
            const positionShifts = shifts.filter((s) => s.position.id === pos.id);
            return (
              <div
                key={pos.id}
                className="flex border-b border-brand-ink/5"
                style={{ minHeight: `${rowHeight}px` }}
              >
                <div
                  className="w-40 flex-none border-r border-brand-ink/10 px-3 py-3 text-sm"
                  style={{ borderLeft: `4px solid ${pos.color ?? "#FF5E5B"}` }}
                >
                  <p className="font-semibold leading-tight">
                    {pos.icon} {pos.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-brand-ink/50">
                    {positionShifts.length} créneaux
                  </p>
                </div>
                <div
                  className="relative"
                  style={{ width: `${totalWidth}px`, height: `${rowHeight}px` }}
                >
                  {/* Background grid */}
                  {ticks.map((t, j) => (
                    <div
                      key={`grid-${j}`}
                      className="absolute top-0 bottom-0 border-l border-brand-ink/5"
                      style={{ left: `${t.offsetHours * HOUR_PX}px` }}
                    />
                  ))}
                  {/* Shifts */}
                  {positionShifts.map((s) => {
                    const status = shiftFillStatus(s);
                    const filled = s.assignments.filter((a) => ["pending", "validated"].includes(a.status)).length;
                    const bg =
                      status === "complete"
                        ? "bg-emerald-500"
                        : status === "partial"
                          ? "bg-amber-400"
                          : "bg-red-50 border-2 border-red-400";
                    const txt =
                      status === "empty" ? "text-red-700" : "text-white";
                    return (
                      <div
                        key={s.id}
                        title={`${new Date(s.starts_at).toLocaleString("fr-FR")} → ${new Date(s.ends_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · ${filled}/${s.needs_count}${s.notes ? `\n${s.notes}` : ""}`}
                        className={`absolute top-2 bottom-2 cursor-pointer rounded text-[11px] font-bold ${bg} ${txt} flex items-center justify-center px-1 transition hover:opacity-80`}
                        style={shiftStyle(s)}
                      >
                        {filled}/{s.needs_count}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
