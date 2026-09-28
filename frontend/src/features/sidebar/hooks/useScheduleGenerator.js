import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { HorariosService } from "@/services/horarios.service.js";
import { useMateriasStore } from "@/store/materias.store.js";

/**
 * Hook para gestionar la generación automática de horarios y validar omisiones por hora mínima.
 */
export function useScheduleGenerator({ isMobile }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    materias,
    materiasSeleccionadas,
    gruposSeleccionados,
    selectGrupo,
    toggleMateriaSelected,
    setHorariosGenerados,
    setMobileActiveView,
    horaMinima,
    evitarHuecos,
  } = useMateriasStore();

  const handleGenerate = useCallback(async () => {
    const removedNames = [];

    // Validar materias seleccionadas contra la hora mínima configurada
    Object.keys(materiasSeleccionadas).forEach((codigo) => {
      const materiaObj = (materias || []).find(
        (m) => String(m.codigo) === String(codigo),
      );

      if (!materiaObj) {
        if (gruposSeleccionados?.[codigo]) {
          selectGrupo(codigo, null);
        }
        toggleMateriaSelected(codigo);
        removedNames.push(codigo);
        return;
      }

      const hasValidGroup = (materiaObj.grupos || []).some((gr) =>
        (gr.horarios || []).some((h) => h.horaInicio >= horaMinima),
      );

      if (!hasValidGroup) {
        if (gruposSeleccionados?.[codigo]) {
          selectGrupo(codigo, null);
        }
        if (materiasSeleccionadas[codigo]) {
          toggleMateriaSelected(codigo);
        }
        removedNames.push(materiaObj.nombre || codigo);
      }
    });

    if (removedNames.length > 0) {
      const names = removedNames.join(", ");
      const message =
        removedNames.length === 1
          ? `La materia ${names} fue omitida: no tiene grupos desde las ${horaMinima}:00.`
          : `Se omitieron ${removedNames.length} materias por hora mínima (${horaMinima}:00): ${names}.`;
      toast.error(message, { duration: 5000 });
    }

    setIsGenerating(true);

    try {
      const codigosSeleccionados = Object.keys(materiasSeleccionadas);
      const horarios = await HorariosService.generarHorarios(materias, codigosSeleccionados, {
        horaMinima,
        evitarHuecos,
      });

      if (horarios.length === 0) {
        toast.error(
          "No se pudieron generar horarios válidos con las materias seleccionadas.",
          { duration: 5000 },
        );
      } else {
        setHorariosGenerados(horarios);
        if (isMobile) {
          setMobileActiveView("schedule");
        }
      }
    } catch {
      toast.error("Error al generar horarios");
    } finally {
      setIsGenerating(false);
    }
  }, [
    materias,
    materiasSeleccionadas,
    gruposSeleccionados,
    selectGrupo,
    toggleMateriaSelected,
    setHorariosGenerados,
    setMobileActiveView,
    horaMinima,
    evitarHuecos,
    isMobile,
  ]);

  return {
    isGenerating,
    handleGenerate,
  };
}
