import { DIAS, HORAS, SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";

/**
 * Verifica si un grupo de una materia tiene conflicto de horario con otras materias
 * ya colocadas en la cuadrícula (usando el mapa celdasMateria).
 *
 * @param {Object} grupo - Grupo a validar con su array de horarios
 * @param {string|number} activeCodigo - Código de la materia actual (para ignorar sus propias celdas)
 * @param {Map<string, string>} celdasMateria - Mapa de coordenadas 'diaIdx-horaIdx' a código de materia
 * @returns {boolean} True si existe un solapamiento con otra materia
 */
export function groupHasConflict(grupo, activeCodigo = null, celdasMateria = null) {
  if (!grupo || !grupo.horarios || !celdasMateria) return false;

  const targetCodeStr = activeCodigo !== null ? String(activeCodigo) : null;

  for (const horario of grupo.horarios) {
    if (!horario.dias) continue;

    const horaInicioIndex = HORAS.indexOf(horario.horaInicio);
    if (horaInicioIndex === -1) continue;

    const duracion = (horario.horaFin || 0) - (horario.horaInicio || 0);
    if (duracion <= 0) continue;

    for (const dia of horario.dias) {
      const diaIndex = DIAS.indexOf(dia);
      if (diaIndex === -1) continue;

      for (let i = 0; i < duracion; i++) {
        const celdaKey = `${diaIndex}-${horaInicioIndex + i}`;
        const materiaEnCelda = celdasMateria.get(celdaKey);

        if (materiaEnCelda && String(materiaEnCelda) !== targetCodeStr) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Valida un grupo contra el estado de grupos seleccionados en el store.
 */
export function checkGroupConflictWithStore(grupoToTest, activeCodigo, storeState) {
  if (!grupoToTest || !grupoToTest.horarios) return false;

  const { materias: todasMaterias = [], gruposSeleccionados = {} } = storeState || {};
  const celdasOtras = new Set();
  const activeCodeStr = String(activeCodigo);

  // Indexar las celdas ocupadas por otras materias seleccionadas
  Object.entries(gruposSeleccionados).forEach(([cod, gNum]) => {
    if (!gNum || String(cod) === activeCodeStr) return;

    const mat = todasMaterias.find((m) => String(m.codigo) === String(cod));
    const grp = mat?.grupos?.find((g) => String(g.numero) === String(gNum));

    (grp?.horarios || []).forEach((h) => {
      const hIdx = HORAS.indexOf(h.horaInicio);
      const dur = (h.horaFin || 0) - (h.horaInicio || 0);
      if (hIdx === -1 || dur <= 0) return;

      (h.dias || []).forEach((d) => {
        const dIdx = DIAS.indexOf(d);
        if (dIdx !== -1) {
          for (let i = 0; i < dur; i++) {
            celdasOtras.add(`${dIdx}-${hIdx + i}`);
          }
        }
      });
    });
  });

  // Validar si algún bloque del grupo a probar cae en celda ocupada
  return (grupoToTest.horarios || []).some((h) => {
    const hIdx = HORAS.indexOf(h.horaInicio);
    const dur = (h.horaFin || 0) - (h.horaInicio || 0);
    if (hIdx === -1 || dur <= 0) return false;

    return (h.dias || []).some((d) => {
      const dIdx = DIAS.indexOf(d);
      if (dIdx === -1) return false;

      for (let i = 0; i < dur; i++) {
        if (celdasOtras.has(`${dIdx}-${hIdx + i}`)) {
          return true;
        }
      }
      return false;
    });
  });
}

/**
 * Valida el intento de soltar una materia sobre una celda específica de la cuadrícula.
 */
export function validateDropTarget({
  currentDragging,
  diaIndex,
  horaIndex,
  storeState,
  celdasMateria,
}) {
  if (!currentDragging) {
    return { isValid: false, grupos: [], errorMessage: null };
  }

  const dia = DIAS[diaIndex];
  const hora = HORAS[horaIndex];
  const activeCodigo = currentDragging.codigo;
  const grupoActual =
    storeState.gruposSeleccionados?.[activeCodigo] ??
    storeState.gruposSeleccionados?.[String(activeCodigo)];

  const gruposEnEstaCelda = (currentDragging.grupos || []).filter((grupo) => {
    if (grupoActual !== undefined && grupoActual !== null && String(grupo.numero) === String(grupoActual)) {
      return false;
    }
    if (typeof grupo.cupoDisponible === "number" && grupo.cupoDisponible <= 0) {
      return false;
    }
    if (groupHasConflict(grupo, activeCodigo, celdasMateria)) {
      return false;
    }
    return (grupo.horarios || []).some((horario) => {
      return (
        (horario.dias || []).includes(dia) &&
        hora >= horario.horaInicio &&
        hora < horario.horaFin
      );
    });
  });

  if (gruposEnEstaCelda.length > 0) {
    return {
      isValid: true,
      grupos: gruposEnEstaCelda,
      errorMessage: null,
    };
  }

  const grupoActualObj = (currentDragging.grupos || []).find(
    (g) => grupoActual && String(g.numero) === String(grupoActual),
  );
  const isCurrentGroupCell =
    grupoActualObj &&
    (grupoActualObj.horarios || []).some((h) =>
      (h.dias || []).includes(dia) && hora >= h.horaInicio && hora < h.horaFin,
    );

  const celdaKey = `${diaIndex}-${horaIndex}`;
  const materiaEnCelda = celdasMateria?.get(celdaKey);
  const isOccupiedByOther =
    (materiaEnCelda && String(materiaEnCelda) !== String(activeCodigo)) ||
    (storeState.manualBlocks || []).some(
      (b) =>
        b.diaIndex === diaIndex &&
        horaIndex >= b.horaIndex &&
        horaIndex < b.horaIndex + b.duracion,
    );

  const anyGroupAtThisTime = (currentDragging.grupos || []).some((g) =>
    (g.horarios || []).some(
      (h) => (h.dias || []).includes(dia) && hora >= h.horaInicio && hora < h.horaFin,
    ),
  );

  let errorMessage = SCHEDULE_MESSAGES.NO_GROUPS_WITHOUT_CONFLICT;
  if (isCurrentGroupCell) {
    errorMessage = SCHEDULE_MESSAGES.GROUP_ALREADY_SELECTED;
  } else if (isOccupiedByOther) {
    errorMessage = SCHEDULE_MESSAGES.SPACE_OCCUPIED;
  } else if (!anyGroupAtThisTime) {
    errorMessage = SCHEDULE_MESSAGES.NO_CLASS_AT_TIME;
  }

  return {
    isValid: false,
    grupos: [],
    errorMessage,
  };
}
