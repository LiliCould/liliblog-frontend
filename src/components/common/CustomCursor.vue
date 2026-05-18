<template>
  <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] max-md:hidden" v-show="isVisible && !isMobile">
    <div
      class="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-250"
      :class="{
        'w-10 h-10 border-2 border-[#00f0ff]': !isHovering && !isText,
        'w-14 h-14 border-2 border-[#ff2d78]': isHovering,
        'w-8 h-8 border-2 border-[#00f0ff]': isText && !isHovering,
      }"
      :style="[outerStyle, outerShadowStyle]"
    ></div>
    <div
      class="absolute w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.95),0_0_20px_rgba(0,240,255,0.5)] transition-[opacity,width,height] duration-200"
      :class="{ 'opacity-0 !w-0 !h-0': isHovering || isText }"
      :style="innerStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, provide } from 'vue'

const isVisible = ref(true)
const isMobile = ref(false)
const isHovering = ref(false)
const isText = ref(false)

provide('cursorState', {
  isHovering,
  isText
})

const mouse = reactive({ x: -100, y: -100 })
const outer = reactive({ x: -100, y: -100 })
const inner = reactive({ x: -100, y: -100 })

let animationFrameId: number | null = null

const MOBILE_BREAKPOINT = 768

const outerStyle = computed(() => ({
  left: `${outer.x}px`,
  top: `${outer.y}px`,
}))

const innerStyle = computed(() => ({
  left: `${inner.x}px`,
  top: `${inner.y}px`,
}))

const outerShadowStyle = computed(() => {
  if (isHovering.value) {
    return { boxShadow: '0 0 15px rgba(255,45,120,0.65), 0 0 30px rgba(255,45,120,0.35), inset 0 0 12px rgba(255,45,120,0.2)' }
  }
  if (isText.value) {
    return { boxShadow: '0 0 8px rgba(0,240,255,0.7), 0 0 16px rgba(0,240,255,0.4), inset 0 0 6px rgba(0,240,255,0.25)' }
  }
  return { boxShadow: '0 0 10px rgba(0,240,255,0.5), 0 0 20px rgba(0,240,255,0.25), inset 0 0 8px rgba(0,240,255,0.15)' }
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT || 'ontouchstart' in window
}

const handleMouseMove = (e: MouseEvent) => {
  if (isMobile.value) return

  mouse.x = e.clientX
  mouse.y = e.clientY

  inner.x = e.clientX
  inner.y = e.clientY
}

const handleMouseLeave = () => {
  isVisible.value = false
}

const handleMouseEnter = () => {
  isVisible.value = true
}

const handleResize = () => {
  checkMobile()
}

const checkHoverState = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target) return

  const tag = target.tagName.toLowerCase()
  const isClickable = target.closest('a, button, [role="button"], input, select, textarea, .clickable')

  if (isClickable) {
    isHovering.value = true
    isText.value = false
  } else if (tag === 'p' || tag === 'span' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    isText.value = true
    isHovering.value = false
  } else {
    isHovering.value = false
    isText.value = false
  }
}

let lastTime = 0
const throttleMs = 16

const updateOuterPosition = (timestamp: number) => {
  if (timestamp - lastTime >= throttleMs) {
    lastTime = timestamp

    outer.x += (mouse.x - outer.x) * 0.15
    outer.y += (mouse.y - outer.y) * 0.15
  }

  animationFrameId = requestAnimationFrame(updateOuterPosition)
}

onMounted(() => {
  checkMobile()

  window.addEventListener('resize', handleResize)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)
  document.addEventListener('mouseover', checkHoverState)

  animationFrameId = requestAnimationFrame(updateOuterPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('mouseenter', handleMouseEnter)
  document.removeEventListener('mouseover', checkHoverState)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
