-- ════════════════════════════════════════════════════════════════════
-- 20260501000010 — RGPD soft-delete 30j (OC-04 + OC-05)
-- Auto-service utilisateur :
--   • Art.15 (export) : route handler /api/account/export
--   • Art.17 (suppression) : soft-delete 30j (SLA produit) puis hard via cron
-- Coexiste avec rgpd_purge (anonymisation 12 mois) — indépendant.
-- ════════════════════════════════════════════════════════════════════

-- ─── Colonnes soft-delete sur volunteer_profiles ────────────────────
alter table public.volunteer_profiles
  add column deletion_requested_at timestamptz,
  add column deleted_at timestamptz;

comment on column public.volunteer_profiles.deletion_requested_at is
  'Horodatage de la demande utilisateur (Art.17). UI affiche "annuler" tant que deleted_at > now().';
comment on column public.volunteer_profiles.deleted_at is
  'Date prévue de purge hard (deletion_requested_at + 30 jours, SLA produit). Profil masqué des leads quand non-null.';

-- Index partiel pour le job cron rgpd_hard_delete
create index idx_vp_pending_hard_delete
  on public.volunteer_profiles(deleted_at)
  where deleted_at is not null;

-- ─── RLS : masquer les comptes soft-deleted des vues lead/post_lead ─
-- Le user lui-même garde l'accès via vp_select_self pour voir le statut "scheduled for deletion".
drop policy if exists "vp_select_event_lead" on public.volunteer_profiles;
create policy "vp_select_event_lead" on public.volunteer_profiles
  for select using (
    deleted_at is null
    and exists (
      select 1 from public.memberships m
      where m.user_id = volunteer_profiles.user_id
        and public.has_role_at_least(m.event_id, 'volunteer_lead')
    )
  );

drop policy if exists "vp_select_post_lead_team" on public.volunteer_profiles;
create policy "vp_select_post_lead_team" on public.volunteer_profiles
  for select using (
    deleted_at is null
    and exists (
      select 1
      from public.memberships m_target
      join public.memberships m_actor on m_actor.event_id = m_target.event_id
      where m_target.user_id = volunteer_profiles.user_id
        and m_target.role = 'volunteer'
        and m_actor.user_id = auth.uid()
        and m_actor.role = 'post_lead'
        and m_actor.position_id is not null
        and m_actor.position_id = m_target.position_id
    )
  );

-- ─── RPC : demande de suppression Art.17 ────────────────────────────
create or replace function public.rgpd_request_self_delete()
returns timestamptz
language plpgsql security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  recovery_until timestamptz;
begin
  if uid is null then
    raise exception 'unauthenticated' using errcode = '42501';
  end if;

  recovery_until := now() + interval '30 days';

  update public.volunteer_profiles
     set deletion_requested_at = now(),
         deleted_at            = recovery_until
   where user_id = uid;

  insert into public.audit_log (user_id, action, payload)
  values (
    uid,
    'rgpd.deletion.requested',
    jsonb_build_object(
      'recovery_until', recovery_until,
      'profile_existed', found
    )
  );

  return recovery_until;
end;
$$;

comment on function public.rgpd_request_self_delete is
  'OC-05 : initie la suppression Art.17 avec soft-delete 30j (SLA produit). Retourne la date de purge prévue.';

-- ─── RPC : annulation de suppression (dans la fenêtre 30j) ──────────
create or replace function public.rgpd_restore_self()
returns boolean
language plpgsql security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  did_restore boolean := false;
begin
  if uid is null then
    return false;
  end if;

  update public.volunteer_profiles
     set deletion_requested_at = null,
         deleted_at            = null
   where user_id = uid
     and deleted_at is not null
     and deleted_at > now();

  did_restore := found;

  if did_restore then
    insert into public.audit_log (user_id, action, payload)
    values (uid, 'rgpd.deletion.cancelled', '{}'::jsonb);
  end if;

  return did_restore;
end;
$$;

comment on function public.rgpd_restore_self is
  'OC-05 : annule la suppression Art.17 si encore dans la fenêtre 30j. Retourne true si restauré.';

-- ─── Permissions ────────────────────────────────────────────────────
grant execute on function public.rgpd_request_self_delete() to authenticated;
grant execute on function public.rgpd_restore_self()         to authenticated;
