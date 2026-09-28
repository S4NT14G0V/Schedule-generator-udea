import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { HorariosService } from "@/services/horarios.service.js";
import { useMateriasStore } from "@/store/materias.store.js";
import { MOCK_DATA } from "@/data/materias.mock.js";
import { GithubIcon } from "@/icons/index.js";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";
const MOCK_FACULTADES = [
  { value: MOCK_DATA.facultad, label: MOCK_DATA.facultad },
];
const MOCK_PROGRAMAS = [
  { value: MOCK_DATA.programa.codigo, label: MOCK_DATA.programa.nombre },
];

function ProgramSelectorComponent({ onMenuOpenChange }) {
  // Inicializar estado directamente desde localStorage si existe
  const [facultades, setFacultades] = useState(
    USE_MOCK_DATA ? MOCK_FACULTADES : [],
  );
  const [programas, setProgramas] = useState(
    USE_MOCK_DATA ? MOCK_PROGRAMAS : [],
  );
  const [selectedFacultad, setSelectedFacultad] = useState(
    () =>
      USE_MOCK_DATA
        ? MOCK_DATA.facultad
        : localStorage.getItem("selectedFacultad") || "",
  );
  const [selectedPrograma, setSelectedPrograma] = useState(
    () =>
      USE_MOCK_DATA
        ? MOCK_DATA.programa.codigo
        : localStorage.getItem("selectedPrograma") || "",
  );

  const [isLoadingFacultades, setIsLoadingFacultades] = useState(false);
  const [isLoadingProgramas, setIsLoadingProgramas] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const {
    setMateriasData,
    resetMateriasSeleccionadas,
    clearHorariosGenerados,
    darkTheme,
  } = useMateriasStore();

  // 1. Cargar facultades al montar el componente
  useEffect(() => {
    if (USE_MOCK_DATA) return undefined;

    let isMounted = true;
    const loadFacultades = async () => {
      try {
        setIsLoadingFacultades(true);
        const data = await HorariosService.getFacultades();
        if (isMounted) setFacultades(data || []);
      } catch {
        toast.error("Error al cargar facultades");
      } finally {
        if (isMounted) setIsLoadingFacultades(false);
      }
    };
    loadFacultades();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cargar programas cuando cambia la facultad
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setProgramas(MOCK_PROGRAMAS);
      return undefined;
    }

    if (!selectedFacultad) {
      setProgramas([]);
      setSelectedPrograma("");
      localStorage.removeItem("selectedPrograma");
      return;
    }

    let isMounted = true;
    const loadProgramas = async () => {
      try {
        setIsLoadingProgramas(true);
        const data = await HorariosService.getProgramas(selectedFacultad);
        if (isMounted) setProgramas(data || []);
      } catch {
        toast.error("Error al cargar programas");
        if (isMounted) setProgramas([]);
      } finally {
        if (isMounted) setIsLoadingProgramas(false);
      }
    };

    loadProgramas();
    return () => {
      isMounted = false;
    };
  }, [selectedFacultad]);

  // Handlers con persistencia sincronizada
  const handleFacultadChange = useCallback((option) => {
    const value = option ? option.value : "";
    setSelectedFacultad(value);
    setSelectedPrograma(""); // Limpiar programa al cambiar facultad
    localStorage.setItem("selectedFacultad", value);
    localStorage.removeItem("selectedPrograma");
  }, []);

  const handleProgramaChange = useCallback((option) => {
    const value = option ? option.value : "";
    setSelectedPrograma(value);
    localStorage.setItem("selectedPrograma", value);
  }, []);

  // Petición de obtención de horarios
  const handleScrapeHorarios = async () => {
    if (!selectedFacultad || !selectedPrograma) {
      toast.error("Por favor selecciona una facultad y un programa", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsScraping(true);

      if (USE_MOCK_DATA) {
        setMateriasData(MOCK_DATA);
        resetMateriasSeleccionadas();
        clearHorariosGenerados();
        toast.success(`Se cargaron ${MOCK_DATA.materias.length} materias mock`, {
          duration: 3500,
        });
        return;
      }

      const facultadObj = facultades.find((f) => f.value === selectedFacultad);
      const programaObj = programas.find((p) => p.value === selectedPrograma);

      const data = await HorariosService.getHorarios(
        selectedFacultad,
        selectedPrograma,
        facultadObj?.label || "",
        programaObj?.label || "",
      );

      if (!data?.materias || data.materias.length === 0) {
        toast.error("No hay horarios disponibles para la selección actual", {
          duration: 4000,
        });
        return;
      }

      setMateriasData(data);
      resetMateriasSeleccionadas();
      clearHorariosGenerados();

      toast.success(
        `Se actualizaron ${data.materias.length} materias y se reiniciaron las selecciones`,
        { duration: 4500 },
      );
    } catch (error) {
      toast.error(`Error al obtener horarios: ${error.message}`, {
        duration: 4000,
      });
    } finally {
      setIsScraping(false);
    }
  };

  // Adaptación dinámica de react-select según Dark Theme
  const customSelectStyles = useMemo(
    () => ({
      control: (base) => ({
        ...base,
        minHeight: "40px",
        borderRadius: "0.5rem",
        backgroundColor: darkTheme ? "#18181b" : "#ffffff",
        borderColor: darkTheme ? "#27272a" : "#e4e4e7",
        boxShadow: "none",
        color: darkTheme ? "#f4f4f5" : "#111827",
      }),
      placeholder: (base) => ({
        ...base,
        color: darkTheme ? "#a1a1aa" : "#6b7280",
      }),
      option: (base, state) => ({
        ...base,
        color: darkTheme ? "#f4f4f5" : "#111827",
        backgroundColor: state.isFocused
          ? darkTheme
            ? "#27272a"
            : "#f4f4f5"
          : darkTheme
          ? "#18181b"
          : "#ffffff",
      }),
      singleValue: (base) => ({
        ...base,
        color: darkTheme ? "#f4f4f5" : "#111827",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: darkTheme ? "#18181b" : "#ffffff",
        borderColor: darkTheme ? "#27272a" : "#e4e4e7",
      }),
      menuList: (base) => ({ ...base, maxHeight: "240px" }),
    }),
    [darkTheme],
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-between px-6 sm:px-14 py-8 overflow-y-auto relative select-none">
      <div className="w-full flex-1 max-w-md flex flex-col justify-center">
        {/* Formulario */}
        <div className="relative z-10 space-y-4">
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-center">
            Obtener Horarios UdeA
          </h3>

          {/* Selector de Facultad */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Facultad
            </label>
            <Select
              options={facultades}
              value={facultades.find((f) => f.value === selectedFacultad) || null}
              onChange={handleFacultadChange}
              isDisabled={isScraping || isLoadingFacultades}
              placeholder={
                isLoadingFacultades
                  ? "Cargando facultades..."
                  : "Selecciona una facultad..."
              }
              className="w-full text-start text-sm"
              classNamePrefix="rs"
              styles={customSelectStyles}
              onMenuOpen={() => onMenuOpenChange?.(true)}
              onMenuClose={() => onMenuOpenChange?.(false)}
              menuShouldScrollIntoView={false}
              isClearable
            />
          </div>

          {/* Selector de Programa */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Programa
            </label>
            <Select
              options={programas}
              value={programas.find((p) => p.value === selectedPrograma) || null}
              onChange={handleProgramaChange}
              isDisabled={!selectedFacultad || isScraping || isLoadingProgramas}
              placeholder={
                !selectedFacultad
                  ? "Primero selecciona una facultad..."
                  : isLoadingProgramas
                  ? "Cargando programas..."
                  : "Selecciona un programa..."
              }
              className="w-full text-start text-sm"
              classNamePrefix="rs"
              styles={customSelectStyles}
              onMenuOpen={() => onMenuOpenChange?.(true)}
              onMenuClose={() => onMenuOpenChange?.(false)}
              menuShouldScrollIntoView={false}
              isClearable
            />
          </div>

          {/* Botón de obtención */}
          <button
            type="button"
            onClick={handleScrapeHorarios}
            disabled={!selectedFacultad || !selectedPrograma || isScraping}
            className="w-full px-4 text-sm py-3 mt-6 bg-primary hover:bg-primary/90 
                       disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500
                       disabled:cursor-not-allowed text-white font-semibold rounded-lg 
                       flex items-center justify-center gap-2 cursor-pointer"
          >
            {isScraping ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Obteniendo horarios...</span>
              </>
            ) : (
              <span>Obtener Horarios</span>
            )}
          </button>
        </div>
      </div>

      {/* Enlace para colaborar en GitHub */}
      <div className="w-full max-w-md pt-6 flex flex-col items-center justify-center text-center">
        <a
          href="https://github.com/S4NT14G0V/Schedule-generator-udea"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-xs duration-200 shadow-2xs"
        >
          <GithubIcon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 group-hover:text-primary transition-colors font-mono">
            GitHub
          </span>
          <span className="font-medium">¿Quieres colaborar?</span>
        </a>
      </div>
    </div>
  );
}

export const ProgramSelector = memo(ProgramSelectorComponent);
export default ProgramSelector;
