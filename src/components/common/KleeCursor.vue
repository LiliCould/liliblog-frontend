<template>
  <div class="klee-cursor-container" v-show="isVisible && !isMobile">
    <img 
      :src="keliImage" 
      alt="klee" 
      class="klee-image"
      :style="kleeStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import keliImage from '@/assets/keli.png'

const isVisible = ref(true)
const isMobile = ref(false)

const mouse = reactive({ x: 0, y: 0 })
const klee = reactive({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  rotation: 0,
  rotationV: 0
})

const physics = {
  stiffness: 0.12,
  damping: 0.78,
  rotationStiffness: 0.06,
  rotationDamping: 0.88
}

const MOBILE_BREAKPOINT = 768

let animationFrameId: number | null = null

const kleeStyle = computed(() => ({
  left: `${klee.x - 16}px`,
  top: `${klee.y - 16}px`,
  transform: `rotate(${klee.rotation}deg)`,
  opacity: 0.9
}))

const checkMobile = () => {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT || 'ontouchstart' in window
}

const handleMouseMove = (e: MouseEvent) => {
  if (isMobile.value) return
  mouse.x = e.clientX
  mouse.y = e.clientY
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

const updatePhysics = () => {
  if (isMobile.value) {
    animationFrameId = requestAnimationFrame(updatePhysics)
    return
  }
  
  const targetX = mouse.x + 20
  const targetY = mouse.y + 20
  
  const dx = targetX - klee.x
  const dy = targetY - klee.y
  
  klee.vx += dx * physics.stiffness
  klee.vy += dy * physics.stiffness
  
  klee.vx *= physics.damping
  klee.vy *= physics.damping
  
  klee.x += klee.vx
  klee.y += klee.vy
  
  const targetRotation = klee.vx * 2
  const rotationDiff = targetRotation - klee.rotation
  klee.rotationV += rotationDiff * physics.rotationStiffness
  klee.rotationV *= physics.rotationDamping
  klee.rotation += klee.rotationV
  
  klee.rotation = Math.max(-15, Math.min(15, klee.rotation))
  
  animationFrameId = requestAnimationFrame(updatePhysics)
}

onMounted(() => {
  checkMobile()
  
  klee.x = window.innerWidth / 2
  klee.y = window.innerHeight / 2
  mouse.x = klee.x
  mouse.y = klee.y
  
  window.addEventListener('resize', handleResize)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)
  
  updatePhysics()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('mouseenter', handleMouseEnter)
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.klee-cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.klee-image {
  position: absolute;
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  pointer-events: none;
  will-change: transform;
}

@media (max-width: 768px) {
  .klee-cursor-container {
    display: none !important;
  }
}
</style>
