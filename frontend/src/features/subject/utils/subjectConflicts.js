import { DIAS } from "@/features/schedule/constants/schedule.js";

/**
 * Comprueba si un grupo colisiona con celdas ocupadas en el horario actual
 * o con bloques manuales personalizados.
 */
export function checkGroupConflict(
  grp,
  materiaCodigo,
  occupiedScheduleCells,
  occupiedManualCells,
) {
  if (!grp?.horarios || grp.horarios.length === 0) return false;

  return grp.horarios.some((horario) => {
    return (horario.dias || []).some((dia) => {
      const diaIndex = DIAS.indexOf(dia);
      if (diaIndex === -1) return false;

      for (let hr = horario.horaInicio; hr < horario.horaFin; hr++) {
        const cellKey = `${diaIndex}-${hr}`;
        const occupiedCod = occupiedScheduleCells?.get?.(cellKey);
        if (occupiedCod && String(occupiedCod) !== String(materiaCodigo)) {
          return true;
        }
        if (occupiedManualCells?.has?.(cellKey)) {
          return true;
        }
      }
      return false;
    });
  });
}

/**
 * Comprueba si existen filtros avanzados activos.
 */
export function hasActiveFilters(activeFilters = {}) {
  return Boolean(
    (activeFilters.selectedDias && activeFilters.selectedDias.length > 0) ||
    (activeFilters.horaMinimaFilter && activeFilters.horaMinimaFilter > 6) ||
    (activeFilters.horaMaximaFilter && activeFilters.horaMaximaFilter < 22) ||
    activeFilters.selectedJornada,
  );
}

/**
 * Verifica si un grupo cumple con los filtros avanzados aplicados
 * (días, franja horaria o jornada).
 */
export function checkGrupoMatchesFilter(grupo, activeFilters = {}) {
  const hasActiveAdvancedFilters = hasActiveFilters(activeFilters);

  if (!hasActiveAdvancedFilters || !grupo?.horarios) return true;

  if (activeFilters.selectedDias?.length > 0) {
    const hasDay = grupo.horarios.some((h) =>
      (h.dias || []).some((d) => activeFilters.selectedDias.includes(d)),
    );
    if (!hasDay) return false;
  }

  const minH = activeFilters.horaMinimaFilter ?? 6;
  const maxH = activeFilters.horaMaximaFilter ?? 22;
  if (minH > 6 || maxH < 22) {
    const hasValidHour = grupo.horarios.some(
      (h) => h.horaInicio >= minH && h.horaFin <= maxH,
    );
    if (!hasValidHour) return false;
  }

  if (activeFilters.selectedJornada) {
    const hasJornada = grupo.horarios.some((h) => {
      if (activeFilters.selectedJornada === "manana") return h.horaInicio < 12;
      if (activeFilters.selectedJornada === "tarde") return h.horaInicio >= 12 && h.horaInicio < 18;
      if (activeFilters.selectedJornada === "noche") return h.horaInicio >= 18;
      return true;
    });
    if (!hasJornada) return false;
  }

  return true;
}

/**
 * Calcula las estadísticas de cupos para una materia.
 */
export function calculateSubjectCupos(materia) {
  const totalGrupos = materia?.grupos?.length || 0;
  let gruposConCupo = 0;
  let totalCupos = 0;

  if (materia?.grupos) {
    for (const g of materia.grupos) {
      const cupos = g.cupoDisponible || 0;
      if (cupos > 0) gruposConCupo++;
      totalCupos += cupos;
    }
  }

  return {
    totalGrupos,
    gruposConCupo,
    totalCupos,
    hasZeroCuposGlobally: totalCupos === 0,
  };
}

/**
 * Comprueba si todos los grupos con cupo disponible de una materia tienen conflicto en el horario.
 */
export function checkAllGroupsConflicted(
  materia,
  isManualMode,
  grupoSeleccionado,
  hasZeroCuposGlobally,
  occupiedScheduleCells,
  occupiedManualCells,
) {
  if (
    !isManualMode ||
    hasZeroCuposGlobally ||
    !materia?.grupos ||
    materia.grupos.length === 0 ||
    grupoSeleccionado
  ) {
    return false;
  }

  const availableWithCupos = materia.grupos.filter(
    (g) => typeof g.cupoDisponible !== "number" || g.cupoDisponible > 0,
  );
  if (availableWithCupos.length === 0) return false;

  return availableWithCupos.every((g) =>
    checkGroupConflict(
      g,
      materia?.codigo,
      occupiedScheduleCells,
      occupiedManualCells,
    ),
  );
}
