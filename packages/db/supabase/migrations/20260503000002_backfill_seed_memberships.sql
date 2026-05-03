-- ════════════════════════════════════════════════════════════════════
-- 20260503000002 — Backfill memberships volunteer pour applications validated
--
-- Contexte : les seeds (notamment 20260430000009_seed_volunteers_shifts.sql)
-- créent des `volunteer_applications` avec `status='validated'` mais ne
-- créent PAS les `memberships` correspondantes. Tous les bénévoles seedés
-- restent donc en pre-volunteer (badge ⏳) côté planning régie, ce qui
-- bloque le drag-and-drop.
--
-- Cette migration crée les memberships manquantes pour TOUTES les
-- applications validées dont l'utilisateur existe déjà dans `auth.users`
-- (match email case-insensitive). Idempotente : la LEFT JOIN exclut les
-- memberships déjà présentes, et la contrainte d'unicité (user_id, event_id)
-- protège en cas d'exécution concurrente.
-- ════════════════════════════════════════════════════════════════════

INSERT INTO public.memberships (user_id, event_id, role, is_active, accepted_at)
SELECT au.id, va.event_id, 'volunteer', true, now()
  FROM public.volunteer_applications va
  JOIN auth.users au ON lower(au.email) = lower(va.email)
  LEFT JOIN public.memberships m
    ON m.user_id = au.id
   AND m.event_id = va.event_id
   AND m.role = 'volunteer'
 WHERE va.status = 'validated'
   AND m.id IS NULL
ON CONFLICT DO NOTHING;
