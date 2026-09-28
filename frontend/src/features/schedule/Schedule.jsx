import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { ScheduleProvider } from "@/features/schedule/context/ScheduleContext.jsx";
import { ScheduleGrid } from "@/features/schedule/components/Grid/ScheduleGrid.jsx";
import { ScheduleDeleteZone } from "@/features/schedule/components/TrashZone/ScheduleDeleteZone.jsx";
import { ClassTooltip } from "@/features/schedule/components/Tooltip/ClassTooltip.jsx";
import { ScheduleToolbar } from "@/features/schedule/components/Toolbar/ScheduleToolbar.jsx";
import GrupoSelectorModal from "@/features/schedule/components/Modal/GrupoSelectorModal.jsx";

import { useScheduleExport } from "@/features/schedule/hooks/useScheduleExport.js";
import { useScheduleSelection } from "@/features/schedule/hooks/useScheduleSelection.js";
import { useScheduleClearAnimation } from "@/features/schedule/hooks/useScheduleClearAnimation.js";
import { useScheduleClasses } from "@/features/schedule/hooks/useScheduleClasses.js";

import { useMateriasStore } from "@/store/materias.store.js";
import {
  ANIMATION_DURATIONS,
  TOOLTIP_CONFIG,
  SCHEDULE_MESSAGES,
} from "@/features/schedule/constants/schedule.js";
import { groupHasConflict, validateDropTarget } from "@/features/schedule/utils/scheduleConflicts.js";
import {
  hasActiveFilters,
  checkGrupoMatchesFilter,
} from "@/features/subject/utils/subjectConflicts.js";

