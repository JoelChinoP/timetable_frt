import { QueryClient } from '@tanstack/svelte-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Datos considerados frescos por 2 minutos
      staleTime: 1000 * 60 * 2,
      // Cache mantenido por 10 minutos
      gcTime: 1000 * 60 * 10,
      // No refetch automático en focus (evita re-fetches innecesarios)
      refetchOnWindowFocus: false,
      // Reintentos limitados
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      // Reintentos para mutaciones
      retry: 0,
    },
  },
});
