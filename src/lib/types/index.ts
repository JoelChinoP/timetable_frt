// ============================================
// Domain Types / DTOs
// ============================================

export type Teacher = {
  id: number;
  name: string;
  lastname: string;
};

export type Classroom = {
  id: number;
  code: string;
  floor: number;
  capacity: number;
};

export type Course = {
  id: number;
  code: string;
  name: string;
  abreviation: string;
  color?: string;
  id_teacher: number;
};

// ============================================
// API Response Types
// ============================================

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ============================================
// Create/Update DTOs (sin id para creates)
// ============================================

export type CreateTeacher = Omit<Teacher, 'id'>;
export type UpdateTeacher = Partial<CreateTeacher>;

export type CreateClassroom = Omit<Classroom, 'id'>;
export type UpdateClassroom = Partial<CreateClassroom>;

export type CreateCourse = Omit<Course, 'id'>;
export type UpdateCourse = Partial<CreateCourse>;
