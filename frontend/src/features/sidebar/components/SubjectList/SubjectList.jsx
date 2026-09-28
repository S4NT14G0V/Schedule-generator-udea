import { useState, useRef, useMemo, useCallback, memo } from "react";
import { useMateriasStore } from "@/store/materias.store.js";
import { GENERATION_MODES } from "@/features/sidebar/constants/sidebar.js";
import {
  filterSubjects,
  groupSubjectsByLetter,
  calculateOccupiedScheduleCells,
  calculateOccupiedManualCells,
} from "@/features/sidebar/utils/filterSubjects.js";
import { useAlphabetScroll } from "@/features/sidebar/hooks/useAlphabetScroll.js";

import { SearchBar } from "@/features/sidebar/components/Search/SearchBar.jsx";
import { QuickFilterTabs } from "@/features/sidebar/components/Navigation/QuickFilterTabs.jsx";
import { AlphabetSidebar } from "@/features/sidebar/components/Navigation/AlphabetSidebar.jsx";
import { SubjectSection } from "./SubjectSection.jsx";

function SubjectListComponent({
  materiasFiltradas = [],
  searchTerm,
  onSearchChange,
  onClearSearch,
  generationMode,
  dragEnabled,
  setDragEnabled,
  horaMinima,
  setHoraMinima,
  evitarHuecos,
  setEvitarHuecos,
  isMobile,
}) {
  const filterBtnRef = useRef(null);
  const prefBtnRef = useRef(null);

  // Estados de filtros y popovers
  const [quickFilter, setQuickFilter] = useState("all"); // "all" | "available" | "selected"
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [horaMinimaFilter, setHoraMinimaFilter] = useState(6);
  const [horaMaximaFilter, setHoraMaximaFilter] = useState(22);
  const [selectedJornada, setSelectedJornada] = useState(null);
  const [selectedDias, setSelectedDias] = useState([]);

  // Selectores atómicos de zustand
  const focusedMateriaCodigo = useMateriasStore((s) => s.focusedMateriaCodigo);
  const focusTimestamp = useMateriasStore((s) => s.focusTimestamp);
  const collapseAllSubjects = useMateriasStore((s) => s.collapseAllSubjects);
  const requestClearSchedule = useMateriasStore((s) => s.requestClearSchedule);
  const resetMateriasSeleccionadas = useMateriasStore((s) => s.resetMateriasSeleccionadas);
  const clearHorariosGenerados = useMateriasStore((s) => s.clearHorariosGenerados);
  const setAllowManualBlocks = useMateriasStore((s) => s.setAllowManualBlocks);
  const clearAllowManualBlocksBySchedule = useMateriasStore((s) => s.clearAllowManualBlocksBySchedule);
  const unlockAllowManualBlocks = useMateriasStore((s) => s.unlockAllowManualBlocks);
  const materias = useMateriasStore((s) => s.materias || []);
  const manualBlocks = useMateriasStore((s) => s.manualBlocks || []);
  const materiasSeleccionadas = useMateriasStore((s) => s.materiasSeleccionadas || {});
  const gruposSeleccionados = useMateriasStore((s) => s.gruposSeleccionados || {});

  const hasExpandedSubjects = useMateriasStore(
    (s) => Object.keys(s.expandedSubjects || {}).length > 0,
  );

  const hasAnySelection = useMateriasStore((s) => {
    const hasSchedules =
      Array.isArray(s.horariosGenerados) && s.horariosGenerados.length > 0;
    if (hasSchedules) return true;
    if (generationMode === GENERATION_MODES.MANUAL) {
      return Object.values(s.gruposSeleccionados || {}).some(
        (v) => v !== null && typeof v !== "undefined",
      );
    }
    return Object.values(s.materiasSeleccionadas || {}).some(Boolean);
  });

  const selectedCount = useMemo(() => {
    if (generationMode === GENERATION_MODES.MANUAL) {
      return Object.values(gruposSeleccionados).filter(
        (v) => v !== null && typeof v !== "undefined",
      ).length;
    }
    return Object.values(materiasSeleccionadas).filter(Boolean).length;
  }, [gruposSeleccionados, materiasSeleccionadas, generationMode]);

  // Celdas ocupadas calculadas centralizadamente
  const occupiedScheduleCells = useMemo(() => {
    if (generationMode !== GENERATION_MODES.MANUAL) return new Map();
    return calculateOccupiedScheduleCells(materias, gruposSeleccionados);
  }, [materias, gruposSeleccionados, generationMode]);

  const occupiedManualCells = useMemo(() => {
    return calculateOccupiedManualCells(manualBlocks);
  }, [manualBlocks]);

  // Objeto de filtros activos para propagar a Subject
  const activeFilters = useMemo(
    () => ({
      selectedDias,
      horaMinimaFilter,
      horaMaximaFilter,
      selectedJornada,
    }),
    [selectedDias, horaMinimaFilter, horaMaximaFilter, selectedJornada],
  );

  // Filtrado compuesto
  const finalFilteredMaterias = useMemo(() => {
    return filterSubjects({
      materias: materiasFiltradas,
      searchTerm: "", // ya filtrado previamente en Sidebar con debouncing
      quickFilter,
      selectedLetter,
      horaMinimaFilter,
      horaMaximaFilter,
      selectedDias,
      generationMode,
      gruposSeleccionados,
      materiasSeleccionadas,
    });
  }, [
    materiasFiltradas,
    quickFilter,
    selectedLetter,
    horaMinimaFilter,
    horaMaximaFilter,
    selectedDias,
    generationMode,
    gruposSeleccionados,
    materiasSeleccionadas,
  ]);

  // Agrupamiento alfabético
  const groupedSections = useMemo(() => {
    return groupSubjectsByLetter(finalFilteredMaterias);
  }, [finalFilteredMaterias]);

  const availableLetters = useMemo(() => {
    return groupedSections.map((s) => s.letter);
  }, [groupedSections]);

  const handleResetFiltersForFocused = useCallback(
    (targetCodigo) => {
      const isVisible = finalFilteredMaterias.some(
        (m) => String(m.codigo) === String(targetCodigo),
      );
      if (!isVisible) {
        setQuickFilter("all");
        setSelectedLetter(null);
        if (searchTerm) onClearSearch();
      }
    },
    [finalFilteredMaterias, searchTerm, onClearSearch],
  );

  const {
    scrollContainerRef,
    sectionRefs,
    activeLetter,
    handleScroll,
    scrollToLetter,
  } = useAlphabetScroll({
    availableLetters,
    focusedMateriaCodigo,
    focusTimestamp,
    onResetFiltersForFocused: handleResetFiltersForFocused,
  });

  const handleReset = useCallback(() => {
    if (requestClearSchedule) {
      requestClearSchedule();
    } else {
      resetMateriasSeleccionadas();
      clearHorariosGenerados();
      setAllowManualBlocks(false);
      clearAllowManualBlocksBySchedule();
      unlockAllowManualBlocks();
    }
  }, [
    requestClearSchedule,
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    setAllowManualBlocks,
    clearAllowManualBlocksBySchedule,
    unlockAllowManualBlocks,
  ]);

  const handleResetAdvancedFilters = useCallback(() => {
    setSelectedLetter(null);
    setHoraMinimaFilter(6);
    setHoraMaximaFilter(22);
    setSelectedJornada(null);
    setSelectedDias([]);
  }, []);

  const handleToggleDia = useCallback((dia) => {
    setSelectedDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
  }, []);

  const hasAdvancedFilters =
    Boolean(selectedLetter) ||
    horaMinimaFilter > 6 ||
    horaMaximaFilter < 22 ||
    Boolean(selectedJornada) ||
    selectedDias.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-2 relative">
      {/* 1. Barra de Búsqueda, Filtros y Preferencias */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onClearSearch={onClearSearch}
        filterBtnRef={filterBtnRef}
        isFilterPopoverOpen={isFilterPopoverOpen}
        setIsFilterPopoverOpen={setIsFilterPopoverOpen}
        hasAdvancedFilters={hasAdvancedFilters}
        prefBtnRef={prefBtnRef}
        isPreferencesOpen={isPreferencesOpen}
        setIsPreferencesOpen={setIsPreferencesOpen}
        generationMode={generationMode}
        horaMinima={horaMinima}
        setHoraMinima={setHoraMinima}
        evitarHuecos={evitarHuecos}
        setEvitarHuecos={setEvitarHuecos}
        dragEnabled={dragEnabled}
        setDragEnabled={setDragEnabled}
        isMobile={isMobile}
        selectedLetter={selectedLetter}
        onSelectLetter={setSelectedLetter}
        horaMinimaFilter={horaMinimaFilter}
        onSetHoraMinimaFilter={setHoraMinimaFilter}
        horaMaximaFilter={horaMaximaFilter}
        onSetHoraMaximaFilter={setHoraMaximaFilter}
        selectedJornada={selectedJornada}
        onSelectJornada={setSelectedJornada}
        selectedDias={selectedDias}
        onToggleDia={handleToggleDia}
        onResetFilters={handleResetAdvancedFilters}
      />

      {/* 2. Filtros Rápidos (Todas | Disponibles | Seleccionadas) */}
      <QuickFilterTabs
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        selectedCount={selectedCount}
        hasAdvancedFilters={hasAdvancedFilters}
        onResetAdvancedFilters={handleResetAdvancedFilters}
      />

      {/* 3. Contenedor Principal: Columna A-Z + Lista de Materias */}
      <div className="flex-1 flex min-h-0 gap-1.5 pt-1">
        <AlphabetSidebar
          availableLetters={availableLetters}
          activeLetter={activeLetter}
          onLetterClick={scrollToLetter}
          isMobile={isMobile}
          hasExpandedSubjects={hasExpandedSubjects}
          onCollapseAll={collapseAllSubjects}
          hasAnySelection={hasAnySelection}
          onReset={handleReset}
        />

        {/* Lista de Materias agrupadas por sección de letra */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="space-y-3 flex-1 min-h-0 pr-1 pl-0.5 overflow-y-auto scrollbar-custom"
        >
          {groupedSections.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
              <p className="font-semibold">No se encontraron materias</p>
              <p className="text-[11px] mt-0.5">Prueba cambiando los filtros</p>
            </div>
          ) : (
            groupedSections.map(({ letter, items }) => (
              <SubjectSection
                key={letter}
                ref={(el) => (sectionRefs.current[letter] = el)}
                letter={letter}
                items={items}
                generationMode={generationMode}
                dragEnabled={dragEnabled}
                activeFilters={activeFilters}
                occupiedScheduleCells={occupiedScheduleCells}
                occupiedManualCells={occupiedManualCells}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export const SubjectList = memo(SubjectListComponent);
export default SubjectList;
