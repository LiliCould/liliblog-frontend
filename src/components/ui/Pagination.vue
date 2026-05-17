<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('change', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
    <button
      :disabled="currentPage === 1"
      class="p-2 rounded-lg border border-border text-text-body hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-none"
      @click="goToPage(currentPage - 1)"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      :class="[
        'px-3 py-2 rounded-lg text-sm font-medium transition-none',
        page === currentPage
          ? 'bg-primary text-primary-foreground'
          : 'border border-border text-text-body hover:bg-bg-surface',
      ]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      :disabled="currentPage === totalPages"
      class="p-2 rounded-lg border border-border text-text-body hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-none"
      @click="goToPage(currentPage + 1)"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>
