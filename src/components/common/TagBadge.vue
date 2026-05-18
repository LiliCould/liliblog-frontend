<template>
  <span
    class="relative inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-xs font-semibold leading-[1.4] whitespace-nowrap cursor-pointer transition-all duration-300 border hover:-translate-y-px hover:shadow-[0_0_10px_rgba(0,240,255,0.15)]"
    :style="badgeStyle"
    @click="goTag"
  >
    <span class="w-1.5 h-1.5 rounded-full opacity-70 shadow-[0_0_6px_currentColor]" :style="{ background: 'currentColor' }"></span>
    {{ tag.name }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Tag } from '@/types/tag.d'

const props = defineProps<{
  tag: Tag
}>()

const router = useRouter()

const textColor = computed(() => {
  return props.tag.color || '#00f0ff'
})

const bgColor = computed(() => {
  if (props.tag.color) {
    return props.tag.color + '15'
  }
  return 'rgba(0, 240, 255, 0.06)'
})

const borderColor = computed(() => {
  if (props.tag.color) {
    return props.tag.color + '40'
  }
  return 'rgba(0, 240, 255, 0.15)'
})

const badgeStyle = computed(() => ({
  color: textColor.value,
  backgroundColor: bgColor.value,
  borderColor: borderColor.value,
}))

function goTag() {
  router.push(`/tag/${props.tag.name}`)
}
</script>
