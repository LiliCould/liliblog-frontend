<template>
  <div class="mouse-effects">
    <div
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="bubble"
      :style="bubble.style"
    />
    <canvas ref="canvasRef" class="ripple-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Bubble {
  id: number
  style: {
    left: string
    top: string
    width: string
    height: string
    opacity: number
    transform: string
    background: string
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const bubbles = ref<Bubble[]>([])
let bubbleId = 0
let lastBubbleTime = 0
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let ripples: Array<{ x: number; y: number; radius: number; opacity: number }> = []

const colors = [
  'rgba(232, 97, 60, 0.3)',
  'rgba(240, 160, 75, 0.3)',
  'rgba(255, 182, 193, 0.3)',
  'rgba(255, 218, 185, 0.3)',
  'rgba(230, 230, 250, 0.3)',
]

const handleMouseMove = (e: MouseEvent) => {
  const now = Date.now()
  if (now - lastBubbleTime > 80) {
    createBubble(e.clientX, e.clientY)
    lastBubbleTime = now
  }
  createRipple(e.clientX, e.clientY)
}

const createBubble = (x: number, y: number) => {
  const size = Math.random() * 20 + 10
  const color = colors[Math.floor(Math.random() * colors.length)]
  const id = bubbleId++
  
  const bubble: Bubble = {
    id,
    style: {
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: 0.8,
      transform: 'scale(0)',
      background: color,
    },
  }
  
  bubbles.value.push(bubble)
  
  requestAnimationFrame(() => {
    const index = bubbles.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bubbles.value[index].style.transform = 'scale(1)'
    }
  })
  
  setTimeout(() => {
    const index = bubbles.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bubbles.value[index].style.opacity = 0
      bubbles.value[index].style.transform = `scale(1.5) translateY(-${Math.random() * 30 + 20}px)`
    }
  }, 50)
  
  setTimeout(() => {
    bubbles.value = bubbles.value.filter(b => b.id !== id)
  }, 800)
}

const createRipple = (x: number, y: number) => {
  if (ripples.length < 5) {
    ripples.push({
      x,
      y,
      radius: 0,
      opacity: 0.15,
    })
  }
}

const animateRipples = () => {
  if (!ctx || !canvasRef.value) {
    animationFrameId = requestAnimationFrame(animateRipples)
    return
  }
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  ripples = ripples.filter(ripple => {
    ripple.radius += 2
    ripple.opacity -= 0.003
    
    if (ripple.opacity <= 0) return false
    
    if (ctx) {
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(232, 97, 60, ${ripple.opacity})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    return true
  })
  
  animationFrameId = requestAnimationFrame(animateRipples)
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('mousemove', handleMouseMove)
  animateRipples()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.mouse-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(2px);
  box-shadow: 0 0 10px rgba(232, 97, 60, 0.2);
}

.ripple-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
