import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DIAS } from "@/features/schedule/constants/schedule.js";

function MobileSchedulePopupPreviewComponent({
  isOpen,
  onClose,
  horarioActualIndex,
  totalSchedules,
  popupMiniBlocks = [],
  popupTotalDays = 6,
}) {
  return (
    <AnimatePresence>
      {isOpen && totalSchedules > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 select-none"
        >
          <div
            onClick={onClose}
            className="pointer-events-auto w-64 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-2.5 flex flex-col gap-2 cursor-pointer active:scale-98 transition-transform"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-[11px] text-zinc-900 dark:text-zinc-100">
                  Horario {horarioActualIndex + 1} de {totalSchedules}
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-zinc-400 dark:text-zinc-500">
                {popupMiniBlocks.length} clases
              </span>
            </div>

            {/* Cuadrícula semanal miniatura */}
            <div className="w-full bg-zinc-50 dark:bg-zinc-950/80 rounded-xl p-1.5 border border-zinc-200/60 dark:border-zinc-800/60">
              <div
                className="grid text-center text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mb-1"
                style={{
                  gridTemplateColumns: `repeat(${popupTotalDays}, 1fr)`,
                }}
              >
                {DIAS.slice(0, popupTotalDays).map((dia) => (
                  <span key={dia}>{dia.slice(0, 1)}</span>
                ))}
              </div>

              <div
                className="relative w-full h-28 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${popupTotalDays}, 1fr)`,
                  gridTemplateRows: "repeat(16, 1fr)",
                }}
              >
                {Array.from({ length: 16 }).map((_, rIdx) => (
                  <div
                    key={rIdx}
                    className="border-b border-zinc-100 dark:border-zinc-800/30 col-span-full pointer-events-none"
                    style={{ gridRow: rIdx + 1 }}
                  />
                ))}

                {popupMiniBlocks.map((b) => (
                  <motion.div
                    key={b.key}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      gridColumn: b.diaIndex + 1,
                      gridRow: `${b.startIdx + 1} / span ${b.duration}`,
                      backgroundColor: b.color,
                    }}
                    className="rounded-[3px] m-[0.5px] shadow-xs"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const MobileSchedulePopupPreview = memo(
  MobileSchedulePopupPreviewComponent,
);
export default MobileSchedulePopupPreview;
