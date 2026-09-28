import { memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Contenedor compartido para Popovers del Sidebar.
 * - Desktop: Posicionamiento anclado a la derecha del sidebar usando coords.
 * - Mobile: Modal flotante centrado con backdrop blur.
 */
function PopoverContainerComponent({
  isOpen,
  onClose,
  isMobile,
  coords,
  children,
}) {
  if (!isOpen || typeof document === "undefined") return null;

  // Mobile: Centered modal
  if (isMobile) {
    return createPortal(
      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-4"
          >
            {children}
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body,
    );
  }

  // Desktop: Anchored popover (requires coords)
  if (!coords) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transformOrigin: "top left",
        }}
        className="z-50 w-80 max-h-[calc(100vh-24px)] overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4"
      >
        {children}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

export const PopoverContainer = memo(PopoverContainerComponent);
export default PopoverContainer;
