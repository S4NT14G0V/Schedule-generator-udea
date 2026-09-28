import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getFacultades() {
  try {
    const { data } = await api.get('/facultades');
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener facultades');
    }
    return data.data;
  } catch (error) {
    console.error('Error en getFacultades:', error);
    throw error;
  }
}

export async function getProgramas(facultad) {
  try {
    const { data } = await api.get(`/programas/${facultad}`);
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener programas');
    }
    return data.data;
  } catch (error) {
    console.error('Error en getProgramas:', error);
    throw error;
  }
}

export async function getHorarios(facultad, programa, nombreFacultad, nombrePrograma) {
  try {
    const { data } = await api.get(`/horarios/${facultad}/${programa}`, {
      params: { nombreFacultad, nombrePrograma },
    });
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener horarios');
    }
    return data.data;
  } catch (error) {
    console.error('Error en getHorarios:', error);
    throw error;
  }
}

export async function generarHorarios(materias, codigosSeleccionados, opciones) {
  if (USE_MOCK_DATA) {
    return generarHorariosMock(materias, codigosSeleccionados, opciones);
  }

  try {
    const { data } = await api.post('/generar-horarios', {
      materias,
      codigosSeleccionados,
      opciones
    });
    if (!data.success) {
      throw new Error(data.error || 'Error al generar horarios');
    }
    return data.data;
  } catch (error) {
    console.error('Error en generarHorarios:', error);
    throw error;
  }
}

function generarHorariosMock(materias, codigosSeleccionados, opciones = {}) {
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
      if (!tieneConflicto(candidato, actual)) {
        construir(indice + 1, [...actual, candidato]);
      }
    }
  };

  if (seleccionadas.length > 0) construir(0, []);

  return combinaciones.slice(0, 10).map((grupos, indice) => ({
    grupos,
    puntuacion: 1000 - indice,
    detalles: { modo: 'mock', materias: grupos.length },
  }));
}

function tieneConflicto(candidato, gruposActuales) {
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


