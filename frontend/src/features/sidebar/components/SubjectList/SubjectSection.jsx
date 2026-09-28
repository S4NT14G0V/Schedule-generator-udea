import { memo, forwardRef } from "react";
import Subject from "@/features/subject";

const SubjectSectionComponent = forwardRef(function SubjectSection(
  {
    letter,
    items,
    generationMode,
    dragEnabled,
    activeFilters,
    occupiedScheduleCells,
    occupiedManualCells,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      id={`section-letter-${letter}`}
      className="space-y-1.5 scroll-mt-2"
    >
      {/* Encabezado con Letra en el centro y líneas a izquierda y derecha */}
      <div className="sticky top-0 z-10 py-1.5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs flex items-center gap-2 select-none">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400 px-1.5">
          {letter}
        </span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Materias pertenecientes a esta letra */}
      <div className="space-y-1.5">
        {items.map((materia) => (
          <Subject
            key={materia.codigo}
            materia={materia}
            generationMode={generationMode}
            dragEnabled={dragEnabled}
            activeFilters={activeFilters}
            occupiedScheduleCells={occupiedScheduleCells}
            occupiedManualCells={occupiedManualCells}
          />
        ))}
      </div>
    </div>
  );
});

export const SubjectSection = memo(SubjectSectionComponent);
export default SubjectSection;
