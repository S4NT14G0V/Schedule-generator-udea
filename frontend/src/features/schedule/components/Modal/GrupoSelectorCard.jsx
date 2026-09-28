import { memo } from "react";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function GrupoSelectorCardComponent({
  grupo,
  idx,
  isSelected,
  onSelectGrupo,
}) {
  const sinCupos = grupo.cupoDisponible === 0;

  return (
    <button
      type="button"
      onClick={() => !sinCupos && onSelectGrupo(grupo.numero)}
      disabled={sinCupos}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
        sinCupos
          ? "border-zinc-200 dark:border-zinc-800 opacity-60 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900/50"
          : isSelected
            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 cursor-pointer shadow-sm"
            : "border-zinc-200 dark:border-zinc-800 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-zinc-800 dark:text-zinc-100">
            Grupo {grupo.numero}
          </span>
          {isSelected && (
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              Seleccionado
            </span>
          )}
          {!isSelected && idx === 0 && !sinCupos && (
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
              Recomendado
            </span>
          )}
          {sinCupos && (
            <span className="text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
              Agotado
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              sinCupos ? "bg-red-400" : "bg-emerald-400"
            }`}
          />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {grupo.cupoDisponible} / {grupo.cupoMaximo} cupos
          </span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {grupo.horarios && grupo.horarios.length > 0 && (
          <div className="space-y-1.5">
            {grupo.horarios.map((h, hidx) => (
              <div key={hidx} className="flex items-start gap-2">
                <svg
                  className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {h.dias?.join(", ")}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {h.horaInicio}:00 - {h.horaFin}:00{" "}
                    {h.aula && `• ${formatAula(h.aula)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {grupo.profesor && (
          <div className="flex items-center gap-2 pt-1">
            <svg
              className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-zinc-500 dark:text-zinc-400 italic">
              {grupo.profesor}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

export const GrupoSelectorCard = memo(GrupoSelectorCardComponent);
export default GrupoSelectorCard;
