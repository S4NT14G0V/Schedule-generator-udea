import { memo } from "react";
import { motion } from "framer-motion";
import { ENTRANCE_PARTICLES } from "@/features/schedule/constants/scheduleAnimations.js";

function ClassBlockEntranceComponent({ blockColor }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
      <motion.div
        initial={{ scale: 0.2, opacity: 0.9, borderWidth: "2.5px" }}
        animate={{ scale: 1.9, opacity: 0, borderWidth: "1px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute w-12 h-12 rounded-full border pointer-events-none"
        style={{ borderColor: blockColor }}
      />

      {ENTRANCE_PARTICLES.map((p) => (
        <motion.div
          key={`enter-${p.id}`}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0.4, 1.25, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.id % 2 === 0 ? "#ffffff" : blockColor,
            boxShadow: `0 0 6px ${blockColor}`,
          }}
        />
      ))}
    </div>
  );
}

export const ClassBlockEntrance = memo(ClassBlockEntranceComponent);
