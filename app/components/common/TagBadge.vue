<template>
  <NuxtLink
    :to="`/tag/${encodeURIComponent(tag.name)}`"
    class="chip-glass inline-flex items-center gap-1.5 px-3.5 py-[5px] text-xs font-semibold leading-[1.4] whitespace-nowrap no-underline hover:-translate-y-px"
    :style="badgeStyle"
  >
    <span class="w-1.5 h-1.5 rounded-full" :style="{ background: accentColor }" />
    {{ tag.name }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '~/types'
import { withAlpha } from '~/utils/color'

const props = defineProps<{
  tag: Tag
}>()

const accentColor = computed(() => props.tag.color || 'var(--color-primary)')

const badgeStyle = computed(() => ({
  backgroundColor: props.tag.color
    ? withAlpha(props.tag.color, 0.10)
    : 'rgba(var(--color-primary-rgb), 0.08)',
  borderColor: props.tag.color
    ? withAlpha(props.tag.color, 0.32)
    : 'rgba(var(--color-primary-rgb), 0.20)',
}))
</script>
