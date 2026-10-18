<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      class="fixed right-4 md:right-8 z-[var(--z-bottom-nav)] w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(var(--color-primary-rgb),0.25)] bg-[rgba(var(--color-surface-rgb),0.92)] text-t-primary shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-200 hover:bg-[rgba(var(--color-primary-rgb),0.12)] hover:border-t-primary active:scale-95 cursor-pointer bottom-[calc(var(--mobile-bottom-nav-height,56px)+var(--safe-bottom,0px)+4.5rem)] md:bottom-8"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { ArrowUp } from 'lucide-vue-next'

const { y } = useWindowScroll()
const visible = computed(() => y.value > 400)

function scrollToTop(): void {
  if (!import.meta.client) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<style scoped>
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
@media (prefers-reduced-motion: reduce) {
  .back-to-top-enter-active,
  .back-to-top-leave-active {
    transition: none;
  }
}
</style>
