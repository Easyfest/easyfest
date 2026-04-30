-- ====================================================================
-- MIGRATIONS J3 PHASE 3 — fix adresse ZIK + plan du site festival
-- ====================================================================

-- 1. Fix adresse siège social ZIK en PACA (Fréjus, pas Montauroux !)
-- Source : attestation bénévoles 2021 officielle
update public.organizations
set
  legal_address = '436 allée des petits châteaux de Villepey, 83370 Fréjus',
  legal_siret = '838 018 968 000 19',
  president_name = 'Pamela Giordanengo',
  president_title = 'Présidente'
where slug = 'icmpaca';

-- Ajouter code APE (champ utile pour préfecture)
alter table public.organizations
  add column if not exists legal_ape_code text;

update public.organizations
set legal_ape_code = '9002Z'
where slug = 'icmpaca';

comment on column public.organizations.legal_ape_code is
  'Code APE / NAF (4 chiffres + 1 lettre, ex: 9002Z)';

-- 2. Plan du site festival (URL image stockée dans bucket Storage)
alter table public.events
  add column if not exists site_plan_url      text,
  add column if not exists site_plan_dark_url text,
  add column if not exists site_plan_caption  text;

comment on column public.events.site_plan_url is
  'URL de l''image du plan du site (mode jour). Bucket Storage festival-assets.';
comment on column public.events.site_plan_dark_url is
  'Variante dark mode du plan (optionnel)';

-- 3. Bucket Storage festival-assets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('festival-assets', 'festival-assets', true, 10485760, array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "anyone_can_read_festival_assets" on storage.objects;
create policy "anyone_can_read_festival_assets" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'festival-assets');

drop policy if exists "direction_can_upload_festival_assets" on storage.objects;
create policy "direction_can_upload_festival_assets" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'festival-assets'
    and exists (
      select 1 from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'direction'
        and m.is_active = true
    )
  );

drop policy if exists "direction_can_update_festival_assets" on storage.objects;
create policy "direction_can_update_festival_assets" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'festival-assets'
    and exists (
      select 1 from public.memberships m
      where m.user_id = auth.uid()
        and m.role = 'direction'
        and m.is_active = true
    )
  );

-- ───────────────────────────────────────────────────────────
-- Vérif
-- ───────────────────────────────────────────────────────────
select
  name as org_name,
  legal_siret,
  legal_address,
  legal_ape_code,
  president_name
from public.organizations where slug = 'icmpaca';

-- ───────────────────────────────────────────────────────────
-- Plans RDL 2026 pré-configurés (servis depuis /public Next.js)
-- ───────────────────────────────────────────────────────────
update public.events
set
  site_plan_url = '/festival-plans/rdl-2026-day.jpg',
  site_plan_dark_url = '/festival-plans/rdl-2026-night.jpg',
  site_plan_caption = 'Plan officiel Roots du Lac 2026 — Montauroux'
where slug = 'rdl-2026';
