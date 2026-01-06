import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { classroomsApi } from '../api';
import { queryKeys } from '../query';
import type { Classroom, CreateClassroom, UpdateClassroom } from '../types';

/**
 * Hook para crear un nuevo classroom
 */
export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateClassroom) => classroomsApi.create(data),
    onMutate: async (newClassroom) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classrooms.all });

      const previousClassrooms = queryClient.getQueryData<Classroom[]>(
        queryKeys.classrooms.all
      );

      if (previousClassrooms) {
        const optimisticClassroom: Classroom = {
          ...newClassroom,
          id: Date.now(),
        };
        queryClient.setQueryData<Classroom[]>(queryKeys.classrooms.all, [
          ...previousClassrooms,
          optimisticClassroom,
        ]);
      }

      return { previousClassrooms };
    },
    onError: (_err, _newClassroom, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(
          queryKeys.classrooms.all,
          context.previousClassrooms
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
    },
  }));
}

/**
 * Hook para actualizar un classroom
 */
export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: ({ id, data }: { id: number; data: UpdateClassroom }) =>
      classroomsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classrooms.all });
      await queryClient.cancelQueries({
        queryKey: queryKeys.classrooms.detail(id),
      });

      const previousClassrooms = queryClient.getQueryData<Classroom[]>(
        queryKeys.classrooms.all
      );
      const previousClassroom = queryClient.getQueryData<Classroom>(
        queryKeys.classrooms.detail(id)
      );

      if (previousClassrooms) {
        queryClient.setQueryData<Classroom[]>(
          queryKeys.classrooms.all,
          previousClassrooms.map((c) => (c.id === id ? { ...c, ...data } : c))
        );
      }

      if (previousClassroom) {
        queryClient.setQueryData<Classroom>(queryKeys.classrooms.detail(id), {
          ...previousClassroom,
          ...data,
        });
      }

      return { previousClassrooms, previousClassroom };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(
          queryKeys.classrooms.all,
          context.previousClassrooms
        );
      }
      if (context?.previousClassroom) {
        queryClient.setQueryData(
          queryKeys.classrooms.detail(id),
          context.previousClassroom
        );
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.detail(id),
      });
    },
  }));
}

/**
 * Hook para eliminar un classroom
 */
export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (id: number) => classroomsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.classrooms.all });

      const previousClassrooms = queryClient.getQueryData<Classroom[]>(
        queryKeys.classrooms.all
      );

      if (previousClassrooms) {
        queryClient.setQueryData<Classroom[]>(
          queryKeys.classrooms.all,
          previousClassrooms.filter((c) => c.id !== id)
        );
      }

      return { previousClassrooms };
    },
    onError: (_err, _id, context) => {
      if (context?.previousClassrooms) {
        queryClient.setQueryData(
          queryKeys.classrooms.all,
          context.previousClassrooms
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
    },
  }));
}
