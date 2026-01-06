<script lang="ts">
  import {
    useCourses,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
    useTeachers,
  } from '$lib/queries';
  import type { Course, CreateCourse, Teacher } from '$lib/types';

  // Queries y mutations
  const courses = useCourses();
  const teachers = useTeachers();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  // Estado del modal
  let isModalOpen = $state(false);
  let editingCourse = $state<Course | null>(null);

  // Form state
  let formData = $state<CreateCourse>({
    code: '',
    name: '',
    abreviation: '',
    color: '#6366f1',
    id_teacher: 0,
  });

  function openCreateModal() {
    formData = {
      code: '',
      name: '',
      abreviation: '',
      color: '#6366f1',
      id_teacher: 0,
    };
    editingCourse = null;
    isModalOpen = true;
  }

  function openEditModal(course: Course) {
    formData = {
      code: course.code,
      name: course.name,
      abreviation: course.abreviation,
      color: course.color || '#6366f1',
      id_teacher: course.id_teacher,
    };
    editingCourse = course;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    editingCourse = null;
    formData = {
      code: '',
      name: '',
      abreviation: '',
      color: '#6366f1',
      id_teacher: 0,
    };
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) return;

    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data: formData });
    } else {
      createCourse.mutate(formData);
    }
    closeModal();
  }

  function handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      deleteCourse.mutate(id);
    }
  }

  // Helper para obtener nombre del profesor
  function getTeacherName(teacherId: number): string {
    const teacher = teachers.data?.find((t: Teacher) => t.id === teacherId);
    return teacher ? `${teacher.name} ${teacher.lastname}` : 'Sin asignar';
  }
</script>

<div>
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Cursos</h1>
      <p class="text-gray-600 mt-1">Gestiona los cursos del sistema</p>
    </div>
    <button
      onclick={openCreateModal}
      class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
    >
      <span>+</span>
      <span>Nuevo Curso</span>
    </button>
  </div>

  <!-- Content -->
  {#if courses.isPending}
    <div class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
    </div>
  {:else if courses.isError}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      Error al cargar los cursos: {courses.error?.message}
    </div>
  {:else if courses.data?.length === 0}
    <div class="text-center py-12 text-gray-500">
      <p class="text-4xl mb-2">📚</p>
      <p>No hay cursos registrados</p>
    </div>
  {:else}
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >ID</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Código</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Nombre</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Abrev.</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Docente</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Acciones</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each courses.data ?? [] as course (course.id)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{course.id}</td
              >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style="background-color: {course.color || '#6366f1'}"
                >
                  {course.code}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{course.name}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{course.abreviation}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >{getTeacherName(course.id_teacher)}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onclick={() => openEditModal(course)}
                  class="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                >
                  Editar
                </button>
                <button
                  onclick={() => handleDelete(course.id)}
                  class="text-red-600 hover:text-red-900 font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<!-- Modal -->
{#if isModalOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity"
        onclick={closeModal}
        role="button"
        tabindex="-1"
        onkeydown={(e) => e.key === 'Escape' && closeModal()}
      ></div>

      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
        </h2>

        <form onsubmit={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="code"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Código</label
              >
              <input
                type="text"
                id="code"
                bind:value={formData.code}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                placeholder="Ej: MAT101"
                required
              />
            </div>

            <div>
              <label
                for="abreviation"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Abreviación</label
              >
              <input
                type="text"
                id="abreviation"
                bind:value={formData.abreviation}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                placeholder="Ej: MAT"
                required
              />
            </div>
          </div>

          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1">Nombre</label
            >
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder="Nombre del curso"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="color"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Color</label
              >
              <input
                type="color"
                id="color"
                bind:value={formData.color}
                class="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label
                for="teacher"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Docente</label
              >
              <select
                id="teacher"
                bind:value={formData.id_teacher}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              >
                <option value={0}>Sin asignar</option>
                {#each teachers.data ?? [] as teacher}
                  <option value={teacher.id}
                    >{teacher.name} {teacher.lastname}</option
                  >
                {/each}
              </select>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              onclick={closeModal}
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createCourse.isPending || updateCourse.isPending}
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingCourse ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
