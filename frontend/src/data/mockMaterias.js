const grupo = (numero, cupoDisponible, profesor, horarios) => ({
  numero,
  cupoDisponible,
  cupoMaximo: Math.max(cupoDisponible, 30),
  profesor,
  horarios,
});

const horario = (dias, horaInicio, horaFin, aula) => ({
  dias,
  horaInicio,
  horaFin,
  aula,
});

export const MOCK_DATA = {
  facultad: "Ingenieria",
  programa: { codigo: "ING", nombre: "Ingenieria de Sistemas" },
  semestre: "2026-2",
  fecha: "2026-09-27",
  materias: [
    {
      codigo: "MOCK-101",
      nombre: "Calculo Diferencial",
      grupos: [
        grupo(1, 24, "Ana Torres", [
          horario(["Lunes", "Miércoles"], 7, 9, "Bloque 12-201"),
          horario(["Viernes"], 7, 8, "Bloque 12-201"),
        ]),
        grupo(2, 12, "Carlos Mejia", [
          horario(["Martes", "Jueves"], 10, 12, "Bloque 5-304"),
        ]),
        grupo(3, 0, "Laura Rios", [
          horario(["Lunes", "Miércoles"], 14, 16, "Bloque 12-202"),
        ]),
      ],
    },
    {
      codigo: "MOCK-102",
      nombre: "Algebra Lineal",
      grupos: [
        grupo(1, 20, "Diego Perez", [
          horario(["Lunes", "Miércoles"], 8, 10, "Bloque 19-101"),
        ]),
        grupo(2, 15, "Sofia Gomez", [
          horario(["Martes", "Jueves"], 7, 9, "Bloque 19-101"),
          horario(["Viernes"], 9, 10, "Bloque 19-101"),
        ]),
        grupo(3, 8, "Diego Perez", [
          horario(["Viernes"], 13, 16, "Bloque 19-102"),
        ]),
      ],
    },
    {
      codigo: "MOCK-103",
      nombre: "Fisica I",
      grupos: [
        grupo(1, 18, "Luis Ramirez", [
          horario(["Martes", "Jueves"], 10, 12, "Bloque 6-201"),
          horario(["Viernes"], 10, 12, "Laboratorio 1"),
        ]),
        grupo(2, 10, "Marta Leon", [
          horario(["Lunes", "Miércoles"], 10, 12, "Bloque 6-204"),
          horario(["Jueves"], 14, 16, "Laboratorio 2"),
        ]),
        grupo(3, 0, "Luis Ramirez", [
          horario(["Sábado"], 8, 12, "Laboratorio 1"),
        ]),
      ],
    },
    {
      codigo: "MOCK-104",
      nombre: "Programacion I",
      grupos: [
        grupo(1, 28, "Nicolas Arias", [
          horario(["Lunes", "Miércoles"], 10, 12, "Bloque 18-301"),
        ]),
        grupo(2, 6, "Valentina Cruz", [
          horario(["Martes", "Jueves"], 13, 15, "Bloque 18-301"),
          horario(["Viernes"], 13, 15, "Bloque 18-301"),
        ]),
        grupo(3, 14, "Nicolas Arias", [
          horario(["Sábado"], 8, 12, "Bloque 18-302"),
        ]),
      ],
    },
    {
      codigo: "MOCK-105",
      nombre: "Estructuras de Datos",
      grupos: [
        grupo(1, 16, "Paula Marin", [
          horario(["Lunes", "Miércoles"], 13, 15, "Bloque 18-303"),
        ]),
        grupo(2, 16, "Paula Marin", [
          horario(["Martes", "Jueves"], 15, 17, "Bloque 18-303"),
        ]),
        grupo(3, 4, "Andres Gil", [
          horario(["Viernes"], 7, 11, "Bloque 18-304"),
        ]),
      ],
    },
    {
      codigo: "MOCK-106",
      nombre: "Bases de Datos",
      grupos: [
        grupo(1, 21, "Juliana Soto", [
          horario(["Lunes", "Miércoles"], 15, 17, "Bloque 18-201"),
        ]),
        grupo(2, 0, "Juliana Soto", [
          horario(["Martes", "Jueves"], 8, 10, "Bloque 18-201"),
        ]),
        grupo(3, 11, "Mateo Ruiz", [
          horario(["Viernes"], 14, 18, "Bloque 18-202"),
        ]),
      ],
    },
    {
      codigo: "MOCK-107",
      nombre: "Ingenieria de Software",
      grupos: [
        grupo(1, 13, "Camilo Vargas", [
          horario(["Lunes", "Miercoles"], 17, 19, "Bloque 20-101"),
        ]),
        grupo(2, 9, "Camilo Vargas", [
          horario(["Martes", "Jueves"], 17, 19, "Bloque 20-101"),
        ]),
        grupo(3, 5, "Sara Molina", [
          horario(["Sábado"], 13, 17, "Bloque 20-102"),
        ]),
      ],
    },
    {
      codigo: "MOCK-108",
      nombre: "Etica Profesional",
      grupos: [
        grupo(1, 30, "Elena Mora", [
          horario(["Lunes"], 7, 9, "Bloque 1-105"),
        ]),
        grupo(2, 30, "Elena Mora", [
          horario(["Viernes"], 10, 12, "Bloque 1-105"),
        ]),
        grupo(3, 30, "Jorge Cano", [
          horario(["Sabado"], 10, 12, "Bloque 1-105"),
        ]),
      ],
    },
    {
      codigo: "MOCK-109",
      nombre: "Probabilidad y Estadistica",
      grupos: [
        grupo(1, 7, "Rocio Parra", [
          horario(["Martes", "Jueves"], 12, 14, "Bloque 10-201"),
        ]),
        grupo(2, 19, "Rocio Parra", [
          horario(["Lunes", "Miércoles"], 12, 14, "Bloque 10-201"),
        ]),
        grupo(3, 0, "Hugo Vera", [
          horario(["Viernes"], 8, 10, "Bloque 10-202"),
        ]),
      ],
    },
    {
      codigo: "MOCK-110",
      nombre: "Sistemas Operativos",
      grupos: [
        grupo(1, 12, "Felipe Osorio", [
          horario(["Lunes", "Miércoles"], 14, 16, "Bloque 18-401"),
          horario(["Viernes"], 14, 16, "Laboratorio 3"),
        ]),
        grupo(2, 12, "Felipe Osorio", [
          horario(["Martes", "Jueves"], 14, 16, "Bloque 18-401"),
          horario(["Sábado"], 8, 10, "Laboratorio 3"),
        ]),
        grupo(3, 3, "Diana Nieto", [
          horario(["Viernes"], 16, 20, "Laboratorio 3"),
        ]),
      ],
    },
    {
      codigo: "MOCK-111",
      nombre: "Redes de Computadores",
      grupos: [
        grupo(1, 17, "Oscar Franco", [
          horario(["Lunes", "Miércoles"], 16, 18, "Bloque 18-402"),
        ]),
        grupo(2, 17, "Oscar Franco", [
          horario(["Martes", "Jueves"], 16, 18, "Bloque 18-402"),
        ]),
        grupo(3, 1, "Miriam Vega", [
          horario(["Sábado"], 14, 18, "Bloque 18-402"),
        ]),
      ],
    },
    {
      codigo: "MOCK-112",
      nombre: "Proyecto Integrador",
      grupos: [
        grupo(1, 8, "Equipo de Proyectos", [
          horario(["Lunes"], 18, 21, "Bloque 20-201"),
          horario(["Miércoles"], 18, 21, "Bloque 20-201"),
        ]),
        grupo(2, 0, "Equipo de Proyectos", [
          horario(["Martes"], 18, 21, "Bloque 20-202"),
          horario(["Jueves"], 18, 21, "Bloque 20-202"),
        ]),
      ],
    },
    {
      codigo: "MOCK-113",
      nombre: "Ingles Tecnico",
      grupos: [
        grupo(1, 26, "Natalia Perez", [
          horario(["Martes", "Jueves"], 9, 10, "Bloque 9-101"),
        ]),
        grupo(2, 26, "Natalia Perez", [
          horario(["Lunes", "Miércoles"], 9, 10, "Bloque 9-101"),
        ]),
        grupo(3, 26, "Santiago Ruiz", [
          horario(["Sábado"], 9, 11, "Bloque 9-102"),
        ]),
      ],
    },
    {
      codigo: "MOCK-114",
      nombre: "Arquitectura de Computadores",
      grupos: [
        grupo(1, 10, "Mariana Hoyos", [
          horario(["Lunes", "Miércoles"], 11, 13, "Bloque 18-403"),
        ]),
        grupo(2, 10, "Mariana Hoyos", [
          horario(["Martes", "Jueves"], 11, 13, "Bloque 18-403"),
        ]),
        grupo(3, 2, "Juan Mesa", [
          horario(["Viernes"], 11, 15, "Bloque 18-403"),
        ]),
      ],
    },
  ],
};