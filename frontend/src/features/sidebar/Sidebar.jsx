import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useMateriasStore } from "@/store/materias.store.js";
import { GENERATION_MODES, SIDEBAR_CONFIG } from "@/features/sidebar/constants/sidebar.js";
import { ArrowLeftIcon } from "@/icons/index.js";
import { Tooltip } from "@/features/ui";
import { useIsMobile } from "@/features/mobile/hooks/useIsMobile.js";

import { useScheduleGenerator } from "./hooks/useScheduleGenerator.js";
import { ModeToggle } from "./components/Navigation/ModeToggle.jsx";
import { SubjectList } from "./components/SubjectList/SubjectList.jsx";
import { GenerateAction } from "./components/Actions/GenerateAction.jsx";
import { MobileScheduleDock } from "./components/Actions/MobileScheduleDock.jsx";
import { ConfirmModeModal } from "./components/Modals/ConfirmModeModal.jsx";

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showConfirmModeModal, setShowConfirmModeModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const {
    materias,
    materiasSeleccionadas,
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    horariosGenerados,
    clearMaterias,
    clearRemovedGroups,
    setAllowManualBlocks,
    dragEnabled,
    setDragEnabled,
    setMobileActiveView,
    generationMode,
    setGenerationMode,
    horaMinima,
    setHoraMinima,
    evitarHuecos,
    setEvitarHuecos,
  } = useMateriasStore();

  const { isGenerating, handleGenerate } = useScheduleGenerator({ isMobile });

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SIDEBAR_CONFIG.SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtrado de materias por término de búsqueda (nombre o código)
  const materiasFiltradas = useMemo(() => {
    if (!materias) return [];
    const query = debouncedSearchTerm.trim().toLowerCase();
    if (!query) return materias;

    return materias.filter(
      (materia) =>
        materia.nombre?.toLowerCase().includes(query) ||
        String(materia.codigo || "").toLowerCase().includes(query),
    );
  }, [materias, debouncedSearchTerm]);

  // Cambio de modo con diálogo de confirmación si hay selección previa
  const requestModeChange = useCallback(
    (targetMode) => {
      if (targetMode === generationMode) return;

      const scheduleCount = horariosGenerados ? horariosGenerados.length : 0;
      if (scheduleCount > 0) {
        setPendingMode(targetMode);
        setShowConfirmModeModal(true);
        return;
      }

      const seleccionCount = materiasSeleccionadas
        ? Object.keys(materiasSeleccionadas).length
        : 0;

      if (seleccionCount >= 1) {
        setPendingMode(targetMode);
        setShowConfirmModeModal(true);
        return;
      }

      setGenerationMode(targetMode);
      if (targetMode === GENERATION_MODES.AUTOMATICO) {
        setAllowManualBlocks(false);
      }
      resetMateriasSeleccionadas();
      clearHorariosGenerados();
    },
    [
      generationMode,
      horariosGenerados,
      materiasSeleccionadas,
      setGenerationMode,
      setAllowManualBlocks,
      resetMateriasSeleccionadas,
      clearHorariosGenerados,
    ],
  );

  const handleConfirmModeChange = useCallback(() => {
    if (!pendingMode) return;
    setGenerationMode(pendingMode);
    if (pendingMode === GENERATION_MODES.AUTOMATICO) {
      setAllowManualBlocks(false);
    }
    setShowConfirmModeModal(false);
    resetMateriasSeleccionadas();
    clearHorariosGenerados();
    setPendingMode(null);
  }, [
    pendingMode,
    setGenerationMode,
    setAllowManualBlocks,
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
  ]);

  const handleCancelModeChange = useCallback(() => {
    setPendingMode(null);
    setShowConfirmModeModal(false);
  }, []);

  // Volver al menú inicial de facultades y programas
  const handleResetToMenu = useCallback(() => {
    try {
      resetMateriasSeleccionadas();
      clearHorariosGenerados();
      clearRemovedGroups?.();
      clearMaterias();
      localStorage.removeItem("selectedFacultad");
      localStorage.removeItem("selectedPrograma");
    } catch {
      toast.error("No se pudo volver al menú");
    }
  }, [
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    clearRemovedGroups,
    clearMaterias,
  ]);

  return (
    <aside className="w-full sm:w-sm h-full min-h-0 select-none md:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col relative z-20 overflow-hidden">
      {/* Cabecera: Mode Toggle + Botón Volver con Tooltip */}
      <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center gap-1.5 flex-shrink-0 bg-white dark:bg-zinc-950">
        <ModeToggle
          generationMode={generationMode}
          onRequestModeChange={requestModeChange}
        />
        <Tooltip
          content="Volver al menú de facultades y programas"
          position="bottom"
        >
          <button
            type="button"
            onClick={handleResetToMenu}
            className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 bg-transparent rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            aria-label="Volver al menú de facultades y programas"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Cuerpo principal: Lista de materias */}
      <div className="flex-1 min-h-0 p-3 flex flex-col overflow-hidden">
        <SubjectList
          materiasFiltradas={materiasFiltradas}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onClearSearch={() => setSearchTerm("")}
          generationMode={generationMode}
          dragEnabled={dragEnabled}
          setDragEnabled={setDragEnabled}
          horaMinima={horaMinima}
          setHoraMinima={setHoraMinima}
          evitarHuecos={evitarHuecos}
          setEvitarHuecos={setEvitarHuecos}
          isMobile={isMobile}
        />
      </div>

      {/* Dock inferior para móvil en modo manual */}
      <MobileScheduleDock
        isMobile={isMobile}
        generationMode={generationMode}
        onOpenSchedule={() => setMobileActiveView("schedule")}
      />

      {/* Dock inferior para modo automático */}
      <GenerateAction
        generationMode={generationMode}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      {/* Modal de confirmación para cambio de modo */}
      <ConfirmModeModal
        isOpen={showConfirmModeModal}
        pendingMode={pendingMode}
        onConfirm={handleConfirmModeChange}
        onCancel={handleCancelModeChange}
      />
    </aside>
  );
}
