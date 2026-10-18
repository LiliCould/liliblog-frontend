<template>
  <div class="card-glass flex flex-col items-center justify-center px-6 py-14 text-center">
    <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-t-danger-soft">
      <AlertTriangle class="h-6 w-6 text-t-danger" />
    </div>
    <h3 class="text-base font-semibold text-t-title mb-1.5">{{ title }}</h3>
    <p v-if="description" class="max-w-[320px] text-sm leading-relaxed text-t-muted">{{ description }}</p>
    <button
      v-if="showRetry"
      class="btn-primary mt-5 px-4 py-2 text-sm"
      @click="emit('retry')"
    >
      <RefreshCw class="h-4 w-4" />
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'

withDefaults(defineProps<{
  title?: string
  description?: string
  showRetry?: boolean
}>(), {
  title: '加载失败',
  description: '网络或服务暂时不可用，请稍后重试。',
  showRetry: true,
})

const emit = defineEmits<{
  retry: []
}>()
</script>
