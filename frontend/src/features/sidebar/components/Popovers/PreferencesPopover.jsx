import { memo, useMemo, useCallback } from "react";
import { useMateriasStore } from "@/store/materias.store.js";
import { Switch } from "@/features/ui";
import { HORA_OPTIONS, GENERATION_MODES, POPOVER_CONFIG } from "@/features/sidebar/constants/sidebar.js";
import { ChevronDownIcon } from "@/icons/index.js";
import { usePopoverPosition } from "@/features/sidebar/hooks/usePopoverPosition.js";
import { PopoverContainer } from "./PopoverContainer.jsx";

function PreferencesPopoverComponent({
  isOpen,
  onClose,
  anchorRef,
  generationMode,
  horaMinima,
  setHoraMinima,
  evitarHuecos,
  setEvitarHuecos,
  dragEnabled,
  setDragEnabled,
  isMobile,
}) {
  const coords = usePopoverPosition(
    anchorRef,
    isOpen,
    isMobile,
    POPOVER_CONFIG.ESTIMATED_PREFERENCES_HEIGHT,
  );

  const {
    horariosGenerados = [],
    horarioActualIndex,
    manualBlocks = [],
    allowManualBlocks,
    setAllowManualBlocks,
    allowManualBlocksLocked,
    allowManualBlocksBySchedule,
    setAllowManualBlocksForSchedule,
    updateManualBlock,
    hoverPreviewEnabled,
    setHoverPreviewEnabled,
  } = useMateriasStore();

  const hasBlocksThisSchedule = useMemo(() => {
    return manualBlocks.some((b) => b.scheduleIndex === horarioActualIndex);
  }, [manualBlocks, horarioActualIndex]);

  const currentAllowManualBlocksForCurrentSchedule = useMemo(() => {
    if (
      allowManualBlocksBySchedule &&
      typeof allowManualBlocksBySchedule[horarioActualIndex] !== "undefined"
    ) {
      return allowManualBlocksBySchedule[horarioActualIndex];
    }
    return hasBlocksThisSchedule;
  }, [allowManualBlocksBySchedule, horarioActualIndex, hasBlocksThisSchedule]);

  const handleToggleManualBlocksSchedule = useCallback(() => {
    const hasHorarios = horariosGenerados.length > 0;
    if (!hasHorarios) return;

    const nextState = !currentAllowManualBlocksForCurrentSchedule;
    setAllowManualBlocksForSchedule(horarioActualIndex, nextState);

    if (nextState && manualBlocks.length > 0) {
      manualBlocks.forEach((b) => {
        if (b.scheduleIndex === undefined || b.scheduleIndex === null) {
          updateManualBlock(b.id, { scheduleIndex: horarioActualIndex });
        }
      });
    }
  }, [
    horariosGenerados,
    currentAllowManualBlocksForCurrentSchedule,
    horarioActualIndex,
    manualBlocks,
    setAllowManualBlocksForSchedule,
    updateManualBlock,
  ]);

  if (!isOpen) return null;
  if (isMobile && generationMode !== GENERATION_MODES.AUTOMATICO) return null;

  const isAutomaticMode = generationMode === GENERATION_MODES.AUTOMATICO;
  const hasHorarios = horariosGenerados.length > 0;

  return (
    <PopoverContainer
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      coords={coords}
    >
      <div className="space-y-4 text-xs select-none text-left">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              Preferencias
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md font-bold bg-primary/10 text-primary border border-primary/20">
              {isAutomaticMode ? "Automático" : "Manual"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar preferencias"
            className="h-6 w-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-xs leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {isAutomaticMode ? (
            <>
              {/* Hora Mínima */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-medium text-zinc-700 dark:text-zinc-300">
                  <span>Hora mínima de inicio</span>
                  <span className="font-mono font-bold text-primary tabular-nums">
                    {String(horaMinima).padStart(2, "0")}:00
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={horaMinima}
                    onChange={(e) => setHoraMinima(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 rounded-md text-xs font-medium text-zinc-800 dark:text-zinc-200 appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-mono"
                  >
                    {HORA_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="dark:bg-zinc-900"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Evitar Huecos */}
              <div
                className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none"
                onClick={() => setEvitarHuecos(!evitarHuecos)}
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Evitar huecos extensos
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    Prioriza horarios continuos
                  </span>
                </div>
                <Switch
                  checked={evitarHuecos}
                  onChange={() => setEvitarHuecos(!evitarHuecos)}
                  label="Evitar horarios con huecos extensos"
                />
              </div>

              {/* Bloques Manuales por Horario (Desktop) */}
              {!isMobile && (
                <div
                  className={`flex items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none ${
                    !hasHorarios ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => hasHorarios && handleToggleManualBlocksSchedule()}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Bloques manuales por horario
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Añade actividades propias en cada opción
                    </span>
                  </div>
                  <Switch
                    checked={currentAllowManualBlocksForCurrentSchedule}
                    onChange={handleToggleManualBlocksSchedule}
                    disabled={!hasHorarios}
                    label="Permitir bloques manuales por horario"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Drag & Drop */}
              {!isMobile && (
                <div
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setDragEnabled(!dragEnabled)}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Arrastrar al horario (Drag &amp; Drop)
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Arrastra materias directamente a la cuadrícula
                    </span>
                  </div>
                  <Switch
                    checked={dragEnabled}
                    onChange={() => setDragEnabled(!dragEnabled)}
                    label="Permitir arrastrar materias al horario"
                  />
                </div>
              )}

              {/* Previsualizar al pasar el cursor (Hover Preview) */}
              {!isMobile && (
                <div
                  className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none"
                  onClick={() => setHoverPreviewEnabled(!hoverPreviewEnabled)}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Previsualizar al pasar el cursor (Hover)
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Muestra los espacios disponibles en el horario
                    </span>
                  </div>
                  <Switch
                    checked={hoverPreviewEnabled}
                    onChange={() => setHoverPreviewEnabled(!hoverPreviewEnabled)}
                    label="Previsualizar materias en el horario al hacer hover"
                  />
                </div>
              )}

              {/* Bloques Manuales Globales */}
              {!isMobile && (
                <div
                  className={`flex items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800 cursor-pointer select-none ${
                    allowManualBlocksLocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    !allowManualBlocksLocked &&
                    setAllowManualBlocks(!allowManualBlocks)
                  }
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Crear bloques manuales
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Habilita bloques de estudio personalizados
                    </span>
                  </div>
                  <Switch
                    checked={allowManualBlocks}
                    onChange={() =>
                      !allowManualBlocksLocked &&
                      setAllowManualBlocks(!allowManualBlocks)
                    }
                    disabled={allowManualBlocksLocked}
                    label="Permitir crear bloques manuales"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PopoverContainer>
  );
}

export const PreferencesPopover = memo(PreferencesPopoverComponent);
export default PreferencesPopover;
