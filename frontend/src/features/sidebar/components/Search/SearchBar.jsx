import { memo } from "react";
import { Tooltip } from "@/features/ui";
import { SearchIcon, FilterIcon, GearIcon } from "@/icons/index.js";
import { FilterPopover } from "@/features/sidebar/components/Popovers/FilterPopover.jsx";
import { PreferencesPopover } from "@/features/sidebar/components/Popovers/PreferencesPopover.jsx";

function SearchBarComponent({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filterBtnRef,
  isFilterPopoverOpen,
  setIsFilterPopoverOpen,
  hasAdvancedFilters,
  prefBtnRef,
  isPreferencesOpen,
  setIsPreferencesOpen,
  generationMode,
  horaMinima,
  setHoraMinima,
  evitarHuecos,
  setEvitarHuecos,
  dragEnabled,
  setDragEnabled,
  isMobile,
  selectedLetter,
  onSelectLetter,
  horaMinimaFilter,
  onSetHoraMinimaFilter,
  horaMaximaFilter,
  onSetHoraMaximaFilter,
  selectedJornada,
  onSelectJornada,
  selectedDias,
  onToggleDia,
  onResetFilters,
}) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0 relative select-none">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        <input
          className="w-full pl-8 pr-7 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-md text-xs 
                     text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 
                     focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-8"
          placeholder="Buscar por nombre o código…"
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          aria-label="Buscar materias"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Limpiar término de búsqueda"
            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Botón de Filtros Avanzados */}
      <div className="relative flex-shrink-0">
        <Tooltip content="Filtros avanzados" position="top">
          <button
            ref={filterBtnRef}
            type="button"
            onClick={() => {
              setIsFilterPopoverOpen(!isFilterPopoverOpen);
              setIsPreferencesOpen(false);
            }}
            aria-label="Filtros avanzados"
            className={`h-8 w-8 rounded-md border flex items-center justify-center cursor-pointer ${
              hasAdvancedFilters || isFilterPopoverOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <FilterIcon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <FilterPopover
          isOpen={isFilterPopoverOpen}
          onClose={() => setIsFilterPopoverOpen(false)}
          anchorRef={filterBtnRef}
          selectedLetter={selectedLetter}
          onSelectLetter={onSelectLetter}
          horaMinimaFilter={horaMinimaFilter}
          onSetHoraMinimaFilter={onSetHoraMinimaFilter}
          horaMaximaFilter={horaMaximaFilter}
          onSetHoraMaximaFilter={onSetHoraMaximaFilter}
          selectedJornada={selectedJornada}
          onSelectJornada={onSelectJornada}
          selectedDias={selectedDias}
          onToggleDia={onToggleDia}
          onResetFilters={onResetFilters}
          isMobile={isMobile}
        />
      </div>

      {/* Botón de Preferencias */}
      {(!isMobile || generationMode === "automatico") && (
        <div className="relative flex-shrink-0">
          <Tooltip content="Preferencias" position="top">
            <button
              ref={prefBtnRef}
              type="button"
              onClick={() => {
                setIsPreferencesOpen(!isPreferencesOpen);
                setIsFilterPopoverOpen(false);
              }}
              aria-label="Preferencias de generación y horarios"
              className={`h-8 w-8 rounded-md border flex items-center justify-center cursor-pointer ${
                isPreferencesOpen
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <GearIcon className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <PreferencesPopover
            isOpen={isPreferencesOpen}
            onClose={() => setIsPreferencesOpen(false)}
            anchorRef={prefBtnRef}
            generationMode={generationMode}
            horaMinima={horaMinima}
            setHoraMinima={setHoraMinima}
            evitarHuecos={evitarHuecos}
            setEvitarHuecos={setEvitarHuecos}
            dragEnabled={dragEnabled}
            setDragEnabled={setDragEnabled}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
export default SearchBar;
