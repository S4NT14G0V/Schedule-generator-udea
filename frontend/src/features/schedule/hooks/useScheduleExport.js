import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { EXPORT_CONFIG, SCHEDULE_MESSAGES } from "@/features/schedule/constants/schedule.js";

/**
 * Hook para manejar la exportación del horario como imagen PNG o documento PDF.
 * Cumple la regla Vercel bundle-dynamic-imports cargando html2canvas-pro y jspdf bajo demanda.
 */
export function useScheduleExport(scheduleRef) {
  const [exporting, setExporting] = useState(false);

  const handleExportPNG = useCallback(async () => {
    try {
      setExporting(true);
      const element = scheduleRef.current;
      if (!element) {
        toast.error(SCHEDULE_MESSAGES.SCHEDULE_NOT_FOUND);
        return;
      }

      const { default: html2canvas } = await import("html2canvas-pro");
      const isDark = document.documentElement.classList.contains("dark");
      const canvas = await html2canvas(element, {
        backgroundColor: isDark ? "#09090b" : "#ffffff",
        scale: EXPORT_CONFIG.CANVAS_SCALE,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = EXPORT_CONFIG.PNG_FILENAME;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success(SCHEDULE_MESSAGES.PNG_EXPORTED);
    } catch {
      toast.error(SCHEDULE_MESSAGES.PNG_EXPORT_ERROR);
    } finally {
      setExporting(false);
    }
  }, [scheduleRef]);

  const handleExportPDF = useCallback(async () => {
    try {
      setExporting(true);
      const element = scheduleRef.current;
      if (!element) {
        toast.error(SCHEDULE_MESSAGES.SCHEDULE_NOT_FOUND);
        return;
      }

      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const isDark = document.documentElement.classList.contains("dark");
      const canvas = await html2canvas(element, {
        backgroundColor: isDark ? "#09090b" : "#ffffff",
        scale: EXPORT_CONFIG.CANVAS_SCALE,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(EXPORT_CONFIG.PDF_FILENAME);
      toast.success(SCHEDULE_MESSAGES.PDF_EXPORTED);
    } catch {
      toast.error(SCHEDULE_MESSAGES.PDF_EXPORT_ERROR);
    } finally {
      setExporting(false);
    }
  }, [scheduleRef]);

  return {
    exporting,
    handleExportPNG,
    handleExportPDF,
  };
}
