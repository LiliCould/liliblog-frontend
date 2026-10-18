<template>
  <div class="app-wrapper min-h-screen bg-t-bg text-t-body flex flex-col">
    <AppHeader />

    <main class="main-content pt-16 min-h-screen bg-t-bg pb-14 md:pb-0 flex-1">
      <slot />
    </main>

    <AppFooter />

    <ClientOnly>
      <MobileNav />
    </ClientOnly>
    <MobileBottomNav />
    <BackToTop />

    <ClientOnly>
      <Toaster
        position="top-center"
        :duration="2200"
        :close-button="false"
        :rich-colors="true"
        class="liliblog-toaster"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
