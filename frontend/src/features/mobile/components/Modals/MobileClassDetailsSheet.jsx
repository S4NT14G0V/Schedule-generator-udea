import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon } from "@/icons/index.js";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function MobileClassDetailsSheetComponent({
  selectedBlockDetails,
  onClose,
  onDelete,
  isManualMode,
}) {
  return (
    <AnimatePresence>
      {selectedBlockDetails && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl p-5 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 select-none"
          >
            {/* Tirador superior */}
            <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-2" />

            <div className="flex items-start justify-between gap-3 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedBlockDetails.codigoMateria && (
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      #{selectedBlockDetails.codigoMateria}
                    </span>
                  )}
                  {selectedBlockDetails.numeroGrupo && (
                    <span
                      style={{ color: selectedBlockDetails.color }}
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20"
                    >
                      Grupo {selectedBlockDetails.numeroGrupo}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedBlockDetails.nombreMateria}
                </h3>
              </div>

              {/* Botón eliminar si estamos en modo manual */}
              {isManualMode && (
                <button
                  type="button"
                  onClick={() => onDelete(selectedBlockDetails)}
                  className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/60 active:scale-95 cursor-pointer"
                  title="Eliminar del horario"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Información detallada */}
            <div className="grid grid-cols-2 gap-2.5 text-xs text-left">
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                <span className="block text-zinc-400 dark:text-zinc-500 font-medium text-[10px]">
                  HORARIO
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedBlockDetails.dia} (
                  {String(selectedBlockDetails.horaInicio).padStart(2, "0")}
                  :00 - {String(selectedBlockDetails.horaFin).padStart(2, "0")}
                  :00)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                <span className="block text-zinc-400 dark:text-zinc-500 font-medium text-[10px]">
                  AULA
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {formatAula(selectedBlockDetails.aula)}
                </span>
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                <span className="block text-zinc-400 dark:text-zinc-500 font-medium text-[10px]">
                  PROFESOR
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedBlockDetails.profesor}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-bold text-xs text-zinc-700 dark:text-zinc-300 active:scale-98 cursor-pointer"
            >
              Cerrar
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const MobileClassDetailsSheet = memo(MobileClassDetailsSheetComponent);
export default MobileClassDetailsSheet;
