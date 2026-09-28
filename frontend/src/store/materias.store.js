import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createMateriasSlice } from "./slices/materias.slice.js";
import { createScheduleSlice } from "./slices/schedule.slice.js";
import { createUiSlice } from "./slices/ui.slice.js";

/**
 * Store global modularizado de la aplicación mediante Zustand slices.
 * Maneja datos académicos, generación de horarios, persistencia y estado visual.
 */
export const useMateriasStore = create(
  persist(
    (...a) => ({
      ...createMateriasSlice(...a),
      ...createScheduleSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: "udea-schedule-store",
      partialize: (state) => ({
        materias: state.materias,
        facultad: state.facultad,
        programa: state.programa,
        semestre: state.semestre,
        fecha: state.fecha,
        isLoaded: state.isLoaded,
        materiasSeleccionadas: state.materiasSeleccionadas,
        gruposSeleccionados: state.gruposSeleccionados,
        horariosGenerados: state.horariosGenerados,
        horarioActualIndex: state.horarioActualIndex,
        manualBlocks: state.manualBlocks,
        allowManualBlocks: state.allowManualBlocks,
        allowManualBlocksBySchedule: state.allowManualBlocksBySchedule,
        generationMode: state.generationMode,
        horaMinima: state.horaMinima,
        evitarHuecos: state.evitarHuecos,
        darkTheme: state.darkTheme,
      }),
    },
  ),
);

export default useMateriasStore;
