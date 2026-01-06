import { http } from './http';
import type { Course, CreateCourse, UpdateCourse } from '../types';

const RESOURCE = '/courses';

export const coursesApi = {
  getAll: () => http.get<Course[]>(RESOURCE),

  getById: (id: number) => http.get<Course>(`${RESOURCE}/${id}`),

  create: (data: CreateCourse) => http.post<Course>(RESOURCE, data),

  update: (id: number, data: UpdateCourse) =>
    http.put<Course>(`${RESOURCE}/${id}`, data),

  delete: (id: number) => http.delete<void>(`${RESOURCE}/${id}`),
};
