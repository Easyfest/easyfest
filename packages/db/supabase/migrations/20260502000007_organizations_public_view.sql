-- 20260502000007_organizations_public_view.sql
-- Comité Sécurité : tighten exposure publique des champs orgs.
--
-- Aujourd'hui la policy "anon_read_org_with_open_events" permet à anon de SELECT
-- toutes les colonnes de organizations (dont contact_email, billing_email, settings JSON, ...).
-- Risque : énumération + scraping des emails d'orgs partenaires.
--
-- Solution : créer une vue organizations_public qui n'expose QUE les champs
-- nécessaires au rendu UI public (slug, name, logo_url, description courte).
-- Le code Next.js des pages publiques (/[orgSlug], /[orgSlug]/[eventSlug]/inscription)
-- doit être mis à jour pour lire cette vue au lieu de la table directement.

CREATE OR REPLACE VIEW organizations_public AS
SELECT
  id,
  slug,
  name,
  logo_url,
  description
FROM organizations
WHERE EXISTS (
  SELECT 1 FROM events
  WHERE events.organization_id = organizations.id
    AND events.status = 'open'
);

-- Permettre à anon de SELECT cette vue (pas la table directe).
GRANT SELECT ON organizations_public TO anon;
GRANT SELECT ON organizations_public TO authenticated;

-- ⚠️ Étape 2 (à appliquer APRÈS update du code public pour utiliser la vue) :
-- DROP POLICY IF EXISTS "anon_read_org_with_open_events" ON organizations;
-- Cette ligne est commentée pour ne pas casser la prod immédiatement. À décommenter quand
-- /[orgSlug]/page.tsx, /[orgSlug]/[eventSlug]/page.tsx, et /[orgSlug]/[eventSlug]/inscription/page.tsx
-- utiliseront from("organizations_public") au lieu de from("organizations").

-- Note : la policy "anon_read_positions_of_open_events" reste OK telle quelle,
-- les positions n'exposent pas d'infos sensibles (juste slug, name, color, icon, description).

-- COMMENT de documentation
COMMENT ON VIEW organizations_public IS
  'Vue publique scope-stricte des organizations qui ont au moins 1 event status=open. Expose UNIQUEMENT id/slug/name/logo_url/description. Pas de contact_email, billing_email, settings.';
