import { useState, useRef, useMemo, useCallback, memo } from "react";
import toast from "react-hot-toast";
import { useMateriasStore } from "@/store/materias.store.js";
import { GENERATION_MODES } from "@/features/sidebar/constants/sidebar.js";
import {
  calculateSubjectCupos,
  checkAllGroupsConflicted,
} from "./utils/subjectConflicts.js";
import { useSubjectShake } from "./hooks/useSubjectShake.js";
import { useSubjectFocus } from "./hooks/useSubjectFocus.js";
import { useSubjectDrag } from "./hooks/useSubjectDrag.js";

import { SubjectCard } from "./components/SubjectCard.jsx";
import { SubjectHeader } from "./components/SubjectHeader.jsx";
import { SubjectGroupList } from "./components/SubjectGroupList.jsx";

function SubjectComponent({
  materia,
  generationMode,
  dragEnabled = true,
  activeFilters = {},
  occupiedScheduleCells,
  occupiedManualCells,
}) {
  const materiaCodigo = materia?.codigo ? String(materia.codigo) : "";

  // Selectores atómicos: SOLO se re-renderizan si cambia el estado puntual de esta materia
  const isSelected = useMateriasStore(
    (s) =>
      Boolean(s.materiasSeleccionadas?.[materiaCodigo]) ||
      Boolean(s.materiasSeleccionadas?.[materia?.codigo]),
  );
  const grupoSeleccionado = useMateriasStore(
    (s) =>
      s.gruposSeleccionados?.[materiaCodigo] ??
      s.gruposSeleccionados?.[materia?.codigo],
  );
  const isExpanded = useMateriasStore((s) =>
    Boolean(s.expandedSubjects?.[materiaCodigo]),
  );

  const toggleSubjectExpanded = useMateriasStore(
    (s) => s.toggleSubjectExpanded,
  );
  const toggleMateriaSelected = useMateriasStore(
    (s) => s.toggleMateriaSelected,
  );
  const selectGrupo = useMateriasStore((s) => s.selectGrupo);
  const draggingMateria = useMateriasStore((s) => s.draggingMateria);
  const hoverPreviewEnabled = useMateriasStore((s) => s.hoverPreviewEnabled);
  const setHoveredMateria = useMateriasStore((s) => s.setHoveredMateria);
  const clearHoveredMateria = useMateriasStore((s) => s.clearHoveredMateria);

  const [showSelectParticles, setShowSelectParticles] = useState(false);
  const [showGroupParticles, setShowGroupParticles] = useState(null);
  const grupoRefs = useRef({});

  // Hooks especializados
  const { shakeControls, triggerShake } = useSubjectShake(materiaCodigo);
  const { isHighlighted, highlightedGrupo, centerFocusedGrupo } =
    useSubjectFocus(materiaCodigo, grupoRefs);

  const isManualMode = generationMode === GENERATION_MODES.MANUAL;

  const { totalGrupos, gruposConCupo, hasZeroCuposGlobally } = useMemo(
    () => calculateSubjectCupos(materia),
    [materia],
  );

  const hasAllGroupsConflicted = useMemo(
    () =>
      checkAllGroupsConflicted(
        materia,
        isManualMode,
        grupoSeleccionado,
        hasZeroCuposGlobally,
        occupiedScheduleCells,
        occupiedManualCells,
      ),
    [
      materia,
      isManualMode,
      grupoSeleccionado,
      hasZeroCuposGlobally,
      occupiedScheduleCells,
      occupiedManualCells,
    ],
  );

  const { handleDragStart, handleDragEnd } = useSubjectDrag({
    materia,
    isManualMode,
    hasZeroCuposGlobally,
    grupoSeleccionado,
    triggerShake,
  });

  const handleToggleSelect = useCallback(() => {
    if (!materiaCodigo) return;
    const willBeSelected = !isSelected;
    toggleMateriaSelected(materiaCodigo);

    if (willBeSelected) {
      setShowSelectParticles(true);
      setTimeout(() => setShowSelectParticles(false), 500);
    } else {
      toggleSubjectExpanded?.(materiaCodigo, false);
    }
  }, [materiaCodigo, isSelected, toggleMateriaSelected, toggleSubjectExpanded]);

  const handleGrupoSelectCallback = useCallback(
    (numeroGrupo, tieneConflicto) => {
      if (grupoSeleccionado === numeroGrupo) {
        selectGrupo(materiaCodigo, null);
        toggleMateriaSelected(materiaCodigo);
        return;
      }

      if (tieneConflicto) {
        triggerShake();
        toast.error("Conflicto con otra materia en el horario");
        return;
      }

      selectGrupo(materiaCodigo, numeroGrupo);
      setShowGroupParticles(numeroGrupo);
      setTimeout(() => setShowGroupParticles(null), 500);

      if (!isSelected) {
        toggleMateriaSelected(materiaCodigo);
      }
    },
    [
      grupoSeleccionado,
      materiaCodigo,
      selectGrupo,
      toggleMateriaSelected,
      triggerShake,
      isSelected,
    ],
  );

  const isCardActive =
    (isManualMode && grupoSeleccionado) || (!isManualMode && isSelected);
  const isAutomaticDisabled = !isManualMode && hasZeroCuposGlobally;

  const handleMouseEnter = useCallback(() => {
    if (!hoverPreviewEnabled || draggingMateria) return;
    setHoveredMateria(materia);
  }, [hoverPreviewEnabled, draggingMateria, materia, setHoveredMateria]);

  const handleMouseLeave = useCallback(() => {
    if (!hoverPreviewEnabled || draggingMateria) return;
    clearHoveredMateria();
  }, [hoverPreviewEnabled, draggingMateria, clearHoveredMateria]);

  const handleGroupHover = useCallback(
    (numeroGrupo) => {
      if (!hoverPreviewEnabled || draggingMateria) return;
      if (numeroGrupo) {
        setHoveredMateria(materia, numeroGrupo);
      } else {
        setHoveredMateria(materia, null);
      }
    },
    [hoverPreviewEnabled, draggingMateria, materia, setHoveredMateria],
  );

  return (
    <SubjectCard
      materiaCodigo={materiaCodigo}
      shakeControls={shakeControls}
      isAutomaticDisabled={isAutomaticDisabled}
      isHighlighted={isHighlighted}
      isCardActive={isCardActive}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SubjectHeader
        materia={materia}
        isManualMode={isManualMode}
        dragEnabled={dragEnabled}
        isExpanded={isExpanded}
        onToggleExpand={() => toggleSubjectExpanded?.(materiaCodigo)}
        isSelected={isSelected}
        onToggleSelect={handleToggleSelect}
        grupoSeleccionado={grupoSeleccionado}
        gruposConCupo={gruposConCupo}
        totalGrupos={totalGrupos}
        hasZeroCuposGlobally={hasZeroCuposGlobally}
        hasAllGroupsConflicted={hasAllGroupsConflicted}
        isAutomaticDisabled={isAutomaticDisabled}
        showSelectParticles={showSelectParticles}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      <SubjectGroupList
        materia={materia}
        grupoSeleccionado={grupoSeleccionado}
        highlightedGrupo={highlightedGrupo}
        activeFilters={activeFilters}
        grupoRefs={grupoRefs}
        onGrupoSelect={handleGrupoSelectCallback}
        onGroupHover={handleGroupHover}
        showGroupParticles={showGroupParticles}
        occupiedScheduleCells={occupiedScheduleCells}
        occupiedManualCells={occupiedManualCells}
        isManualMode={isManualMode}
        dragEnabled={dragEnabled}
        isExpanded={isExpanded}
        centerFocusedGrupo={centerFocusedGrupo}
      />
    </SubjectCard>
  );
}

export const Subject = memo(SubjectComponent, (prev, next) => {
  return (
    prev.materia?.codigo === next.materia?.codigo &&
    prev.generationMode === next.generationMode &&
    prev.dragEnabled === next.dragEnabled &&
    prev.activeFilters === next.activeFilters &&
    prev.occupiedScheduleCells === next.occupiedScheduleCells &&
    prev.occupiedManualCells === next.occupiedManualCells
  );
});

export default Subject;
