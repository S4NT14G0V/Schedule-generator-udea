import { useCallback } from "react";
import toast from "react-hot-toast";
import { useMateriasStore } from "@/store/materias.store.js";
import { SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";
import { setNativeDragGhost } from "@/features/schedule/utils/dragGhost.js";
import { checkGroupConflictWithStore } from "@/features/schedule/utils/scheduleConflicts.js";

/**
 * Hook para encapsular la lógica de inicio y finalización del arrastre de materias desde el bloque de clase.
 */
export function useClassDrag({
  codigoMateria,
  materia,
  grupo,
  isEditing,
  isExploding,
  isPreview,
  manualId,
  dragEnabled,
  triggerShake,
  onLeave,
}) {
  const isDraggable =
    Boolean(codigoMateria || materia) &&
    !isEditing &&
    !isExploding &&
    !isPreview &&
    !manualId &&
    dragEnabled;

  const handleDragStart = useCallback(
    (e) => {
      if (!isDraggable) {
        e.preventDefault();
        return;
      }

      const state = useMateriasStore.getState();
      const mat =
        state.materias?.find((m) => String(m.codigo) === String(codigoMateria)) ||
        state.materias?.find((m) => m.nombre === materia);

      if (!mat || !mat.grupos || mat.grupos.length === 0) {
        e.preventDefault();
        return;
      }

      const grupoActual =
        grupo !== null && typeof grupo !== "undefined"
          ? grupo
          : state.gruposSeleccionados[mat.codigo];

      const availableGroups = (mat.grupos || []).filter((g) => {
        if (
          grupoActual !== null &&
          typeof grupoActual !== "undefined" &&
          String(g.numero) === String(grupoActual)
        ) {
          return false;
        }
        if (typeof g.cupoDisponible === "number" && g.cupoDisponible <= 0) {
          return false;
        }
        return !checkGroupConflictWithStore(g, mat.codigo, state);
      });

      if (availableGroups.length === 0) {
        e.preventDefault();
        triggerShake();
        toast.error(SCHEDULE_MESSAGES.NO_OTHER_HOURS_AVAILABLE);
        return;
      }

      onLeave?.();

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(mat.codigo));

      setNativeDragGhost(e, mat);

      setTimeout(() => {
        state.setDraggingMateria({
          codigo: mat.codigo,
          nombre: mat.nombre,
          grupos: mat.grupos,
        });
      }, 0);
    },
    [isDraggable, codigoMateria, materia, grupo, triggerShake, onLeave],
  );

  const handleDragEnd = useCallback(() => {
    const state = useMateriasStore.getState();
    const cod =
      codigoMateria ||
      state.draggingMateria?.codigo ||
      state.materias?.find((m) => m.nombre === materia)?.codigo;

    if (!state.lastDropSuccessful && cod) {
      if (Date.now() - (state.shakeTimestamp || 0) > 300) {
        state.triggerShakeMateria?.(cod);
      }
    }
    state.clearDragState?.();
  }, [codigoMateria, materia]);

  return {
    isDraggable,
    handleDragStart,
    handleDragEnd,
  };
}
