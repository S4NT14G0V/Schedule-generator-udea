/**
 * Constantes y definiciones de partículas para las animaciones del horario.
 * Sigue la regla Vercel server-hoist-static-io / rendering-hoist-jsx:
 * Los cálculos geométricos estáticos se inicializan una sola vez a nivel de módulo.
 */

export const EXPLOSION_PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i / 24) * 360 + ((i % 5) * 8 - 16);
  const rad = (angle * Math.PI) / 180;
  const distance = 50 + ((i * 17) % 45);
  const isShard = i % 3 === 0;
  const isSpark = i % 4 === 0;

  return {
    id: i,
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance + (isShard ? 12 : 0),
    size: isShard ? 4 + (i % 3) * 3 : 3 + (i % 4) * 2,
    rotateX: (i % 2 === 0 ? 1 : -1) * (180 + i * 45),
    rotateZ: (i % 2 === 0 ? 1 : -1) * (90 + i * 30),
    duration: 0.38 + (i % 4) * 0.04,
    delay: (i % 5) * 0.008,
    type: isSpark ? "spark" : "shard",
  };
});

export const ENTRANCE_PARTICLES = Array.from({ length: 14 }).map((_, i) => {
  const angle = (i / 14) * 360 + ((i % 3) * 10 - 10);
  const rad = (angle * Math.PI) / 180;
  const distance = 75 + ((i * 11) % 36);
  return {
    id: i,
    x: Math.cos(rad) * distance,
    y: Math.sin(rad) * distance,
    size: 3 + (i % 3) * 1.8,
    duration: 0.42 + (i % 3) * 0.05,
    delay: (i % 4) * 0.015,
  };
});

export const SHAKE_ANIMATION = {
  x: [0, -9, 9, -7, 7, -4, 4, 0],
  transition: { duration: 0.45, ease: "easeInOut" },
};

export const EXPLOSION_SCALE_VARIANTS = {
  scale: [1, 1.18, 0],
  opacity: [1, 1, 0],
  rotate: [0, -6, 8, -4],
  filter: [
    "brightness(1) drop-shadow(0 0 0px transparent)",
    "brightness(2.5) contrast(1.5) drop-shadow(0 0 12px rgba(255,255,255,0.9))",
    "brightness(4) blur(8px)",
  ],
};
