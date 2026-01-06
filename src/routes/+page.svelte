<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router';
</script>

<div class="text-center py-12">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">📅 Timetable</h1>
  <p class="text-xl text-gray-600 mb-8">Sistema de gestión de horarios</p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
    <a
      href="/teachers"
      use:route
      class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div class="text-4xl mb-3">👨‍🏫</div>
      <h2 class="text-lg font-semibold text-gray-900">Docentes</h2>
      <p class="text-gray-500 text-sm mt-1">Gestiona los docentes</p>
    </a>

    <a
      href="/classrooms"
      use:route
      class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div class="text-4xl mb-3">🏫</div>
      <h2 class="text-lg font-semibold text-gray-900">Aulas</h2>
      <p class="text-gray-500 text-sm mt-1">Gestiona las aulas</p>
    </a>

    <a
      href="/courses"
      use:route
      class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div class="text-4xl mb-3">📚</div>
      <h2 class="text-lg font-semibold text-gray-900">Cursos</h2>
      <p class="text-gray-500 text-sm mt-1">Gestiona los cursos</p>
    </a>
  </div>
</div>
