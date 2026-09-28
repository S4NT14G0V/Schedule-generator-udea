import { memo } from "react";
import { motion } from "framer-motion";
import { EXPLOSION_PARTICLES } from "@/features/schedule/constants/scheduleAnimations.js";
import { DEFAULT_SCHEDULE_COLOR } from "@/features/schedule/constants/schedule.js";

function ExplosionParticlesComponent({ color = DEFAULT_SCHEDULE_COLOR }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
      {/* Flash Blanco Inicial (Impacto) */}
      <motion.div
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute w-12 h-12 rounded-full bg-white shadow-[0_0_25px_#ffffff]"
      />

      {/* Shockwave Principal (Onda rápida) */}
      <motion.div
        initial={{ scale: 0.1, opacity: 1, borderWidth: "4px" }}
        animate={{ scale: 3.2, opacity: 0, borderWidth: "0.5px" }}
        transition={{ duration: 0.38, ease: [0.1, 0.8, 0.3, 1] }}
        className="absolute w-14 h-14 rounded-full border"
        style={{
          borderColor: color,
          boxShadow: `0 0 15px ${color}`,
        }}
      />

      {/* Shockwave Secundaria (Onda expansiva suave) */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8, borderWidth: "2px" }}
        animate={{ scale: 2.4, opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 0.42, delay: 0.04, ease: "easeOut" }}
        className="absolute w-14 h-14 rounded-full border border-white"
      />

      {/* Sistema de Partículas Avanzado (24 partículas calculadas estáticamente) */}
      {EXPLOSION_PARTICLES.map((p) => {
        const isSpark = p.type === "spark";
        const isShard = p.type === "shard";

        return (
          <motion.div
            key={p.id}
            initial={{
              x: 0,
              y: 0,
              scale: 0.2,
              opacity: 1,
              rotateX: 0,
              rotateZ: 0,
            }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0.4, 1.4, 0],
              opacity: [1, 1, 0],
              rotateX: p.rotateX,
              rotateZ: p.rotateZ,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.05, 0.85, 0.15, 1],
            }}
            className={`absolute pointer-events-none ${
              isShard ? "rounded-xs" : "rounded-full"
            }`}
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: isSpark
                ? "#ffffff"
                : p.id % 3 === 0
                  ? "#fbbf24"
                  : color,
              boxShadow: isSpark
                ? `0 0 10px #ffffff, 0 0 18px ${color}`
                : `0 0 8px ${color}`,
              clipPath: isSpark
                ? "polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export const ExplosionParticles = memo(ExplosionParticlesComponent);
