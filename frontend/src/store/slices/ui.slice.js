/**
 * Slice para gestionar el estado visual, tema, navegación móvil, drag and drop e interactividad.
 */
export const createUiSlice = (set) => ({
  // Tema visual
  darkTheme: false,
  themeSyncEnabled: false,

  setDarkTheme: (isDark) => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ darkTheme: isDark });
  },

  toggleDarkTheme: () =>
    set((state) => {
      const nextDark = !state.darkTheme;
      if (typeof document !== "undefined") {
        if (nextDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return {
        darkTheme: nextDark,
        themeSyncEnabled: false,
      };
    }),

  syncThemeWithSystem: (isDark) =>
    set((state) => {
      if (state.themeSyncEnabled) {
        if (typeof document !== "undefined") {
          if (isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        return { darkTheme: isDark };
      }
      return {};
    }),

  // Navegación y transiciones móviles
  mobileActiveView: "sidebar", // 'sidebar' | 'schedule'
  setMobileActiveView: (view) => set({ mobileActiveView: view }),
  miniPreviewPos: null, // { top, left }
  setMiniPreviewPos: (pos) => set({ miniPreviewPos: pos }),
  miniPreviewRect: null,
  setMiniPreviewRect: (rect) => set({ miniPreviewRect: rect }),
  mobileTransition: null, // null | 'shrinking' | 'expanding'
  setMobileTransition: (t) => set({ mobileTransition: t }),

  // Drag and Drop y selección de grupos en conflicto
  dragEnabled: false,
  draggingMateria: null,
  hoveredScheduleCell: null,
  availableHorarios: [],
  showGrupoSelector: false,
  gruposConflicto: [],
  previewGrupo: null,
  pendingModal: false,
  lastDropSuccessful: false,

  setDragEnabled: (value) => set({ dragEnabled: !!value }),

  setDraggingMateria: (materia) =>
    set({
      draggingMateria: materia,
      availableHorarios: [],
      lastDropSuccessful: false,
    }),

  setHoveredScheduleCell: (cell) =>
    set({
      hoveredScheduleCell: cell,
    }),

  setAvailableHorarios: (horarios) =>
    set({
      availableHorarios: horarios,
    }),

  setShowGrupoSelector: (show, grupos = []) => {
    set({
      showGrupoSelector: show,
      gruposConflicto: grupos,
      pendingModal: show && grupos.length > 0,
    });
  },

  setPreviewGrupo: (preview) =>
    set({
      previewGrupo: preview,
    }),

  setLastDropSuccessful: (val) => set({ lastDropSuccessful: Boolean(val) }),

  clearDragState: () =>
    set((state) => {
      if (state.pendingModal) {
        return state;
      }
      return {
        draggingMateria: null,
        hoveredScheduleCell: null,
        availableHorarios: [],
        previewGrupo: null,
        showGrupoSelector: false,
        gruposConflicto: [],
        pendingModal: false,
      };
    }),

  // Navegación, focus y efectos en materias
  focusedMateriaCodigo: null,
  focusedGrupoNumero: null,
  focusTimestamp: 0,
  shakeMateriaCodigo: null,
  shakeTimestamp: 0,
  triggerClearScheduleSequence: 0,

  focusMateria: (codigo, grupoNumero = null) =>
    set((state) => {
      const currentExpanded = { ...(state.expandedSubjects || {}) };
      if (codigo) {
        currentExpanded[String(codigo)] = true;
      }
      return {
        focusedMateriaCodigo: codigo ? String(codigo) : null,
        focusedGrupoNumero:
          grupoNumero !== null && typeof grupoNumero !== "undefined"
            ? String(grupoNumero)
            : null,
        focusTimestamp: Date.now(),
        expandedSubjects: currentExpanded,
      };
    }),

  clearFocusedMateria: () =>
    set({ focusedMateriaCodigo: null, focusedGrupoNumero: null }),

  triggerShakeMateria: (codigo) => {
    set((state) => ({
      shakeMateriaCodigo: codigo ? String(codigo) : null,
      shakeTimestamp: Math.max(Date.now(), (state.shakeTimestamp || 0) + 1),
    }));
  },

  requestClearSchedule: () =>
    set((state) => ({
      triggerClearScheduleSequence:
        (state.triggerClearScheduleSequence || 0) + 1,
    })),

  // Notificaciones internas
  notify: (message) => {
    console.log("Notify:", message);
  },
  setNotifier: (fn) => set({ notify: fn }),
});
