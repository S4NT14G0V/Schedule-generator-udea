import React, { memo, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  DIAS,
  HORAS,
  formatHoraCompact,
} from "@/features/schedule/constants/schedule.js";
import { ScheduleHeader } from "@/features/schedule/components/Header/ScheduleHeader.jsx";
import { ClassBlock } from "@/features/schedule/components/ClassBlock/ClassBlock.jsx";
import { ScheduleDropOverlay } from "./ScheduleDropOverlay.jsx";

function ScheduleGridComponent({
  gridRef,
  previewRef,
  clasesParaRenderizar = [],
  draggingMateria,
  hoveredMateria,
  availableHorarios = [],
  celdasMateria,
  isClearingSequence,
  clearingExplosions,
  explodingCodigo,
  explodingManualId,
  editingManualId,
  setEditingManualId,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onMouseDown,
  onClassHover,
  onClassLeave,
  onDeleteManualBlock,
  onDeleteSubject,
  onRenameManualBlock,
}) {
  const scrollContainerRef = useRef(null);

  // Scroll horizontal con la rueda del ratón cuando la pantalla es estrecha
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Verificar si hay desbordamiento horizontal
      const hasHorizontalOverflow =
        container.scrollWidth > container.clientWidth;
      if (!hasHorizontalOverflow) return;

      // Si el movimiento predominante es vertical con la rueda del ratón (deltaY)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden scrollbar-custom relative z-10"
    >
      <div className="min-w-[912px] h-full flex flex-col">
        {/* Encabezado sincronizado de los días */}
        <ScheduleHeader dias={DIAS} />

        {/* Cuadrícula de horas y días */}
        <div
          ref={gridRef}
          className="grid flex-1 w-full relative min-h-0"
          style={{
            gridTemplateColumns: "72px repeat(7, minmax(120px, 1fr))",
            gridTemplateRows: `repeat(${HORAS.length}, 1fr)`,
            userSelect: "none",
          }}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onMouseDown={onMouseDown}
        >
          {/* Celdas del grid */}
          {HORAS.map((hora, horaIdx) => (
            <React.Fragment key={hora}>
              {/* Columna de hora vertical */}
              <div
                className="px-2 text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-900/40 border-r border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center select-none tabular-nums"
                style={{
                  gridColumn: 1,
                  gridRow: horaIdx + 1,
                }}
              >
                {formatHoraCompact(hora)}
              </div>

              {/* Celdas para cada día */}
              {DIAS.map((dia, diaIdx) => (
                <div
                  key={`${dia}-${hora}`}
                  data-cell={`${diaIdx}-${horaIdx}`}
                  data-day={diaIdx}
                  data-hour={horaIdx}
                  className="bg-transparent border-r border-b border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100/40 dark:hover:bg-zinc-800/20"
                  style={{
                    gridColumn: diaIdx + 2,
                    gridRow: horaIdx + 1,
                    zIndex: 1,
                  }}
                  onDrop={(e) => onDrop(e, diaIdx, horaIdx)}
                  onDragOver={(e) => e.preventDefault()}
                />
              ))}
            </React.Fragment>
          ))}

          {/* Preview de selección al arrastrar para crear bloque manual */}
          <div
            ref={previewRef}
            style={{
              position: "absolute",
              zIndex: 999,
              pointerEvents: "none",
              display: "none",
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.6)",
              borderRadius: 6,
              transition: "top 60ms linear, height 60ms linear",
              boxSizing: "border-box",
            }}
            data-selection-preview
          />

          {/* Renderizar cada bloque de clase con animación individual */}
          <AnimatePresence>
            {clasesParaRenderizar.map((clase) => {
              const blockKey = clase.manualId
                ? `manual-${clase.manualId}`
                : `block-${clase.codigoMateria || clase.materia}-d${clase.diaIndex}-h${clase.horaIndex}-${clase.duracion}-g${clase.grupo || "0"}`;

              const isExploding = Boolean(
                clearingExplosions?.has(blockKey) ||
                  (clase.codigoMateria &&
                    explodingCodigo &&
                    String(explodingCodigo) === String(clase.codigoMateria)) ||
                  (clase.manualId && explodingManualId === clase.manualId),
              );

              return (
                <div
                  key={blockKey}
                  className="relative w-full h-full"
                  style={{
                    gridColumn: clase.diaIndex + 2,
                    gridRow: `${clase.horaIndex + 1} / span ${clase.duracion}`,
                    zIndex: clase.isPreview ? 6 : 10,
                    pointerEvents: isClearingSequence ? "none" : "auto",
                  }}
                >
                  <ClassBlock
                    clase={clase}
                    onHover={onClassHover}
                    onLeave={onClassLeave}
                    onDelete={
                      clase.manualId
                        ? () => onDeleteManualBlock(clase.manualId)
                        : () => onDeleteSubject(clase.codigoMateria)
                    }
                    onRename={
                      clase.manualId
                        ? (name) => onRenameManualBlock(clase.manualId, name)
                        : undefined
                    }
                    autoEdit={editingManualId === clase.manualId}
                    onEditComplete={() => setEditingManualId(null)}
                    isForceExploding={isExploding}
                  />
                </div>
              );
            })}
          </AnimatePresence>

          {/* Overlay de horarios disponibles durante drag o hover */}
          {(draggingMateria || hoveredMateria) && (
            <ScheduleDropOverlay
              availableHorarios={availableHorarios}
              dias={DIAS}
              horas={HORAS}
              onBlockDrop={onDrop}
              celdasMateria={celdasMateria}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const ScheduleGrid = memo(ScheduleGridComponent);
export default ScheduleGrid;
