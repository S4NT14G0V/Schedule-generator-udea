import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useMateriasStore } from "@/store/materias.store.js";
import { ANIMATION_DURATIONS, SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";

/**
 * Hook para orquestar la animación de limpieza en cascada/efecto dominó del horario.
 */
export function useScheduleClearAnimation({
  clasesParaRenderizar,
  onClearStart,
}) {
  const [clearingExplosions, setClearingExplosions] = useState(() => new Set());
  const [isClearingSequence, setIsClearingSequence] = useState(false);

  const {
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    clearManualBlocks,
    clearAllowManualBlocksBySchedule,
    triggerClearScheduleSequence,
  } = useMateriasStore();

  const handleClearSchedule = useCallback(() => {
    if (isClearingSequence) return;

    if (!clasesParaRenderizar || clasesParaRenderizar.length === 0) {
      resetMateriasSeleccionadas();
      clearHorariosGenerados();
      clearManualBlocks();
      clearAllowManualBlocksBySchedule();
      toast.success(SCHEDULE_MESSAGES.SCHEDULE_CLEARED);
      return;
    }

    setIsClearingSequence(true);
    onClearStart?.();

    // Obtener keys únicas de todos los bloques a explotar en orden
    const blockKeys = clasesParaRenderizar.map((clase) =>
      clase.manualId
        ? `manual-${clase.manualId}`
        : `block-${clase.codigoMateria || clase.materia}-d${clase.diaIndex}-h${clase.horaIndex}-${clase.duracion}-g${clase.grupo || "0"}`,
    );

    const count = blockKeys.length;
    const stagger = Math.min(
      ANIMATION_DURATIONS.EXPLOSION_STAGGER_MAX_MS,
      Math.max(ANIMATION_DURATIONS.EXPLOSION_STAGGER_MIN_MS, 600 / count),
    );

    blockKeys.forEach((key, index) => {
      setTimeout(() => {
        setClearingExplosions((prev) => {
          const next = new Set(prev);
          next.add(key);
          return next;
        });
      }, index * stagger);
    });

    const totalTime = count * stagger + ANIMATION_DURATIONS.CLEAR_TOTAL_BUFFER_MS;
    setTimeout(() => {
      resetMateriasSeleccionadas();
      clearHorariosGenerados();
      clearManualBlocks();
      clearAllowManualBlocksBySchedule();
      setClearingExplosions(new Set());
      setIsClearingSequence(false);
      toast.success(SCHEDULE_MESSAGES.SCHEDULE_CLEARED);
    }, totalTime);
  }, [
    isClearingSequence,
    clasesParaRenderizar,
    onClearStart,
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    clearManualBlocks,
    clearAllowManualBlocksBySchedule,
  ]);

  const lastClearTriggerRef = useRef(triggerClearScheduleSequence || 0);

  useEffect(() => {
    if (
      triggerClearScheduleSequence &&
      triggerClearScheduleSequence !== lastClearTriggerRef.current
    ) {
      lastClearTriggerRef.current = triggerClearScheduleSequence;
      const timer = setTimeout(() => {
        handleClearSchedule();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [triggerClearScheduleSequence, handleClearSchedule]);

  return {
    clearingExplosions,
    isClearingSequence,
    handleClearSchedule,
  };
}
