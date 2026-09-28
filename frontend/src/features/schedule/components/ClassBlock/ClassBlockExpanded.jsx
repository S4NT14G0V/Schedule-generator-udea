import { memo } from "react";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function ClassBlockExpandedComponent({
  grupo,
  aula,
  isPreview,
  displayName,
  blockColor,
  isEditing,
  isManual,
  editText,
  inputRef,
  onEditTextChange,
  onCommitEdit,
  onKeyDown,
  onStartEditing,
}) {
  return (
    <>
      <div className="absolute top-1 left-1.5 flex items-center gap-1 flex-wrap min-w-0 z-10 pointer-events-none">
        {grupo !== null && typeof grupo !== "undefined" && (
          <span
            className="font-mono text-xs font-bold px-1.5 py-0.5 rounded leading-none text-white shadow-2xs"
            style={{ backgroundColor: blockColor }}
          >
            G{grupo}
          </span>
        )}
        {aula && (
          <span className="font-mono text-xs font-medium text-primary dark:text-zinc-100 bg-primary/5 border-primary/40 border px-1 py-0.5 rounded leading-none truncate max-w-[85px]">
            {formatAula(aula)}
          </span>
        )}
        {isPreview && (
          <span className="font-mono text-[8.5px] font-bold text-white bg-primary px-1.5 py-0.5 rounded leading-none">
            PREVIEW
          </span>
        )}
      </div>

      <div className="w-full h-full flex items-center justify-center text-center px-2 py-1 min-w-0 z-0">
        {isEditing && isManual ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={onEditTextChange}
            onBlur={onCommitEdit}
            onKeyDown={onKeyDown}
            className="w-full text-xs font-semibold p-1 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary text-center"
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Editar nombre del bloque"
          />
        ) : (
          <p
            onDoubleClick={onStartEditing}
            className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 text-center select-none"
          >
            {displayName}
          </p>
        )}
      </div>
    </>
  );
}

export const ClassBlockExpanded = memo(ClassBlockExpandedComponent);
