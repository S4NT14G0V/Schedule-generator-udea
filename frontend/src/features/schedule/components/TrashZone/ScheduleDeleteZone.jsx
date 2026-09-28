import { useState, memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon } from "@/icons/index.js";
import { SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";

function ScheduleDeleteZoneComponent({
  draggingMateria,
  onDeleteMateria,
  onClearDragState,
}) {
  const [isHoveringTrash, setIsHoveringTrash] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsHoveringTrash(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsHoveringTrash(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsHoveringTrash(false);

      if (draggingMateria?.codigo) {
        onDeleteMateria(draggingMateria.codigo);
      }
      onClearDragState();
    },
    [draggingMateria, onDeleteMateria, onClearDragState],
  );

  return (
    <AnimatePresence>
      {draggingMateria && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: isHoveringTrash ? 1.06 : 1,
          }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border shadow-lg flex items-center gap-3 backdrop-blur-md cursor-pointer select-none transition-colors duration-150 ${
            isHoveringTrash
              ? "bg-red-500 text-white border-red-600 ring-4 ring-red-500/30"
              : "bg-white/95 dark:bg-zinc-900/95 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 ring-1 ring-red-500/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <TrashIcon className="w-4 h-4 pointer-events-none" />
          <span className="text-sm pointer-events-none font-medium">
            {isHoveringTrash
              ? SCHEDULE_MESSAGES.RELEASE_TO_DELETE
              : SCHEDULE_MESSAGES.DROP_TO_DELETE}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ScheduleDeleteZone = memo(ScheduleDeleteZoneComponent);
export default ScheduleDeleteZone;
