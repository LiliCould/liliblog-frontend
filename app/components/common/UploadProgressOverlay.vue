<template>
  <Teleport to="body">
    <Transition name="upload-overlay">
      <div v-if="state.visible" class="fixed inset-0 z-[1500] flex items-center justify-center" role="alert" aria-live="polite">
        <div class="absolute inset-0 bg-[rgba(0,0,0,0.5)]" style="backdrop-filter: blur(4px)" />

        <div class="relative w-full max-w-sm mx-4 rounded-xl border border-[rgba(var(--color-primary-rgb),0.2)] p-6" style="background: rgba(var(--color-surface-rgb), 0.98)">
          <div class="flex items-center gap-3 mb-5">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)]">
              <Loader2 class="w-5 h-5 text-t-primary animate-spin" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-t-title">{{ isProcessing ? '服务器处理中' : '上传中' }}</p>
              <p class="text-xs text-t-muted truncate">{{ state.label }}</p>
            </div>
            <span v-if="!isProcessing" class="ml-auto text-sm font-semibold text-t-primary tabular-nums">{{ state.percent }}%</span>
          </div>

          <div class="w-full h-2 rounded-full bg-[rgba(var(--color-primary-rgb),0.12)] overflow-hidden">
            <div v-if="isProcessing" class="upload-bar--indeterminate h-full rounded-full bg-t-primary" />
            <div v-else class="h-full rounded-full bg-t-primary transition-[width] duration-200 ease-out" :style="{ width: `${state.percent}%` }" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const { state } = useUploadProgress()
const isProcessing = computed(() => state.value.phase === 'processing')
</script>
