import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useMateriasStore } from "@/store/materias.store.js";
import { useIsMobile } from "@/features/mobile/hooks/useIsMobile.js";
import { DEFAULT_SCHEDULE_COLOR, ANIMATION_DURATIONS } from "@/features/schedule/constants/schedule.js";
import { SHAKE_ANIMATION } from "@/features/schedule/constants/scheduleAnimations.js";
import { useClassDrag } from "@/features/schedule/hooks/useClassDrag.js";

import { ClassBlockCompact } from "./ClassBlockCompact.jsx";
import { ClassBlockExpanded } from "./ClassBlockExpanded.jsx";
import { ClassBlockActions } from "./ClassBlockActions.jsx";
import { ClassBlockEntrance } from "./ClassBlockEntrance.jsx";
import { ExplosionWrapper } from "@/features/schedule/components/effects/ExplosionWrapper.jsx";

function ClassBlockComponent({
  clase,
  onHover,
  onLeave,
  onDelete,
  onRename,
  autoEdit,
  onEditComplete,
  isForceExploding = false,
}) {
  const {
    materia,
    grupo,
    aula,
    color,
    isPreview,
    codigoMateria,
    source,
    manualId,
    pulsing,
    duracion = 1,
  } = clase;

  const blockRef = useRef(null);
  const inputRef = useRef(null);

  const isManual = source === "manual" && Boolean(manualId);
  const [isEditing, setIsEditing] = useState(() => Boolean(autoEdit && isManual));
  const [editText, setEditText] = useState(materia || "");
  const displayName = materia || "";

  const [selfExploding, setSelfExploding] = useState(false);
  const isExploding = selfExploding || isForceExploding;
  const [showEntranceParticles, setShowEntranceParticles] = useState(!isPreview);

  const shakeMateriaCodigo = useMateriasStore((s) => s.shakeMateriaCodigo);
  const shakeTimestamp = useMateriasStore((s) => s.shakeTimestamp);
  const dragEnabled = useMateriasStore((s) => s.dragEnabled);
  const shakeControls = useAnimationControls();
  const lastShakeTimestampRef = useRef(shakeTimestamp || 0);

  const triggerShake = useCallback(() => {
    shakeControls.set({ x: 0 });
    shakeControls.start(SHAKE_ANIMATION);
  }, [shakeControls]);

  useEffect(() => {
    if (
      shakeTimestamp &&
      shakeTimestamp !== lastShakeTimestampRef.current &&
      shakeMateriaCodigo &&
      (String(shakeMateriaCodigo) === String(codigoMateria) ||
        (materia && String(shakeMateriaCodigo) === String(materia)))
    ) {
      lastShakeTimestampRef.current = shakeTimestamp;
      triggerShake();
    }
  }, [shakeMateriaCodigo, shakeTimestamp, codigoMateria, materia, triggerShake]);

  useEffect(() => {
    if (!isPreview) {
      const timer = setTimeout(
        () => setShowEntranceParticles(false),
        ANIMATION_DURATIONS.ENTRANCE_PARTICLES_HIDE_MS,
      );
      return () => clearTimeout(timer);
    }
  }, [isPreview]);

  useEffect(() => {
    return () => onLeave?.();
  }, [onLeave]);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  const isMobile = useIsMobile();

  const handleMouseEnter = useCallback(() => {
    if (isMobile || isExploding) return;
    if (blockRef.current && onHover) {
      const rect = blockRef.current.getBoundingClientRect();
      onHover(clase, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [isMobile, isExploding, onHover, clase]);

  const handleRemoveSubject = useCallback(
    (e) => {
      e?.stopPropagation();
      onLeave?.();

      if (onDelete) {
        onDelete();
        return;
      }

      setSelfExploding(true);
      setTimeout(() => {
        if (manualId) {
          const state = useMateriasStore.getState();
          state.removeManualBlock?.(manualId);
        } else if (codigoMateria) {
          const state = useMateriasStore.getState();
          state.deleteMateriaFromSchedule?.(codigoMateria);
        }
      }, ANIMATION_DURATIONS.EXPLOSION_DELETE_MS);
    },
    [onLeave, onDelete, manualId, codigoMateria],
  );

  const commitEdit = useCallback(() => {
    const newName = editText?.trim();
    const finalName = newName && newName.length > 0 ? newName : "Bloque manual";
    if (onRename) onRename(finalName);
    setEditText(finalName);
    setIsEditing(false);
    if (onEditComplete) onEditComplete(finalName);
  }, [editText, onRename, onEditComplete]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") commitEdit();
      else if (e.key === "Escape") {
        setIsEditing(false);
        setEditText(materia || "");
      }
    },
    [commitEdit, materia],
  );

  const handleBlockClick = useCallback(
    (e) => {
      if (e.target.closest("button") || e.target.closest("input")) return;
      onLeave?.();
      if (codigoMateria) {
        const { focusMateria } = useMateriasStore.getState();
        if (focusMateria) focusMateria(codigoMateria, grupo);
      }
    },
    [onLeave, codigoMateria, grupo],
  );

  const { isDraggable, handleDragStart, handleDragEnd } = useClassDrag({
    codigoMateria,
    materia,
    grupo,
    isEditing,
    isExploding,
    isPreview,
    manualId,
    dragEnabled,
    triggerShake,
    onLeave,
  });

  const blockColor = color || DEFAULT_SCHEDULE_COLOR;

  const contentProps = {
    grupo,
    aula,
    isPreview,
    displayName,
    blockColor,
    isEditing,
    isManual,
    editText,
    inputRef,
    onEditTextChange: (e) => setEditText(e.target.value),
    onCommitEdit: commitEdit,
    onKeyDown: handleKeyDown,
    onStartEditing: () => isManual && setIsEditing(true),
  };

  return (
    <motion.div
      animate={shakeControls}
      data-no-select
      data-class-block="true"
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      onClick={handleBlockClick}
      className={`absolute inset-1 rounded-md pointer-events-auto select-none ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <ExplosionWrapper
        isExploding={isExploding}
        color={blockColor}
        className="w-full h-full"
      >
        <div
          ref={blockRef}
          onClick={handleBlockClick}
          className={`relative w-full h-full rounded-md border border-l-[3.5px] flex items-center justify-center p-1 overflow-hidden hover:shadow-md select-none group transition-shadow duration-100 ease-out ${
            isPreview ? "border-dashed ring-2 ring-primary/40 shadow-md" : ""
          } ${pulsing ? "pulse-animate" : ""}`}
          data-no-select
          style={{
            backgroundColor: isPreview ? `${blockColor}22` : `${blockColor}12`,
            borderColor: blockColor,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={onLeave}
        >
          {duracion === 1 ? (
            <ClassBlockCompact {...contentProps} />
          ) : (
            <ClassBlockExpanded {...contentProps} />
          )}

          {!isPreview && !isExploding && (
            <ClassBlockActions
              isDraggable={isDraggable}
              isManual={isManual}
              onRemoveSubject={handleRemoveSubject}
              duracion={duracion}
            />
          )}
        </div>
      </ExplosionWrapper>

      {showEntranceParticles && !isExploding && !isPreview && (
        <ClassBlockEntrance blockColor={blockColor} />
      )}
    </motion.div>
  );
}

export const ClassBlock = memo(ClassBlockComponent);
export default ClassBlock;
