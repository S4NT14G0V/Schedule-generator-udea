import { memo } from "react";
import { formatAula } from "@/features/schedule/constants/schedule.js";

function ClassBlockCompactComponent({
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
    <div className="w-full h-full flex items-center gap-1.5 px-2 py-0.5 overflow-hidden min-w-0 group-hover:pr-14 transition-[padding] duration-150">
      {grupo !== null && typeof grupo !== "undefined" && (
        <span
          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded leading-none text-white shadow-2xs flex-shrink-0"
          style={{ backgroundColor: blockColor }}
        >
          G{grupo}
        </span>
      )}
      {aula && (
        <span className="font-mono text-[10px] font-medium text-primary dark:text-zinc-100 bg-primary/5 border-primary/40 border px-1 py-0.5 rounded leading-none truncate max-w-[72px] flex-shrink-0">
          {formatAula(aula)}
        </span>
      )}
      {isPreview && (
        <span className="font-mono text-[8px] font-bold text-white bg-primary px-1.5 py-0.5 rounded leading-none flex-shrink-0">
          PREVIEW
        </span>
      )}

      <div className="flex-1 min-w-0 flex items-center">
        {isEditing && isManual ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={onEditTextChange}
            onBlur={onCommitEdit}
            onKeyDown={onKeyDown}
            className="w-full text-xs font-semibold px-1 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-primary"
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Editar nombre del bloque"
          />
        ) : (
          <p
            onDoubleClick={onStartEditing}
            className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight truncate min-w-0 flex-1 text-left select-none"
            title={displayName}
          >
            {displayName}
          </p>
        )}
      </div>
    </div>
  );
}

export const ClassBlockCompact = memo(ClassBlockCompactComponent);
