<template>
  <NuxtLink
    :to="`/tag/${encodeURIComponent(tag.name)}`"
    class="relative inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-xs font-semibold leading-[1.4] whitespace-nowrap cursor-pointer no-underline transition-all duration-300 border hover:-translate-y-px hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)]"
    :style="badgeStyle"
  >
    <span class="w-1.5 h-1.5 rounded-full opacity-70 shadow-[0_0_6px_currentColor]" :style="{ background: 'currentColor' }" />
    {{ tag.name }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '~/types'

const props = defineProps<{
  tag: Tag
}>()

const textColor = computed(() => props.tag.color || '#00f0ff')

const bgColor = computed(() => {
  if (props.tag.color) return `${props.tag.color}15`
  return 'rgba(0, 240, 255, 0.06)'
})

const borderColor = computed(() => {
  if (props.tag.color) return `${props.tag.color}40`
  return 'rgba(0, 240, 255, 0.15)'
})

const badgeStyle = computed(() => ({
  color: textColor.value,
  backgroundColor: bgColor.value,
  borderColor: borderColor.value,
}))
</script>
