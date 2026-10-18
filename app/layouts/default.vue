<template>
  <div class="app-wrapper relative z-[var(--z-content)] min-h-screen text-t-body flex flex-col">
    <AppHeader />

    <main class="main-content pt-16 min-h-screen pb-[calc(var(--mobile-bottom-nav-height)+var(--safe-bottom))] md:pb-0 flex-1">
      <slot />
    </main>

    <AppFooter />

    <ClientOnly>
      <MobileNav />
    </ClientOnly>
    <MobileBottomNav />
    <BackToTop />
  </div>
</template>
