import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/features/ui";
import { ChevronDownIcon, TrashIcon } from "@/icons/index.js";

function AlphabetSidebarComponent({
  availableLetters = [],
  activeLetter,
  onLetterClick,
  isMobile,
  hasExpandedSubjects,
  onCollapseAll,
  hasAnySelection,
  onReset,
}) {
  if (availableLetters.length === 0) return null;

  return (
    <div className="w-8 flex flex-col items-center justify-between py-0.5 select-none flex-shrink-0 border-r border-zinc-200/70 dark:border-zinc-800/80 pr-1 h-full min-h-0 overflow-hidden">
      {/* Lista de letras disponibles */}
      <div className="flex-1 w-full flex flex-col items-center space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar min-h-0">
        {availableLetters.map((letter) => {
          const isActive = (activeLetter || availableLetters[0]) === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => onLetterClick(letter)}
              className={`w-5.5 h-5.5 rounded-md text-xs font-mono font-bold flex items-center justify-center cursor-pointer flex-shrink-0 ${
                isActive
                  ? "bg-primary text-white shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title={`Ir a letra ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Sección Inferior: Colapsables + Limpiar selecciones */}
      <div className="w-full flex flex-col items-center gap-1.5 pt-1.5 flex-shrink-0">
        <AnimatePresence>
          {!isMobile && hasExpandedSubjects && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full flex flex-col items-stretch flex-shrink-0 overflow-hidden"
            >
              <Tooltip
                content="Cerrar todos los grupos abiertos"
                position="right"
                className="w-full"
              >
                <button
                  type="button"
                  onClick={onCollapseAll}
                  className="w-full py-2.5 px-0.5 rounded-md bg-zinc-100/90 hover:bg-red-50 dark:bg-zinc-800/90 dark:hover:bg-red-950/40 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700/80 hover:border-red-300 dark:hover:border-red-800/60 shadow-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 active:scale-95 group select-none"
                  aria-label="Cerrar colapsables"
                >
                  <ChevronDownIcon className="w-3.5 h-3.5 rotate-180 transition-transform duration-150 group-hover:-translate-y-0.5 flex-shrink-0" />
                  <span
                    className="text-[8.5px] font-bold uppercase tracking-wider text-center select-none block"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    Cerrar todos los colapsables
                  </span>
                </button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasAnySelection && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0, scale: 0.8 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full flex justify-center flex-shrink-0 overflow-hidden"
            >
              <Tooltip
                content="Limpiar selecciones y horarios"
                position="right"
                className="w-full flex justify-center"
              >
                <button
                  type="button"
                  onClick={onReset}
                  aria-label="Limpiar selecciones y horarios"
                  className="w-7 h-7 rounded-md border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-800/60 shadow-xs flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const AlphabetSidebar = memo(AlphabetSidebarComponent);
export default AlphabetSidebar;
