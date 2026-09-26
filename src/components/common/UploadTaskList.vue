<template>
  <div
    v-if="tasks.length"
    class="upload-tasks flex flex-col gap-2 px-3 py-2 border-b border-[rgba(var(--color-primary-rgb),0.1)]"
    style="background: rgba(var(--color-surface-rgb), 0.95)"
  >
    <div v-for="task in tasks" :key="task.id" class="flex items-center gap-2.5 min-w-0">
      <div
        class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full"
        :class="task.status === 'error'
          ? 'bg-[rgba(244,63,94,0.12)] text-[#f43f5e]'
          : 'bg-[rgba(var(--color-primary-rgb),0.12)] text-t-primary'"
      >
        <AlertCircle v-if="task.status === 'error'" class="w-3.5 h-3.5" />
        <Loader2 v-else class="w-3.5 h-3.5 animate-spin" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-xs text-t-body truncate leading-snug">{{ task.name }}</p>
        <div class="mt-1.5 h-1 rounded-full bg-[rgba(var(--color-primary-rgb),0.15)] overflow-hidden">
          <div
            v-if="isProcessing(task)"
            class="upload-bar--indeterminate h-full rounded-full bg-t-primary"
          ></div>
          <div
            v-else
            class="h-full rounded-full transition-[width] duration-200 ease-out"
            :class="task.status === 'error' ? 'bg-[#f43f5e]' : 'bg-t-primary'"
            :style="{ width: task.percent + '%' }"
          ></div>
        </div>
      </div>

      <span
        class="flex-shrink-0 text-xs tabular-nums"
        :class="task.status === 'error' ? 'text-[#f43f5e]' : 'text-t-primary'"
      >
        {{ statusText(task) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import type { UploadTask } from '@/composables/useUploadTasks'

defineProps<{
  tasks: UploadTask[]
}>()

/** 「处理中」阶段没有真实进度数据，用不确定态进度条代替僵住的 100% */
function isProcessing(task: UploadTask): boolean {
  return task.status === 'active' && task.phase === 'processing'
}

function statusText(task: UploadTask): string {
  if (task.status === 'error') return '失败'
  if (task.phase === 'processing') return '处理中'
  return `${task.percent}%`
}
</script>
