-- ════════════════════════════════════════════════════════════════════
-- 20260503010000 — RPC assign_volunteer_atomic
--
-- Refactor définitif de assignVolunteerToTeam (Bug #5 audit-extreme retest
-- 3 mai 2026) : tout-en-un transactionnel côté SQL pour éviter les
-- inconsistances entre membership / profile / assignment quand un drag
-- côté planning régie touche un pre-volunteer.
--
-- Contrats :
-- - p_user_or_email : "pre-<email>" (case-insensitive) OU UUID auth.users.id
-- - p_position_id : NULL = retour au pool (suppression assignments event)
-- - p_event_id : event sur lequel placer le bénévole
-- - p_actor_user_id : user qui fait le drag (Pamela direction / lead)
--
-- Sécurité : SECURITY DEFINER + permission check direction|volunteer_lead
-- avant tout write. Le service-role bypass RLS est encapsulé dans cette
-- fonction unique : pas d'autre voie d'écriture côté serveur.
--
-- Idempotence : tous les writes utilisent ON CONFLICT — relancer la même
-- opération ne casse rien.
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.assign_volunteer_atomic(
  p_user_or_email TEXT,
  p_position_id   UUID,
  p_event_id      UUID,
  p_actor_user_id UUID
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_real_user_id  UUID;
  v_email         TEXT;
  v_app           public.volunteer_applications%ROWTYPE;
  v_target_shift_id UUID;
  v_event_starts  TIMESTAMPTZ;
  v_event_ends    TIMESTAMPTZ;
BEGIN
  -- ─── 1. Permission check (direction OR volunteer_lead sur cet event)
  IF NOT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE user_id = p_actor_user_id
      AND event_id = p_event_id
      AND is_active = true
      AND role IN ('direction', 'volunteer_lead')
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Permission refusée');
  END IF;

  -- ─── 2. Résoudre p_user_or_email → UUID réel
  IF p_user_or_email LIKE 'pre-%' THEN
    v_email := lower(substr(p_user_or_email, 5));

    SELECT id INTO v_real_user_id
    FROM auth.users
    WHERE lower(email) = v_email
    LIMIT 1;

    IF v_real_user_id IS NULL THEN
      RETURN jsonb_build_object(
        'ok', false,
        'error', format('Compte auth introuvable pour %s — clique 📧 Inviter dans Candidatures', v_email)
      );
    END IF;

    -- 2b. App validated obligatoire (sécurité : empêche n'importe qui d'auto-créer une membership)
    SELECT * INTO v_app
    FROM public.volunteer_applications
    WHERE lower(email) = v_email
      AND event_id = p_event_id
      AND status = 'validated'
    LIMIT 1;

    IF v_app.id IS NULL THEN
      RETURN jsonb_build_object(
        'ok', false,
        'error', format('Aucune candidature validée pour %s sur cet event — valide d''abord la candidature', v_email)
      );
    END IF;

    -- 2c. Créer la membership volunteer (idempotent)
    INSERT INTO public.memberships (user_id, event_id, role, is_active, accepted_at)
    VALUES (v_real_user_id, p_event_id, 'volunteer', true, now())
    ON CONFLICT (user_id, event_id, role) DO UPDATE SET is_active = true;

    -- 2d. Bootstrap volunteer_profile si manquant (idempotent via PK user_id)
    INSERT INTO public.volunteer_profiles (
      user_id, full_name, first_name, last_name, birth_date, gender, phone, email,
      address_street, address_city, address_zip, profession, size, diet_notes,
      diet_type, carpool, available_setup, available_teardown, skills, limitations,
      bio, avatar_url, is_returning
    )
    VALUES (
      v_real_user_id,
      COALESCE(v_app.full_name, v_email),
      v_app.first_name, v_app.last_name, v_app.birth_date, v_app.gender, v_app.phone, v_email,
      v_app.address_street, v_app.address_city, v_app.address_zip, v_app.profession,
      v_app.size, v_app.diet_notes, v_app.diet_type, v_app.carpool,
      v_app.available_setup, v_app.available_teardown,
      COALESCE(v_app.skills, '{}'::text[]),
      COALESCE(v_app.limitations, '{}'::text[]),
      v_app.bio, v_app.avatar_url, COALESCE(v_app.is_returning, false)
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- 2e. Audit log auto-création
    INSERT INTO public.audit_log (user_id, event_id, action, payload)
    VALUES (
      p_actor_user_id, p_event_id,
      'membership.auto_created_via_assignment',
      jsonb_build_object(
        'email', v_email,
        'target_user_id', v_real_user_id,
        'reason', 'drag_pre_volunteer'
      )
    );
  ELSE
    -- Cas UUID direct
    BEGIN
      v_real_user_id := p_user_or_email::UUID;
    EXCEPTION WHEN invalid_text_representation THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Identifiant bénévole invalide');
    END;
  END IF;

  -- ─── 3. Supprimer toutes les assignments existantes du bénévole sur les shifts de cet event
  DELETE FROM public.assignments
  WHERE volunteer_user_id = v_real_user_id
    AND status IN ('pending', 'validated')
    AND shift_id IN (
      SELECT s.id FROM public.shifts s
      JOIN public.positions p ON p.id = s.position_id
      WHERE p.event_id = p_event_id
    );

  -- ─── 4. Si retour au pool, fin de course
  IF p_position_id IS NULL THEN
    INSERT INTO public.audit_log (user_id, event_id, action, payload)
    VALUES (
      p_actor_user_id, p_event_id,
      'assignment.team.removed',
      jsonb_build_object('volunteer_user_id', v_real_user_id)
    );
    RETURN jsonb_build_object('ok', true, 'real_user_id', v_real_user_id);
  END IF;

  -- ─── 5. Validation : la position appartient bien à cet event
  IF NOT EXISTS (
    SELECT 1 FROM public.positions
    WHERE id = p_position_id AND event_id = p_event_id
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Position invalide pour cet event');
  END IF;

  -- ─── 6. Trouver un shift dans la position cible, ou en créer un par défaut
  SELECT id INTO v_target_shift_id
  FROM public.shifts
  WHERE position_id = p_position_id
  ORDER BY starts_at ASC
  LIMIT 1;

  IF v_target_shift_id IS NULL THEN
    SELECT starts_at, ends_at INTO v_event_starts, v_event_ends
    FROM public.events WHERE id = p_event_id;

    IF v_event_starts IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Event introuvable');
    END IF;

    INSERT INTO public.shifts (position_id, starts_at, ends_at, needs_count, notes)
    VALUES (
      p_position_id, v_event_starts, v_event_ends, 1,
      'Shift couverture totale créé via planning équipes'
    )
    RETURNING id INTO v_target_shift_id;
  END IF;

  -- ─── 7. Créer l'assignment (idempotent : si déjà présent, on n'écrase rien d'utile)
  INSERT INTO public.assignments (shift_id, volunteer_user_id, status, assigned_by)
  VALUES (v_target_shift_id, v_real_user_id, 'validated', p_actor_user_id)
  ON CONFLICT (shift_id, volunteer_user_id) DO UPDATE
    SET status = 'validated', assigned_by = EXCLUDED.assigned_by;

  -- ─── 8. Audit log assignment
  INSERT INTO public.audit_log (user_id, event_id, action, payload)
  VALUES (
    p_actor_user_id, p_event_id,
    'assignment.team.assigned',
    jsonb_build_object(
      'volunteer_user_id', v_real_user_id,
      'position_id', p_position_id,
      'shift_id', v_target_shift_id,
      'resolved_from', p_user_or_email
    )
  );

  RETURN jsonb_build_object('ok', true, 'real_user_id', v_real_user_id, 'shift_id', v_target_shift_id);
END;
$$;

COMMENT ON FUNCTION public.assign_volunteer_atomic(TEXT, UUID, UUID, UUID) IS
  'Bug #5 audit-extreme retest : assigne un bénévole (UUID ou pre-<email>) à une position en une seule transaction. Auto-crée la membership volunteer + le profil si pre-volunteer. Idempotent. Permission check direction|volunteer_lead.';

REVOKE ALL ON FUNCTION public.assign_volunteer_atomic(TEXT, UUID, UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_volunteer_atomic(TEXT, UUID, UUID, UUID) TO authenticated;
