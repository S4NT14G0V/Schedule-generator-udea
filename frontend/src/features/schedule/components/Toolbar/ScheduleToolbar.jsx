import { memo } from "react";
import { Tooltip } from "@/features/ui";
import { TrashIcon, SunIcon, MoonIcon } from "@/icons/index.js";
import { ExportDropdown } from "./ExportDropdown.jsx";
import { SchedulePagination } from "./SchedulePagination.jsx";

function ScheduleToolbarComponent({
  exporting,
  onExportPNG,
  onExportPDF,
  horariosGenerados = [],
  horarioActualIndex = 0,
  onSetHorarioActualIndex,
  onClearSchedule,
  hasContentToClear = false,
  darkTheme,
  onToggleDarkTheme,
}) {
  const scheduleCount = horariosGenerados ? horariosGenerados.length : 0;

  return (
    <div className="relative w-full h-12 flex-shrink-0 border-t border-zinc-200/70 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md px-4 flex items-center justify-between select-none z-20">
      <div className="flex items-center gap-2">
        <ExportDropdown
          exporting={exporting}
          onExportPNG={onExportPNG}
          onExportPDF={onExportPDF}
        />
      </div>

      <SchedulePagination
        scheduleCount={scheduleCount}
        horarioActualIndex={horarioActualIndex}
        onSetHorarioActualIndex={onSetHorarioActualIndex}
      />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onClearSchedule}
          disabled={!hasContentToClear}
          className={`h-8 px-2.5 rounded-md border flex items-center gap-1.5 text-xs font-medium ${
            hasContentToClear
              ? "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
              : "border-transparent bg-transparent text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
          }`}
          aria-label="Limpiar horario"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Limpiar horario</span>
        </button>

        <Tooltip
          content={darkTheme ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          position="top-left"
        >
          <button
            type="button"
            onClick={onToggleDarkTheme}
            className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer flex items-center justify-center"
            aria-label={
              darkTheme ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
            }
          >
            {darkTheme ? (
              <SunIcon className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <MoonIcon className="w-3.5 h-3.5 text-indigo-500" />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export const ScheduleToolbar = memo(ScheduleToolbarComponent);
export default ScheduleToolbar;
