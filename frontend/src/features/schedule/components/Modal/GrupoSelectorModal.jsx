import { useEffect, useMemo, useCallback } from "react";
import { useScheduleContext } from "@/features/schedule/context/ScheduleContext.jsx";
import { useMateriasStore } from "@/store/materias.store.js";
import { GrupoSelectorCard } from "./GrupoSelectorCard.jsx";
import { SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";

/**
 * Modal que aparece cuando hay múltiples grupos con el mismo horario.
 * Permite al usuario seleccionar cuál grupo quiere agregar sin conflictos.
 */
export default function GrupoSelectorModal() {
  const {
    showGrupoSelector,
    gruposConflicto,
    draggingMateria,
    selectGrupo,
    toggleMateriaSelected,
    gruposSeleccionados,
    setShowGrupoSelector,
    clearDragState,
    materias,
  } = useMateriasStore();

  const { checkGrupoConflict, showToastMessage } = useScheduleContext();

  const gruposSinConflicto = useMemo(() => {
    if (!showGrupoSelector || !draggingMateria) return [];

    return (gruposConflicto || []).filter((grupo) => {
      if (typeof grupo.cupoDisponible === "number" && grupo.cupoDisponible <= 0) {
        return false;
      }

      const materiaOriginal = (materias || []).find(
        (m) => String(m.codigo) === String(draggingMateria.codigo),
      );
      if (!materiaOriginal) return true;

      const grupoActual =
        gruposSeleccionados[draggingMateria.codigo] ||
        gruposSeleccionados[String(draggingMateria.codigo)];

      return !checkGrupoConflict(materiaOriginal, grupo, grupoActual);
    });
  }, [
    showGrupoSelector,
    draggingMateria,
    gruposConflicto,
    materias,
    gruposSeleccionados,
    checkGrupoConflict,
  ]);

  const resetModalState = useCallback(
    (lastDropSuccessful = false) => {
      setShowGrupoSelector(false, []);
      useMateriasStore.setState({
        draggingMateria: null,
        hoveredScheduleCell: null,
        availableHorarios: [],
        previewGrupo: null,
        showGrupoSelector: false,
        gruposConflicto: [],
        pendingModal: false,
        lastDropSuccessful,
      });
    },
    [setShowGrupoSelector],
  );

  const handleSelectGrupo = useCallback(
    (numeroGrupo) => {
      if (!draggingMateria) return;

      selectGrupo(draggingMateria.codigo, numeroGrupo);

      const isSelected = gruposSeleccionados[draggingMateria.codigo];
      if (!isSelected) {
        toggleMateriaSelected(draggingMateria.codigo);
      }

      resetModalState(true);
    },
    [
      draggingMateria,
      selectGrupo,
      gruposSeleccionados,
      toggleMateriaSelected,
      resetModalState,
    ],
  );

  const handleCancel = useCallback(() => {
    const cod = draggingMateria?.codigo;
    if (cod) {
      useMateriasStore.getState().triggerShakeMateria?.(cod);
    }
    resetModalState(false);
  }, [draggingMateria, resetModalState]);

  useEffect(() => {
    if (!showGrupoSelector) return;

    if (gruposSinConflicto.length === 1 && draggingMateria) {
      handleSelectGrupo(gruposSinConflicto[0].numero);
    } else if ((gruposConflicto || []).length > 0 && gruposSinConflicto.length === 0) {
      if (showToastMessage) {
        showToastMessage(`⚠️ ${SCHEDULE_MESSAGES.NO_GROUPS_WITHOUT_CONFLICT}`);
      }
      setShowGrupoSelector(false, []);
      clearDragState();
    }
  }, [
    showGrupoSelector,
    gruposSinConflicto,
    gruposConflicto,
    draggingMateria,
    showToastMessage,
    setShowGrupoSelector,
    clearDragState,
    handleSelectGrupo,
  ]);

  if (!showGrupoSelector || gruposSinConflicto.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
      style={{ zIndex: 99999, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        style={{ zIndex: 100000 }}
      >
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
            Seleccionar Grupo
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Hay múltiples grupos disponibles para{" "}
            <span className="font-semibold text-primary">
              {draggingMateria?.nombre}
            </span>{" "}
            en este horario
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {gruposSinConflicto.map((grupo, idx) => {
            const isSelected =
              draggingMateria &&
              gruposSeleccionados[draggingMateria.codigo] === grupo.numero;

            return (
              <GrupoSelectorCard
                key={grupo.numero ?? idx}
                grupo={grupo}
                idx={idx}
                isSelected={Boolean(isSelected)}
                onSelectGrupo={handleSelectGrupo}
              />
            );
          })}
        </div>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
