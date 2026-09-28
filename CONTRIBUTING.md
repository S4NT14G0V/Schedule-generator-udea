# Guía de Contribución y Continuidad del Proyecto

¡Gracias por tu interés en **Schedule Generator UdeA**! Este proyecto nació con el propósito de facilitar la vida académica de los estudiantes de la Universidad de Antioquia al automatizar y optimizar la generación de horarios de clase.

---

## Estado del Proyecto y Transición al LIS (UdeA)

> **Nota importante sobre el futuro de este repositorio:**  
> Este repositorio personal (`S4NT14G0V/Schedule-generator-udea`) entrará próximamente en una fase de archivo / mantenimiento pasivo.  
> La iniciativa, mantenimiento institucional y evolución oficial del generador de horarios serán transferidos formalmente al **LIS (Laboratorio Integrado de Sistemas)** de la Facultad de Ingeniería de la **Universidad de Antioquia**.

### ¿Cómo continuar y colaborar? ¡Haz un Fork!
El código es de código abierto bajo la **Licencia MIT**. Si eres estudiante, docente o desarrollador y deseas:
- Implementar nuevas características o algoritmos de optimización.
- Adaptar el scraper a otros portales o facultades.
- Corregir errores o experimentar con interfaces alternativas.

Te invitamos abiertamente a **hacer un Fork** de este repositorio:

1. Haz clic en el botón **Fork** en la parte superior derecha de GitHub.
2. Clona tu repositorio bifurcado localmente.
3. Continúa mejorando el proyecto libremente bajo tu propia autoría o prepáralo para contribuir con la iniciativa del **LIS**.

---

## Atribución y Licencia (Heritage & Attribution)

Cualquier bifurcación (fork), adaptación institucional o proyecto derivado —incluyendo su transición y despliegue dentro del ecosistema del **LIS**— **debe preservar y mantener de manera visible los créditos originales y la mención de autoría** a nombre de **(`S4NT14G0V`) y (`Arge2004`)** y los colaboradores originales del proyecto, tal como lo estipula la licencia [LICENSE](./LICENSE).

---

## Configuración del Entorno de Desarrollo Local

### 1. Requisitos Previos
- **Node.js** (versión 18 o superior recomendada).
- **npm** (versión 9 o superior).
- **Git**.

### 2. Instalación

Clona tu fork e instala todas las dependencias (raíz, frontend y backend):

```bash
git clone https://github.com/TU-USUARIO/Schedule-generator-udea.git
cd Schedule-generator-udea
npm run install:all
```

### 3. Variables de Entorno y Modo Mock

Para desarrollar la interfaz rápidamente sin necesidad de levantar el scraper ni depender del portal de la universidad, puedes usar el **modo simulado (Mock Data)**:

1. Crea o edita el archivo `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_USE_MOCK_DATA=true
   ```
2. Con `VITE_USE_MOCK_DATA=true`, el frontend cargará instantáneamente un catálogo realista de materias de la UdeA con grupos, cupos, docentes y aulas preconfiguradas.

### 4. Ejecución en Modo Desarrollo

Puedes iniciar ambos servicios o trabajar únicamente en el frontend:

```bash
# Iniciar frontend y backend concurrentemente:
npm run dev

# O iniciar solo el frontend (ideal con VITE_USE_MOCK_DATA=true):
npm run dev:frontend

# O iniciar solo el backend:
npm run dev:backend
```

- **Frontend:** `http://localhost:5173/` (o `5174`)
- **Backend API:** `http://localhost:3001/`

---

## Convenciones y Arquitectura de Código

### Arquitectura Feature-First en el Frontend
El frontend (`frontend/src/`) está organizado modularmente por dominios funcionales:

- `src/features/schedule/`: Componentes de la grilla de horarios, overlays de hover/drag, tooltip de materias, bloques manuales y exportación.
- `src/features/sidebar/`: Barra de búsqueda, paginación alfabética A-Z, filtros avanzados (días, franjas, jornadas) y popovers de preferencias.
- `src/features/subject/`: Tarjetas de materias, listas de grupos, cálculo de cupos y conflictos en tiempo real.
- `src/features/auth/`: Pantalla de bienvenida con fondo interactivo Dither y selector de facultad/programa.
- `src/features/mobile/`: Vistas y previsualizaciones compactas para dispositivos móviles.
- `src/features/ui/`: Componentes atómicos reutilizables (Botones, Switches, Modales, Tooltips, Partículas).
- `src/store/`: Estado global con Zustand estructurado en slices (`materias.slice.js`, `schedule.slice.js`, `ui.slice.js`).
- `src/icons/`: Iconos SVG optimizados e independientes.

### Estándares de Calidad
Antes de realizar commits o proponer cambios, asegúrate de que el código cumpla con los estándares:

```bash
cd frontend

# Ejecutar el linter (debe terminar con 0 errores y 0 warnings)
npm run lint

# Verificar compilación de producción
npm run build
```

---

¡Gracias por apoyar y formar parte del ecosistema de herramientas para la **Universidad de Antioquia**!