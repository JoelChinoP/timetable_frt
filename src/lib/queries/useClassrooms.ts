import { createQuery } from '@tanstack/svelte-query';
import { classroomsApi } from '../api';
import { queryKeys } from '../query';
import type { Classroom } from '../types';

/**
 * Hook para obtener todos los classrooms
 */
export function useClassrooms() {
  return createQuery<Classroom[]>(() => ({
    queryKey: queryKeys.classrooms.all,
    queryFn: () => classroomsApi.getAll(),
  }));
}

/**
 * Hook para obtener un classroom por ID
 */
export function useClassroom(getId: () => number | undefined) {
  return createQuery<Classroom>(() => {
    const id = getId();
    return {
      queryKey: queryKeys.classrooms.detail(id!),
      queryFn: () => classroomsApi.getById(id!),
      enabled: !!id,
    };
  });
}
