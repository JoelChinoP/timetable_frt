import { http } from './http';
import type { Classroom, CreateClassroom, UpdateClassroom } from '../types';

const RESOURCE = '/classrooms';

export const classroomsApi = {
  getAll: () => http.get<Classroom[]>(RESOURCE),

  getById: (id: number) => http.get<Classroom>(`${RESOURCE}/${id}`),

  create: (data: CreateClassroom) => http.post<Classroom>(RESOURCE, data),

  update: (id: number, data: UpdateClassroom) =>
    http.put<Classroom>(`${RESOURCE}/${id}`, data),

  delete: (id: number) => http.delete<void>(`${RESOURCE}/${id}`),
};
