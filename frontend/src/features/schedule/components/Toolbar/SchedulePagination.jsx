import { memo } from "react";
import { Tooltip } from "@/features/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons/index.js";

function SchedulePaginationComponent({
  scheduleCount,
  horarioActualIndex,
  onSetHorarioActualIndex,
}) {
  if (scheduleCount <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Tooltip content="Horario anterior" position="top">
        <button
          type="button"
          onClick={() => {
            const newIndex =
              horarioActualIndex > 0 ? horarioActualIndex - 1 : scheduleCount - 1;
            onSetHorarioActualIndex(newIndex);
          }}
          className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white cursor-pointer flex items-center justify-center"
          aria-label="Horario anterior"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </button>
      </Tooltip>

      <div className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-md border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
        {horarioActualIndex + 1} / {scheduleCount}
      </div>

      <Tooltip content="Horario siguiente" position="top">
        <button
          type="button"
          onClick={() => {
            const newIndex =
              horarioActualIndex < scheduleCount - 1 ? horarioActualIndex + 1 : 0;
            onSetHorarioActualIndex(newIndex);
          }}
          className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white cursor-pointer flex items-center justify-center"
          aria-label="Horario siguiente"
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </Tooltip>
    </div>
  );
}

export const SchedulePagination = memo(SchedulePaginationComponent);
export default SchedulePagination;
