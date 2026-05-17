<script setup lang="ts">
import { FileX } from 'lucide-vue-next'

/**
 * 空状态组件
 * 机械图标 + 大字提示
 */
interface Props {
  /** 提示文字 */
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: '暂无数据',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16">
    <FileX class="h-16 w-16 text-[var(--neutral-800)] dark:text-[var(--text-secondary)]" />
    <p class="mt-4 text-lg font-bold">
      {{ message }}
    </p>
  </div>
</template>
