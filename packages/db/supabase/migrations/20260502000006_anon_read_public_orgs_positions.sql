-- Migration 20260502000006_anon_read_public_orgs_positions.sql
-- Permettre à l'anon de lire :
-- - organizations qui ont au moins 1 event status='open' (pour pages /[orgSlug] et /[orgSlug]/[eventSlug])
-- - positions actives des events open (pour formulaire candidature)
-- Sans cette policy, les pages publiques d'inscription sont en 404 (RLS bloque le nested join).

DO $$ BEGIN
  CREATE POLICY "anon_read_org_with_open_events"
    ON organizations FOR SELECT
    TO anon
    USING (
      EXISTS (
        SELECT 1 FROM events
        WHERE events.organization_id = organizations.id
          AND events.status = 'open'
      )
    );
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'Policy already exists, skipping';
END $$;

DO $$ BEGIN
  CREATE POLICY "anon_read_positions_of_open_events"
    ON positions FOR SELECT
    TO anon
    USING (
      is_active = true
      AND EXISTS (
        SELECT 1 FROM events
        WHERE events.id = positions.event_id
          AND events.status = 'open'
      )
    );
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'Policy already exists, skipping';
END $$;
