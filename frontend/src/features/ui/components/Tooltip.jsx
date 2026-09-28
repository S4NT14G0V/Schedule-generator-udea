import { useState, useRef, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { getTooltipCoords } from "../utils/tooltipPosition.js";

function TooltipComponent({
  children,
  content,
  position = "top",
  delay = 100,
  className = "",
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords(rect);
  }, []);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    calculatePosition();
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // Ocultar inmediatamente al hacer scroll, resize, click o blur en cualquier contenedor
  useEffect(() => {
    if (!isVisible) return;
    const handleClose = () => {
      setIsVisible(false);
    };
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    window.addEventListener("pointerdown", handleClose);
    window.addEventListener("blur", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("pointerdown", handleClose);
      window.removeEventListener("blur", handleClose);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex ${className}`}
    >
      {children}

      {isVisible &&
        content &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={getTooltipCoords(coords, position)}
            className="pointer-events-none px-3 py-1.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-2xl border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap text-left select-none"
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
}

export const Tooltip = memo(TooltipComponent);
export default Tooltip;
