<script lang="ts">
  import {
    useClassrooms,
    useCreateClassroom,
    useUpdateClassroom,
    useDeleteClassroom,
  } from '$lib/queries';
  import type { Classroom, CreateClassroom } from '$lib/types';

  // Queries y mutations
  const classrooms = useClassrooms();
  const createClassroom = useCreateClassroom();
  const updateClassroom = useUpdateClassroom();
  const deleteClassroom = useDeleteClassroom();

  // Estado del modal
  let isModalOpen = $state(false);
  let editingClassroom = $state<Classroom | null>(null);

  // Form state
  let formData = $state<CreateClassroom>({ code: '', floor: 1, capacity: 30 });

  function openCreateModal() {
    formData = { code: '', floor: 1, capacity: 30 };
    editingClassroom = null;
    isModalOpen = true;
  }

  function openEditModal(classroom: Classroom) {
    formData = {
      code: classroom.code,
      floor: classroom.floor,
      capacity: classroom.capacity,
    };
    editingClassroom = classroom;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    editingClassroom = null;
    formData = { code: '', floor: 1, capacity: 30 };
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!formData.code.trim()) return;

    if (editingClassroom) {
      updateClassroom.mutate({ id: editingClassroom.id, data: formData });
    } else {
      createClassroom.mutate(formData);
    }
    closeModal();
  }

  function handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar esta aula?')) {
      deleteClassroom.mutate(id);
    }
  }
</script>

<div>
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Aulas</h1>
      <p class="text-gray-600 mt-1">Gestiona las aulas del sistema</p>
    </div>
    <button
      onclick={openCreateModal}
      class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
    >
      <span>+</span>
      <span>Nueva Aula</span>
    </button>
  </div>

  <!-- Content -->
  {#if classrooms.isPending}
    <div class="flex justify-center py-12">
      <div
        class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
    </div>
  {:else if classrooms.isError}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      Error al cargar las aulas: {classrooms.error?.message}
    </div>
  {:else if classrooms.data?.length === 0}
    <div class="text-center py-12 text-gray-500">
      <p class="text-4xl mb-2">🏫</p>
      <p>No hay aulas registradas</p>
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
              >Piso</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Capacidad</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Acciones</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each classrooms.data ?? [] as classroom (classroom.id)}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{classroom.id}</td
              >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{classroom.code}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >{classroom.floor}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >{classroom.capacity} personas</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  onclick={() => openEditModal(classroom)}
                  class="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                >
                  Editar
                </button>
                <button
                  onclick={() => handleDelete(classroom.id)}
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
          {editingClassroom ? 'Editar Aula' : 'Nueva Aula'}
        </h2>

        <form onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label
              for="code"
              class="block text-sm font-medium text-gray-700 mb-1">Código</label
            >
            <input
              type="text"
              id="code"
              bind:value={formData.code}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder="Ej: A-101"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="floor"
                class="block text-sm font-medium text-gray-700 mb-1">Piso</label
              >
              <input
                type="number"
                id="floor"
                bind:value={formData.floor}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                min="0"
                required
              />
            </div>

            <div>
              <label
                for="capacity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Capacidad</label
              >
              <input
                type="number"
                id="capacity"
                bind:value={formData.capacity}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                min="1"
                required
              />
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
              disabled={createClassroom.isPending || updateClassroom.isPending}
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingClassroom ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
