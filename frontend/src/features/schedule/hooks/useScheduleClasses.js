import { useMemo } from "react";
import { useMateriasStore } from "@/store/materias.store.js";
import { DIAS, HORAS, getSubjectColor } from "@/features/schedule/constants/schedule.js";

/**
 * Hook para derivar la lista de clases a renderizar en la cuadrícula del horario,
 * así como los mapas de celdas ocupadas y celdas por código de materia.
 * Sigue la regla Vercel rerender-derived-state-no-effect: deriva estado sin sincronizar en useEffect.
 */
export function useScheduleClasses() {
  const {
    horariosGenerados = [],
    horarioActualIndex = 0,
    gruposSeleccionados = {},
    materias = [],
    previewGrupo = null,
    manualBlocks = [],
  } = useMateriasStore();

  const clasesParaRenderizar = useMemo(() => {
    const clases = [];
    let gruposParaProcesar = [];

    const anyManualSelected =
      gruposSeleccionados &&
      Object.values(gruposSeleccionados).some(
        (v) => v !== null && v !== undefined,
      );

    if (anyManualSelected && materias) {
      Object.entries(gruposSeleccionados).forEach(
        ([codigoMateria, numeroGrupo]) => {
          if (numeroGrupo !== null && typeof numeroGrupo !== "undefined") {
            const materia = materias.find(
              (m) => String(m.codigo) === String(codigoMateria),
            );
            if (materia) {
              const grupo = (materia.grupos || []).find(
                (g) => g.numero === numeroGrupo,
              );
              if (grupo) {
                gruposParaProcesar.push({
                  nombreMateria: materia.nombre,
                  numeroGrupo: grupo.numero,
                  horarios: grupo.horarios || [],
                  profesor: grupo.profesor,
                  codigoMateria: materia.codigo,
                  source: "manual",
                  color: getSubjectColor(materia.codigo || materia.nombre),
                });
              }
            }
          }
        },
      );
    } else if (horariosGenerados && horariosGenerados.length > 0) {
      const horarioSeleccionado = horariosGenerados[horarioActualIndex];
      if (horarioSeleccionado && horarioSeleccionado.grupos) {
        gruposParaProcesar = horarioSeleccionado.grupos.map((g) => ({
          nombreMateria: g.nombreMateria,
          numeroGrupo: g.numeroGrupo,
          horarios: g.horarios || [],
          profesor: g.profesor,
          codigoMateria: g.codigoMateria,
          source: "automatico",
          color: getSubjectColor(g.codigoMateria || g.nombreMateria),
        }));
      }
    }

    if (manualBlocks && manualBlocks.length > 0) {
      manualBlocks.forEach((b) => {
        const belongsToCurrent =
          horariosGenerados && horariosGenerados.length > 0
            ? typeof b.scheduleIndex === "number"
              ? b.scheduleIndex === horarioActualIndex
              : false
            : true;
        if (!belongsToCurrent) return;

        gruposParaProcesar.push({
          nombreMateria: b.name || "Bloque manual",
          numeroGrupo: null,
          horarios: [
            {
              dias: [DIAS[b.diaIndex]],
              horaInicio: HORAS[b.horaIndex],
              horaFin: HORAS[b.horaIndex] + b.duracion,
            },
          ],
          profesor: "",
          codigoMateria: null,
          source: "manual",
          manualId: b.id,
          color: b.color || getSubjectColor(b.id || b.name),
        });
      });
    }

    if (previewGrupo && !gruposSeleccionados[previewGrupo.codigo]) {
      gruposParaProcesar.push({
        nombreMateria: previewGrupo.nombre,
        numeroGrupo: previewGrupo.numeroGrupo,
        horarios: previewGrupo.horarios || [],
        profesor: previewGrupo.profesor,
        codigoMateria: previewGrupo.codigo,
        source: "manual",
        color: getSubjectColor(previewGrupo.codigo || previewGrupo.nombre),
        isPreview: true,
      });
    }

    gruposParaProcesar.forEach((grupo) => {
      let codigoMateria = grupo.codigoMateria || null;
      if (!codigoMateria && materias) {
        const mat = materias.find((m) => m.nombre === grupo.nombreMateria);
        if (mat) codigoMateria = mat.codigo;
      }

      (grupo.horarios || []).forEach((horario) => {
        (horario.dias || []).forEach((dia) => {
          const diaIndex = DIAS.indexOf(dia);
          if (diaIndex !== -1) {
            clases.push({
              materia: grupo.nombreMateria,
              codigoMateria: codigoMateria,
              grupo: grupo.numeroGrupo,
              aula: horario.aula,
              profesor: grupo.profesor,
              color: grupo.color,
              horaInicio: horario.horaInicio,
              horaFin: horario.horaFin,
              duracion: (horario.horaFin || 0) - (horario.horaInicio || 0),
              diaIndex: diaIndex,
              horaIndex: HORAS.indexOf(horario.horaInicio),
              isPreview: Boolean(grupo.isPreview),
              source: grupo.source || (grupo.isPreview ? "preview" : "manual"),
              manualId: grupo.manualId,
            });
          }
        });
      });
    });

    return clases;
  }, [
    horariosGenerados,
    horarioActualIndex,
    gruposSeleccionados,
    materias,
    previewGrupo,
    manualBlocks,
  ]);

  const celdasOcupadas = useMemo(() => {
    const ocupadas = new Map();
    clasesParaRenderizar.forEach((clase) => {
      if (!clase.isPreview) {
        for (let i = 0; i < clase.duracion; i++) {
          ocupadas.set(
            `${clase.diaIndex}-${clase.horaIndex + i}`,
            clase.materia,
          );
        }
      }
    });
    return ocupadas;
  }, [clasesParaRenderizar]);

  const celdasMateria = useMemo(() => {
    const map = new Map();
    const normalize = (s = "") =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();

    clasesParaRenderizar.forEach((clase) => {
      if (!clase.isPreview) {
        let codigo = clase.codigoMateria;
        if (!codigo && materias && Array.isArray(materias)) {
          const buscado = materias.find(
            (m) =>
              normalize(m.nombre) === normalize(clase.materia) ||
              m.codigo === clase.codigoMateria,
          );
          if (buscado) codigo = buscado.codigo;
        }

        const identifier = codigo || clase.materia;
        for (let i = 0; i < clase.duracion; i++) {
          map.set(`${clase.diaIndex}-${clase.horaIndex + i}`, identifier);
        }
      }
    });
    return map;
  }, [clasesParaRenderizar, materias]);

  return {
    clasesParaRenderizar,
    celdasOcupadas,
    celdasMateria,
  };
}

export default useScheduleClasses;
