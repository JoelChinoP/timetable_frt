# Timetable Frontend

Sistema de gestión de horarios construido con **Svelte 5 (runes)**, **Tailwind CSS v4**, y **@tanstack/svelte-query v6**.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Previsualizar build
pnpm preview
```

## 📁 Estructura del Proyecto

```
src/
├── lib/
│   ├── api/                    # Servicios de API
│   │   ├── http.ts             # 🔑 Wrapper principal de fetch
│   │   ├── teachers.api.ts     # API de docentes
│   │   ├── classrooms.api.ts   # API de aulas
│   │   ├── courses.api.ts      # API de cursos
│   │   └── index.ts            # Re-exports
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.svelte       # 🧭 Navegación principal
│   │   └── index.ts
│   │
│   ├── queries/                # Hooks de TanStack Query
│   │   ├── useTeachers.ts      # Query de docentes
│   │   ├── useTeachersMutations.ts  # Mutations con optimistic updates
│   │   ├── useClassrooms.ts
│   │   ├── useClassroomsMutations.ts
│   │   ├── useCourses.ts
│   │   ├── useCoursesMutations.ts
│   │   └── index.ts
│   │
│   ├── query/                  # Configuración de Query Client
│   │   ├── client.ts           # 🔧 QueryClient configurado
│   │   ├── keys.ts             # Factory de query keys
│   │   └── index.ts
│   │
│   └── types/                  # Tipos TypeScript
│       └── index.ts            # 📦 DTOs y tipos de API
│
├── routes/                     # Páginas de la aplicación
│   ├── +layout.svelte          # 🎯 Layout con QueryClientProvider
│   ├── +page.svelte            # Página de inicio
│   ├── teachers/+page.svelte   # CRUD de docentes
│   ├── classrooms/+page.svelte # CRUD de aulas
│   └── courses/+page.svelte    # CRUD de cursos
│
├── app.css                     # Estilos globales + Tailwind
└── main.ts                     # Entry point
```

## 🔑 Puntos Clave

### 1. API Wrapper (`src/lib/api/http.ts`)

```typescript
// Valida automáticamente la respuesta { success, message, data }
// Lanza ApiError con message y status en caso de error
const teachers = await http.get<Teacher[]>('/teachers');
```

**Características:**
- ✅ Valida forma de respuesta `{ success, message, data }`
- ✅ Manejo de errores centralizado con `ApiError`
- ✅ Timeout configurable (default: 10s)
- ✅ Base URL por variable de entorno `VITE_API_URL`

### 2. Query Client (`src/lib/query/client.ts`)

```typescript
// Configuración optimizada:
// - staleTime: 2 minutos (evita re-fetches innecesarios)
// - gcTime: 10 minutos (cache en memoria)
// - refetchOnWindowFocus: false
// - retry: 1 intento
```

### 3. Query Keys (`src/lib/query/keys.ts`)

```typescript
// Factory centralizado para consistencia
queryKeys.teachers.all     // ['teachers']
queryKeys.teachers.detail(1) // ['teachers', 1]
```

### 4. Hooks de Queries (`src/lib/queries/`)

```typescript
// Sintaxis thunk para reactividad
const teachers = useTeachers();
const teacher = useTeacher(() => selectedId);

// En template:
{#if $teachers.isPending}
  <Spinner />
{:else if $teachers.data}
  {#each $teachers.data as teacher}
    ...
  {/each}
{/if}
```

### 5. Mutations con Optimistic Updates

```typescript
const createTeacher = useCreateTeacher();

// Automáticamente:
// 1. Cancela queries en vuelo
// 2. Guarda snapshot del estado
// 3. Aplica update optimista
// 4. Hace rollback si hay error
// 5. Invalida queries al terminar
```

### 6. Navbar (`src/lib/components/Navbar.svelte`)

- 🎨 Diseño responsive con Tailwind
- ⏳ Spinner de loading global con `useIsFetching`
- 📱 Menú móvil colapsable
- 🎯 Estado manejado con runes (`$state`)

## ⚙️ Configuración

### Variables de Entorno

Crear `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Formato de Respuesta del Backend

Todas las respuestas deben seguir:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

En caso de error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

## 📦 Recursos CRUD

| Recurso    | Endpoint      | Campos                                          |
|------------|---------------|-------------------------------------------------|
| Teachers   | `/teachers`   | `id`, `name`, `lastname`                        |
| Classrooms | `/classrooms` | `id`, `code`, `floor`, `capacity`               |
| Courses    | `/courses`    | `id`, `code`, `name`, `abreviation`, `color`, `id_teacher` |

## 🆕 Agregar un Nuevo Recurso

1. **Crear tipo** en `src/lib/types/index.ts`
2. **Crear API** en `src/lib/api/[resource].api.ts`
3. **Agregar query keys** en `src/lib/query/keys.ts`
4. **Crear hooks** en `src/lib/queries/use[Resource].ts`
5. **Crear página** en `src/routes/[resource]/+page.svelte`

## 🎯 Buenas Prácticas Implementadas

- ✅ **Svelte 5 Runes**: `$state`, `$props` en lugar de stores legacy
- ✅ **TypeScript estricto**: Tipos definidos para todo
- ✅ **Optimistic updates**: UX instantánea en mutaciones
- ✅ **Stale-while-revalidate**: Cache inteligente
- ✅ **Query keys factory**: Consistencia y fácil invalidación
- ✅ **Centralización de errores**: `ApiError` class
- ✅ **Componentes puros**: Mínima lógica en templates
- ✅ **Responsive design**: Mobile-first con Tailwind

## 📜 Scripts Disponibles

| Comando          | Descripción                    |
|------------------|--------------------------------|
| `pnpm dev`       | Servidor de desarrollo         |
| `pnpm build`     | Build para producción          |
| `pnpm preview`   | Previsualizar build            |
| `pnpm check`     | Type-checking con svelte-check |

## 🛠️ Stack Técnico

- **Svelte 5** con Runes
- **Tailwind CSS v4**
- **@tanstack/svelte-query v6**
- **TypeScript**
- **Vite**
