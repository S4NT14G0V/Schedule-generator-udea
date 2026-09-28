import { DIAS, HORAS, getSubjectColor } from "@/features/schedule/constants/schedule.js";

/**
 * Reconstruye la lista unificada de clases del horario activo (manual o automático),
 * incluyendo los bloques de materias seleccionadas y los bloques manuales.
 */
export function buildCurrentClasses({
  isManualMode,
  materias = [],
  gruposSeleccionados = {},
  horariosGenerados = [],
  horarioActualIndex = 0,
  manualBlocks = [],
}) {
  const list = [];

  // 1. Modo manual: materias con grupos seleccionados
  if (isManualMode && materias && gruposSeleccionados) {
    Object.entries(gruposSeleccionados).forEach(
      ([codigoMateria, numeroGrupo]) => {
        if (numeroGrupo === null || numeroGrupo === undefined) return;
        const mat = materias.find(
          (m) => String(m.codigo) === String(codigoMateria),
        );
        if (!mat) return;
        const grp = (mat.grupos || []).find((g) => g.numero === numeroGrupo);
        if (!grp) return;
        const color = getSubjectColor(mat.codigo || mat.nombre);

        (grp.horarios || []).forEach((h) => {
          (h.dias || []).forEach((dia) => {
            const diaIndex = DIAS.indexOf(dia);
            if (diaIndex !== -1) {
              list.push({
                id: `man-${mat.codigo}-${grp.numero}-${dia}-${h.horaInicio}`,
                codigoMateria: mat.codigo,
                nombreMateria: mat.nombre,
                numeroGrupo: grp.numero,
                profesor: grp.profesor || "Sin profesor asignado",
                aula: h.aula || "Por definir",
                dia,
                diaIndex,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
                duracion: h.horaFin - h.horaInicio,
                color,
                isManual: false,
              });
            }
          });
        });
      },
    );
  } else if (horariosGenerados && horariosGenerados.length > 0) {
    // 2. Modo automático: grupos del horario generado actual
    const schedule =
      horariosGenerados[horarioActualIndex] || horariosGenerados[0];
    if (schedule && schedule.grupos) {
      schedule.grupos.forEach((g) => {
        const color = getSubjectColor(g.codigoMateria || g.nombreMateria);
        (g.horarios || []).forEach((h) => {
          (h.dias || []).forEach((dia) => {
            const diaIndex = DIAS.indexOf(dia);
            if (diaIndex !== -1) {
              list.push({
                id: `auto-${g.codigoMateria}-${g.numeroGrupo}-${dia}-${h.horaInicio}`,
                codigoMateria: g.codigoMateria,
                nombreMateria: g.nombreMateria,
                numeroGrupo: g.numeroGrupo,
                profesor: g.profesor || "Sin profesor asignado",
                aula: h.aula || "Por definir",
                dia,
                diaIndex,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
                duracion: h.horaFin - h.horaInicio,
                color,
                isManual: false,
              });
            }
          });
        });
      });
    }
  }

  // 3. Bloques manuales creados por el usuario
  if (manualBlocks && manualBlocks.length > 0) {
    manualBlocks.forEach((b) => {
      const belongsToCurrent =
        horariosGenerados && horariosGenerados.length > 0
          ? typeof b.scheduleIndex === "number"
            ? b.scheduleIndex === horarioActualIndex
            : false
          : true;
      if (!belongsToCurrent) return;

      const dia = DIAS[b.diaIndex];
      const horaInicio = HORAS[b.horaIndex];
      const horaFin = horaInicio + b.duracion;
      const color = b.color || getSubjectColor(b.id || b.name);

      list.push({
        id: `manual-block-${b.id}`,
        manualId: b.id,
        codigoMateria: null,
        nombreMateria: b.name || "Bloque manual",
        numeroGrupo: null,
        profesor: "",
        aula: "Manual",
        dia,
        diaIndex: b.diaIndex,
        horaInicio,
        horaFin,
        duracion: b.duracion,
        color,
        isManual: true,
      });
    });
  }

  return list;
}

/**
 * Calcula los bloques de la previsualización semanal en miniatura para un horario dado.
 */
export function buildMiniScheduleBlocks({
  isManualMode,
  materias = [],
  gruposSeleccionados = {},
  horariosGenerados = [],
  horarioActualIndex = 0,
  manualBlocks = [],
}) {
  const blocks = [];

  // Modo manual
  if (isManualMode && gruposSeleccionados && materias) {
    Object.entries(gruposSeleccionados).forEach(([codigo, numGrupo]) => {
      if (numGrupo === null || numGrupo === undefined) return;
      const mat = materias.find((m) => String(m.codigo) === String(codigo));
      if (!mat) return;
      const grp = (mat.grupos || []).find((g) => g.numero === numGrupo);
      if (!grp) return;
      const color = getSubjectColor(mat.codigo || mat.nombre);

      (grp.horarios || []).forEach((h) => {
        (h.dias || []).forEach((dia) => {
          const dIdx = DIAS.indexOf(dia);
          if (dIdx !== -1 && dIdx < 7) {
            const startIdx = Math.max(0, h.horaInicio - 6);
            const duration = Math.max(1, h.horaFin - h.horaInicio);
            blocks.push({
              key: `m-${codigo}-${dIdx}-${startIdx}`,
              diaIndex: dIdx,
              startIdx,
              duration,
              color,
              nombre: mat.nombre,
            });
          }
        });
      });
    });
  } else if (horariosGenerados && horariosGenerados.length > 0) {
    // Modo automático
    const schedule =
      horariosGenerados[horarioActualIndex] || horariosGenerados[0];
    if (schedule && schedule.grupos) {
      schedule.grupos.forEach((g) => {
        const color = getSubjectColor(g.codigoMateria || g.nombreMateria);
        (g.horarios || []).forEach((h) => {
          (h.dias || []).forEach((dia) => {
            const dIdx = DIAS.indexOf(dia);
            if (dIdx !== -1 && dIdx < 7) {
              const startIdx = Math.max(0, h.horaInicio - 6);
              const duration = Math.max(1, h.horaFin - h.horaInicio);
              blocks.push({
                key: `auto-${g.codigoMateria}-${g.numeroGrupo}-${dia}-${h.horaInicio}`,
                diaIndex: dIdx,
                startIdx,
                duration,
                color,
                nombre: g.nombreMateria,
              });
            }
          });
        });
      });
    }
  }

  // Bloques manuales
  if (manualBlocks && manualBlocks.length > 0) {
    manualBlocks.forEach((b) => {
      const belongsToCurrent =
        horariosGenerados && horariosGenerados.length > 0
          ? typeof b.scheduleIndex === "number"
            ? b.scheduleIndex === horarioActualIndex
            : false
          : true;
      if (!belongsToCurrent) return;

      const color = b.color || getSubjectColor(b.id || b.name);
      blocks.push({
        key: `b-${b.id}`,
        diaIndex: b.diaIndex,
        startIdx: b.horaIndex,
        duration: b.duracion,
        color,
        nombre: b.name,
      });
    });
  }

  return blocks;
}

/**
 * Cuenta la cantidad de clases presentes en cada día de la semana.
 */
export function calculateClassCountByDay(allCurrentClasses = []) {
  const counts = Array(DIAS.length).fill(0);
  allCurrentClasses.forEach((c) => {
    if (c.diaIndex >= 0 && c.diaIndex < DIAS.length) {
      counts[c.diaIndex]++;
    }
  });
  return counts;
}
