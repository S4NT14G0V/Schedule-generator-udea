import { useState, useRef, useEffect, memo } from "react";
import { DownloadIcon, ChevronDownIcon } from "@/icons/index.js";

function ExportDropdownComponent({
  exporting,
  onExportPNG,
  onExportPDF,
}) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onDocClick = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      setExportMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [exportMenuOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setExportMenuOpen(!exportMenuOpen)}
        disabled={exporting}
        className="h-8 px-3 rounded-md bg-primary hover:bg-primary/90 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        aria-label="Exportar horario"
      >
        <DownloadIcon className="w-3.5 h-3.5" />
        <span>{exporting ? "Exportando…" : "Exportar"}</span>
        <ChevronDownIcon
          className={`w-3 h-3 transition-transform duration-150 ${
            exportMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {exportMenuOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-36 bg-white dark:bg-zinc-900 rounded-md shadow-2xl border border-zinc-200 dark:border-zinc-800 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setExportMenuOpen(false);
              onExportPNG();
            }}
            className="w-full px-3 py-1.5 text-left text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium"
          >
            <img src="/png.png" alt="PNG" className="w-3.5 h-3.5" />
            <span>Imagen PNG</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setExportMenuOpen(false);
              onExportPDF();
            }}
            className="w-full px-3 py-1.5 text-left text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium"
          >
            <img src="/pdf.png" alt="PDF" className="w-3.5 h-3.5" />
            <span>Documento PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

export const ExportDropdown = memo(ExportDropdownComponent);
export default ExportDropdown;
