<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import {
    Router,
    type RouteConfig,
    StatusCode,
  } from '@mateothegreat/svelte5-router';
  import { queryClient } from '$lib/query';
  import { Navbar } from '$lib/components';

  // Importar páginas
  import Home from './routes/+page.svelte';
  import Teachers from './routes/teachers/+page.svelte';
  import Classrooms from './routes/classrooms/+page.svelte';
  import Courses from './routes/courses/+page.svelte';
  import NotFound from '$lib/components/NotFound.svelte';

  // Definir rutas
  const routes: RouteConfig[] = [
    { path: '', component: Home },
    { path: 'teachers', component: Teachers },
    { path: 'classrooms', component: Classrooms },
    { path: 'courses', component: Courses },
  ];
</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Router
        {routes}
        statuses={{ [StatusCode.NotFound]: () => ({ component: NotFound }) }}
      />
    </main>
  </div>
</QueryClientProvider>
