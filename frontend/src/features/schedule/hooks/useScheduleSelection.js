import { useRef, useCallback } from "react";
import { HORAS, GRID_CONFIG, DEFAULT_SCHEDULE_COLOR } from "@/features/schedule/constants/schedule.js";

/**
 * Hook que gestiona la selección arrastrando el mouse para crear bloques manuales en el horario.
 * Mantiene la manipulación de DOM de alto rendimiento mediante requestAnimationFrame.
 */
export function useScheduleSelection({
  gridRef,
  previewRef,
  effectiveAllowManualBlocks,
  celdasOcupadas,
  manualBlocks,
  horariosGenerados,
  horarioActualIndex,
  addManualBlock,
  editingManualId,
  setEditingManualId,
}) {
  const selectionStartRef = useRef(null);
  const selectionCurrentRef = useRef(null);
  const isSelectingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const hasLongPressedRef = useRef(false);
  const longPressTimerRef = useRef(null);
  const rafRef = useRef(null);
  const gridRectRef = useRef(null);

  // Calcula día y hora a partir de las coordenadas del puntero
  const getCellFromClient = useCallback((clientX, clientY) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const leftDays = rect.left + GRID_CONFIG.HOURS_COLUMN_WIDTH;

    if (
      clientX < leftDays ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    const widthDays = rect.width - GRID_CONFIG.HOURS_COLUMN_WIDTH;
    const cellWidth = widthDays / GRID_CONFIG.TOTAL_DAYS;
    const cellHeight = rect.height / HORAS.length;
    const x = clientX - leftDays;
    const y = clientY - rect.top;
    const diaIndex = Math.floor(x / cellWidth);
    const horaIndex = Math.floor(y / cellHeight);

    if (
      isNaN(diaIndex) ||
      isNaN(horaIndex) ||
      diaIndex < 0 ||
      diaIndex >= GRID_CONFIG.TOTAL_DAYS ||
      horaIndex < 0 ||
      horaIndex >= HORAS.length
    ) {
      return null;
    }

    gridRectRef.current = { rect, cellWidth, cellHeight, leftDays };
    return { diaIndex, horaIndex, rect, cellWidth, cellHeight, leftDays };
  }, [gridRef]);

  // Actualiza la caja de preview en el DOM directamente sin disparar re-renders de React
  const updatePreviewDOM = useCallback(() => {
    if (!previewRef.current) return;
    const start = selectionStartRef.current;
    const current = selectionCurrentRef.current;
    if (!start || !current) return;

    const minRow = Math.min(start.horaIndex, current.horaIndex);
    const maxRow = Math.max(start.horaIndex, current.horaIndex);
    const span = maxRow - minRow + 1;

    const gridRectData = gridRectRef.current || {};
    const cellH =
      gridRectData.cellHeight ||
      gridRef.current?.getBoundingClientRect().height / HORAS.length;
    const cellW =
      gridRectData.cellWidth ||
      (gridRef.current?.getBoundingClientRect().width - GRID_CONFIG.HOURS_COLUMN_WIDTH) / GRID_CONFIG.TOTAL_DAYS;

    const leftDaysLocal =
      (gridRectData.leftDays ||
        gridRef.current?.getBoundingClientRect().left + GRID_CONFIG.HOURS_COLUMN_WIDTH) -
      (gridRectData.rect
        ? gridRectData.rect.left
        : gridRef.current?.getBoundingClientRect().left);
    const left = Math.round(leftDaysLocal + start.diaIndex * cellW);
    const top = Math.round(minRow * cellH);
    const width = Math.round(cellW);
    const height = Math.round(span * cellH);

    previewRef.current.style.left = `${left}px`;
    previewRef.current.style.top = `${top}px`;
    previewRef.current.style.width = `${width}px`;
    previewRef.current.style.height = `${height}px`;
    previewRef.current.style.display = "block";
  }, [gridRef, previewRef]);

  // Restringe el preview para no invadir celdas ya ocupadas
  const clampPreviewToFree = useCallback(
    (startDia, startHora, targetHora) => {
      const occupied = new Set();
      celdasOcupadas.forEach((_, k) => occupied.add(k));

      const belongsToCurrent = (b) => {
        if (!(horariosGenerados && horariosGenerados.length > 0)) return true;
        return typeof b.scheduleIndex === "number"
          ? b.scheduleIndex === horarioActualIndex
          : false;
      };

      manualBlocks.forEach((b) => {
        if (!belongsToCurrent(b)) return;
        for (let i = 0; i < b.duracion; i++) {
          occupied.add(`${b.diaIndex}-${b.horaIndex + i}`);
        }
      });

      const dir = targetHora >= startHora ? 1 : -1;
      let current = startHora;

      while (true) {
        const next = current + dir;
        if (dir === 1 && next > targetHora) break;
        if (dir === -1 && next < targetHora) break;

        const key = `${startDia}-${next}`;
        if (occupied.has(key)) break;
        current = next;
      }

      return current;
    },
    [celdasOcupadas, manualBlocks, horariosGenerados, horarioActualIndex],
  );

  const onPointerMove = useCallback(
    (ev) => {
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const cell = getCellFromClient(clientX, clientY);
      if (!cell) return;

      const start = selectionStartRef.current;
      if (!start) return;

      const adjustedHora = clampPreviewToFree(
        start.diaIndex,
        start.horaIndex,
        cell.horaIndex,
      );

      selectionCurrentRef.current = {
        diaIndex: start.diaIndex,
        horaIndex: adjustedHora,
      };

      if (adjustedHora !== start.horaIndex || hasDraggedRef.current) {
        if (adjustedHora !== start.horaIndex && longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        if (adjustedHora !== start.horaIndex) hasDraggedRef.current = true;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updatePreviewDOM);
      }
    },
    [getCellFromClient, clampPreviewToFree, updatePreviewDOM],
  );

  const endSelection = useCallback(() => {
    if (!isSelectingRef.current) return;
    isSelectingRef.current = false;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const start = selectionStartRef.current;
    const current = selectionCurrentRef.current || start;
    if (!start) {
      if (previewRef.current) previewRef.current.style.display = "none";
      return;
    }

    if (!hasDraggedRef.current && !hasLongPressedRef.current) {
      if (previewRef.current) previewRef.current.style.display = "none";
      selectionStartRef.current = null;
      selectionCurrentRef.current = null;
      isSelectingRef.current = false;
      return;
    }

    const minRow = Math.min(start.horaIndex, current.horaIndex);
    const span = Math.abs(start.horaIndex - current.horaIndex) + 1;
    const newId = Date.now() + Math.round(Math.random() * 1000);

    addManualBlock({
      id: newId,
      name: "Bloque manual",
      diaIndex: start.diaIndex,
      horaIndex: minRow,
      duracion: span,
      color: DEFAULT_SCHEDULE_COLOR,
      pulsing: true,
      scheduleIndex:
        horariosGenerados && horariosGenerados.length > 0
          ? horarioActualIndex
          : null,
    });
    setEditingManualId(newId);

    hasLongPressedRef.current = false;
    if (previewRef.current) previewRef.current.style.display = "none";
    selectionStartRef.current = null;
    selectionCurrentRef.current = null;
  }, [
    addManualBlock,
    horariosGenerados,
    horarioActualIndex,
    previewRef,
    setEditingManualId,
  ]);

  const handleMouseDown = useCallback(
    (e) => {
      const target = e.target;
      if (
        target?.closest?.("[data-no-select]") ||
        target?.closest?.("[data-class-block]")
      ) {
        return;
      }
      if (!effectiveAllowManualBlocks) return;

      if (
        editingManualId &&
        typeof document !== "undefined" &&
        document.activeElement?.tagName === "INPUT"
      ) {
        try {
          document.activeElement.blur();
        } catch {
          /* ignore */
        }
      }

      if (e.button !== 0) return;
      e.preventDefault();

      const cell = getCellFromClient(e.clientX, e.clientY);
      if (!cell) return;

      selectionStartRef.current = {
        diaIndex: cell.diaIndex,
        horaIndex: cell.horaIndex,
      };
      selectionCurrentRef.current = { ...selectionStartRef.current };
      isSelectingRef.current = true;
      hasDraggedRef.current = false;
      hasLongPressedRef.current = false;

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", onPointerMove);
        endSelection();
      };

      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    },
    [
      effectiveAllowManualBlocks,
      editingManualId,
      getCellFromClient,
      onPointerMove,
      endSelection,
    ],
  );

  return {
    handleMouseDown,
    getCellFromClient,
  };
}
