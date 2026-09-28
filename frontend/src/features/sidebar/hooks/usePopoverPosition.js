import { useState, useLayoutEffect } from "react";
import { getPopoverCoords } from "@/features/sidebar/utils/popoverPosition.js";
import { POPOVER_CONFIG } from "@/features/sidebar/constants/sidebar.js";

/**
 * Hook para posicionar dinámicamente un popover fijado al lateral derecho del sidebar,
 * sincronizándose reactivamente con el scroll y el redimensionamiento de ventana.
 */
export function usePopoverPosition(
  anchorRef,
  isOpen,
  isMobile,
  estimatedHeight = POPOVER_CONFIG.ESTIMATED_PREFERENCES_HEIGHT,
) {
  const [coords, setCoords] = useState(null);

  useLayoutEffect(() => {
    if (!isOpen || isMobile) return;

    const updatePosition = () => {
      if (!anchorRef?.current) return;
      setCoords(getPopoverCoords(anchorRef.current, estimatedHeight));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, isMobile, anchorRef, estimatedHeight]);

  return coords;
}
