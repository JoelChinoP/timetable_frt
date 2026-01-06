<script lang="ts">
  import {
    useTeachers,
    useCreateTeacher,
    useUpdateTeacher,
    useDeleteTeacher,
  } from '$lib/queries';
  import type { Teacher, CreateTeacher } from '$lib/types';

  // Queries y mutations
  const teachers = useTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  // Estado del modal
  let isModalOpen = $state(false);
  let editingTeacher = $state<Teacher | null>(null);

  // Form state
  let formData = $state<CreateTeacher>({ name: '', lastname: '' });

  function openCreateModal() {
    formData = { name: '', lastname: '' };
    editingTeacher = null;
    isModalOpen = true;
  }

  function openEditModal(teacher: Teacher) {
    formData = { name: teacher.name, lastname: teacher.lastname };
    editingTeacher = teacher;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    editingTeacher = null;
    formData = { name: '', lastname: '' };
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.lastname.trim()) return;

    if (editingTeacher) {
      updateTeacher.mutate({ id: editingTeacher.id, data: formData });
    } else {
      createTeacher.mutate(formData);
    }
    closeModal();
  }

  function handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este docente?')) {
      deleteTeacher.mutate(id);
    }
  }
</script>

<div>
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Docentes</h1>
      <p class="text-gray-600 mt-1">Gestiona los docentes del sistema</p>
    </div>
    <button
      onclick={openCreateModal}
      class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
    >
      <span>+</span>
      <span>Nuevo Docente</span>
    </button>
  </div>

  <!-- Content -->
  {#if teachers.isPending}
    <div class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
    </div>
  {:else if teachers.isError}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      Error al cargar los docentes: {teachers.error?.message}
    </div>
  {:else if teachers.data?.length === 0}
    <div class="text-center py-12 text-gray-500">
      <p class="text-4xl mb-2">👨‍🏫</p>
      <p>No hay docentes registrados</p>
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
              >Nombre</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Apellido</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Acciones</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each teachers.data ?? [] as teacher (teacher.id)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{teacher.id}</td
              >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{teacher.name}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >{teacher.lastname}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onclick={() => openEditModal(teacher)}
                  class="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                >
                  Editar
                </button>
                <button
                  onclick={() => handleDelete(teacher.id)}
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
          {editingTeacher ? 'Editar Docente' : 'Nuevo Docente'}
        </h2>

        <form onsubmit={handleSubmit} class="space-y-4">
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
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          <div>
            <label
              for="lastname"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Apellido</label
            >
            <input
              type="text"
              id="lastname"
              bind:value={formData.lastname}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder="Ingresa el apellido"
              required
            />
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
              disabled={createTeacher.isPending || updateTeacher.isPending}
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingTeacher ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
