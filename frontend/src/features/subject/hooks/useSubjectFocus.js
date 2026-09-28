import { useState, useEffect, useCallback } from "react";
import { useMateriasStore } from "@/store/materias.store.js";

/**
 * Hook para gestionar el auto-enfoque, expansión, resaltado y centrado
 * de la materia y su grupo cuando se hace clic sobre ella desde la cuadrícula del horario.
 */
export function useSubjectFocus(materiaCodigo, grupoRefs) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [highlightedGrupo, setHighlightedGrupo] = useState(null);

  const focusedMateriaCodigo = useMateriasStore((s) => s.focusedMateriaCodigo);
  const focusedGrupoNumero = useMateriasStore((s) => s.focusedGrupoNumero);
  const focusTimestamp = useMateriasStore((s) => s.focusTimestamp);
  const toggleSubjectExpanded = useMateriasStore((s) => s.toggleSubjectExpanded);

  const centerFocusedGrupo = useCallback(
    (grupoNum) => {
      if (!grupoNum || !grupoRefs?.current) return;
      const targetEl = grupoRefs.current[String(grupoNum)];
      if (!targetEl) return;

      const containerEl = targetEl.closest(".overflow-y-auto");
      if (!containerEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const targetCenter = targetRect.top + targetRect.height / 2;
      const containerCenter = containerRect.top + containerRect.height / 2;
      const offset = targetCenter - containerCenter;

      if (Math.abs(offset) > 4) {
        containerEl.scrollBy({
          top: offset,
          behavior: "smooth",
        });
      }
    },
    [grupoRefs],
  );

  useEffect(() => {
    if (
      focusedMateriaCodigo &&
      String(focusedMateriaCodigo) === String(materiaCodigo) &&
      focusTimestamp
    ) {
      const raf = requestAnimationFrame(() => {
        toggleSubjectExpanded?.(materiaCodigo, true);
        setIsHighlighted(true);
        if (focusedGrupoNumero) {
          setHighlightedGrupo(String(focusedGrupoNumero));
        }
      });

      if (focusedGrupoNumero) {
        const grp = String(focusedGrupoNumero);

        const t1 = setTimeout(() => centerFocusedGrupo(grp), 40);
        const t2 = setTimeout(() => centerFocusedGrupo(grp), 180);
        const t3 = setTimeout(() => centerFocusedGrupo(grp), 360);

        const clearTimer = setTimeout(() => {
          setIsHighlighted(false);
          setHighlightedGrupo(null);
        }, 1800);

        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          clearTimeout(clearTimer);
        };
      }

      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1800);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [
    focusedMateriaCodigo,
    focusedGrupoNumero,
    focusTimestamp,
    materiaCodigo,
    toggleSubjectExpanded,
    centerFocusedGrupo,
  ]);

  return {
    isHighlighted,
    highlightedGrupo,
    centerFocusedGrupo,
  };
}
