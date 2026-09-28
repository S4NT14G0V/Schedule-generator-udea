export const MOCK_MATERIAS = [
  {
    codigo: "2508101",
    nombre: "Calculo Diferencial",
    grupos: [{
      numero: 1,
      cupoDisponible: 24,
      cupoMaximo: 30,
      profesor: "Ana Torres",
      horarios: [{ dias: ["Lunes", "Miercoles"], horaInicio: 7, horaFin: 9 }],
    }],
  },
  {
    codigo: "2508102",
    nombre: "Fisica I",
    grupos: [{
      numero: 2,
      cupoDisponible: 18,
      cupoMaximo: 25,
      profesor: "Luis Ramirez",
      horarios: [{ dias: ["Martes", "Jueves"], horaInicio: 10, horaFin: 12 }],
    }],
  },
];