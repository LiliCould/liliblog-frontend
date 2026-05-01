<template>
  <div class="custom-cursor" v-show="isVisible && !isMobile">
    <div
      class="cursor-outer"
      :class="{ 'cursor-hover': isHovering, 'cursor-text': isText }"
      :style="outerStyle"
    ></div>
    <div
      class="cursor-inner"
      :class="{ 'cursor-hidden': isHovering || isText }"
      :style="innerStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

const isVisible = ref(true)
const isMobile = ref(false)
const isHovering = ref(false)
const isText = ref(false)

const mouse = reactive({ x: -100, y: -100 })
const outer = reactive({ x: -100, y: -100 })
const inner = reactive({ x: -100, y: -100 })

let animationFrameId: number | null = null

const MOBILE_BREAKPOINT = 768

const outerStyle = computed(() => ({
  left: `${outer.x}px`,
  top: `${outer.y}px`
}))

const innerStyle = computed(() => ({
  left: `${inner.x}px`,
  top: `${inner.y}px`
}))

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

const updateOuterPosition = () => {
  outer.x += (mouse.x - outer.x) * 0.15
  outer.y += (mouse.y - outer.y) * 0.15
  
  animationFrameId = requestAnimationFrame(updateOuterPosition)
}

onMounted(() => {
  checkMobile()
  
  window.addEventListener('resize', handleResize)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)
  document.addEventListener('mouseover', checkHoverState)
  
  updateOuterPosition()
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

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: var(--z-cursor);
}

.cursor-outer {
  position: absolute;
  width: var(--cursor-outer-size);
  height: var(--cursor-outer-size);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.15s ease-out;
  will-change: transform;
}

.cursor-outer.cursor-hover {
  width: var(--cursor-hover-outer-size);
  height: var(--cursor-hover-outer-size);
  border-color: var(--color-primary);
}

.cursor-outer.cursor-text {
  width: var(--cursor-text-outer-size);
  height: var(--cursor-text-outer-size);
  border-color: rgba(255, 255, 255, 0.8);
}

.cursor-inner {
  position: absolute;
  width: var(--cursor-inner-size);
  height: var(--cursor-inner-size);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease,
              width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.cursor-inner.cursor-hidden {
  opacity: 0;
  width: 0;
  height: 0;
}

@media (max-width: 768px) {
  .custom-cursor {
    display: none !important;
  }
}
</style>
