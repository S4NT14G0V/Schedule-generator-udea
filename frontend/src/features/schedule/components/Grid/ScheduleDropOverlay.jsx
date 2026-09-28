import { useMemo, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMateriasStore } from "@/store/materias.store.js";
import { DIAS, HORAS } from "@/features/schedule/constants/schedule.js";

/**
 * Componente que muestra una superposición visual sobre el schedule
 * cuando se está arrastrando una materia, resaltando los horarios disponibles.
 */
function ScheduleDropOverlayComponent({
  availableHorarios = [],
  dias = DIAS,
  horas = HORAS,
  onBlockDrop,
  showToastMessage,
  celdasMateria,
}) {
  const {
    draggingMateria,
    hoveredMateria,
    materiasSeleccionadas,
    clearDragState,
    selectGrupo,
    toggleMateriaSelected,
    setShowGrupoSelector,
    clearHoveredMateria,
  } = useMateriasStore();

  const isDragging = Boolean(draggingMateria);

  const handleBackdropDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = e.currentTarget.getBoundingClientRect();
      const cellWidth = rect.width / 7;
      const cellHeight = rect.height / horas.length;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const diaIndex = Math.floor(x / cellWidth);
      const horaIndex = Math.floor(y / cellHeight);

      if (
        diaIndex >= 0 &&
        diaIndex < 7 &&
        horaIndex >= 0 &&
        horaIndex < horas.length
      ) {
        if (onBlockDrop) {
          onBlockDrop(e, diaIndex, horaIndex);
          return;
        }

        const celdaKey = `${diaIndex}-${horaIndex}`;
        const materiaEnCeldaCodigo = celdasMateria?.get(celdaKey);
        if (
          materiaEnCeldaCodigo &&
          materiaEnCeldaCodigo !== draggingMateria?.codigo
        ) {
          showToastMessage?.(
            "⚠️ No se puede colocar: hay un conflicto con otra materia",
          );
        } else {
          showToastMessage?.("⚠️ Esta materia no tiene clases en este horario");
        }
      }

      clearDragState();
    },
    [horas.length, onBlockDrop, celdasMateria, draggingMateria?.codigo, showToastMessage, clearDragState],
  );

  const bloques = useMemo(() => {
    if (!availableHorarios || availableHorarios.length === 0) return [];

    const slotMap = new Map();
    availableHorarios.forEach((horario) => {
      (horario.dias || []).forEach((dia) => {
        const diaIndex = dias.indexOf(dia);
        if (diaIndex !== -1) {
          const horaInicioIndex = horas.indexOf(horario.horaInicio);
          const duracion = (horario.horaFin || 0) - (horario.horaInicio || 0);
          if (horaInicioIndex !== -1 && duracion > 0) {
            const slotKey = `${diaIndex}-${horaInicioIndex}-${duracion}`;
            if (!slotMap.has(slotKey)) {
              slotMap.set(slotKey, {
                key: slotKey,
                diaIndex,
                horaInicioIndex,
                duracion,
                grupos: [horario.numeroGrupo],
                isFilteredMatch: Boolean(horario.isFilteredMatch),
              });
            } else {
              const existing = slotMap.get(slotKey);
              if (!existing.grupos.includes(horario.numeroGrupo)) {
                existing.grupos.push(horario.numeroGrupo);
              }
              if (horario.isFilteredMatch) {
                existing.isFilteredMatch = true;
              }
            }
          }
        }
      });
    });

    return Array.from(slotMap.values());
  }, [availableHorarios, dias, horas]);

  const handleDrop = useCallback(
    (e, bloque) => {
      e.preventDefault();
      e.stopPropagation();
      if (onBlockDrop) {
        onBlockDrop(e, bloque.diaIndex, bloque.horaInicioIndex);
      }
    },
    [onBlockDrop],
  );

  if (!availableHorarios || availableHorarios.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          gridColumn: "2 / span 7",
          gridRow: "1 / -1",
          zIndex: 12,
          pointerEvents: isDragging ? "auto" : "none",
        }}
        onDrop={isDragging ? handleBackdropDrop : undefined}
        onDragOver={
          isDragging
            ? (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }
            : undefined
        }
      />

      <AnimatePresence>
        {bloques.map((bloque, idx) => (
          <motion.div
            key={bloque.key}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{
              duration: 0.25,
              delay: idx * 0.02,
              ease: "easeOut",
            }}
            className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center p-1.5 text-center shadow-xs select-none transition-colors ${
              bloque.isFilteredMatch
                ? "bg-purple-500/15 dark:bg-purple-500/25 border-purple-500 dark:border-purple-400 hover:bg-purple-500/25 dark:hover:bg-purple-500/35 ring-1 ring-purple-500/30"
                : "bg-primary/15 dark:bg-primary/20 border-primary/70 dark:border-primary/80 hover:bg-primary/25 dark:hover:bg-primary/30"
            }`}
            style={{
              gridColumn: bloque.diaIndex + 2,
              gridRow: `${bloque.horaInicioIndex + 1} / span ${bloque.duracion}`,
              zIndex: 15,
              pointerEvents: "auto",
              cursor: isDragging ? "copy" : "pointer",
            }}
            onClick={(e) => {
              if (!isDragging && hoveredMateria && bloque.grupos && bloque.grupos.length > 0) {
                e.stopPropagation();
                if (bloque.grupos.length === 1) {
                  const targetGroupNum = bloque.grupos[0];
                  selectGrupo(hoveredMateria.codigo, targetGroupNum);
                  if (!materiasSeleccionadas?.[hoveredMateria.codigo]) {
                    toggleMateriaSelected(hoveredMateria.codigo);
                  }
                  clearHoveredMateria();
                } else {
                  const targetGroups = (hoveredMateria.grupos || []).filter((g) =>
                    bloque.grupos.includes(g.numero),
                  );
                  useMateriasStore.setState({
                    draggingMateria: hoveredMateria,
                    lastDropSuccessful: true,
                  });
                  setShowGrupoSelector(true, targetGroups);
                  clearHoveredMateria();
                }
              }
            }}
            onDrop={(e) => handleDrop(e, bloque)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
          >
            <div className="flex items-center gap-1">
              <span
                className={`font-semibold text-xs font-mono ${
                  bloque.isFilteredMatch
                    ? "text-purple-700 dark:text-purple-300 font-bold"
                    : "text-primary dark:text-primary-foreground"
                }`}
              >
                {bloque.grupos.length > 1
                  ? `${bloque.grupos.length} grupos`
                  : `Grupo ${bloque.grupos[0]}`}
              </span>
            </div>
            <span
              className={`text-[10px] font-medium ${
                bloque.isFilteredMatch
                  ? "text-purple-600/90 dark:text-purple-300/90 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {isDragging
                ? "Soltar para colocar"
                : bloque.isFilteredMatch
                  ? "Cumple filtro (Clic para colocar)"
                  : "Disponible (Clic para colocar)"}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}

export const ScheduleDropOverlay = memo(ScheduleDropOverlayComponent);
export default ScheduleDropOverlay;
