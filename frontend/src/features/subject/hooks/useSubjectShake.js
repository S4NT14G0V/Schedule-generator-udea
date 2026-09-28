import { useEffect, useRef, useCallback } from "react";
import { useAnimationControls } from "framer-motion";
import { useMateriasStore } from "@/store/materias.store.js";

/**
 * Hook para controlar la animación de sacudida (shake) en la tarjeta de materia
 * ante errores, conflictos de horario o intentos de arrastre no válidos.
 */
export function useSubjectShake(materiaCodigo) {
  const shakeControls = useAnimationControls();
  const shakeMateriaCodigo = useMateriasStore((s) => s.shakeMateriaCodigo);
  const shakeTimestamp = useMateriasStore((s) => s.shakeTimestamp);
  const lastShakeTimestampRef = useRef(shakeTimestamp || 0);

  const triggerShake = useCallback(() => {
    shakeControls.set({ x: 0 });
    shakeControls.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.45, ease: "easeInOut" },
    });
  }, [shakeControls]);

  useEffect(() => {
    if (
      shakeTimestamp &&
      shakeTimestamp !== lastShakeTimestampRef.current &&
      shakeMateriaCodigo &&
      String(shakeMateriaCodigo) === String(materiaCodigo)
    ) {
      lastShakeTimestampRef.current = shakeTimestamp;
      triggerShake();
    }
  }, [shakeMateriaCodigo, shakeTimestamp, materiaCodigo, triggerShake]);

  return {
    shakeControls,
    triggerShake,
  };
}
