/* Hallmark · constants: schedule · genre: modern-minimal
 * Shared constants, days, hours and palette for the schedule grid.
 */

export const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const HORAS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM (6:00) a 9 PM (21:00)

export const SCHEDULE_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#ef4444", // red
];

/**
 * Retorna un color determinista y persistente para cada materia según su código o identificador.
 * Esto asegura que al agregar o remover otras materias, los colores ya asignados nunca cambien.
 */
export function getSubjectColor(identifier) {
  if (!identifier) return SCHEDULE_COLORS[0];
  const str = String(identifier).trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SCHEDULE_COLORS.length;
  return SCHEDULE_COLORS[index];
}

export const formatHora = (hora) => {
  const ampm = hora < 12 ? "AM" : "PM";
  const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora;
  return `${hora12}:00 ${ampm}`;
};

export const formatHoraCompact = (hora) => {
  return `${String(hora).padStart(2, "0")}:00`;
};

/**
 * Formatea y simplifica la denominación del aula o espacio para badges:
 * - Aulas o plataformas virtuales (INGENIA, UDE@, Virtual, etc.) se normalizan a "Virtual".
 * - "Laboratorio" se abrevia a "Lab" (ej: "Laboratorio 1" -> "Lab 1").
 * - Se elimina el prefijo redundante "Bloque " (ej: "Bloque 19-102" -> "19-102").
 *
 * @param {string} aula
 * @returns {string}
 */
export const formatAula = (aula) => {
  if (!aula || typeof aula !== "string") return "";

  const trimmed = aula.trim();
  if (!trimmed) return "";

  // 1. Detección de modalidades o plataformas virtuales (INGENIA, UDE@, Virtual, etc.)
  if (/(?:ingenia|ude@|virtual|en\s*l[ií]nea|teams|zoom|meet)/i.test(trimmed)) {
    return "Virtual";
  }

  // 2. Normalización de prefijo "Bloque" y abreviación de "Laboratorio" -> "Lab"
  return trimmed
    .replace(/^bloque\s+/i, "")
    .replace(/\blaboratorios?\b/gi, "Lab")
    .replace(/\blab\.\s*/gi, "Lab ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const DEFAULT_SCHEDULE_COLOR = "#3b82f6";

export const GRID_CONFIG = {
  HOURS_COLUMN_WIDTH: 72,
  TOTAL_DAYS: 7,
  MIN_CELL_WIDTH: 120,
};

export const ANIMATION_DURATIONS = {
  EXPLOSION_DELETE_MS: 240,
  EXPLOSION_STAGGER_MIN_MS: 45,
  EXPLOSION_STAGGER_MAX_MS: 90,
  CLEAR_TOTAL_BUFFER_MS: 380,
  ENTRANCE_PARTICLES_HIDE_MS: 550,
  SHAKE_DURATION_SEC: 0.45,
};

export const TOOLTIP_CONFIG = {
  MIN_SPACE_ABOVE: 170,
  MIN_SPACE_RIGHT: 260,
  HIDE_DELAY_MS: 30,
};

export const EXPORT_CONFIG = {
  PNG_FILENAME: "mi_horario_udea.png",
  PDF_FILENAME: "mi_horario_udea.pdf",
  CANVAS_SCALE: 2,
};

export const SCHEDULE_MESSAGES = {
  SCHEDULE_CLEARED: "Horario limpiado correctamente",
  MANUAL_BLOCK_DELETED: "Bloque manual eliminado",
  PNG_EXPORTED: "Horario exportado como PNG",
  PDF_EXPORTED: "Horario exportado como PDF",
  PNG_EXPORT_ERROR: "Error al exportar PNG",
  PDF_EXPORT_ERROR: "Error al exportar PDF",
  SCHEDULE_NOT_FOUND: "No se encontró el horario",
  GROUP_ALREADY_SELECTED: "Este grupo ya está seleccionado en este horario",
  SPACE_OCCUPIED: "Este espacio ya está ocupado por otra materia",
  NO_CLASS_AT_TIME: "Esta materia no tiene clases en este horario",
  NO_GROUPS_WITHOUT_CONFLICT: "No hay grupos disponibles sin conflicto de horario",
  NO_OTHER_HOURS_AVAILABLE: "No hay otros horarios disponibles para esta materia",
  DROP_TO_DELETE: "Arrastra aquí para eliminar del horario",
  RELEASE_TO_DELETE: "¡Soltar para eliminar del horario!",
};
