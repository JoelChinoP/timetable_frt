import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { teachersApi } from '../api';
import { queryKeys } from '../query';
import type { Teacher, CreateTeacher, UpdateTeacher } from '../types';

/**
 * Hook para crear un nuevo teacher
 * Incluye optimistic update
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateTeacher) => teachersApi.create(data),
    onMutate: async (newTeacher) => {
      // Cancelar queries en vuelo
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.all });

      // Snapshot del estado anterior
      const previousTeachers = queryClient.getQueryData<Teacher[]>(
        queryKeys.teachers.all
      );

      // Optimistic update con ID temporal
      if (previousTeachers) {
        const optimisticTeacher: Teacher = {
          ...newTeacher,
          id: Date.now(), // ID temporal
        };
        queryClient.setQueryData<Teacher[]>(queryKeys.teachers.all, [
          ...previousTeachers,
          optimisticTeacher,
        ]);
      }

      return { previousTeachers };
    },
    onError: (_err, _newTeacher, context) => {
      // Rollback en caso de error
      if (context?.previousTeachers) {
        queryClient.setQueryData(queryKeys.teachers.all, context.previousTeachers);
      }
    },
    onSettled: () => {
      // Invalidar para sincronizar con servidor
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
    },
  }));
}

/**
 * Hook para actualizar un teacher
 * Incluye optimistic update
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeacher }) =>
      teachersApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.detail(id) });

      const previousTeachers = queryClient.getQueryData<Teacher[]>(
        queryKeys.teachers.all
      );
      const previousTeacher = queryClient.getQueryData<Teacher>(
        queryKeys.teachers.detail(id)
      );

      // Optimistic update en lista
      if (previousTeachers) {
        queryClient.setQueryData<Teacher[]>(
          queryKeys.teachers.all,
          previousTeachers.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
      }

      // Optimistic update en detalle
      if (previousTeacher) {
        queryClient.setQueryData<Teacher>(queryKeys.teachers.detail(id), {
          ...previousTeacher,
          ...data,
        });
      }

      return { previousTeachers, previousTeacher };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTeachers) {
        queryClient.setQueryData(queryKeys.teachers.all, context.previousTeachers);
      }
      if (context?.previousTeacher) {
        queryClient.setQueryData(
          queryKeys.teachers.detail(id),
          context.previousTeacher
        );
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.detail(id) });
    },
  }));
}

/**
 * Hook para eliminar un teacher
 * Incluye optimistic update
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (id: number) => teachersApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.teachers.all });

      const previousTeachers = queryClient.getQueryData<Teacher[]>(
        queryKeys.teachers.all
      );

      if (previousTeachers) {
        queryClient.setQueryData<Teacher[]>(
          queryKeys.teachers.all,
          previousTeachers.filter((t) => t.id !== id)
        );
      }

      return { previousTeachers };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTeachers) {
        queryClient.setQueryData(queryKeys.teachers.all, context.previousTeachers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
    },
  }));
}
