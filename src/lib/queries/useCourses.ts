import { createQuery } from '@tanstack/svelte-query';
import { coursesApi } from '../api';
import { queryKeys } from '../query';
import type { Course } from '../types';

/**
 * Hook para obtener todos los courses
 */
export function useCourses() {
  return createQuery<Course[]>(() => ({
    queryKey: queryKeys.courses.all,
    queryFn: () => coursesApi.getAll(),
  }));
}

/**
 * Hook para obtener un course por ID
 */
export function useCourse(getId: () => number | undefined) {
  return createQuery<Course>(() => {
    const id = getId();
    return {
      queryKey: queryKeys.courses.detail(id!),
      queryFn: () => coursesApi.getById(id!),
      enabled: !!id,
    };
  });
}
