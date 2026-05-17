<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * 分页器组件
 * 方形按钮 + 硬边框风格
 */
interface Props {
  /** 当前页码 */
  current: number
  /** 总页数 */
  totalPage: number
  /** 是否有上一页 */
  hasPrevious: boolean
  /** 是否有下一页 */
  hasNext: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  /** 页码变更事件 */
  change: [page: number]
}>()

// 显示的页码列表
const pageList = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPage
  const current = props.current

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPage && page !== props.current) {
    emit('change', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <!-- 上一页 -->
    <button
      class="flex h-8 w-8 items-center justify-center border-2 border-black disabled:opacity-30 dark:border-[var(--neutral-800)]"
      :disabled="!hasPrevious"
      @click="handlePageChange(current - 1)"
    >
      <ChevronLeft class="h-4 w-4" />
    </button>

    <!-- 页码 -->
    <template
      v-for="(page, index) in pageList"
      :key="index"
    >
      <button
        v-if="typeof page === 'number'"
        class="flex h-8 w-8 items-center justify-center border-2 text-sm font-bold"
        :class="{
          'border-black bg-[var(--accent-toxic)] text-black dark:border-white': page === current,
          'border-black dark:border-[var(--neutral-800)]': page !== current,
        }"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <span
        v-else
        class="flex h-8 w-8 items-center justify-center text-sm"
      >
        {{ page }}
      </span>
    </template>

    <!-- 下一页 -->
    <button
      class="flex h-8 w-8 items-center justify-center border-2 border-black disabled:opacity-30 dark:border-[var(--neutral-800)]"
      :disabled="!hasNext"
      @click="handlePageChange(current + 1)"
    >
      <ChevronRight class="h-4 w-4" />
    </button>
  </div>
</template>
