"use client";

import { createContext, useContext } from "react";

export interface AssignTeam {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
}

export interface AssignVolunteerSummary {
  user_id: string;
  full_name: string;
  first_name: string | null;
  email: string | null;
  pending_account?: boolean;
  preferred_slugs: string[];
}

export interface AssignContextValue {
  teams: AssignTeam[];
  /** Renvoie un message d'info si action impossible (ex: pre-account). Sinon ok=true. */
  assign: (
    volunteerUserId: string,
    targetPositionId: string | null,
  ) => Promise<{ ok: boolean; error?: string }>;
  openMenu: (volunteer: AssignVolunteerSummary, currentTeamId: string | null) => void;
  /** Notifier l'invitation pour un pré-bénévole (toast). */
  onInviteRequest?: (email: string) => void;
}

const AssignCtx = createContext<AssignContextValue | null>(null);

export function AssignProvider({
  value,
  children,
}: {
  value: AssignContextValue;
  children: React.ReactNode;
}) {
  return <AssignCtx.Provider value={value}>{children}</AssignCtx.Provider>;
}

export function useAssign(): AssignContextValue {
  const ctx = useContext(AssignCtx);
  if (!ctx) throw new Error("useAssign must be used within <AssignProvider>");
  return ctx;
}
