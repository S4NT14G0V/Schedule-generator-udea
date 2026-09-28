import { memo } from "react";
import { MobileMiniSchedulePreview } from "@/features/mobile";
import { CalendarIcon } from "@/icons/index.js";
import { GENERATION_MODES } from "@/features/sidebar/constants/sidebar.js";

function MobileScheduleDockComponent({
  isMobile,
  generationMode,
  onOpenSchedule,
}) {
  if (!isMobile || generationMode !== GENERATION_MODES.MANUAL) {
    return null;
  }

  return (
    <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800 flex-shrink-0 z-20 flex flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <MobileMiniSchedulePreview onOpenSchedule={onOpenSchedule} />
      <div className="p-3 pt-2">
        <button
          type="button"
          onClick={onOpenSchedule}
          className="w-full h-10 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Ver Horario</span>
        </button>
      </div>
    </div>
  );
}

export const MobileScheduleDock = memo(MobileScheduleDockComponent);
export default MobileScheduleDock;
