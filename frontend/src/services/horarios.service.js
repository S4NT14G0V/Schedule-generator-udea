import axios from "axios";

/**
 * Servicio para gestión y consulta de horarios y programas académicos.
 * Diseñado como clase con atributos de configuración y métodos integrados directamente.
 */
export class HorariosService {
  static apiUrl = import.meta.env.VITE_API_URL || "";
  static useMockData = import.meta.env.VITE_USE_MOCK_DATA !== "false";

  static client = axios.create({
    baseURL: `${HorariosService.apiUrl}/api`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Obtiene la lista de facultades disponibles directamente desde la clase.
   * @returns {Promise<Array>}
   */
  static async getFacultades() {
    try {
      const { data } = await this.client.get("/facultades");
      if (!data.success) {
        throw new Error(data.error || "Error al obtener facultades");
      }
      return data.data;
    } catch (error) {
      console.error("Error en getFacultades:", error);
      throw error;
    }
  }

  /**
   * Obtiene los programas asociados a una facultad directamente desde la clase.
   * @param {string} facultad
   * @returns {Promise<Array>}
   */
  static async getProgramas(facultad) {
    try {
      const { data } = await this.client.get(`/programas/${facultad}`);
      if (!data.success) {
        throw new Error(data.error || "Error al obtener programas");
      }
      return data.data;
    } catch (error) {
      console.error("Error en getProgramas:", error);
      throw error;
    }
  }

  /**
   * Obtiene las materias y horarios correspondientes a un programa y facultad.
   * @param {string} facultad
   * @param {string} programa
   * @param {string} [nombreFacultad]
   * @param {string} [nombrePrograma]
   * @returns {Promise<Object>}
   */
  static async getHorarios(facultad, programa, nombreFacultad, nombrePrograma) {
    try {
      const { data } = await this.client.get(
        `/horarios/${facultad}/${programa}`,
        {
          params: { nombreFacultad, nombrePrograma },
        },
      );
      if (!data.success) {
        throw new Error(data.error || "Error al obtener horarios");
      }
      return data.data;
    } catch (error) {
      console.error("Error en getHorarios:", error);
      throw error;
    }
  }

  /**
   * Genera combinaciones de horarios para las materias seleccionadas.
   * @param {Array} materias
   * @param {Array<string>} codigosSeleccionados
   * @param {Object} [opciones]
   * @returns {Promise<Array>}
   */
  static async generarHorarios(materias, codigosSeleccionados, opciones) {
    if (this.useMockData) {
      return this._generarHorariosMock(
        materias,
        codigosSeleccionados,
        opciones,
      );
    }

    try {
      const { data } = await this.client.post("/generar-horarios", {
        materias,
        codigosSeleccionados,
        opciones,
      });
      if (!data.success) {
        throw new Error(data.error || "Error al generar horarios");
      }
      return data.data;
    } catch (error) {
      console.error("Error en generarHorarios:", error);
      throw error;
    }
  }

  /**
   * Generador de horarios simulado local para entornos de desarrollo/demo.
   * @private
   */
  static _generarHorariosMock(materias, codigosSeleccionados, opciones = {}) {
    const horaMinima = opciones.horaMinima ?? 6;
    const seleccionadas = (materias || [])
      .filter((materia) => codigosSeleccionados.includes(materia.codigo))
      .map((materia) => ({
        ...materia,
        grupos: (materia.grupos || []).filter(
          (grupo) =>
            grupo.cupoDisponible > 0 &&
            (grupo.horarios || []).every(
              (horario) => horario.horaInicio >= horaMinima,
            ),
        ),
      }))
      .filter((materia) => materia.grupos.length > 0);

    const combinaciones = [];
    const construir = (indice, actual) => {
      if (combinaciones.length >= 1000) return;
      if (indice === seleccionadas.length) {
        combinaciones.push(actual.map((grupo) => ({ ...grupo })));
        return;
      }

      for (const grupo of seleccionadas[indice].grupos) {
        const candidato = {
          codigoMateria: seleccionadas[indice].codigo,
          nombreMateria: seleccionadas[indice].nombre,
          numeroGrupo: grupo.numero,
          horarios: grupo.horarios,
          profesor: grupo.profesor,
          cupoDisponible: grupo.cupoDisponible,
        };
        if (!this._tieneConflicto(candidato, actual)) {
          construir(indice + 1, [...actual, candidato]);
        }
      }
    };

    if (seleccionadas.length > 0) construir(0, []);

    return combinaciones.slice(0, 10).map((grupos, indice) => ({
      grupos,
      puntuacion: 1000 - indice,
      detalles: { modo: "mock", materias: grupos.length },
    }));
  }

  /**
   * Verifica si existe solapamiento temporal entre un grupo candidato y los seleccionados.
   * @private
   */
  static _tieneConflicto(candidato, gruposActuales) {
    return gruposActuales.some((grupo) =>
      (candidato.horarios || []).some((horarioNuevo) =>
        (grupo.horarios || []).some((horarioActual) =>
          horarioNuevo.dias.some(
            (dia) =>
              horarioActual.dias.includes(dia) &&
              horarioNuevo.horaInicio < horarioActual.horaFin &&
              horarioActual.horaInicio < horarioNuevo.horaFin,
          ),
        ),
      ),
    );
  }

  // Métodos de instancia que delegan a los métodos de la clase
  getFacultades() {
    return HorariosService.getFacultades();
  }

  getProgramas(facultad) {
    return HorariosService.getProgramas(facultad);
  }

  getHorarios(facultad, programa, nombreFacultad, nombrePrograma) {
    return HorariosService.getHorarios(
      facultad,
      programa,
      nombreFacultad,
      nombrePrograma,
    );
  }

  generarHorarios(materias, codigosSeleccionados, opciones) {
    return HorariosService.generarHorarios(
      materias,
      codigosSeleccionados,
      opciones,
    );
  }
}

export const horariosService = new HorariosService();
export default HorariosService;
