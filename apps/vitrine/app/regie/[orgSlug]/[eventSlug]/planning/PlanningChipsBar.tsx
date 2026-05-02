"use client";

import { useDroppable } from "@dnd-kit/core";

import { useAssign } from "@/components/AssignContext";

import { POOL_ID } from "./PlanningTeamColumn";

/**
 * Sticky top bar mobile-first : ligne horizontale scrollable avec une chip par équipe.
 * Chaque chip est un drop target DnD (drag depuis pool vers chip = assigner) + un bouton
 * tactile (tap = filtrer le pool sur cette équipe, ou ouvrir le menu d'équipe focus).
 *
 * Visible uniquement sur mobile (md:hidden). Desktop garde la grid colonnes.
 */
interface ChipTeam {
  id: string;
  slug: string;
  name: string;
  color: string;
  icon: string | null;
  membersCount: number;
  needs: number;
}

interface Props {
  teams: ChipTeam[];
  /** Slug ou id sélectionné pour highlight (depuis ?team=...) */
  highlightId?: string | null;
}

export function PlanningChipsBar({ teams, highlightId }: Props) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-brand-ink/10 bg-easyfest-cream/95 px-4 py-2 backdrop-blur md:hidden">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-ink/55">
          Équipes — touche un bénévole pour l&apos;assigner
        </p>
        <span className="text-[10px] text-brand-ink/40">{teams.length} équipes</span>
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x proximity" }}
        role="group"
        aria-label="Liste des équipes — drop target ou cliquer pour focus"
      >
        <PoolChip />
        {teams.map((t) => (
          <TeamChip key={t.id} team={t} highlighted={highlightId === t.id || highlightId === t.slug} />
        ))}
      </div>
    </div>
  );
}

function PoolChip() {
  const { setNodeRef, isOver } = useDroppable({ id: `t-${POOL_ID}` });
  return (
    <a
      ref={setNodeRef}
      href="#planning-pool"
      className={`flex h-11 min-w-[88px] flex-none items-center gap-1.5 rounded-full border-2 px-3 text-xs font-semibold transition active:scale-95 ${
        isOver
          ? "border-amber-500 bg-amber-100 text-amber-900 shadow-glow-amber"
          : "border-brand-ink/15 bg-white text-brand-ink/65 hover:border-brand-ink/30"
      }`}
      style={{ scrollSnapAlign: "start" }}
    >
      <span aria-hidden>🪂</span>
      <span>Pool</span>
    </a>
  );
}

function TeamChip({ team, highlighted }: { team: ChipTeam; highlighted: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `t-${team.id}` });
  const { openMenu } = useAssign();

  const ratio = team.needs > 0 ? team.membersCount / team.needs : 0;
  const status =
    ratio === 0 ? "empty" : ratio < 0.5 ? "low" : ratio < 1 ? "mid" : "full";
  const statusColor = {
    empty: "bg-red-100 text-red-700",
    low: "bg-amber-100 text-amber-700",
    mid: "bg-blue-100 text-blue-700",
    full: "bg-emerald-100 text-emerald-700",
  }[status];

  return (
    <a
      ref={setNodeRef}
      href={`#team-${team.slug}`}
      className={`flex h-11 min-w-[120px] flex-none items-center gap-1.5 rounded-full border-2 px-3 text-xs font-semibold transition active:scale-95 ${
        isOver
          ? "border-[var(--theme-primary,_#FF5E5B)] bg-[var(--theme-primary,_#FF5E5B)]/10 text-[var(--theme-primary,_#FF5E5B)] shadow-glow"
          : highlighted
            ? "border-[var(--theme-primary,_#FF5E5B)]/60 bg-[var(--theme-primary,_#FF5E5B)]/5 text-brand-ink"
            : "border-brand-ink/15 bg-white text-brand-ink/80 hover:border-brand-ink/30"
      }`}
      style={{ scrollSnapAlign: "start" }}
      title={`${team.name} : ${team.membersCount}/${team.needs} bénévoles`}
    >
      {team.icon && <span aria-hidden className="text-sm">{team.icon}</span>}
      <span className="truncate">{team.name}</span>
      <span
        className={`flex-none rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${statusColor}`}
        aria-label={`${team.membersCount} sur ${team.needs} bénévoles`}
      >
        {team.membersCount}/{team.needs}
      </span>
    </a>
  );
}
