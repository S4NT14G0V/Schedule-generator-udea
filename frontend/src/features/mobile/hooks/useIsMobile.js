import { useSyncExternalStore } from "react";

/**
 * Hook reactivo para detectar si la pantalla actual corresponde a un dispositivo móvil.
 * Utiliza `useSyncExternalStore` siguiendo las mejores prácticas de React 19 y Vercel
 * sin requerir `useState` ni `useEffect`, evitando re-renders en cascada o hydration mismatches.
 *
 * @param {number} breakpoint Ancho en píxeles para considerar móvil (por defecto 768px)
 * @returns {boolean} true si el ancho de pantalla es menor o igual al breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    },
    () => false, // Snapshot para SSR / Server-side
  );
}

export default useIsMobile;
