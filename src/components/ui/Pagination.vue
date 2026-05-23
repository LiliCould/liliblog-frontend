<template>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <span class="text-xs text-t-muted">每页</span>
      <select :value="pageSize"
        class="px-2 py-1 rounded bg-t-bg border border-t-border text-t-body text-xs outline-none transition-colors duration-200 focus:border-t-primary cursor-pointer"
        @change="onPageSizeChange">
        <option v-for="s in pageSizeOptions" :key="s" :value="s">{{ s }} 条</option>
      </select>
    </div>
    <div class="flex items-center gap-1">
      <button
        class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="current <= 1" @click="emit('update:current', current - 1)">
        <ChevronLeft class="w-4 h-4" />
      </button>

      <template v-for="page in displayedPages" :key="page">
        <span v-if="page === '...'" class="w-8 h-8 flex items-center justify-center text-t-muted text-xs">...</span>
        <button v-else class="w-8 h-8 rounded text-xs font-medium transition-all duration-200"
          :class="page === current
            ? 'bg-[rgba(var(--color-primary-rgb),0.12)] border border-t-primary text-t-primary'
            : 'border border-transparent text-t-muted hover:text-t-primary hover:border-t-primary'" @click="emit('update:current', page as number)">
          {{ page }}
        </button>
      </template>

      <button
        class="flex items-center justify-center w-8 h-8 rounded border border-t-border text-t-muted transition-all duration-200 hover:text-t-primary hover:border-t-primary disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="current >= totalPages" @click="emit('update:current', current + 1)">
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <span class="text-xs text-t-muted">共 {{ total }} 条</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const pageSizeOptions = [5, 10, 15, 20, 50]

const props = defineProps<{
  current: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:current', page: number): void
  (e: 'update:pageSize', size: number): void
}>()

function onPageSizeChange(e: Event) {
  const val = Number((e.target as HTMLSelectElement).value)
  emit('update:pageSize', val)
}

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
