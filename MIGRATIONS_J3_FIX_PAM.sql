-- Élargit le check engagement_kind pour autoriser 'convention_benevolat'
-- (vu sur attestation bénévoles 2021 ZIK en PACA — Pamela Giordanengo)

alter table public.signed_engagements
  drop constraint if exists signed_engagements_engagement_kind_check;

alter table public.signed_engagements
  add constraint signed_engagements_engagement_kind_check
  check (engagement_kind in (
    'charter',
    'anti_harassment',
    'image_rights',
    'pii_consent',
    'convention_benevolat'
  ));

comment on column public.signed_engagements.engagement_kind is
  'Type d''engagement signé. convention_benevolat = attestation/convention de prise de poste bénévolat (modèle ZIK en PACA).';
-- Ajoute les champs juridiques à organizations (pour générer la convention de bénévolat)
alter table public.organizations
  add column if not exists legal_siret      text,
  add column if not exists legal_address    text,
  add column if not exists president_name   text,
  add column if not exists president_title  text default 'Président·e';

comment on column public.organizations.legal_siret is 'Numéro SIRET (14 chiffres)';
comment on column public.organizations.legal_address is 'Adresse postale du siège social';
comment on column public.organizations.president_name is 'Nom du/de la président·e (signataire des conventions)';

-- Update ZIK en PACA avec les vraies infos (depuis attestation bénévoles 2021)
update public.organizations
set
  legal_siret = '838 018 968 000 19',
  legal_address = 'Montauroux, France',
  president_name = 'Pamela Giordanengo'
