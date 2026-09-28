import { memo } from "react";
import { Tooltip, SelectionParticles } from "@/features/ui";
import { ChevronDownIcon, GripIcon } from "@/icons/index.js";

function SubjectHeaderComponent({
  materia,
  isManualMode,
  dragEnabled,
  isExpanded,
  onToggleExpand,
  isSelected,
  onToggleSelect,
  grupoSeleccionado,
  gruposConCupo,
  totalGrupos,
  hasZeroCuposGlobally,
  hasAllGroupsConflicted,
  isAutomaticDisabled,
  showSelectParticles,
  onDragStart,
  onDragEnd,
}) {
  const handleItemClick = () => {
    if (isManualMode && !dragEnabled) {
      onToggleExpand();
    } else if (!isManualMode && !hasZeroCuposGlobally) {
      onToggleSelect();
    }
  };

  return (
    <div
      draggable={
        isManualMode &&
        dragEnabled &&
        materia?.grupos?.length > 0 &&
        !hasZeroCuposGlobally
      }
      onDragStart={
        isManualMode && dragEnabled && !hasZeroCuposGlobally
          ? onDragStart
          : undefined
      }
      onDragEnd={isManualMode && dragEnabled ? onDragEnd : undefined}
      onClick={handleItemClick}
      className={`p-2.5 flex items-center justify-between gap-2.5 ${
        isAutomaticDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="flex-1 min-w-0 flex flex-col text-left space-y-1">
        {/* Fila 1: Badges superiores */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {materia?.codigo && (
            <span className="font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              #{materia.codigo}
            </span>
          )}

          <span
            className="font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 tabular-nums"
            title={`${gruposConCupo} de ${totalGrupos} grupos con cupos`}
          >
            {gruposConCupo}/{totalGrupos}
          </span>

          {hasZeroCuposGlobally && (
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/60">
              Sin cupos
            </span>
          )}

          {!hasZeroCuposGlobally &&
            hasAllGroupsConflicted &&
            !grupoSeleccionado && (
              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60">
                Con conflictos
              </span>
            )}

          {isManualMode && grupoSeleccionado && (
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/30">
              G{grupoSeleccionado}
            </span>
          )}
        </div>

        {/* Fila 2: Nombre de la Materia */}
        <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug truncate pr-1">
          {materia?.nombre || "Materia sin nombre"}
        </h3>
      </div>

      {/* Lado Derecho: Controles según modo */}
      <div className="flex items-center justify-center gap-1.5 flex-shrink-0 self-center">
        {isManualMode ? (
          dragEnabled ? (
            <Tooltip content="Arrastrar materia al horario" position="top">
              <div
                className="p-1 rounded-md text-zinc-400 hover:text-primary cursor-grab"
                aria-label="Arrastrar materia al horario"
              >
                <GripIcon className="w-4 h-4" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              content={isExpanded ? "Colapsar grupos" : "Expandir grupos"}
              position="top"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className={`p-1 rounded-md transition-transform duration-200 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
                aria-label={isExpanded ? "Colapsar" : "Expandir"}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          )
        ) : (
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!hasZeroCuposGlobally) onToggleSelect();
              }}
              disabled={hasZeroCuposGlobally}
              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-2xs scale-105"
                  : "bg-white dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 hover:border-primary/80 dark:hover:border-primary/80"
              } ${hasZeroCuposGlobally ? "cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={`Seleccionar ${materia?.nombre}`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                </svg>
              )}
            </button>
            {showSelectParticles && (
              <SelectionParticles color="#1392ec" count={12} radius={26} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const SubjectHeader = memo(SubjectHeaderComponent);
export default SubjectHeader;
