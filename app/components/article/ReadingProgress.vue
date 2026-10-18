<template>
  <div
    class="fixed left-0 right-0 z-[45] h-0.5 bg-[rgba(var(--color-primary-rgb),0.08)] pointer-events-none"
    :style="{
      top: headerHidden ? '0px' : 'var(--header-height)',
      transition: reduceMotion ? 'none' : 'top var(--motion-card) var(--ease-standard)',
    }"
    role="progressbar"
    aria-label="阅读进度"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full bg-gradient-to-r from-t-primary to-t-secondary origin-left"
      :style="{ transform: `scaleX(${progress / 100})`, transition: reduceMotion ? 'none' : 'transform 120ms linear' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const props = defineProps<{
  target: HTMLElement | null
}>()

const { y } = useWindowScroll()
const { height } = useWindowSize()
const { headerHidden } = useHeaderState()
const reduceMotion = ref(false)

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const progress = computed(() => {
  if (!import.meta.client || !props.target) return 0
  // 读取 y 让滚动触发重算
  const scrollTop = y.value
  const rect = props.target.getBoundingClientRect()
  const articleTop = rect.top + scrollTop
  const total = Math.max(1, props.target.offsetHeight - height.value + 120)
  const value = ((scrollTop - articleTop + 80) / total) * 100
  return Math.min(100, Math.max(0, Math.round(value)))
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  div {
    transition: none !important;
  }
}
</style>
