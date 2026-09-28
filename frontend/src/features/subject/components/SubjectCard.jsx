import { memo } from "react";
import { motion } from "framer-motion";

function SubjectCardComponent({
  materiaCodigo,
  shakeControls,
  isAutomaticDisabled,
  isHighlighted,
  isCardActive,
  children,
}) {
  return (
    <motion.div
      id={`subject-card-${materiaCodigo}`}
      animate={shakeControls}
      className={`rounded-md border select-none duration-200 ${
        isAutomaticDisabled
          ? "opacity-40 bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
          : isHighlighted
            ? "ring-2 ring-primary border-primary bg-primary/10 shadow-md"
            : isCardActive
              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {children}
    </motion.div>
  );
}

export const SubjectCard = memo(SubjectCardComponent);
export default SubjectCard;
