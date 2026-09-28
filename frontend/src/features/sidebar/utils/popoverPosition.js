import { POPOVER_CONFIG } from "@/features/sidebar/constants/sidebar.js";

/**
 * Calcula las coordenadas de posición de un popover anclado lateralmente a la derecha del aside.
 * Previene desbordamientos fuera de la pantalla (viewport).
 *
 * @param {HTMLElement} anchorEl - Elemento botón desencadenante
 * @param {number} estimatedHeight - Altura estimada del popover
 * @returns {{ top: number, left: number }} Coordenadas fijas
 */
export function getPopoverCoords(
  anchorEl,
  estimatedHeight = POPOVER_CONFIG.ESTIMATED_PREFERENCES_HEIGHT,
) {
  if (!anchorEl || typeof window === "undefined") {
    return { top: 60, left: 390 };
  }

  const btnRect = anchorEl.getBoundingClientRect();
  const aside = anchorEl.closest("aside");
  const asideRect = aside ? aside.getBoundingClientRect() : btnRect;

  const left = asideRect.right + POPOVER_CONFIG.ASIDE_GAP;
  const top = Math.max(
    POPOVER_CONFIG.VIEWPORT_MARGIN,
    Math.min(
      btnRect.top - 4,
      Math.max(
        POPOVER_CONFIG.VIEWPORT_MARGIN,
        window.innerHeight - estimatedHeight - POPOVER_CONFIG.BOTTOM_SAFETY_MARGIN,
      ),
    ),
  );

  return { top, left };
}
