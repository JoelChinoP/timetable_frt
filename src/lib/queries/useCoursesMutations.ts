import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { coursesApi } from '../api';
import { queryKeys } from '../query';
import type { Course, CreateCourse, UpdateCourse } from '../types';

/**
 * Hook para crear un nuevo course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (data: CreateCourse) => coursesApi.create(data),
    onMutate: async (newCourse) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.all });

      const previousCourses = queryClient.getQueryData<Course[]>(
        queryKeys.courses.all
      );

      if (previousCourses) {
        const optimisticCourse: Course = {
          ...newCourse,
          id: Date.now(),
        };
        queryClient.setQueryData<Course[]>(queryKeys.courses.all, [
          ...previousCourses,
          optimisticCourse,
        ]);
      }

      return { previousCourses };
    },
    onError: (_err, _newCourse, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(queryKeys.courses.all, context.previousCourses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  }));
}

/**
 * Hook para actualizar un course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourse }) =>
      coursesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.detail(id) });

      const previousCourses = queryClient.getQueryData<Course[]>(
        queryKeys.courses.all
      );
      const previousCourse = queryClient.getQueryData<Course>(
        queryKeys.courses.detail(id)
      );

      if (previousCourses) {
        queryClient.setQueryData<Course[]>(
          queryKeys.courses.all,
          previousCourses.map((c) => (c.id === id ? { ...c, ...data } : c))
        );
      }

      if (previousCourse) {
        queryClient.setQueryData<Course>(queryKeys.courses.detail(id), {
          ...previousCourse,
          ...data,
        });
      }

      return { previousCourses, previousCourse };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(queryKeys.courses.all, context.previousCourses);
      }
      if (context?.previousCourse) {
        queryClient.setQueryData(
          queryKeys.courses.detail(id),
          context.previousCourse
        );
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
    },
  }));
}

/**
 * Hook para eliminar un course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: (id: number) => coursesApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.all });

      const previousCourses = queryClient.getQueryData<Course[]>(
        queryKeys.courses.all
      );

      if (previousCourses) {
        queryClient.setQueryData<Course[]>(
          queryKeys.courses.all,
          previousCourses.filter((c) => c.id !== id)
        );
      }

      return { previousCourses };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(queryKeys.courses.all, context.previousCourses);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  }));
}
