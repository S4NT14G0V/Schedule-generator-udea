# Generador de Horarios UdeA

Aplicación web moderna y de alto rendimiento para generar, personalizar y optimizar horarios de clase de la **Universidad de Antioquia (UdeA)** mediante web scraping automatizado y algoritmos inteligentes de resolución de conflictos.

---

## Estado del Proyecto y Transición al LIS (UdeA)

> **Aviso de Continuidad:**  
> Este repositorio personal (`S4NT14G0V/Schedule-generator-udea`) entrará en fase de archivo pasivo próximamente.  
> La continuidad oficial y desarrollo institucional del proyecto se transferirán formalmente al **LIS (Laboratorio Integrado de Sistemas)** de la Facultad de Ingeniería de la **Universidad de Antioquia**.  
>  
> Si deseas colaborar, implementar mejoras o crear tu propia versión, te invitamos a **hacer un Fork** de este repositorio. Consulta la [Guía de Contribución](./CONTRIBUTING.md) para más detalles.

---

## Características Principales

- **Modo Automático Inteligente:** Generación y ranking de múltiples combinaciones de horarios sin conflictos, optimizando huecos entre clases y respetando cupos disponibles.
- **Modo Manual Interactivo:**
  - **Arrastre y Soltado (Drag & Drop):** Arrastra materias y grupos directamente hacia los bloques disponibles de la cuadrícula.
  - **Previsualización en Hover con Detección de Filtros:** Pasa el cursor sobre cualquier materia o grupo para previsualizar instantáneamente sus espacios libres en el horario. Si hay filtros activos, los cupos que cumplen con el filtro se destacan en **morado punteado** con opción de colocación con un solo clic.
  - **Preferencias Personalizables:** Activa o desactiva de forma independiente el *Drag & Drop* y la *Previsualización en Hover* desde el menú de opciones (⚙️).
- **Bloques Manuales de Estudio:** Añade actividades extracurriculares, trabajo o bloques de estudio personalizados con edición de nombre y duración directamente sobre la cuadrícula.
- **Búsqueda y Filtros Avanzados:**
  - Navegación alfabética instantánea (A-Z) con scroll sincronizado.
  - Filtros avanzados por días de la semana, franjas horarias mínimas/máximas y jornadas (Mañana, Tarde, Noche).
- **Exportación Multi-formato:** Descarga tu horario en alta resolución en formatos **PNG** y **PDF** listos para imprimir o compartir.
- **Experiencia Visual Pulida:** Temas Claro y Oscuro fluidos, micro-animaciones con Framer Motion y fondo interactivo dinámico con efecto Dither.
- **Soporte Móvil:** Vista compacta y drawer adaptado para dispositivos móviles.

---

## Estructura del Proyecto

El proyecto sigue una arquitectura desacoplada basada en módulos de dominio (**Feature-First** en el frontend y **MVC/Service** en el backend):

```
Schedule-generator-udea/
├── frontend/                     # Aplicación de usuario (SPA con React + Vite)
│   ├── src/
│   │   ├── features/             # Módulos organizados por dominio funcional
│   │   │   ├── auth/             # Fondo interactivo Dither, login y selección de programa
│   │   │   ├── schedule/         # Grilla de horarios, overlays de hover/drop, toolbars y exportación
│   │   │   ├── sidebar/          # Buscador, navegación A-Z, filtros avanzados y popovers
│   │   │   ├── subject/          # Tarjetas de materias, grupos, cupos y cálculo de conflictos
│   │   │   ├── mobile/           # Componentes adaptados para dispositivos móviles
│   │   │   └── ui/               # Componentes atómicos base (Botones, Switches, Modales, Tooltips)
│   │   ├── store/                # Estado global centralizado con Zustand (Slices modulares)
│   │   │   ├── materias.store.js
│   │   │   └── slices/           # materias.slice, schedule.slice, ui.slice
│   │   ├── services/             # Clientes HTTP y conexión con la API
│   │   ├── data/                 # Dataset simulado (MOCK_DATA) para desarrollo offline
│   │   ├── icons/                # Iconos SVG vectoriales optimizados
│   │   └── index.css             # Configuración Tailwind CSS y temas de color
│   ├── .env.example              # Plantilla de variables de entorno para el frontend
│   └── package.json
│
├── backend/                      # API REST y Scraper headless (Express + Playwright)
│   ├── controllers/              # Controladores de rutas
│   ├── models/                   # Modelos de datos
│   ├── routes/                   # Definición de endpoints API
│   ├── services/                 # Scraper de horarios (Playwright) y lógica de negocio
│   ├── utils/                    # Validaciones y utilidades compartidas
│   ├── app.js                    # Servidor Express principal
│   ├── .env.example              # Plantilla de variables de entorno del backend
│   └── package.json
│
├── .env.example                  # Variables de entorno globales del proyecto
├── CONTRIBUTING.md               # Guía para forks, contribuciones y contexto del LIS
├── LICENSE                       # Licencia MIT y cláusula de atribución original
└── package.json                  # Scripts orquestadores del monorepositorio
```

---

## Inicio Rápido

### 1. Instalación de Dependencias

Ejecuta el script principal en la raíz para instalar todos los paquetes (raíz, frontend y backend):

```bash
npm run install:all
```

### 2. Configuración de Variables de Entorno

Copia el archivo de ejemplo en el frontend:

```bash
cp frontend/.env.example frontend/.env
```

Contenido de `frontend/.env`:
```env
# URL de la API del backend
VITE_API_URL=http://localhost:3001

# Modo de desarrollo con datos simulados (Mock Data)
# true: Permite desarrollar la interfaz de inmediato sin depender del backend ni scraping.
# false: Realiza consultas al scraper del backend conectado al portal de la UdeA.
VITE_USE_MOCK_DATA=true
```

### 3. Ejecución en Desarrollo

```bash
# Iniciar ambos entornos en paralelo (Frontend en :5173 / :5174 y Backend en :3001)
npm run dev

# O ejecutar únicamente el frontend (ideal con VITE_USE_MOCK_DATA=true):
npm run dev:frontend

# O ejecutar únicamente el backend:
npm run dev:backend
```

### 4. Compilación para Producción

```bash
# Compilar el frontend optimizado
npm run build

# Desplegar servidor completo (sirve el frontend compilado desde el backend en :3001)
npm start
```

---

## Tecnologías Utilizadas

- **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Zustand](https://zustand-demo.pmnd.rs/), [html2canvas](https://html2canvas.hertzen.com/), [jsPDF](https://github.com/parallax/jsPDF).
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Playwright](https://playwright.dev/) (navegador Chromium headless para scraping de portales académicos).
- **Calidad de Código:** ESLint con reglas de React y Hooks.

---

## Endpoints de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado de salud del servicio |
| `GET` | `/api/facultades` | Lista de facultades disponibles |
| `GET` | `/api/programas/:facultad` | Lista de programas académicos por facultad |
| `POST` | `/api/scrape-horarios` | Inicia el scraping de materias y grupos según facultad y programa |

---

## Licencia y Atribución

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

### Cláusula de Atribución (Heritage Notice)
Concebido, diseñado y desarrollado originalmente por **Santiago Trespalacios Bolivar ([@S4NT14G0V](https://github.com/S4NT14G0V))**, **Argenis Medina Morales ([@Arge2004](https://github.com/Arge2004))** y colaboradores originales. Cualquier bifurcación (fork), adaptación institucional o continuación en el **LIS (Laboratorio Integrado de Sistemas - Universidad de Antioquia)** debe mantener y preservar de manera visible la autoría original y los créditos correspondientes.
