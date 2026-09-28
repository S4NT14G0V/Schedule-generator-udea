import { memo } from "react";
import { useMobileSchedule } from "./hooks/useMobileSchedule.js";
import { MobileHeader } from "./components/Navigation/MobileHeader.jsx";
import { MobileDayTabs } from "./components/Navigation/MobileDayTabs.jsx";
import { MobileDayGrid } from "./components/Grid/MobileDayGrid.jsx";
import { MobileSchedulePaginationPill } from "./components/Navigation/MobileSchedulePaginationPill.jsx";
import { MobileSchedulePopupPreview } from "./components/Preview/MobileSchedulePopupPreview.jsx";
import { MobileClassDetailsSheet } from "./components/Modals/MobileClassDetailsSheet.jsx";

function MobileScheduleViewComponent() {
  const {
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
  } = useMobileSchedule();

  return (
    <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative select-none">
      {/* 1. Header de navegación (Volver, Anterior, Siguiente) */}
      <MobileHeader
        activeDay={activeDay}
        goToDay={goToDay}
        onBackToMaterias={handleBackToMaterias}
      />

      {/* 2. Selector de 7 días */}
      <MobileDayTabs
        activeDay={activeDay}
        goToDay={goToDay}
        classCountByDay={classCountByDay}
      />

      {/* 3. Cuadrícula de horas con soporte de swipe */}
      <MobileDayGrid
        activeDay={activeDay}
        direction={direction}
        handleDragEnd={handleDragEnd}
        classesForActiveDay={classesForActiveDay}
        onSelectBlock={setSelectedBlockDetails}
        scrollContainerRef={scrollContainerRef}
      />

      {/* 4. Previsualizador miniatura emergente al cambiar de horario generado */}
      <MobileSchedulePopupPreview
        isOpen={showMiniPreviewPopup}
        onClose={() => setShowMiniPreviewPopup(false)}
        horarioActualIndex={horarioActualIndex}
        totalSchedules={horariosGenerados?.length || 0}
        popupMiniBlocks={popupMiniBlocks}
        popupTotalDays={popupTotalDays}
      />

      {/* 5. Pill flotante de paginación / modo manual */}
      <MobileSchedulePaginationPill
        horariosGenerados={horariosGenerados}
        horarioActualIndex={horarioActualIndex}
        totalClasses={allCurrentClasses.length}
        onPrevious={handlePreviousSchedule}
        onNext={handleNextSchedule}
      />

      {/* 6. Bottom Sheet con detalles de la clase y opción de eliminación */}
      <MobileClassDetailsSheet
        selectedBlockDetails={selectedBlockDetails}
        onClose={() => setSelectedBlockDetails(null)}
        onDelete={handleDeleteBlock}
        isManualMode={isManualMode}
      />
    </div>
  );
}

export const MobileScheduleView = memo(MobileScheduleViewComponent);
export default MobileScheduleView;
