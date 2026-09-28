import { memo } from "react";
import { motion } from "framer-motion";
import { ExplosionParticles } from "./ExplosionParticles.jsx";
import { EXPLOSION_SCALE_VARIANTS } from "@/features/schedule/constants/scheduleAnimations.js";
import { DEFAULT_SCHEDULE_COLOR } from "@/features/schedule/constants/schedule.js";

/**
 * ExplosionWrapper:
 * Componente envoltorio reutilizable que aplica un efecto físico de desintegración y explosión
 * a cualquier componente hijo que se le pase.
 *
 * @param {React.ReactNode} children - El componente o elemento al que se le aplicará la desintegración
 * @param {boolean} isExploding - Desencadenante: activa la animación de explosión y partículas
 * @param {string} color - Color principal para el shockwave y las esquirlas
 * @param {Function} onExplosionComplete - Callback invocado al finalizar la animación
 * @param {string} className - Clases del contenedor exterior
 */
function ExplosionWrapperComponent({
  children,
  isExploding = false,
  color = DEFAULT_SCHEDULE_COLOR,
  onExplosionComplete,
  className = "relative w-full h-full",
}) {
  return (
    <div className={className}>
      {/* Contenido envuelto con animación física de desintegración */}
      <motion.div
        initial={false}
        animate={isExploding ? EXPLOSION_SCALE_VARIANTS : {}}
        transition={
          isExploding
            ? { duration: 0.4, ease: [0.05, 0.7, 0.1, 1] }
            : undefined
        }
        onAnimationComplete={() => {
          if (isExploding && onExplosionComplete) {
            onExplosionComplete();
          }
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* Partículas y ondas expansivas al explotar */}
      {isExploding && <ExplosionParticles color={color} />}
    </div>
  );
}

export const ExplosionWrapper = memo(ExplosionWrapperComponent);
export default ExplosionWrapper;
