import { createQuery } from '@tanstack/svelte-query';
import { teachersApi } from '../api';
import { queryKeys } from '../query';
import type { Teacher } from '../types';

/**
 * Hook para obtener todos los teachers
 */
export function useTeachers() {
  return createQuery<Teacher[]>(() => ({
    queryKey: queryKeys.teachers.all,
    queryFn: () => teachersApi.getAll(),
  }));
}

/**
 * Hook para obtener un teacher por ID
 */
export function useTeacher(getId: () => number | undefined) {
  return createQuery<Teacher>(() => {
    const id = getId();
    return {
      queryKey: queryKeys.teachers.detail(id!),
      queryFn: () => teachersApi.getById(id!),
      enabled: !!id,
    };
  });
}
