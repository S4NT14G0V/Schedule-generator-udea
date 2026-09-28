import { useState, useRef, useEffect, useCallback } from "react";
import { SIDEBAR_CONFIG } from "@/features/sidebar/constants/sidebar.js";

/**
 * Hook para sincronizar la columna de navegación A-Z con el scroll de materias.
 * Soporta scroll programático instantáneo y seguimiento de letra activa por visibilidad.
 */
export function useAlphabetScroll({
  availableLetters = [],
  focusedMateriaCodigo,
  focusTimestamp,
  onResetFiltersForFocused,
}) {
  const scrollContainerRef = useRef(null);
  const sectionRefs = useRef({});
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef(null);
  const targetLetterRef = useRef(null);

  const [activeLetter, setActiveLetter] = useState(null);

  // Observer para detectar qué sección de letra está activa durante el scroll
  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        if (targetLetterRef.current) {
          setActiveLetter(targetLetterRef.current);
        }
      }, SIDEBAR_CONFIG.SCROLL_PROGRAMMATIC_TIMEOUT_MS);
      return;
    }

    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    let currentLetter = availableLetters[0] || null;
    for (const letter of availableLetters) {
      const el = sectionRefs.current[letter];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= SIDEBAR_CONFIG.SCROLL_HEADER_OFFSET) {
          currentLetter = letter;
        } else {
          break;
        }
      }
    }
    setActiveLetter(currentLetter);
  }, [availableLetters]);

  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  // Scroll suave hacia una letra seleccionada
  const scrollToLetter = useCallback((letter) => {
    const el = sectionRefs.current[letter];
    if (el && scrollContainerRef.current) {
      setActiveLetter(letter);
      targetLetterRef.current = letter;
      isProgrammaticScrollRef.current = true;

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }

      el.scrollIntoView({ behavior: "smooth", block: "start" });

      scrollEndTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        setActiveLetter(letter);
      }, 200);
    }
  }, []);

  // Navegar y hacer scroll automáticamente hacia la materia seleccionada desde el horario
  useEffect(() => {
    if (!focusedMateriaCodigo || !focusTimestamp) return;

    const timer = setTimeout(() => {
      onResetFiltersForFocused?.(focusedMateriaCodigo);

      const el = document.getElementById(
        `subject-card-${focusedMateriaCodigo}`,
      );
      const container = scrollContainerRef.current;
      if (el && container) {
        const targetRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offset =
          targetRect.top +
          targetRect.height / 2 -
          (containerRect.top + containerRect.height / 2);
        container.scrollBy({ top: offset, behavior: "smooth" });
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [focusTimestamp, focusedMateriaCodigo, onResetFiltersForFocused]);

  return {
    scrollContainerRef,
    sectionRefs,
    activeLetter,
    handleScroll,
    scrollToLetter,
  };
}
