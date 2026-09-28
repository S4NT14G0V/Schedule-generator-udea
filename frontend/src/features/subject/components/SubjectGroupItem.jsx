import React, { memo } from "react";
import { Tooltip, SelectionParticles } from "@/features/ui";
import { InfoIcon } from "@/icons/index.js";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function SubjectGroupItemComponent({
  grupo,
  isGrupoSelected,
  tieneConflicto,
  sinCupos,
  disabled,
  isFocusedGrupo,
  isFilteredMatch,
  isFilteredNonMatch,
  activeFilters = {},
  grupoRef,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  showParticles,
}) {
  return (
    <div
      ref={grupoRef}
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative p-2 rounded-md border text-xs duration-200 flex items-center justify-between gap-2.5 transition-all ${
        isFocusedGrupo
          ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-zinc-900 border-primary bg-primary/20 text-primary dark:text-blue-100 font-bold shadow-md scale-[1.02]"
          : disabled
            ? "opacity-40 cursor-not-allowed border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40"
            : isGrupoSelected
              ? "border-primary bg-primary/10 text-primary dark:text-blue-100 font-semibold cursor-pointer shadow-2xs ring-1 ring-primary/30"
              : isFilteredMatch
                ? "border-purple-500 dark:border-purple-400/90 ring-1 ring-purple-500/20 bg-white dark:bg-zinc-900 hover:border-purple-600 dark:hover:border-purple-300 text-zinc-900 dark:text-zinc-100 cursor-pointer shadow-2xs"
                : isFilteredNonMatch
                  ? "opacity-40 hover:opacity-75 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 cursor-pointer"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
      }`}
    >
      {/* EXTREMO IZQUIERDO: Check / Radio Indicator + Badge Grupo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
              isGrupoSelected
                ? "border-primary bg-primary text-white scale-110"
                : isFilteredMatch
                  ? "border-purple-500 dark:border-purple-400 bg-white dark:bg-zinc-900 text-purple-600"
                  : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-transparent"
            }`}
          >
            {isGrupoSelected ? (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            ) : isFilteredMatch ? (
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:purple-400" />
            ) : null}
          </div>
          {showParticles && (
            <SelectionParticles color="#1392ec" count={10} radius={22} />
          )}
        </div>

        <span
          className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
            isGrupoSelected
              ? "bg-primary text-white"
              : isFilteredMatch
                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs font-bold"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
          }`}
        >
          G{grupo.numero}
        </span>
      </div>

      {/* CENTRO: Horarios divididos en filas por cada bloque */}
      <div className="flex-1 min-w-0 flex flex-col space-y-0.5 text-left font-mono">
        {grupo.horarios && grupo.horarios.length > 0 ? (
          grupo.horarios.map((h, hIdx) => {
            const start = String(h.horaInicio).padStart(2, "0");
            const end = String(h.horaFin).padStart(2, "0");

            return (
              <div
                key={hIdx}
                className="flex items-center gap-1 text-[10.5px] text-zinc-700 dark:text-zinc-300 truncate"
              >
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {(h.dias || []).map((d, dIdx) => {
                    const isMatchingDay =
                      activeFilters.selectedDias?.includes(d);
                    return (
                      <React.Fragment key={d}>
                        {dIdx > 0 && ", "}
                        <span
                          className={
                            isMatchingDay
                              ? "px-1 py-0.2 rounded font-bold text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-900/50"
                              : ""
                          }
                        >
                          {d.slice(0, 3)}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {start}:00-{end}:00
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-[10px] text-zinc-400">Sin horario</span>
        )}
      </div>

      {/* EXTREMO DERECHO: Badge de Cupos + Botón de Info Cuadrado con Tooltip */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border tabular-nums ${
            sinCupos
              ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60"
              : tieneConflicto
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60"
                : "bg-zinc-100 dark:bg-zinc-800 text-primary dark:text-blue-400 border border-zinc-200 dark:border-zinc-700"
          }`}
        >
          {grupo.cupoDisponible}/{grupo.cupoMaximo}
        </span>

        <Tooltip
          position="top"
          content={
            <div className="space-y-2 w-56 text-left">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-300 block mb-0.5">
                  Docente
                </span>
                <span className="text-xs font-semibold text-white block leading-snug">
                  {grupo.profesor || "Docente por asignar"}
                </span>
              </div>
              <div className="pt-1.5 border-t border-zinc-800">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-300 block mb-0.5">
                  Aula / Salón
                </span>
                <span className="text-xs font-mono text-primary dark:text-blue-400 font-bold block">
                  {formatAula(grupo.aula) || "Por asignar"}
                </span>
              </div>
            </div>
          }
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="h-6 w-6 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer flex items-center justify-center"
            aria-label="Información del grupo"
          >
            <InfoIcon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export const SubjectGroupItem = memo(SubjectGroupItemComponent);
export default SubjectGroupItem;
