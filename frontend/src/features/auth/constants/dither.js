export const DITHER_CONFIG = {
  BLOCK_SIZE: 2, // 2px por bloque
  LEVELS: 4, // 4 niveles de cuantización por canal
  BRIGHTNESS: 1.03, // 103% de brillo
  CONTRAST: 1.0, // 1 (sin cambio)
  FLICKER_FRACTION: 0.25, // 25% de bloques animados
  SPEED: 2.4, // Velocidad base de oscilación
  OSC_AMP: 0.45, // Amplitud de oscilación del umbral
  TARGET_FPS: 60, // Tasa de refresco objetivo
  BACKGROUND_COLOR: "#0b0b0c",
  IMAGE_SRC: "/background/ditther-background.png",
};

// Matriz Bayer 4×4 normalizada [0..15] / 16
export const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];
