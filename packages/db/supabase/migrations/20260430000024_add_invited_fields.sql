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
