import { http } from './http';
import type { Teacher, CreateTeacher, UpdateTeacher } from '../types';

const RESOURCE = '/teachers';

export const teachersApi = {
  getAll: () => http.get<Teacher[]>(RESOURCE),

  getById: (id: number) => http.get<Teacher>(`${RESOURCE}/${id}`),

  create: (data: CreateTeacher) => http.post<Teacher>(RESOURCE, data),

  update: (id: number, data: UpdateTeacher) =>
    http.put<Teacher>(`${RESOURCE}/${id}`, data),

  delete: (id: number) => http.delete<void>(`${RESOURCE}/${id}`),
};
