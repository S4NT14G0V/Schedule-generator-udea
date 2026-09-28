import { createContext, useContext, useMemo, useCallback } from "react";
import { DIAS, HORAS } from "@/features/schedule/constants/schedule.js";

const ScheduleContext = createContext({
  celdasMateria: new Map(),
  showToastMessage: () => {},
  checkGrupoConflict: () => false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useScheduleContext = () => useContext(ScheduleContext);

export const ScheduleProvider = ({
  celdasMateria = new Map(),
  showToastMessage,
  children,
}) => {
  const checkGrupoConflict = useCallback(
    (materia, grupo, grupoSeleccionado) => {
      if (!grupo || !materia) return false;

      const celdasMateriaSinActual = new Map(celdasMateria);
      if (grupoSeleccionado) {
        const grupoActual = (materia.grupos || []).find(
          (g) => g.numero === grupoSeleccionado,
        );
        if (grupoActual) {
          (grupoActual.horarios || []).forEach((horario) => {
            (horario.dias || []).forEach((dia) => {
              const diaIndex = DIAS.indexOf(dia);
              if (diaIndex !== -1) {
                const horaInicioIdx = HORAS.indexOf(horario.horaInicio);
                const duracion = (horario.horaFin || 0) - (horario.horaInicio || 0);
                for (let i = 0; i < duracion; i++) {
                  const celdaKey = `${diaIndex}-${horaInicioIdx + i}`;
                  if (
                    String(celdasMateriaSinActual.get(celdaKey)) ===
                    String(materia.codigo)
                  ) {
                    celdasMateriaSinActual.delete(celdaKey);
                  }
                }
              }
            });
          });
        }
      }

      for (const horario of grupo.horarios || []) {
        for (const dia of horario.dias || []) {
          const diaIndex = DIAS.indexOf(dia);
          if (diaIndex !== -1) {
            const horaInicioIdx = HORAS.indexOf(horario.horaInicio);
            const duracion = (horario.horaFin || 0) - (horario.horaInicio || 0);
            for (let i = 0; i < duracion; i++) {
              const celdaKey = `${diaIndex}-${horaInicioIdx + i}`;
              const materiaEnCeldaCodigo = celdasMateriaSinActual.get(celdaKey);
              if (
                materiaEnCeldaCodigo &&
                String(materiaEnCeldaCodigo) !== String(materia.codigo)
              ) {
                return true;
              }
            }
          }
        }
      }

      return false;
    },
    [celdasMateria],
  );

  const contextValue = useMemo(
    () => ({
      celdasMateria,
      showToastMessage,
      checkGrupoConflict,
    }),
    [celdasMateria, showToastMessage, checkGrupoConflict],
  );

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};
