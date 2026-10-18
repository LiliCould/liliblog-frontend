<template>
  <div
    ref="hostRef"
    class="pointer-events-none"
    :class="variant === 'global' ? 'fixed inset-0 z-[var(--z-particle)]' : 'absolute inset-0 z-[5]'"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="block h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useParticleScene } from '~/composables/useParticleScene'

const props = withDefaults(defineProps<{
  variant?: 'global' | 'hero'
  count?: number
  interactive?: boolean
  paused?: boolean
}>(), {
  variant: 'global',
  count: 0,
  interactive: false,
  paused: false,
})

const hostRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

useParticleScene(canvasRef, hostRef, {
  variant: props.variant,
  count: props.count > 0 ? props.count : undefined,
  interactive: props.interactive,
  paused: () => props.paused,
})
</script>
