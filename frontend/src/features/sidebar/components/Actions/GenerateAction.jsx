import { memo } from "react";
import { useMateriasStore } from "@/store/materias.store.js";
import { CalendarIcon } from "@/icons/index.js";
import { GENERATION_MODES } from "@/features/sidebar/constants/sidebar.js";

function GenerateActionComponent({
  generationMode,
  isGenerating,
  onGenerate,
}) {
  const materiasSeleccionadas = useMateriasStore(
    (s) => s.materiasSeleccionadas || {},
  );

  // En modo manual no se muestra dock de generación
  if (generationMode === GENERATION_MODES.MANUAL) {
    return null;
  }

  const selectedMateriasCount = Object.keys(materiasSeleccionadas).length;
  const isDisabled = isGenerating || selectedMateriasCount === 0;

  return (
    <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={onGenerate}
        disabled={isDisabled}
        className={`
          flex-1 h-9 px-4 rounded-md font-bold text-xs  
          flex items-center justify-center gap-2 shadow-xs cursor-pointer
          ${
            isDisabled
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border border-zinc-200/50 dark:border-zinc-700/50 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white active:scale-[0.99]"
          }
        `}
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            <span>Generando…</span>
          </div>
        ) : (
          <>
            <CalendarIcon className="w-4 h-4" />
            <span>Generar Horarios</span>
            {selectedMateriasCount > 0 && (
              <span className="font-mono text-[10.5px] font-bold bg-white/25 text-white px-2 py-0.5 rounded-md tabular-nums border border-white/20">
                {selectedMateriasCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

export const GenerateAction = memo(GenerateActionComponent);
export default GenerateAction;