where slug = 'icmpaca';
-- Ajoute avatar_url à volunteer_applications (uploadée à l'inscription, pré-compte créé)
alter table public.volunteer_applications
  add column if not exists avatar_url text;

comment on column public.volunteer_applications.avatar_url is
  'Photo uploadée lors de l''inscription (Supabase Storage bucket avatars). Recopiée dans volunteer_profiles à la création du compte.';

-- ─── Bucket avatars (public-read pour affichage facile dans l'app) ─────
-- NOTE : à créer via Supabase Studio si pas auto-créé.
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
-- ON CONFLICT (id) DO UPDATE SET public = excluded.public;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Policy : anonymes peuvent uploader dans applications/* (form public)
drop policy if exists "anon_can_upload_application_avatars" on storage.objects;
create policy "anon_can_upload_application_avatars" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] in ('applications', 'profiles')
  );

-- Policy : tout le monde peut lire (bucket public)
drop policy if exists "anyone_can_read_avatars" on storage.objects;
create policy "anyone_can_read_avatars" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'avatars');

-- Policy : l'owner peut update sa propre photo (profils)
drop policy if exists "user_can_update_own_avatar" on storage.objects;
create policy "user_can_update_own_avatar" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = 'profiles'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
-- Ajoute les champs manquants pour parité avec Google Form Pam (RDL 2026)
alter table public.volunteer_applications
  add column if not exists available_setup    boolean default false,
  add column if not exists available_teardown boolean default false,
  add column if not exists diet_type          text check (diet_type in ('none','vegetarian','vegan','gluten_free','no_pork','other') or diet_type is null),
  add column if not exists carpool            text check (carpool in ('none','offering','seeking') or carpool is null) default 'none';

comment on column public.volunteer_applications.available_setup is 'Dispo pour le montage (J-2 / J-1)';
comment on column public.volunteer_applications.available_teardown is 'Dispo pour le démontage (J+1)';
comment on column public.volunteer_applications.diet_type is 'Régime alimentaire structuré (en plus de diet_notes libre)';
comment on column public.volunteer_applications.carpool is 'Préférence covoiturage';

alter table public.volunteer_profiles
  add column if not exists available_setup    boolean default false,
  add column if not exists available_teardown boolean default false,
  add column if not exists diet_type          text,
  add column if not exists carpool            text default 'none';

-- Mise à jour du RPC submit_volunteer_application pour accepter les nouveaux champs
create or replace function public.submit_volunteer_application(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app_id uuid;
  v_pos_slugs text[];
  v_skills text[];
  v_limitations text[];
begin
  v_pos_slugs := coalesce(array(select jsonb_array_elements_text(coalesce(payload->'preferred_position_slugs','[]'::jsonb))), '{}');
  v_skills := coalesce(array(select jsonb_array_elements_text(coalesce(payload->'skills','[]'::jsonb))), '{}');
  v_limitations := coalesce(array(select jsonb_array_elements_text(coalesce(payload->'limitations','[]'::jsonb))), '{}');

  insert into public.volunteer_applications (
    event_id, email, full_name, first_name, last_name, birth_date, is_minor,
    gender, phone, profession, arrival_at, departure_at, size, diet_notes,
    has_vehicle, driving_license,
    available_setup, available_teardown, diet_type, carpool,
    preferred_position_slugs, skills, limitations, bio, is_returning, parental_auth_url,
    consent_pii_at, consent_charter_at, consent_anti_harass_at, consent_image_at,
    privacy_policy_version_accepted, source, turnstile_token, ip_address, user_agent
  ) values (
    (payload->>'event_id')::uuid,
    payload->>'email',
    payload->>'full_name',
    payload->>'first_name',
    payload->>'last_name',
    nullif(payload->>'birth_date','')::date,
    coalesce((payload->>'is_minor')::boolean, false),
    nullif(payload->>'gender',''),
    payload->>'phone',
    nullif(payload->>'profession',''),
    nullif(payload->>'arrival_at','')::timestamptz,
    nullif(payload->>'departure_at','')::timestamptz,
    nullif(payload->>'size',''),
    nullif(payload->>'diet_notes',''),
    coalesce((payload->>'has_vehicle')::boolean, false),
    coalesce((payload->>'driving_license')::boolean, false),
    coalesce((payload->>'available_setup')::boolean, false),
    coalesce((payload->>'available_teardown')::boolean, false),
    nullif(payload->>'diet_type',''),
    coalesce(payload->>'carpool', 'none'),
    v_pos_slugs,
    v_skills,
    v_limitations,
    nullif(payload->>'bio',''),
    coalesce((payload->>'is_returning')::boolean, false),
    nullif(payload->>'parental_auth_url',''),
    nullif(payload->>'consent_pii_at','')::timestamptz,
    nullif(payload->>'consent_charter_at','')::timestamptz,
    nullif(payload->>'consent_anti_harass_at','')::timestamptz,
    nullif(payload->>'consent_image_at','')::timestamptz,
    coalesce(payload->>'privacy_policy_version_accepted','1.0.0'),
    coalesce(payload->>'source','public_form'),
    nullif(payload->>'turnstile_token',''),
    nullif(payload->>'ip_address','')::inet,
    nullif(payload->>'user_agent','')
  ) returning id into v_app_id;

  return v_app_id;
end;
$$;

grant execute on function public.submit_volunteer_application(jsonb) to anon, authenticated;
-- Suivi des invitations magic-link envoyées par les responsables
alter table public.volunteer_applications
  add column if not exists invited_at  timestamptz,
  add column if not exists invited_by  uuid references auth.users(id) on delete set null;

create index if not exists idx_applications_invited
  on public.volunteer_applications(invited_at)
  where invited_at is not null;

comment on column public.volunteer_applications.invited_at is
  'Quand le responsable a cliqué Inviter → magic-link envoyé via Supabase Auth';
comment on column public.volunteer_applications.invited_by is
  'Qui a déclenché l''invitation (audit + accountability)';
-- ====================================================================
-- SPONSORS CRM (Roots du Lac & festivals en général)
-- ====================================================================

create type if not exists public.sponsor_status as enum (
  'prospect', 'in_discussion', 'pending_signature', 'signed', 'paid', 'cancelled'
);

create type if not exists public.sponsor_tier as enum (
  'bronze', 'silver', 'gold', 'platinum', 'partner'
);

create table if not exists public.sponsors (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid not null references public.events(id) on delete cascade,
  name            text not null,
  tier            public.sponsor_tier default 'bronze',
  status          public.sponsor_status not null default 'prospect',
  logo_url        text,

  -- Contact
  contact_name    text,
  contact_email   citext,
  contact_phone   text,
  website         text,

  -- Financier
  amount_eur      numeric(10,2) default 0,
  amount_in_kind  text,                       -- contribution en nature (ex: '500 boissons gratuites')
  currency        text default 'EUR',

  -- Contractuel
  signed_at       timestamptz,
  contract_url    text,                       -- lien vers le contrat signé (Storage)
  payment_due_at  timestamptz,
  paid_at         timestamptz,

  -- Contreparties promises
  counterparts    text[] default '{}',         -- ex: ['logo sur affiche', 'stand 3x3', '10 places VIP']
  counterparts_status jsonb default '{}'::jsonb, -- ex: {'logo_affiche': 'done', 'stand': 'pending'}

  -- Notes internes
  internal_notes  text,
  next_action_at  date,
  next_action     text,

  -- Audit
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger tg_sponsors_updated_at
  before update on public.sponsors
  for each row execute function public.tg_set_updated_at();

create index if not exists idx_sponsors_event on public.sponsors(event_id, status);

-- ─── RLS ────────────────────────────────────────────────────────────
alter table public.sponsors enable row level security;

drop policy if exists "sponsors_select_lead" on public.sponsors;
create policy "sponsors_select_lead" on public.sponsors
  for select using (public.has_role_at_least(sponsors.event_id, 'volunteer_lead'));

drop policy if exists "sponsors_modify_direction" on public.sponsors;
create policy "sponsors_modify_direction" on public.sponsors
  for all using (public.has_role_at_least(sponsors.event_id, 'direction'))
  with check (public.has_role_at_least(sponsors.event_id, 'direction'));

-- ─── Seed sponsors RDL pour la démo (3 sponsors d'exemple ZIK en PACA) ────
insert into public.sponsors (event_id, name, tier, status, contact_name, contact_email, amount_eur, counterparts, internal_notes, next_action)
select
  e.id,
  'Brasserie de la Côte',
  'gold',
  'signed',
  'Marc Dupont',
  'm.dupont@brasserie-cote.fr',
  3500.00,
  ARRAY['Logo bâche scène principale', 'Stand 3x3 VIP zone', '20 places gratuites par jour', 'Annonce micro 2x/jour'],
  'Sponsor historique RDL depuis 2022. Payment toujours dans les 30j. Très réactif Marc.',
  'Envoyer photos bâche posée'
from public.events e where e.slug = 'rdl-2026'
on conflict do nothing;

insert into public.sponsors (event_id, name, tier, status, contact_name, contact_email, amount_eur, counterparts, next_action_at, next_action)
select
  e.id,
  'Mairie de Montauroux',
  'partner',
  'in_discussion',
  'Mme la Maire',
  'cabinet@mairie-montauroux.fr',
  2000.00,
  ARRAY['Subvention publique', 'Mise à disposition lac', 'Sécurité municipale'],
  '2026-05-10'::date,
  'Relancer pour signature convention subvention'
from public.events e where e.slug = 'rdl-2026'
on conflict do nothing;

insert into public.sponsors (event_id, name, tier, status, contact_name, contact_email, amount_eur, amount_in_kind, counterparts, internal_notes)
select
  e.id,
  'Auchan Drive Draguignan',
  'silver',
  'prospect',
  'Service partenariats',
  'partenariats.draguignan@auchan.fr',
  500.00,
  '50 cagettes fruits frais + boissons soft',
  ARRAY['Logo programme papier', 'Mention RS officielles'],
  'Premier contact mars, à relancer. Offre dotation produits frais pour catering bénévoles.'
from public.events e where e.slug = 'rdl-2026'
on conflict do nothing;
