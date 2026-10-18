<template>
  <div class="flex items-center justify-between gap-4 max-md:flex-col max-md:gap-3">
    <div class="flex items-center gap-2 max-md:w-full max-md:justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xs text-t-muted">每页</span>
        <CustomSelect
          :model-value="pageSize"
          :options="pageSizeSelectOptions"
          button-class="px-3 py-1.5 rounded-full text-xs min-w-[76px]"
          @update:model-value="onPageSizeChange"
        />
      </div>
      <span class="text-xs text-t-muted md:hidden">共 {{ total }} 条</span>
    </div>

    <div class="flex items-center gap-1.5">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-t-muted transition-all duration-200 hover:border-t-primary hover:text-t-primary disabled:cursor-not-allowed disabled:opacity-30 max-md:h-11 max-md:w-11"
        :disabled="current <= 1"
        aria-label="上一页"
        @click="emit('update:current', current - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <div class="hidden items-center gap-1.5 md:flex">
        <template v-for="page in displayedPages" :key="page">
          <span v-if="page === '...'" class="flex h-10 w-10 items-center justify-center text-xs text-t-muted">...</span>
          <button
            v-else
            class="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-xs font-medium transition-all duration-200"
            :class="page === current
              ? 'border border-t-primary bg-[rgba(var(--color-primary-rgb),0.14)] text-t-primary font-semibold'
              : 'border border-transparent text-t-muted hover:border-t-primary hover:text-t-primary'"
            :aria-current="page === current ? 'page' : undefined"
            @click="emit('update:current', page as number)"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <span class="min-w-[64px] text-center text-xs font-medium text-t-body md:hidden">
        {{ current }} / {{ totalPages }}
      </span>

      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-t-muted transition-all duration-200 hover:border-t-primary hover:text-t-primary disabled:cursor-not-allowed disabled:opacity-30 max-md:h-11 max-md:w-11"
        :disabled="current >= totalPages"
        aria-label="下一页"
        @click="emit('update:current', current + 1)"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <div class="flex items-center gap-2 max-md:hidden">
      <span class="text-xs text-t-muted">共 {{ total }} 条</span>
      <div v-if="totalPages > 1" class="ml-2 flex items-center gap-1.5">
        <span class="text-xs text-t-muted">跳至</span>
        <input
          v-model="jumpInput"
          type="number"
          :min="1"
          :max="totalPages"
          class="h-8 w-14 rounded-full border border-[var(--glass-border)] bg-[rgba(var(--color-surface-rgb),0.55)] text-center text-xs text-t-body outline-none transition-colors duration-200 focus:border-t-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          @keyup.enter="handleJump"
        />
        <span class="text-xs text-t-muted">页</span>
        <button
          class="h-8 rounded-full border border-[var(--glass-border)] px-3 text-xs text-t-muted transition-colors duration-200 hover:border-t-primary hover:text-t-primary"
          @click="handleJump"
        >
          跳转
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const pageSizeOptions = [5, 10, 15, 20, 50]
const pageSizeSelectOptions = pageSizeOptions.map(size => ({ label: `${size} 条`, value: size }))

const props = defineProps<{
  current: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:current': [page: number]
  'update:pageSize': [size: number]
}>()

const jumpInput = ref('')

function onPageSizeChange(value: string | number): void {
  emit('update:pageSize', Number(value))
}

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.current

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 4) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 3) pages.push('...')
  pages.push(total)
  return pages
})

function handleJump(): void {
  const page = Number.parseInt(jumpInput.value, 10)
  if (!Number.isNaN(page) && page >= 1 && page <= totalPages.value) {
    emit('update:current', page)
    jumpInput.value = ''
  }
}
</script>
