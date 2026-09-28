import { memo } from "react";
import { Tooltip } from "@/features/ui";
import { TrashIcon, GripIcon } from "@/icons/index.js";

function ClassBlockActionsComponent({
  isDraggable,
  isManual,
  onRemoveSubject,
  duracion = 1,
}) {
  const isCompact = duracion === 1;

  return (
    <>
      {/* Botón de borrar en la esquina superior derecha, un poco más grande (w-6 h-6) */}
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 absolute ${
          isCompact ? "right-1.5 top-1/2 -translate-y-1/2" : "right-1.5 top-1.5"
        }`}
      >
        <Tooltip
          content={
            isManual
              ? "Eliminar bloque manual"
              : "Quitar materia del horario"
          }
          position="top"
        >
          <button
            type="button"
            onClick={onRemoveSubject}
            className="w-6 h-6 aspect-square rounded-md bg-white/95 dark:bg-zinc-900/95 shadow-xs border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            aria-label={
              isManual ? "Eliminar bloque manual" : "Quitar del horario"
            }
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Icono de 6 puntos a la derecha en la mitad vertical, con fondo transparente */}
      {isDraggable && (
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 absolute top-1/2 -translate-y-1/2 ${
            isCompact ? "right-8" : "right-1.5"
          }`}
        >
          <Tooltip content="Arrastrar materia al horario" position="left">
            <div
              className="p-1 text-zinc-400/80 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing flex items-center justify-center select-none transition-colors"
              aria-label="Arrastrar materia al horario"
            >
              <GripIcon className="w-4 h-4 pointer-events-none" />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  );
}

export const ClassBlockActions = memo(ClassBlockActionsComponent);
export default ClassBlockActions;
