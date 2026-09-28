import { memo } from "react";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function MobileClassCardComponent({ clase, onSelect }) {
  const startHour = Math.floor(clase.horaInicio);
  const startIdx = Math.max(0, startHour - 6);
  const duration = Math.max(1, clase.duracion);

  return (
    <div
      onClick={() => onSelect(clase)}
      style={{
        gridColumn: 2,
        gridRow: `${startIdx + 1} / span ${duration}`,
        zIndex: 10,
        padding: "2px",
      }}
      className="relative cursor-pointer select-none active:scale-[0.99] transition-transform"
    >
      <div
        style={{
          backgroundColor: `${clase.color}18`,
          borderColor: `${clase.color}60`,
          borderLeftColor: clase.color,
          borderLeftWidth: "4px",
        }}
        className="relative w-full h-full rounded-lg border p-2 flex items-center justify-center overflow-hidden shadow-xs select-none"
      >
        {/* Fila superior */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {clase.codigoMateria && (
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                #{clase.codigoMateria}
              </span>
            )}
            {clase.numeroGrupo && (
              <span
                style={{ color: clase.color }}
                className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-700/80"
              >
                Grupo {clase.numeroGrupo}
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
            {String(clase.horaInicio).padStart(2, "0")}:00 -{" "}
            {String(clase.horaFin).padStart(2, "0")}:00
          </span>
        </div>

        {/* Nombre de la Materia centrado */}
        <div className="w-full flex items-center justify-center text-center px-1 py-4 z-0 min-w-0">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 text-center">
            {clase.nombreMateria}
          </h4>
        </div>

        {/* Fila inferior */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10.5px] text-zinc-500 dark:text-zinc-400 font-medium z-10 pointer-events-none">
          <span className="truncate max-w-[150px]">{clase.profesor}</span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {formatAula(clase.aula)}
          </span>
        </div>
      </div>
    </div>
  );
}

export const MobileClassCard = memo(MobileClassCardComponent);
export default MobileClassCard;
