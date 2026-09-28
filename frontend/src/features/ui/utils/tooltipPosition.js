/**
 * Calcula el estilo de posición fija del tooltip en el viewport.
 */
export function getTooltipCoords(coords, position = "top") {
  if (!coords || typeof window === "undefined") return { display: "none" };

  const gap = 8;
  const style = {
    position: "fixed",
    zIndex: 999999,
  };

  switch (position) {
    case "bottom":
      style.top = `${coords.bottom + gap}px`;
      style.left = `${coords.left + coords.width / 2}px`;
      style.transform = "translateX(-50%)";
      break;
    case "left":
      style.top = `${coords.top + coords.height / 2}px`;
      style.left = `${coords.left - gap}px`;
      style.transform = "translate(-100%, -50%)";
      break;
    case "right":
      style.top = `${coords.top + coords.height / 2}px`;
      style.left = `${coords.right + gap}px`;
      style.transform = "translateY(-50%)";
      break;
    case "top-left":
      style.top = `${coords.top - gap}px`;
      style.left = `${Math.min(window.innerWidth - 8, coords.right)}px`;
      style.transform = "translate(-100%, -100%)";
      break;
    case "top-right":
      style.top = `${coords.top - gap}px`;
      style.left = `${Math.max(8, coords.left)}px`;
      style.transform = "translate(0, -100%)";
      break;
    case "top":
    default:
      style.top = `${coords.top - gap}px`;
      style.left = `${Math.min(
        window.innerWidth - 120,
        Math.max(120, coords.left + coords.width / 2),
      )}px`;
      style.transform = "translate(-50%, -100%)";
      break;
  }

  return style;
}
