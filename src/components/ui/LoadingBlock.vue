<script setup lang="ts">
interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mb-4" />
    <p class="text-sm text-text-meta">{{ text }}</p>
  </div>
</template>
