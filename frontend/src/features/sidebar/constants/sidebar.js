export const GENERATION_MODES = {
  MANUAL: "manual",
  AUTOMATICO: "automatico",
};

export const MODES = [
  { id: GENERATION_MODES.MANUAL, label: "Manual" },
  { id: GENERATION_MODES.AUTOMATICO, label: "Automático" },
];

export const HORA_OPTIONS = [
  { value: 6, label: "6:00 AM" },
  { value: 7, label: "7:00 AM" },
  { value: 8, label: "8:00 AM" },
  { value: 9, label: "9:00 AM" },
  { value: 10, label: "10:00 AM" },
  { value: 11, label: "11:00 AM" },
  { value: 12, label: "12:00 PM" },
  { value: 13, label: "1:00 PM" },
  { value: 14, label: "2:00 PM" },
];

export const HORA_MAXIMA_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const value = i + 6;
  return { value, label: `${value}:00` };
});

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const DIAS_SEMANA_FILTRO = [
  { id: "Lunes", label: "Lun" },
  { id: "Martes", label: "Mar" },
  { id: "Miércoles", label: "Mié" },
  { id: "Jueves", label: "Jue" },
  { id: "Viernes", label: "Vie" },
  { id: "Sábado", label: "Sáb" },
];

export const JORNADAS = [
  { id: "manana", label: "Mañana", range: "06:00 - 12:00", min: 6, max: 12 },
  { id: "tarde", label: "Tarde", range: "12:00 - 18:00", min: 12, max: 18 },
  { id: "noche", label: "Noche", range: "18:00 - 22:00", min: 18, max: 22 },
];

export const POPOVER_CONFIG = {
  ESTIMATED_FILTER_HEIGHT: 440,
  ESTIMATED_PREFERENCES_HEIGHT: 360,
  ASIDE_GAP: 8,
  VIEWPORT_MARGIN: 12,
  BOTTOM_SAFETY_MARGIN: 16,
};

export const SIDEBAR_CONFIG = {
  SEARCH_DEBOUNCE_MS: 250,
  SCROLL_HEADER_OFFSET: 40,
  SCROLL_PROGRAMMATIC_TIMEOUT_MS: 150,
};
