import { memo } from "react";
import { DIAS } from "@/features/schedule/constants/schedule.js";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/icons/index.js";

function MobileHeaderComponent({
  activeDay,
  goToDay,
  onBackToMaterias,
}) {
  return (
    <header className="px-3 py-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2 z-30 flex-shrink-0 select-none">
      {/* Botón Volver a Materias */}
      <button
        type="button"
        onClick={onBackToMaterias}
        className="flex-1 h-9 px-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        <span>Materias</span>
      </button>

      {/* Botón Día Anterior */}
      <button
        type="button"
        disabled={activeDay === 0}
        onClick={() => goToDay(activeDay - 1)}
        className="flex-1 h-9 px-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform cursor-pointer"
      >
        <ChevronLeftIcon className="w-3.5 h-3.5" />
        <span>Anterior</span>
      </button>

      {/* Botón Día Siguiente */}
      <button
        type="button"
        disabled={activeDay === DIAS.length - 1}
        onClick={() => goToDay(activeDay + 1)}
        className="flex-1 h-9 px-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform cursor-pointer"
      >
        <span>Siguiente</span>
        <ChevronRightIcon className="w-3.5 h-3.5" />
      </button>
    </header>
  );
}

export const MobileHeader = memo(MobileHeaderComponent);
export default MobileHeader;
