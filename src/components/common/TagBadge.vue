<template>
  <span class="tag-badge" :style="{ backgroundColor: bgColor, color: textColor }">
    <span class="tag-dot"></span>
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
    return props.tag.color + '15'
  }
  return 'var(--color-primary-light)'
})

const textColor = computed(() => {
  return props.tag.color || 'var(--color-primary)'
})
</script>

<style scoped>
.tag-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  white-space: nowrap;
  cursor: default;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.tag-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.3));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.tag-badge:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: currentColor;
  opacity: 0.9;
}

.tag-badge:hover::before {
  opacity: 1;
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
}
</style>
