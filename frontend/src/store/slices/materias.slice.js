/**
 * Slice para gestionar los datos de materias académicas, programas y selecciones.
 */
export const createMateriasSlice = (set) => ({
  // Estado inicial de datos académicos
  materias: null,
  facultad: "",
  programa: { codigo: "", nombre: "" },
  semestre: "",
  fecha: "",
  isLoaded: false,
  resetKey: 0,

  // Selecciones de materias y grupos
  materiasSeleccionadas: {}, // { codigoMateria: true/false }
  gruposSeleccionados: {}, // { codigoMateria: numeroGrupo }
  expandedSubjects: {}, // { codigoMateria: true }

  // Acciones de carga y limpieza de datos
  setMateriasData: (data) =>
    set((state) => ({
      materias: data.materias,
      facultad: data.facultad,
      programa: data.programa,
      semestre: data.semestre,
      fecha: data.fecha,
      isLoaded: true,
      materiasSeleccionadas: {},
      gruposSeleccionados: {},
      horariosGenerados: [],
      horarioActualIndex: 0,
      previewGrupo: null,
      removedGroups: state.removedGroups ? [] : undefined,
      resetKey: (state.resetKey || 0) + 1,
    })),

  clearMaterias: () =>
    set({
      materias: null,
      facultad: "",
      programa: { codigo: "", nombre: "" },
      semestre: "",
      fecha: "",
      isLoaded: false,
      materiasSeleccionadas: {},
      gruposSeleccionados: {},
      horariosGenerados: [],
      horarioActualIndex: 0,
      manualBlocks: [],
      mobileActiveView: "sidebar",
      generationMode: "manual",
      horaMinima: 6,
      evitarHuecos: false,
    }),

  // Acciones de selección
  toggleMateriaSelected: (codigoMateria) =>
    set((state) => {
      const newSeleccionadas = { ...state.materiasSeleccionadas };
      if (newSeleccionadas[codigoMateria]) {
        delete newSeleccionadas[codigoMateria];
      } else {
        newSeleccionadas[codigoMateria] = true;
      }
      return { materiasSeleccionadas: newSeleccionadas };
    }),

  resetMateriasSeleccionadas: () =>
    set((state) => ({
      materiasSeleccionadas: {},
      gruposSeleccionados: {},
      expandedSubjects: {},
      resetKey: (state.resetKey || 0) + 1,
    })),

  selectGrupo: (codigoMateria, numeroGrupo) =>
    set((state) => ({
      gruposSeleccionados: {
        ...state.gruposSeleccionados,
        [codigoMateria]: numeroGrupo,
      },
    })),

  deleteMateriaFromSchedule: (codigoMateria) =>
    set((state) => {
      const newGrupos = { ...state.gruposSeleccionados };
      delete newGrupos[codigoMateria];
      delete newGrupos[String(codigoMateria)];
      delete newGrupos[Number(codigoMateria)];

      const newMaterias = { ...state.materiasSeleccionadas };
      delete newMaterias[codigoMateria];
      delete newMaterias[String(codigoMateria)];
      delete newMaterias[Number(codigoMateria)];

      const newExpanded = { ...(state.expandedSubjects || {}) };
      delete newExpanded[codigoMateria];
      delete newExpanded[String(codigoMateria)];

      return {
        gruposSeleccionados: newGrupos,
        materiasSeleccionadas: newMaterias,
        expandedSubjects: newExpanded,
        resetKey: (state.resetKey || 0) + 1,
      };
    }),

  toggleSubjectExpanded: (codigo, isExpanded) =>
    set((state) => {
      const current = { ...(state.expandedSubjects || {}) };
      const key = String(codigo);
      const shouldExpand =
        typeof isExpanded === "boolean" ? isExpanded : !current[key];
      if (shouldExpand) {
        current[key] = true;
      } else {
        delete current[key];
      }
      return { expandedSubjects: current };
    }),

  collapseAllSubjects: () => set({ expandedSubjects: {} }),

  // Selectores de estado
  isMateriaSelected: (codigoMateria) => (state) => {
    return !!state.materiasSeleccionadas[codigoMateria];
  },

  getMateriasSeleccionadas: () => (state) => {
    return Object.keys(state.materiasSeleccionadas);
  },
});
