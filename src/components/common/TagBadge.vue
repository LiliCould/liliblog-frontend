<template>
  <span
    class="tag-badge"
    :style="{ backgroundColor: bgColor, color: textColor }"
  >
    {{ tag.name }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/types/tag.d'

const props = defineProps<{
  tag: Tag
}>()

const bgColor = computed(() => {
  if (props.tag.color) {
    return props.tag.color + '18'
  }
  return 'var(--color-primary-light)'
})

const textColor = computed(() => {
  return props.tag.color || 'var(--color-primary)'
})
</script>

<style scoped>
.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  transition: opacity 0.2s;
  cursor: default;
}

.tag-badge:hover {
  opacity: 0.8;
}
</style>
