<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router';
</script>

<div class="text-center py-16">
  <p class="text-6xl mb-4">🔍</p>
  <h1 class="text-3xl font-bold text-gray-900 mb-2">404</h1>
  <p class="text-gray-600 mb-6">Página no encontrada</p>
  <a
    href="/"
    use:route
    class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
  >
    ← Volver al inicio
  </a>
</div>
