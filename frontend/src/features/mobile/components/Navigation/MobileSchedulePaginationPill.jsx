import { memo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons/index.js";

function MobileSchedulePaginationPillComponent({
  horariosGenerados = [],
  horarioActualIndex = 0,
  totalClasses = 0,
  onPrevious,
  onNext,
}) {
  const hasGenerados = horariosGenerados && horariosGenerados.length > 0;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex items-center justify-center pointer-events-none px-4 select-none">
      {hasGenerados ? (
        <div className="pointer-events-auto flex items-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl px-2.5 py-1.5 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 gap-1.5 text-xs">
          <button
            type="button"
            onClick={onPrevious}
            disabled={horariosGenerados.length <= 1}
            className="p-1.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-transform cursor-pointer"
            aria-label="Horario anterior"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400">
              Horarios generados:
            </span>
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {horarioActualIndex + 1} de {horariosGenerados.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={horariosGenerados.length <= 1}
            className="p-1.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none active:scale-90 transition-transform cursor-pointer"
            aria-label="Horario siguiente"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto flex items-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl px-3.5 py-1.5 shadow-xl border border-zinc-200/80 dark:border-zinc-800 gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            Horario Manual
          </span>
          <span className="text-zinc-400 dark:text-zinc-500 font-medium">
            ({totalClasses} {totalClasses === 1 ? "clase" : "clases"})
          </span>
        </div>
      )}
    </div>
  );
}

export const MobileSchedulePaginationPill = memo(
  MobileSchedulePaginationPillComponent,
);
export default MobileSchedulePaginationPill;
