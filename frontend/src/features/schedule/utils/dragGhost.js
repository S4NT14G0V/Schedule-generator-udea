/**
 * Genera y aplica un nodo de previsualización (drag ghost) nativo del navegador,
 * nítido, 100% opaco y adaptado al tema actual (claro/oscuro).
 *
 * @param {DragEvent} e - Evento nativo de DragStart
 * @param {Object} materia - Objeto de la materia con codigo y nombre
 */
export function setNativeDragGhost(e, materia) {
  if (typeof document === "undefined" || !e?.dataTransfer || !materia) return;

  const isDark = document.documentElement.classList.contains("dark");
  const dragNode = document.createElement("div");

  dragNode.style.position = "fixed";
  dragNode.style.top = "-9999px";
  dragNode.style.left = "-9999px";
  dragNode.style.zIndex = "999999";
  dragNode.style.opacity = "1";
  dragNode.style.pointerEvents = "none";
  dragNode.style.background = isDark ? "#18181b" : "#ffffff";
  dragNode.style.color = isDark ? "#f4f4f5" : "#09090b";
  dragNode.style.border = isDark
    ? "1.5px solid #3f3f46"
    : "1.5px solid #cbd5e1";
  dragNode.style.borderRadius = "8px";
  dragNode.style.padding = "7px 12px";
  dragNode.style.boxShadow =
    "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)";
  dragNode.style.display = "flex";
  dragNode.style.alignItems = "center";
  dragNode.style.gap = "8px";
  dragNode.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
  dragNode.style.fontSize = "12px";
  dragNode.style.fontWeight = "600";
  dragNode.style.whiteSpace = "nowrap";

  dragNode.innerHTML = `
    <span style="
      background: #1392ec;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
    ">#${materia.codigo || ""}</span>
    <span>${materia.nombre}</span>
  `;

  document.body.appendChild(dragNode);
  e.dataTransfer.setDragImage(dragNode, 24, 18);

  setTimeout(() => {
    if (document.body.contains(dragNode)) {
      document.body.removeChild(dragNode);
    }
  }, 0);
}
