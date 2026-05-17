<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '加载失败',
  description: '请稍后重试',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle class="w-12 h-12 text-accent-rose mb-4" />
    <h3 class="text-lg font-semibold text-text-title mb-2">{{ title }}</h3>
    <p class="text-sm text-text-meta">{{ description }}</p>
  </div>
</template>
