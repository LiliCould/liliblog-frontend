<template>
  <div class="flex items-center gap-2">
    <button
      class="flex items-center justify-center w-9 h-9 rounded-lg border border-t-border text-t-muted transition-all duration-300 hover:text-t-primary hover:border-t-primary hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-t-muted disabled:hover:border-t-border disabled:hover:shadow-none"
      :disabled="current <= 1" @click="emit('update:current', current - 1)">
      <ChevronLeft class="w-4 h-4" />
    </button>

    <template v-for="page in displayedPages" :key="page">
      <span v-if="page === '...'" class="w-9 h-9 flex items-center justify-center text-t-muted text-sm">...</span>
      <button v-else class="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-300"
        :class="page === current
          ? 'bg-[rgba(var(--color-primary-rgb),0.15)] border border-t-primary text-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.15)]'
          : 'border border-t-border text-t-muted hover:text-t-primary hover:border-t-primary hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]'" @click="emit('update:current', page as number)">
        {{ page }}
      </button>
    </template>

    <button
      class="flex items-center justify-center w-9 h-9 rounded-lg border border-t-border text-t-muted transition-all duration-300 hover:text-t-primary hover:border-t-primary hover:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-t-muted disabled:hover:border-t-border disabled:hover:shadow-none"
      :disabled="current >= totalPages" @click="emit('update:current', current + 1)">
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  current: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:current', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.current

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 3) {
      pages.push('...')
    }
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (current < total - 2) {
      pages.push('...')
    }
    pages.push(total)
  }

  return pages
})
</script>
