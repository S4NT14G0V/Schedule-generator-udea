/**
 * Genera la configuración matemática determinista de las partículas de selección.
 */
export function generateParticles(count = 14, radius = 28) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 360 + ((i % 2) * 15 - 7.5);
    const rad = (angle * Math.PI) / 180;
    const distance = radius * (0.6 + ((i * 13) % 40) / 100);
    const size = 3 + (i % 3) * 1.5;
    const isStar = i % 4 === 0;

    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size,
      isStar,
      duration: 0.38 + (i % 3) * 0.04,
      delay: (i % 3) * 0.015,
    };
  });
}
