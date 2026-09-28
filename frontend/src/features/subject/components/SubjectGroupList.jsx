import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  checkGroupConflict,
  checkGrupoMatchesFilter,
} from "@/features/subject/utils/subjectConflicts.js";
import { SubjectGroupItem } from "./SubjectGroupItem.jsx";

function SubjectGroupListComponent({
  materia,
  grupoSeleccionado,
  highlightedGrupo,
  activeFilters = {},
  grupoRefs,
  onGrupoSelect,
  onGroupHover,
  showGroupParticles,
  occupiedScheduleCells,
  occupiedManualCells,
  isManualMode,
  dragEnabled,
  isExpanded,
  centerFocusedGrupo,
}) {
  const hasActiveAdvancedFilters = useMemo(
    () =>
      Boolean(
        (activeFilters.selectedDias && activeFilters.selectedDias.length > 0) ||
        (activeFilters.horaMinimaFilter && activeFilters.horaMinimaFilter > 6) ||
        (activeFilters.horaMaximaFilter && activeFilters.horaMaximaFilter < 22) ||
        activeFilters.selectedJornada,
      ),
    [activeFilters],
  );

  return (
    <AnimatePresence initial={false}>
      {isManualMode && !dragEnabled && materia?.grupos && isExpanded && (
        <motion.div
          key="groups"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            height: { duration: 0.15, ease: "easeOut" },
            opacity: { duration: 0.15, ease: "easeOut" },
          }}
          onAnimationComplete={() => {
            if (highlightedGrupo) {
              centerFocusedGrupo(highlightedGrupo);
            }
          }}
          className="px-2 pb-2.5 pt-0.5 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60"
        >
          {(materia.grupos || []).map((grupo) => {
            const sinCupos = grupo.cupoDisponible === 0;
            const isGrupoSelected = grupoSeleccionado === grupo.numero;
            const tieneConflicto = checkGroupConflict(
              grupo,
              materia?.codigo,
              occupiedScheduleCells,
              occupiedManualCells,
            );
            const disabled = sinCupos || tieneConflicto;
            const isFocusedGrupo =
              highlightedGrupo &&
              String(highlightedGrupo) === String(grupo.numero);
            const matchesFilter = checkGrupoMatchesFilter(grupo, activeFilters);
            const isFilteredMatch =
              hasActiveAdvancedFilters &&
              matchesFilter &&
              !isGrupoSelected &&
              !isFocusedGrupo;
            const isFilteredNonMatch =
              hasActiveAdvancedFilters &&
              !matchesFilter &&
              !isGrupoSelected &&
              !isFocusedGrupo;

            return (
              <SubjectGroupItem
                key={grupo.numero}
                grupo={grupo}
                isGrupoSelected={isGrupoSelected}
                tieneConflicto={tieneConflicto}
                sinCupos={sinCupos}
                disabled={disabled}
                isFocusedGrupo={isFocusedGrupo}
                isFilteredMatch={isFilteredMatch}
                isFilteredNonMatch={isFilteredNonMatch}
                activeFilters={activeFilters}
                grupoRef={(el) => {
                  if (el && grupoRefs?.current) {
                    grupoRefs.current[String(grupo.numero)] = el;
                  }
                }}
                onSelect={() => onGrupoSelect(grupo.numero, tieneConflicto)}
                onMouseEnter={() => onGroupHover?.(grupo.numero)}
                onMouseLeave={() => onGroupHover?.(null)}
                showParticles={showGroupParticles === grupo.numero}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SubjectGroupList = memo(SubjectGroupListComponent);
export default SubjectGroupList;
