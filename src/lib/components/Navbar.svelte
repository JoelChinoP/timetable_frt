<script lang="ts">
  import { useIsFetching } from '@tanstack/svelte-query';
  import { route } from '@mateothegreat/svelte5-router';

  const isFetching = useIsFetching();

  // Estado para menú móvil
  let isMenuOpen = $state(false);

  const navLinks = [
    { href: '/teachers', label: 'Docentes', icon: '👨‍🏫' },
    { href: '/classrooms', label: 'Aulas', icon: '🏫' },
    { href: '/courses', label: 'Cursos', icon: '📚' },
  ];

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<nav
  class="bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo y nombre -->
      <div class="flex items-center gap-3">
        <a
          href="/"
          use:route
          class="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity"
        >
          <span class="text-2xl">📅</span>
          <span class="hidden sm:inline">Timetable</span>
        </a>

        <!-- Loading indicator -->
        {#if isFetching.current > 0}
          <div class="flex items-center gap-2 ml-4">
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span class="text-white/70 text-sm hidden sm:inline"
              >Cargando...</span
            >
          </div>
        {/if}
      </div>

      <!-- Desktop navigation -->
      <div class="hidden md:flex items-center gap-1">
        {#each navLinks as navItem}
          <a
            href={navItem.href}
            use:route={{ active: { class: 'bg-white/20' } }}
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            <span>{navItem.icon}</span>
            <span>{navItem.label}</span>
          </a>
        {/each}
      </div>

      <!-- Mobile menu button -->
      <button
        onclick={toggleMenu}
        class="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {#if isMenuOpen}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile navigation -->
  {#if isMenuOpen}
    <div class="md:hidden border-t border-white/10">
      <div class="px-4 py-3 space-y-1">
        {#each navLinks as navItem}
          <a
            href={navItem.href}
            use:route={{ active: { class: 'bg-white/20' } }}
            onclick={closeMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            <span class="text-xl">{navItem.icon}</span>
            <span>{navItem.label}</span>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
