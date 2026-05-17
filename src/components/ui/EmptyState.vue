<script setup lang="ts">
import { FileX } from 'lucide-vue-next'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂无内容',
  description: '这里还没有任何内容',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <FileX class="w-12 h-12 text-text-meta mb-4" />
    <h3 class="text-lg font-semibold text-text-title mb-2">{{ title }}</h3>
    <p class="text-sm text-text-meta">{{ description }}</p>
  </div>
</template>
