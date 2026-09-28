/**
 * Cuantiza un valor de color normalizado [0..1] aplicando desplazamiento por umbral Bayer.
 */
export function quantizeColor(val, threshold, quantSteps = 3) {
  const spread = 1.0 / quantSteps;
  const dithered = val + (threshold - 0.5) * spread;
  const clamped = dithered < 0 ? 0 : dithered > 1 ? 1 : dithered;
  const level = Math.round(clamped * quantSteps);
  return Math.round((level / quantSteps) * 255);
}

/**
 * Ajusta brillo y contraste de un canal de color normalizado [0..1].
 */
export function adjustBrightnessContrast(val, brightness = 1.03, contrast = 1.0) {
  return Math.min(
    1.0,
    Math.max(0.0, (val * brightness - 0.5) * contrast + 0.5),
  );
}
