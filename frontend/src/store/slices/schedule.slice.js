/**
 * Slice para gestionar la generación de horarios, paginación y bloques manuales.
 */
export const createScheduleSlice = (set) => ({
  // Horarios generados automáticamente y navegación
  horariosGenerados: [],
  horarioActualIndex: 0,
  generationMode: "manual", // 'manual' | 'automatico'
  horaMinima: 6,
  evitarHuecos: false,

  // Bloques manuales creados por el usuario (click+drag)
  manualBlocks: [], // { id, name, diaIndex, horaIndex, duracion, color, pulsing }
  allowManualBlocks: false,
  allowManualBlocksLocked: false,
  previousAllowManualBlocks: null,
  allowManualBlocksBySchedule: {},

  // Modos de generación y filtros
  setGenerationMode: (mode) => set({ generationMode: mode }),
  setHoraMinima: (hora) => set({ horaMinima: hora }),
  setEvitarHuecos: (val) => set({ evitarHuecos: val }),

  // Guardar horarios generados automáticamente
  setHorariosGenerados: (horarios) =>
    set((state) => {
      const allowMap = {};
      if (horarios && horarios.length > 0) {
        for (let i = 0; i < horarios.length; i++) {
          if (
            state.allowManualBlocksBySchedule &&
            typeof state.allowManualBlocksBySchedule[i] !== "undefined"
          ) {
            allowMap[i] = !!state.allowManualBlocksBySchedule[i];
          } else {
            allowMap[i] = !!state.allowManualBlocks;
          }
        }
      }

      return {
        horariosGenerados: horarios,
        horarioActualIndex: 0,
        allowManualBlocksBySchedule: allowMap,
        manualBlocks: (state.manualBlocks || []).map((b) => ({
          ...b,
          scheduleIndex:
            horarios && horarios.length > 0
              ? typeof b.scheduleIndex === "number"
                ? b.scheduleIndex
                : 0
              : b.scheduleIndex,
        })),
      };
    }),

  // Cambiar el horario que se está visualizando
  setHorarioActualIndex: (index) =>
    set({
      horarioActualIndex: index,
    }),

  // Limpiar horarios generados
  clearHorariosGenerados: () =>
    set({
      horariosGenerados: [],
      horarioActualIndex: 0,
      allowManualBlocksBySchedule: {},
    }),

  // Gestión de bloques manuales
  addManualBlock: (block) =>
    set((state) => ({
      manualBlocks: [...(state.manualBlocks || []), block],
    })),

  removeManualBlock: (id) =>
    set((state) => ({
      manualBlocks: (state.manualBlocks || []).filter((b) => b.id !== id),
    })),

  renameManualBlock: (id, name) =>
    set((state) => ({
      manualBlocks: (state.manualBlocks || []).map((b) =>
        b.id === id ? { ...b, name } : b,
      ),
    })),

  updateManualBlock: (id, props) =>
    set((state) => ({
      manualBlocks: (state.manualBlocks || []).map((b) =>
        b.id === id ? { ...b, ...props } : b,
      ),
    })),

  clearManualBlocks: () => set({ manualBlocks: [] }),

  // Preferencias de bloques manuales
  setAllowManualBlocks: (value) => set({ allowManualBlocks: !!value }),

  toggleAllowManualBlocks: () =>
    set((state) => {
      if (state.allowManualBlocksLocked) return state;
      return { allowManualBlocks: !state.allowManualBlocks };
    }),

  // Bloquear temporalmente la preferencia
  lockAllowManualBlocks: () =>
    set((state) => ({
      previousAllowManualBlocks: state.allowManualBlocks,
      allowManualBlocks: false,
      allowManualBlocksLocked: true,
    })),

  // Desbloquear y restaurar el valor previo
  unlockAllowManualBlocks: () =>
    set((state) => ({
      allowManualBlocks:
        state.previousAllowManualBlocks !== null
          ? state.previousAllowManualBlocks
          : false,
      allowManualBlocksLocked: false,
      previousAllowManualBlocks: null,
    })),

  // Preferencias de bloques manuales por horario
  setAllowManualBlocksForSchedule: (index, value) =>
    set((state) => ({
      allowManualBlocksBySchedule: {
        ...(state.allowManualBlocksBySchedule || {}),
        [index]: !!value,
      },
    })),

  clearAllowManualBlocksBySchedule: () =>
    set({ allowManualBlocksBySchedule: {} }),
});
