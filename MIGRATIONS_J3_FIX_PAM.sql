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
