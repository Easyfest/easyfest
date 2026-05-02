"use client";

import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  /** Délai avant déclenchement (ms). Défaut : 250ms (compatible iOS contextmenu). */
  delay?: number;
  /** Tolérance de mouvement avant annulation (px). Défaut : 12px. */
  tolerance?: number;
  /** Vibration haptique au déclenchement (ms). 0 pour désactiver. Défaut : 15ms. */
  haptic?: number;
  /** Empêche le menu contextuel natif (right-click, iOS hold). Défaut : true. */
  preventContextMenu?: boolean;
}

interface PressPoint {
  x: number;
  y: number;
}

/**
 * Hook universel d'appui long.
 *
 * - Déclenche `onLongPress` après `delay` ms si le pointeur ne bouge pas plus de `tolerance` px.
 * - Compatible souris, tactile, stylet (PointerEvents) + clic droit (ContextMenu) en raccourci PC.
 * - Vibration haptique sur appareils mobiles compatibles (Android Chrome).
 * - Bloque le menu natif si `preventContextMenu` (par défaut true).
 *
 * Spread les handlers retournés sur l'élément cible :
 *   const lp = useLongPress(() => openMenu(), { delay: 250 });
 *   <div {...lp.handlers} />
 */
export function useLongPress(
  onLongPress: (event: React.PointerEvent | React.MouseEvent) => void,
  options: UseLongPressOptions = {},
) {
  const { delay = 250, tolerance = 12, haptic = 15, preventContextMenu = true } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPointRef = useRef<PressPoint | null>(null);
  const triggeredRef = useRef(false);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPointRef.current = null;
  }, []);

  const fire = useCallback(
    (event: React.PointerEvent | React.MouseEvent) => {
      triggeredRef.current = true;
      if (haptic > 0 && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(haptic);
        } catch {
          /* ignore — Safari/iOS */
        }
      }
      onLongPress(event);
    },
    [haptic, onLongPress],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      // Ignorer clic droit côté pointer down (ContextMenu s'en occupe)
      if (event.button === 2) return;
      triggeredRef.current = false;
      startPointRef.current = { x: event.clientX, y: event.clientY };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fire(event), delay);
    },
    [delay, fire],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const start = startPointRef.current;
      if (!start) return;
      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      if (dx > tolerance || dy > tolerance) cancel();
    },
    [cancel, tolerance],
  );

  const onPointerUp = useCallback(() => cancel(), [cancel]);
  const onPointerCancel = useCallback(() => cancel(), [cancel]);
  const onPointerLeave = useCallback(() => cancel(), [cancel]);

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (preventContextMenu) event.preventDefault();
      // Si déjà déclenché par timer, ne pas re-fire
      if (triggeredRef.current) return;
      cancel();
      fire(event);
    },
    [cancel, fire, preventContextMenu],
  );

  return {
    /** Indique si l'appui long a été déclenché (lecture seule). */
    wasTriggered: () => triggeredRef.current,
    /** Annule manuellement le timer en cours. */
    cancel,
    /** Spread sur l'élément cible. */
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onContextMenu,
    },
  };
}