export default function Schedule() {
  const {
    horariosGenerados = [],
    horarioActualIndex = 0,
    setHorarioActualIndex,
    gruposSeleccionados = {},
    materiasSeleccionadas = {},
    draggingMateria,
    hoverPreviewEnabled,
    activeFilters = {},
    hoveredMateria,
    hoveredGrupo,
    setAvailableHorarios,
    selectGrupo,
    toggleMateriaSelected,
    setShowGrupoSelector,
    clearDragState,
    darkTheme,
    toggleDarkTheme,
    allowManualBlocks,
    allowManualBlocksBySchedule,
    manualBlocks = [],
    addManualBlock,
    removeManualBlock,
    renameManualBlock,
    deleteMateriaFromSchedule,
  } = useMateriasStore();

  const [editingManualId, setEditingManualId] = useState(null);
  const [explodingCodigo, setExplodingCodigo] = useState(null);
  const [explodingManualId, setExplodingManualId] = useState(null);

  const [tooltipState, setTooltipState] = useState(null);
  const hideTimeoutRef = useRef(null);

  const scheduleRef = useRef(null);
  const gridRef = useRef(null);
  const previewRef = useRef(null);

  const effectiveAllowManualBlocks =
    horariosGenerados && horariosGenerados.length > 0
      ? Boolean(
          allowManualBlocksBySchedule &&
          allowManualBlocksBySchedule[horarioActualIndex],
        )
      : Boolean(allowManualBlocks);

  const { clasesParaRenderizar, celdasOcupadas, celdasMateria } =
    useScheduleClasses();

  const { exporting, handleExportPNG, handleExportPDF } =
    useScheduleExport(scheduleRef);

  const { handleMouseDown } = useScheduleSelection({
    gridRef,
    previewRef,
    effectiveAllowManualBlocks,
    celdasOcupadas,
    manualBlocks,
    horariosGenerados,
    horarioActualIndex,
    addManualBlock,
    editingManualId,
    setEditingManualId,
  });

  const { clearingExplosions, isClearingSequence, handleClearSchedule } =
    useScheduleClearAnimation({
      clasesParaRenderizar,
      onClearStart: () => setTooltipState(null),
    });

  const handleDeleteSubjectWithAnimation = useCallback(
    (codigoMateria) => {
      if (!codigoMateria) return;
      setExplodingCodigo(codigoMateria);
      setTimeout(() => {
        deleteMateriaFromSchedule(codigoMateria);
        setExplodingCodigo(null);
      }, ANIMATION_DURATIONS.EXPLOSION_DELETE_MS);
    },
    [deleteMateriaFromSchedule],
  );

  const handleDeleteManualBlockWithAnimation = useCallback(
    (manualId) => {
      if (!manualId) return;
      setExplodingManualId(manualId);
      setTimeout(() => {
        removeManualBlock(manualId);
        setExplodingManualId(null);
        toast.success(SCHEDULE_MESSAGES.MANUAL_BLOCK_DELETED);
      }, ANIMATION_DURATIONS.EXPLOSION_DELETE_MS);
    },
    [removeManualBlock],
  );

  const hasContentToClear = useMemo(() => {
    return (
      !isClearingSequence &&
      ((horariosGenerados && horariosGenerados.length > 0) ||
        (manualBlocks && manualBlocks.length > 0) ||
        (gruposSeleccionados &&
          Object.values(gruposSeleccionados).some(
            (v) => v !== null && v !== undefined,
          )) ||
        (materiasSeleccionadas && Object.keys(materiasSeleccionadas).length > 0))
    );
  }, [
    isClearingSequence,
    horariosGenerados,
    manualBlocks,
    gruposSeleccionados,
    materiasSeleccionadas,
  ]);

  const handleClassHover = useCallback(
    (clase, position) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const spaceAbove = position.y;
      const spaceRight = window.innerWidth - (position.x + position.width);

      const finalPosition = {
        ...position,
        placement:
          spaceAbove < TOOLTIP_CONFIG.MIN_SPACE_ABOVE &&
          spaceRight > TOOLTIP_CONFIG.MIN_SPACE_RIGHT
            ? "right"
            : "top",
      };

      setTooltipState({
        clase,
        position: finalPosition,
        horarioIndex: horarioActualIndex,
      });
    },
    [horarioActualIndex],
  );

  const handleClassLeave = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setTooltipState(null);
    }, TOOLTIP_CONFIG.HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!tooltipState) return;

    const clearTooltip = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setTooltipState(null);
    };

    window.addEventListener("scroll", clearTooltip, true);
    window.addEventListener("resize", clearTooltip);
    window.addEventListener("blur", clearTooltip);
    window.addEventListener("pointerdown", clearTooltip);

    return () => {
      window.removeEventListener("scroll", clearTooltip, true);
      window.removeEventListener("resize", clearTooltip);
      window.removeEventListener("blur", clearTooltip);
      window.removeEventListener("pointerdown", clearTooltip);
    };
  }, [tooltipState]);

  const activeTooltip = useMemo(() => {
    if (!tooltipState || draggingMateria) return null;
    if (
      tooltipState.horarioIndex !== undefined &&
      tooltipState.horarioIndex !== horarioActualIndex
    ) {
      return null;
    }
    return tooltipState;
  }, [tooltipState, draggingMateria, horarioActualIndex]);

  const calculatedAvailableHorarios = useMemo(() => {
    const targetMateria = draggingMateria || (hoverPreviewEnabled ? hoveredMateria : null);
    if (!targetMateria) return [];

    const grupoActual =
      gruposSeleccionados[targetMateria.codigo] ||
      gruposSeleccionados[String(targetMateria.codigo)];

    const hasFilters = hasActiveFilters(activeFilters);
    const todosLosHorarios = [];

    (targetMateria.grupos || []).forEach((grupo) => {
      if (hoveredGrupo && String(grupo.numero) !== String(hoveredGrupo)) return;
      if (grupoActual && String(grupo.numero) === String(grupoActual)) return;
      if (typeof grupo.cupoDisponible === "number" && grupo.cupoDisponible <= 0) return;
      if (groupHasConflict(grupo, targetMateria.codigo, celdasMateria)) return;

      const isFilteredMatch =
        hasFilters && checkGrupoMatchesFilter(grupo, activeFilters);

      (grupo.horarios || []).forEach((horario) => {
        todosLosHorarios.push({
          ...horario,
          numeroGrupo: grupo.numero,
          isFilteredMatch,
        });
      });
    });
    return todosLosHorarios;
  }, [
    draggingMateria,
    hoverPreviewEnabled,
    hoveredMateria,
    hoveredGrupo,
    celdasMateria,
    gruposSeleccionados,
    activeFilters,
  ]);

  useEffect(() => {
    setAvailableHorarios(calculatedAvailableHorarios);
  }, [calculatedAvailableHorarios, setAvailableHorarios]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
  }, []);

  const handleDrop = useCallback(
    (e, diaIndex, horaIndex, overrideMateria = null) => {
      if (e?.preventDefault) e.preventDefault();
      if (e?.stopPropagation) e.stopPropagation();

      const storeState = useMateriasStore.getState();
      const currentDragging =
        overrideMateria || storeState.draggingMateria || draggingMateria;

      if (!currentDragging) return false;

      const validation = validateDropTarget({
        currentDragging,
        diaIndex,
        horaIndex,
        storeState,
        celdasMateria,
      });

      if (!validation.isValid) {
        storeState.triggerShakeMateria?.(currentDragging.codigo);
        if (validation.errorMessage) {
          toast.error(validation.errorMessage);
        }
        clearDragState();
        return false;
      }

      const { grupos: gruposEnEstaCelda } = validation;

      if (gruposEnEstaCelda.length > 1) {
        useMateriasStore.setState({
          draggingMateria: currentDragging,
          lastDropSuccessful: true,
        });
        setShowGrupoSelector(true, gruposEnEstaCelda);
        return true;
      }

      if (gruposEnEstaCelda.length === 1) {
        const grupo = gruposEnEstaCelda[0];
        useMateriasStore.setState({ lastDropSuccessful: true });
        selectGrupo(currentDragging.codigo, grupo.numero);
        if (!storeState.gruposSeleccionados[currentDragging.codigo]) {
          toggleMateriaSelected(currentDragging.codigo);
        }
        clearDragState();
        return true;
      }

      return false;
    },
    [
      draggingMateria,
      celdasMateria,
      clearDragState,
      setShowGrupoSelector,
      selectGrupo,
      toggleMateriaSelected,
    ],
  );

  return (
    <ScheduleProvider
      celdasMateria={celdasMateria}
      showToastMessage={(msg) => toast(msg)}
    >
      <div className="flex-1 h-full flex flex-col bg-white dark:bg-zinc-950 relative overflow-hidden select-none">
        <div
          ref={scheduleRef}
          data-schedule-export
          className="flex-1 flex flex-col overflow-hidden relative"
        >
          <ScheduleGrid
            gridRef={gridRef}
            previewRef={previewRef}
            clasesParaRenderizar={clasesParaRenderizar}
            draggingMateria={draggingMateria}
            hoveredMateria={hoverPreviewEnabled ? hoveredMateria : null}
            availableHorarios={calculatedAvailableHorarios}
            celdasMateria={celdasMateria}
            isClearingSequence={isClearingSequence}
            clearingExplosions={clearingExplosions}
            explodingCodigo={explodingCodigo}
            explodingManualId={explodingManualId}
            editingManualId={editingManualId}
            setEditingManualId={setEditingManualId}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onMouseDown={handleMouseDown}
            onClassHover={handleClassHover}
            onClassLeave={handleClassLeave}
            onDeleteManualBlock={handleDeleteManualBlockWithAnimation}
            onDeleteSubject={handleDeleteSubjectWithAnimation}
            onRenameManualBlock={renameManualBlock}
          />

          <ScheduleDeleteZone
            draggingMateria={draggingMateria}
            onDeleteMateria={deleteMateriaFromSchedule}
            onClearDragState={clearDragState}
          />

          {activeTooltip && (
            <ClassTooltip
              clase={activeTooltip.clase}
              color={activeTooltip.clase.color}
              position={activeTooltip.position}
            />
          )}
        </div>

        <ScheduleToolbar
          exporting={exporting}
          onExportPNG={handleExportPNG}
          onExportPDF={handleExportPDF}
          horariosGenerados={horariosGenerados}
          horarioActualIndex={horarioActualIndex}
          onSetHorarioActualIndex={setHorarioActualIndex}
          onClearSchedule={handleClearSchedule}
          hasContentToClear={hasContentToClear}
          darkTheme={darkTheme}
          onToggleDarkTheme={toggleDarkTheme}
        />

        <GrupoSelectorModal />
      </div>
    </ScheduleProvider>
  );
}
