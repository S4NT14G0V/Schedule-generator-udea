import React, { memo } from "react";
import { motion } from "framer-motion";
import { DIAS, HORAS } from "@/features/schedule/constants/schedule.js";
import { MobileClassCard } from "./MobileClassCard.jsx";

function MobileDayGridComponent({
  activeDay,
  direction,
  handleDragEnd,
  classesForActiveDay = [],
  onSelectBlock,
  scrollContainerRef,
}) {
  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto relative w-full pb-20 pt-2 px-3 touch-pan-y"
    >
      <motion.div
        key={activeDay}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0.88, x: direction * 35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="min-w-full"
      >
        {/* Encabezado del día activo */}
        <div className="flex items-center justify-between pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {DIAS[activeDay]}
            </h2>
          </div>
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            Desliza para cambiar de día
          </span>
        </div>

        {/* Cuadrícula de 16 horas */}
        <div
          className="relative min-w-full"
          style={{
            display: "grid",
            gridTemplateRows: `repeat(16, 56px)`,
            gridTemplateColumns: "54px 1fr",
          }}
        >
          {HORAS.map((hora, horaIdx) => (
            <React.Fragment key={hora}>
              {/* Columna de Horas */}
              <div
                className="flex items-start pt-1 pr-2 border-t border-zinc-200/60 dark:border-zinc-800/60"
                style={{
                  gridColumn: 1,
                  gridRow: horaIdx + 1,
                }}
              >
                <span className="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                  {String(hora).padStart(2, "0")}:00
                </span>
              </div>

              {/* Celda de fondo con línea punteada */}
              <div
                className="border-t border-dashed border-zinc-200/60 dark:border-zinc-800/60"
                style={{
                  gridColumn: 2,
                  gridRow: horaIdx + 1,
                }}
              />
            </React.Fragment>
          ))}

          {/* Bloques de Clase posicionados en el día */}
          {classesForActiveDay.map((clase) => (
            <MobileClassCard
              key={clase.id}
              clase={clase}
              onSelect={onSelectBlock}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export const MobileDayGrid = memo(MobileDayGridComponent);
export default MobileDayGrid;
