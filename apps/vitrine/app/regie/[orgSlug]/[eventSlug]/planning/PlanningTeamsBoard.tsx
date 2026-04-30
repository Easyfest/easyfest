"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { useMemo, useState, useTransition } from "react";

import { assignVolunteerToTeam } from "@/app/actions/planning";

interface Volunteer {
  user_id: string;
  full_name: string;
  first_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  is_returning: boolean;
  preferred_slugs: string[];
  bio: string | null;
  arrival_at: string | null;
  departure_at: string | null;
  position_ids: string[];
  pending_account?: boolean;
  assignments: { id: string; shift_id: string; position_id: string; starts_at: string; ends_at: string }[];
}

interface Team {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
  description: string | null;
  needs_count_default: number;
  members: Volunteer[];
}

interface Props {
  initialTeams: Team[];
  initialPool: Volunteer[];
  eventId: string;
}

const POOL_ID = "__pool__";

export function PlanningTeamsBoard({ initialTeams, initialPool, eventId }: Props) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [pool, setPool] = useState<Volunteer[]>(initialPool);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const teamSlugById = useMemo(() => {
    const m = new Map<string, string>();
    teams.forEach((t) => m.set(t.id, t.slug));
    return m;
  }, [teams]);

  function findVolunteer(userId: string): { vol: Volunteer; from: string | typeof POOL_ID } | null {
    const inPool = pool.find((v) => v.user_id === userId);
    if (inPool) return { vol: inPool, from: POOL_ID };
    for (const t of teams) {
      const v = t.members.find((m) => m.user_id === userId);
      if (v) return { vol: v, from: t.id };
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const userId = String(active.id).replace(/^v-/, "");
    const targetTeamId = String(over.id).replace(/^t-/, "");

    // Bloquer drag sur les pré-bénévoles (pas de vrai user_id)
    if (userId.startsWith("pre-")) {
      setFeedback("⏳ Compte pas encore créé — invite ce bénévole à se connecter d'abord");
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const found = findVolunteer(userId);
    if (!found) return;

    if (found.from === targetTeamId) return; // Drop sur la même équipe

    // Optimistic update : retirer de l'origine, ajouter à la destination
    const updatedTeams = teams.map((t) => ({
      ...t,
      members: t.members.filter((m) => m.user_id !== userId),
    }));
    let updatedPool = pool.filter((v) => v.user_id !== userId);

    if (targetTeamId === POOL_ID) {
      updatedPool = [...updatedPool, { ...found.vol, position_ids: [] }];
    } else {
      const idx = updatedTeams.findIndex((t) => t.id === targetTeamId);
      if (idx === -1) return;
      updatedTeams[idx] = {
        ...updatedTeams[idx],
        members: [...updatedTeams[idx].members, { ...found.vol, position_ids: [targetTeamId] }],
      };
    }

    setTeams(updatedTeams);
    setPool(updatedPool);
    setFeedback("Mise à jour…");

    startTransition(async () => {
      const result = await assignVolunteerToTeam({
        volunteerUserId: userId,
        targetPositionId: targetTeamId === POOL_ID ? null : targetTeamId,
        eventId,
      });
      if (!result.ok) {
        // Rollback
        setTeams(initialTeams);
        setPool(initialPool);
        setFeedback(`❌ ${result.error}`);
      } else {
        setFeedback("✓ Sauvegardé");
        setTimeout(() => setFeedback(null), 2000);
      }
    });
  }

  // Filter
  const lowerFilter = filter.trim().toLowerCase();
  const matches = (v: Volunteer) =>
    !lowerFilter ||
    v.full_name.toLowerCase().includes(lowerFilter) ||
    (v.email ?? "").toLowerCase().includes(lowerFilter);

  const filteredPool = pool.filter(matches);
  const filteredTeams = teams.map((t) => ({ ...t, members: t.members.filter(matches) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filtrer par nom ou email…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm focus:border-brand-coral focus:outline-none"
        />
        {feedback && (
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              feedback.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : feedback.startsWith("✓")
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {feedback}
          </span>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* Pool */}
        <PoolDroppable
          pool={filteredPool}
          teamSlugById={teamSlugById}
          totalPool={pool.length}
        />

        {/* Grid des équipes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTeams.map((team) => (
            <TeamColumn key={team.id} team={team} teamSlugById={teamSlugById} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function PoolDroppable({
  pool,
  teamSlugById,
  totalPool,
}: {
  pool: Volunteer[];
  teamSlugById: Map<string, string>;
  totalPool: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `t-${POOL_ID}` });
  return (
    <section
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed p-4 transition ${
        isOver ? "border-brand-coral bg-brand-coral/5" : "border-brand-ink/15 bg-brand-cream/40"
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-ink/70">
          📋 Bénévoles à placer ({totalPool})
        </h3>
        <span className="text-xs text-brand-ink/50">
          Glisse-les vers une équipe ci-dessous
        </span>
      </header>
      {pool.length === 0 ? (
        <p className="py-3 text-center text-xs text-brand-ink/50">
          Tous les bénévoles ont une équipe 🎉
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pool.map((v) => (
            <VolunteerCard key={v.user_id} v={v} teamSlugById={teamSlugById} currentTeamId={null} />
          ))}
        </div>
      )}
    </section>
  );
}

function TeamColumn({
  team,
  teamSlugById,
}: {
  team: Team;
  teamSlugById: Map<string, string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `t-${team.id}` });
  const filled = team.members.length;
  const need = team.needs_count_default;
  const status =
    filled >= need ? "complete" : filled > 0 ? "partial" : "empty";
  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[140px] flex-col rounded-2xl border-2 bg-white p-3 shadow-sm transition ${
        isOver ? "border-brand-coral ring-2 ring-brand-coral/20" : "border-brand-ink/10"
      }`}
      style={{ borderTopColor: team.color, borderTopWidth: 4 }}
    >
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold leading-tight">
          {team.icon ? <span className="mr-1">{team.icon}</span> : null}
          {team.name}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            status === "complete"
              ? "bg-emerald-100 text-emerald-700"
              : status === "partial"
                ? "bg-amber-100 text-amber-700"
                : "bg-brand-ink/10 text-brand-ink/60"
          }`}
        >
          {filled} / {need}
        </span>
      </header>
      {team.description && (
        <p className="mb-2 text-[11px] text-brand-ink/55 line-clamp-2">{team.description}</p>
      )}
      <div className="space-y-2">
        {team.members.length === 0 ? (
          <p className="rounded-lg border border-dashed border-brand-ink/15 px-2 py-3 text-center text-[11px] text-brand-ink/40">
            Glisse un bénévole ici
          </p>
        ) : (
          team.members.map((v) => (
            <VolunteerCard
              key={v.user_id}
              v={v}
              teamSlugById={teamSlugById}
              currentTeamId={team.id}
              currentTeamSlug={team.slug}
            />
          ))
        )}
      </div>
    </section>
  );
}

function VolunteerCard({
  v,
  teamSlugById,
  currentTeamId,
  currentTeamSlug,
}: {
  v: Volunteer;
  teamSlugById: Map<string, string>;
  currentTeamId: string | null;
  currentTeamSlug?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `v-${v.user_id}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const matchesCurrent = currentTeamSlug && v.preferred_slugs.includes(currentTeamSlug);
  const wantedTeams = v.preferred_slugs.slice(0, 3);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-lg border bg-white p-2 text-xs shadow-sm transition ${
        v.pending_account
          ? "cursor-not-allowed border-blue-200 bg-blue-50/30 opacity-80"
          : "cursor-grab active:cursor-grabbing"
      } ${
        isDragging
          ? "border-brand-coral shadow-glow ring-2 ring-brand-coral/30"
          : v.pending_account
            ? ""
            : "border-brand-ink/10 hover:border-brand-coral/40 hover:shadow"
      }`}
    >
      <div className="flex items-start gap-2">
        {v.avatar_url ? (
          <img
            src={v.avatar_url}
            alt=""
            className="h-8 w-8 flex-none rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-coral/15 text-[11px] font-bold text-brand-coral">
            {(v.first_name?.[0] ?? v.full_name[0] ?? "?").toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">
            {v.first_name ?? v.full_name}
            {v.is_returning && <span className="ml-1 text-amber-600" title="Bénévole fidèle">★</span>}
            {v.pending_account && (
              <span className="ml-1 inline-block rounded bg-blue-100 px-1 text-[8px] font-bold text-blue-700" title="Compte pas encore créé — se connectera au 1er magic-link">
                ⏳
              </span>
            )}
          </p>
          {v.email && (
            <p className="truncate text-[10px] text-brand-ink/50">{v.email}</p>
          )}
        </div>
        {currentTeamSlug && (
          <span
            className={`flex-none text-[11px] font-bold ${
              matchesCurrent ? "text-emerald-600" : "text-amber-500"
            }`}
            title={matchesCurrent ? "Souhait respecté" : "Pas son souhait initial"}
          >
            {matchesCurrent ? "✓" : "◇"}
          </span>
        )}
      </div>
      {wantedTeams.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {wantedTeams.map((slug) => (
            <span
              key={slug}
              className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                slug === currentTeamSlug
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-brand-ink/8 text-brand-ink/70"
              }`}
              title={`Souhait ${v.preferred_slugs.indexOf(slug) + 1}`}
            >
              {slug}
            </span>
          ))}
        </div>
      )}
      {v.bio && (
        <p className="mt-1 line-clamp-2 text-[10px] italic text-brand-ink/60">"{v.bio}"</p>
      )}
    </div>
  );
}
