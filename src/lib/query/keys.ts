// Query keys factory - centralizado para consistencia
export const queryKeys = {
  // Teachers
  teachers: {
    all: ['teachers'] as const,
    detail: (id: number) => ['teachers', id] as const,
  },
  // Classrooms
  classrooms: {
    all: ['classrooms'] as const,
    detail: (id: number) => ['classrooms', id] as const,
  },
  // Courses
  courses: {
    all: ['courses'] as const,
    detail: (id: number) => ['courses', id] as const,
  },
} as const;
