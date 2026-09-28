import { useCallback } from "react";
import toast from "react-hot-toast";
import { DIAS } from "@/features/schedule/constants/schedule.js";
import { useMateriasStore } from "@/store/materias.store.js";

/**
 * Hook para gestionar el inicio y finalización del arrastre (HTML5 Drag & Drop)
 * de una materia hacia el horario con preview visual flotante y validaciones.
 */
export function useSubjectDrag({
  materia,
  isManualMode,
  hasZeroCuposGlobally,
  grupoSeleccionado,
  triggerShake,
}) {
  const setDraggingMateria = useMateriasStore((s) => s.setDraggingMateria);

  const handleDragStart = useCallback(
    (e) => {
      if (!isManualMode) {
        e.preventDefault();
        return;
      }

      const hasAnyHorario = (materia?.grupos || []).some(
        (g) => g.horarios && g.horarios.length > 0,
      );
      if (!hasAnyHorario) {
        e.preventDefault();
        triggerShake();
        toast.error("Esta materia no tiene horarios registrados");
        return;
      }

      if (hasZeroCuposGlobally) {
        e.preventDefault();
        triggerShake();
        toast.error("Esta materia no tiene cupos disponibles");
        return;
      }

      // Validar conflictos contra el estado global en el instante del drag
      const storeState = useMateriasStore.getState();
      const currentGrupos = storeState.gruposSeleccionados || {};
      const allManual = storeState.manualBlocks || [];
      const allMaterias = storeState.materias || [];

      const occupiedByOthers = new Set();
      Object.entries(currentGrupos).forEach(([cod, numGrp]) => {
        if (!cod || !numGrp || String(cod) === String(materia?.codigo)) return;
        const mat = allMaterias.find((m) => String(m.codigo) === String(cod));
        const g = mat?.grupos?.find((gr) => String(gr.numero) === String(numGrp));
        (g?.horarios || []).forEach((h) => {
          (h.dias || []).forEach((d) => {
            const dIdx = DIAS.indexOf(d);
            if (dIdx !== -1) {
              for (let hr = h.horaInicio; hr < h.horaFin; hr++) {
                occupiedByOthers.add(`${dIdx}-${hr}`);
              }
            }
          });
        });
      });

      allManual.forEach((b) => {
        for (let k = 0; k < b.duracion; k++) {
          occupiedByOthers.add(`${b.diaIndex}-${b.horaIndex + 6 + k}`);
        }
      });

      const availableGroups = (materia.grupos || []).filter((g) => {
        if (grupoSeleccionado && String(g.numero) === String(grupoSeleccionado)) {
          return false;
        }
        if (typeof g.cupoDisponible === "number" && g.cupoDisponible <= 0) {
          return false;
        }
        if (!g.horarios || g.horarios.length === 0) return false;
        return !g.horarios.some((horario) => {
          return (horario.dias || []).some((dia) => {
            const diaIndex = DIAS.indexOf(dia);
            if (diaIndex === -1) return false;
            for (let hr = horario.horaInicio; hr < horario.horaFin; hr++) {
              if (occupiedByOthers.has(`${diaIndex}-${hr}`)) {
                return true;
              }
            }
            return false;
          });
        });
      });

      if (availableGroups.length === 0) {
        e.preventDefault();
        triggerShake();
        toast.error("Todos los grupos tienen conflicto con tu horario actual");
        return;
      }

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", materia.codigo);

      // Crear imagen fantasma (drag preview)
      if (typeof document !== "undefined") {
        const isDark = document.documentElement.classList.contains("dark");
        const dragNode = document.createElement("div");
        dragNode.style.position = "fixed";
        dragNode.style.top = "-9999px";
        dragNode.style.left = "-9999px";
        dragNode.style.zIndex = "999999";
        dragNode.style.opacity = "1";
        dragNode.style.pointerEvents = "none";
        dragNode.style.background = isDark ? "#18181b" : "#ffffff";
        dragNode.style.color = isDark ? "#f4f4f5" : "#09090b";
        dragNode.style.border = isDark
          ? "1.5px solid #3f3f46"
          : "1.5px solid #cbd5e1";
        dragNode.style.borderRadius = "8px";
        dragNode.style.padding = "7px 12px";
        dragNode.style.boxShadow =
          "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)";
        dragNode.style.display = "flex";
        dragNode.style.alignItems = "center";
        dragNode.style.gap = "8px";
        dragNode.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
        dragNode.style.fontSize = "12px";
        dragNode.style.fontWeight = "600";
        dragNode.style.whiteSpace = "nowrap";

        dragNode.innerHTML = `
          <span style="
            background: #1392ec;
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: ui-monospace, monospace;
            font-size: 10px;
            font-weight: 700;
          ">#${materia.codigo || ""}</span>
          <span>${materia.nombre}</span>
        `;

        document.body.appendChild(dragNode);
        e.dataTransfer.setDragImage(dragNode, 24, 18);
        setTimeout(() => {
          if (document.body.contains(dragNode)) {
            document.body.removeChild(dragNode);
          }
        }, 0);
      }

      setTimeout(() => {
        setDraggingMateria({
          codigo: materia.codigo,
          nombre: materia.nombre,
          grupos: materia.grupos,
        });
      }, 0);
    },
    [
      materia,
      isManualMode,
      hasZeroCuposGlobally,
      grupoSeleccionado,
      triggerShake,
      setDraggingMateria,
    ],
  );

  const materiaCodigo = materia?.codigo;

  const handleDragEnd = useCallback(() => {
    const state = useMateriasStore.getState();
    if (!state.lastDropSuccessful && materiaCodigo) {
      if (Date.now() - (state.shakeTimestamp || 0) > 300) {
        state.triggerShakeMateria?.(materiaCodigo);
      }
    }
    state.clearDragState?.();
  }, [materiaCodigo]);

  return {
    handleDragStart,
    handleDragEnd,
  };
}
