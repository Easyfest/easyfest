-- ====================================================================
-- ENRICHISSEMENT IMPORTS PAM : ajout des preferred_position_slugs
-- À RUN après IMPORT_PAM_INSCRITS.sql
-- Idempotent : update sur email
-- ====================================================================

do $$
declare
  v_event_id uuid;
begin
  select id into v_event_id from public.events where slug = 'rdl-2026' limit 1;
  if v_event_id is null then
    raise exception 'Event rdl-2026 introuvable';
  end if;

  update public.volunteer_applications set preferred_position_slugs = ARRAY['backline','catering','loge'] where event_id = v_event_id and email = 'pameach@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['catering','loge','bar'] where event_id = v_event_id and email = 's.ancarani@hotmail.fr';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['billetterie','bar','point-info'] where event_id = v_event_id and email = 'luccaetlilou@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['entree','bar','billetterie'] where event_id = v_event_id and email = 'douradolana1@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['catering','bar','runners'] where event_id = v_event_id and email = 'eli.fiona@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','catering','backline'] where event_id = v_event_id and email = 'ameliepaillette06@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['backline','catering','loge'] where event_id = v_event_id and email = 'tessadly@live.fr';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','loge','catering'] where event_id = v_event_id and email = 'jessiebercher@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['brigade-verte','decoration','bar'] where event_id = v_event_id and email = 'menbatimefi06@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['loge','catering','bar'] where event_id = v_event_id and email = 'davsilva83310@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['accueil','billetterie','catering'] where event_id = v_event_id and email = 'deschamps.alexandrine@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['loge','catering','securite'] where event_id = v_event_id and email = 'diopy679@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['loge','decoration','bar'] where event_id = v_event_id and email = 'flore22ange@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline','loge'] where event_id = v_event_id and email = 'windalmahaut@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['loge','catering','bar'] where event_id = v_event_id and email = 'dorothyperrier@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','entree','billetterie'] where event_id = v_event_id and email = 'marine.gillosi@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','catering','runners'] where event_id = v_event_id and email = 'arnaud.loiret06@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['billetterie','point-info','decoration'] where event_id = v_event_id and email = 'willychataigner@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline'] where event_id = v_event_id and email = 'fieschi.fred@free.fr';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline'] where event_id = v_event_id and email = 'noa.levasseur08@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['runners','backline','loge'] where event_id = v_event_id and email = 'aweedo@hotmail.fr';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','point-info'] where event_id = v_event_id and email = 'xchamina@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','billetterie','backline'] where event_id = v_event_id and email = 'valoufil@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['entree','decoration','brigade-verte'] where event_id = v_event_id and email = 'm.lahoundere@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','brigade-verte'] where event_id = v_event_id and email = 'harminidory@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','runners','entree'] where event_id = v_event_id and email = '13bosquet@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','point-info','billetterie'] where event_id = v_event_id and email = 'marjorieyon83@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar'] where event_id = v_event_id and email = 'matt.berthod@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline','loge'] where event_id = v_event_id and email = 'domitille.martinet@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline','loge'] where event_id = v_event_id and email = 'elisemalfoy@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline','loge'] where event_id = v_event_id and email = 'camille.jar06@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['decoration','billetterie'] where event_id = v_event_id and email = 'christellebrouant@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','backline','loge'] where event_id = v_event_id and email = 'ingrid.jar03@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','catering','loge'] where event_id = v_event_id and email = 'knippaurelien@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar'] where event_id = v_event_id and email = 'antoine.courtadon67@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','entree','billetterie'] where event_id = v_event_id and email = 'sophie.robinet83@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['backline'] where event_id = v_event_id and email = 'laurent.brossier.83@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar'] where event_id = v_event_id and email = 'chionstephane1@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['entree','catering','billetterie'] where event_id = v_event_id and email = 'giordanengok@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','decoration'] where event_id = v_event_id and email = 'stephanie.pierre1208@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','decoration','loge'] where event_id = v_event_id and email = 'dalmasso.elodie@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['loge'] where event_id = v_event_id and email = 'positiv.heart.force@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['decoration'] where event_id = v_event_id and email = 'celzanella@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','runners'] where event_id = v_event_id and email = 'margot06.lanier@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['billetterie','entree','runners'] where event_id = v_event_id and email = 'claire.lavalou@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['billetterie'] where event_id = v_event_id and email = 'samantha.pacarlo@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','decoration','runners'] where event_id = v_event_id and email = 'cedric.eaubelle@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['bar','loge','catering'] where event_id = v_event_id and email = 'morganecalais1994@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['decoration','bar'] where event_id = v_event_id and email = 'je.calvini@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['billetterie','runners','loge'] where event_id = v_event_id and email = 'christinedupoyet@gmail.com';
  update public.volunteer_applications set preferred_position_slugs = ARRAY['securite','brigade-verte','bar'] where event_id = v_event_id and email = 'rogerlandi988@gmail.com';

end $$;

select email, preferred_position_slugs from public.volunteer_applications where source = 'pam_import_2026' order by preferred_position_slugs desc nulls last limit 10;
