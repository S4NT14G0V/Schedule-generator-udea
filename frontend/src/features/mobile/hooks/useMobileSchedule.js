import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DIAS } from "@/features/schedule/constants/schedule.js";
import { useMateriasStore } from "@/store/materias.store.js";
import {
  buildCurrentClasses,
  buildMiniScheduleBlocks,
  calculateClassCountByDay,
} from "../utils/mobileSchedule.js";

/**
 * Hook para gestionar el estado, navegación y sincronización de la vista móvil del horario.
 */
export function useMobileSchedule() {
  const [activeDay, setActiveDay] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedBlockDetails, setSelectedBlockDetails] = useState(null);
  const [showMiniPreviewPopup, setShowMiniPreviewPopup] = useState(false);

  const scrollContainerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const isFirstMountRef = useRef(true);

  const {
    materias,
    gruposSeleccionados,
    horariosGenerados,
    horarioActualIndex,
    setHorarioActualIndex,
    manualBlocks,
    deleteMateriaFromSchedule,
    removeManualBlock,
    setMobileActiveView,
  } = useMateriasStore();

  const isManualMode =
    (!horariosGenerados || horariosGenerados.length === 0) &&
    Boolean(gruposSeleccionados) &&
    Object.keys(gruposSeleccionados).length > 0;

  // Lista unificada de clases
  const allCurrentClasses = useMemo(() => {
    return buildCurrentClasses({
      isManualMode,
      materias,
      gruposSeleccionados,
      horariosGenerados,
      horarioActualIndex,
      manualBlocks,
    });
  }, [
    isManualMode,
    materias,
    gruposSeleccionados,
    horariosGenerados,
    horarioActualIndex,
    manualBlocks,
  ]);

  // Clases del día seleccionado ordenadas por hora
  const classesForActiveDay = useMemo(() => {
    return allCurrentClasses
      .filter((c) => c.diaIndex === activeDay)
      .sort((a, b) => a.horaInicio - b.horaInicio);
  }, [allCurrentClasses, activeDay]);

  // Conteo de clases por día
  const classCountByDay = useMemo(() => {
    return calculateClassCountByDay(allCurrentClasses);
  }, [allCurrentClasses]);

  // Mini bloques para la previsualización emergente al cambiar de horario
  const popupMiniBlocks = useMemo(() => {
    return buildMiniScheduleBlocks({
      isManualMode: false,
      materias,
      gruposSeleccionados,
      horariosGenerados,
      horarioActualIndex,
      manualBlocks,
    });
  }, [materias, gruposSeleccionados, horariosGenerados, horarioActualIndex, manualBlocks]);

  const popupTotalDays = useMemo(() => {
    const hasSunday = popupMiniBlocks.some((b) => b.diaIndex === 6);
    return hasSunday ? 7 : 6;
  }, [popupMiniBlocks]);

  // Navegación de día
  const goToDay = useCallback(
    (idx) => {
      setDirection(idx > activeDay ? 1 : -1);
      setActiveDay(idx);
    },
    [activeDay],
  );

  // Swipe gesture
  const handleDragEnd = useCallback(
    (event, info) => {
      const threshold = 45;
      const velocityThreshold = 350;

      if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
        if (activeDay > 0) {
          setDirection(-1);
          setActiveDay((prev) => prev - 1);
        }
      } else if (
        info.offset.x < -threshold ||
        info.velocity.x < -velocityThreshold
      ) {
        if (activeDay < DIAS.length - 1) {
          setDirection(1);
          setActiveDay((prev) => prev + 1);
        }
      }
    },
    [activeDay],
  );

  // Reset de scroll al cambiar de día o de horario
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeDay, horarioActualIndex]);

  // Previsualizador emergente al cambiar de horario generado
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (horariosGenerados && horariosGenerados.length > 1) {
      const showTimer = setTimeout(() => setShowMiniPreviewPopup(true), 0);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = setTimeout(() => {
        setShowMiniPreviewPopup(false);
      }, 2000);

      return () => {
        clearTimeout(showTimer);
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }
      };
    }
  }, [horarioActualIndex, horariosGenerados]);

  const handlePreviousSchedule = useCallback(() => {
    if (!horariosGenerados || horariosGenerados.length <= 1) return;
    const nextIdx =
      horarioActualIndex > 0
        ? horarioActualIndex - 1
        : horariosGenerados.length - 1;
    setHorarioActualIndex(nextIdx);
  }, [horariosGenerados, horarioActualIndex, setHorarioActualIndex]);

  const handleNextSchedule = useCallback(() => {
    if (!horariosGenerados || horariosGenerados.length <= 1) return;
    const nextIdx =
      horarioActualIndex < horariosGenerados.length - 1
        ? horarioActualIndex + 1
        : 0;
    setHorarioActualIndex(nextIdx);
  }, [horariosGenerados, horarioActualIndex, setHorarioActualIndex]);

  const handleBackToMaterias = useCallback(() => {
    setMobileActiveView("sidebar");
  }, [setMobileActiveView]);

  const handleDeleteBlock = useCallback(
    (block) => {
      if (!block) return;
      if (block.codigoMateria) {
        deleteMateriaFromSchedule?.(block.codigoMateria);
      } else if (block.manualId) {
        removeManualBlock?.(block.manualId);
      }
      setSelectedBlockDetails(null);
    },
    [deleteMateriaFromSchedule, removeManualBlock],
  );

  return {
    activeDay,
    direction,
    scrollContainerRef,
    isManualMode,
    allCurrentClasses,
    classesForActiveDay,
    classCountByDay,
    selectedBlockDetails,
    setSelectedBlockDetails,
    showMiniPreviewPopup,
    setShowMiniPreviewPopup,
    popupMiniBlocks,
    popupTotalDays,
    horariosGenerados,
    horarioActualIndex,
    goToDay,
    handleDragEnd,
    handlePreviousSchedule,
    handleNextSchedule,
    handleBackToMaterias,
    handleDeleteBlock,
  };
}
