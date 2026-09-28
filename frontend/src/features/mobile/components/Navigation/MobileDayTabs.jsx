import { memo } from "react";
import { DIAS } from "@/features/schedule/constants/schedule.js";

function MobileDayTabsComponent({
  activeDay,
  goToDay,
  classCountByDay = [],
}) {
  return (
    <div className="grid grid-cols-7 gap-1 px-2 py-1.5 bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 flex-shrink-0 z-20 w-full select-none">
      {DIAS.map((dia, idx) => {
        const isActive = activeDay === idx;
        const count = classCountByDay[idx] || 0;
        return (
          <button
            key={dia}
            type="button"
            onClick={() => goToDay(idx)}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-center transition-all w-full relative cursor-pointer ${
              isActive
                ? "bg-primary text-white shadow-xs font-bold"
                : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-semibold"
            }`}
          >
            <span className="text-[11px] leading-tight tracking-tight">
              {dia.slice(0, 3)}
            </span>
            {/* Indicador de clases */}
            <div className="h-1.5 flex items-center justify-center mt-0.5">
              {count > 0 && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-white" : "bg-primary"
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const MobileDayTabs = memo(MobileDayTabsComponent);
export default MobileDayTabs;
