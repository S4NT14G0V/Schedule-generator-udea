import { DIAS } from "@/features/schedule/constants/schedule.js";

/**
 * Normaliza la primera letra de un texto ignorando diacríticos (tildes).
 * Por ejemplo: "Álgebra" -> "A", "Ética" -> "E".
 */
export function getNormalizedInitialLetter(str) {
  if (!str) return "#";
  const trimmed = str.trim();
  if (!trimmed) return "#";
  const firstChar = trimmed.charAt(0).toUpperCase();
  return firstChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Filtra materias según búsqueda por texto, filtro rápido, letra, horas y días.
 */
export function filterSubjects({
  materias = [],
  searchTerm = "",
  quickFilter = "all",
  selectedLetter = null,
  horaMinimaFilter = 6,
  horaMaximaFilter = 22,
  selectedDias = [],
  generationMode = "manual",
  gruposSeleccionados = {},
  materiasSeleccionadas = {},
}) {
  if (!materias || materias.length === 0) return [];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const selectedDiasSet = new Set(selectedDias);
  const isSearchActive = normalizedSearch.length > 0;
  const isHourFilterActive = horaMinimaFilter > 6 || horaMaximaFilter < 22;
  const isDayFilterActive = selectedDiasSet.size > 0;

  return materias.filter((materia) => {
    // 1. Filtro por término de búsqueda (nombre o código)
    if (isSearchActive) {
      const matchName = materia.nombre?.toLowerCase().includes(normalizedSearch);
      const matchCode = String(materia.codigo || "").toLowerCase().includes(normalizedSearch);
      if (!matchName && !matchCode) return false;
    }

    // 2. Filtro Rápido (todas | disponibles | seleccionadas)
    if (quickFilter === "selected") {
      const cod = String(materia.codigo);
      const isSel =
        generationMode === "manual"
          ? (gruposSeleccionados[cod] !== null &&
              typeof gruposSeleccionados[cod] !== "undefined") ||
            (gruposSeleccionados[materia.codigo] !== null &&
              typeof gruposSeleccionados[materia.codigo] !== "undefined")
          : Boolean(
              materiasSeleccionadas[cod] || materiasSeleccionadas[materia.codigo],
            );
      if (!isSel) return false;
    } else if (quickFilter === "available") {
      const hasCupos = (materia.grupos || []).some(
        (g) => (g.cupoDisponible || 0) > 0,
      );
      if (!hasCupos) return false;
    }

    // 3. Filtro por Letra inicial
    if (selectedLetter) {
      const firstLetter = getNormalizedInitialLetter(materia.nombre);
      if (firstLetter !== selectedLetter) return false;
    }

    // 4. Filtro por Intervalo Horario
    if (isHourFilterActive) {
      const hasValidSchedule = (materia.grupos || []).some((g) =>
        (g.horarios || []).some(
          (h) =>
            h.horaInicio >= horaMinimaFilter && h.horaFin <= horaMaximaFilter,
        ),
      );
      if (!hasValidSchedule) return false;
    }

    // 5. Filtro por Días seleccionados
    if (isDayFilterActive) {
      const hasMatchingDay = (materia.grupos || []).some((g) =>
        (g.horarios || []).some((h) =>
          (h.dias || []).some((d) => selectedDiasSet.has(d)),
        ),
      );
      if (!hasMatchingDay) return false;
    }

    return true;
  });
}

/**
 * Agrupa una lista de materias alfabéticamente por letra inicial normalizada.
 */
export function groupSubjectsByLetter(materiasList = []) {
  const groups = {};

  materiasList.forEach((materia) => {
    const letter = getNormalizedInitialLetter(materia.nombre);
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(materia);
  });

  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .map((letter) => ({
      letter,
      items: groups[letter].sort((a, b) =>
        (a.nombre || "").localeCompare(b.nombre || "", "es", {
          sensitivity: "base",
        }),
      ),
    }));
}

/**
 * Calcula las celdas ocupadas en el horario a partir de los grupos seleccionados.
 */
export function calculateOccupiedScheduleCells(materias, gruposSeleccionados) {
  if (!gruposSeleccionados) return new Map();
  const map = new Map();
  const allMaterias = Array.isArray(materias) ? materias : [];

  Object.entries(gruposSeleccionados).forEach(([cod, numGrp]) => {
    if (!cod || !numGrp) return;
    const mat = allMaterias.find((m) => String(m.codigo) === String(cod));
    const g = mat?.grupos?.find((gr) => String(gr.numero) === String(numGrp));

    (g?.horarios || []).forEach((h) => {
      (h.dias || []).forEach((d) => {
        const dIdx = DIAS.indexOf(d);
        if (dIdx !== -1) {
          for (let hr = h.horaInicio; hr < h.horaFin; hr++) {
            map.set(`${dIdx}-${hr}`, String(cod));
          }
        }
      });
    });
  });

  return map;
}

/**
 * Calcula las celdas ocupadas por bloques manuales en el horario.
 */
export function calculateOccupiedManualCells(manualBlocks) {
  const set = new Set();
  if (manualBlocks && manualBlocks.length > 0) {
    manualBlocks.forEach((b) => {
      for (let k = 0; k < b.duracion; k++) {
        set.add(`${b.diaIndex}-${b.horaIndex + 6 + k}`);
      }
    });
  }
  return set;
}
