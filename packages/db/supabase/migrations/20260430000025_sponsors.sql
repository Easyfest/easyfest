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
