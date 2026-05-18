<template>
  <section class="relative w-full h-screen overflow-hidden">
    <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 transition-all duration-1000 ease-in-out"
      :class="[
        index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      ]">
      <img :src="slide.src" :alt="slide.alt" class="w-full h-full object-cover" loading="lazy"
        :fetchpriority="index === 0 ? 'high' : 'low'" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,15,0.3)] via-[rgba(10,10,15,0.5)] to-[rgba(10,10,15,0.85)]">
      </div>
    </div>

    <div class="absolute inset-0 pointer-events-none"
      style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)">
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center h-full gap-5 text-center px-4">
      <h1 class="glitch-title" :class="titleSizeClass" data-text="LiliCould's Blog">
        <span class="glitch-before" aria-hidden="true">LiliCould's Blog</span>
        <span class="glitch-main">LiliCould's Blog</span>
        <span class="glitch-after" aria-hidden="true">LiliCould's Blog</span>
        <span class="glitch-line"></span>
      </h1>

      <p class="tracking-wide flex items-center justify-center min-h-[2em]" :class="subtitleSizeClass"
        style="font-family: 'Inter', 'Segoe UI', 'PingFang SC', sans-serif;">
        <span v-if="subtitleStarted" class="text-[#9ca3af]">
          <span class="text-[#00f0ff]">&lt;</span>
          <span>{{ subDisplayText }}</span>
          <span class="typewriter-cursor" :class="{ 'cursor-blink': subTypingDone }">|</span>
          <span v-if="subTypingDone" class="text-[#00f0ff]"> /&gt;</span>
        </span>
      </p>

      <div
        class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_10px_rgba(0,240,255,0.5)]"
        :class="{ 'opacity-0': !subTypingDone, 'opacity-100 transition-opacity duration-700': subTypingDone }"></div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
      <button v-for="(_, index) in slides" :key="index"
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 border" :class="[
          index === currentIndex
            ? 'bg-[#00f0ff] border-[#00f0ff] w-8 shadow-[0_0_8px_rgba(0,240,255,0.5)]'
            : 'bg-transparent border-[rgba(0,240,255,0.4)] hover:border-[#00f0ff] hover:bg-[rgba(0,240,255,0.3)]'
        ]" @click="goTo(index)"></button>
    </div>

    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.5)] hover:[box-shadow:0_0_12px_rgba(0,240,255,0.3)]"
      @click="prev">
      <ChevronLeft class="w-5 h-5" />
    </button>
    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.5)] hover:[box-shadow:0_0_12px_rgba(0,240,255,0.3)]"
      @click="next">
      <ChevronRight class="w-5 h-5" />
    </button>

    <div class="absolute bottom-8 right-4 z-20">
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)]"
        @click="togglePause">
        <Pause v-if="!paused" class="w-3.5 h-3.5" />
        <Play v-else class="w-3.5 h-3.5" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'

import hero1 from '@/assets/heros/hero-1.png'
import hero2 from '@/assets/heros/hero-2.png'
import hero3 from '@/assets/heros/hero-3.png'
import hero4 from '@/assets/heros/hero-4.jpg'

const MAIN_TEXT = "LiliCould's Blog"

const SUB_TEXT = '技术与生活的分享空间'
const SUB_TYPE_SPEED = 100

const slides = [
  { src: hero1, alt: 'Hero 1' },
  { src: hero2, alt: 'Hero 2' },
  { src: hero3, alt: 'Hero 3' },
  { src: hero4, alt: 'Hero 4' },
]

const currentIndex = ref(0)
const paused = ref(false)
let slideTimer: ReturnType<typeof setInterval> | null = null

const mainDisplayText = ref('')
const subDisplayText = ref('')
const subTypingDone = ref(false)
const subtitleStarted = ref(false)

const titleSizeClass = computed(() => 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl')
const subtitleSizeClass = computed(() => 'text-base sm:text-lg md:text-xl')

function typeText(
  text: string,
  speed: number,
  delay: number,
  displayRef: typeof subDisplayText,
  doneRef: typeof subTypingDone,
  onStart?: () => void,
): ReturnType<typeof setTimeout>[] {
  const timers: ReturnType<typeof setTimeout>[] = []
  const t1 = setTimeout(() => {
    onStart?.()
    let i = 0
    const t2 = setInterval(() => {
      if (i < text.length) {
        displayRef.value = text.slice(0, i + 1)
        i++
      } else {
        clearInterval(t2)
        doneRef.value = true
      }
    }, speed)
    timers.push(t2 as unknown as ReturnType<typeof setTimeout>)
  }, delay)
  timers.push(t1)
  return timers
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

function goTo(index: number) {
  currentIndex.value = index
}

function togglePause() {
  paused.value = !paused.value
  if (paused.value) {
    stopAutoPlay()
  } else {
    startAutoPlay()
  }
}

function startAutoPlay() {
  stopAutoPlay()
  slideTimer = setInterval(() => {
    if (!paused.value) next()
  }, 5000)
}

function stopAutoPlay() {
  if (slideTimer) {
    clearInterval(slideTimer)
    slideTimer = null
  }
}

let typewriterTimers: ReturnType<typeof setTimeout>[] = []

function startTypewriter() {
  mainDisplayText.value = MAIN_TEXT
  subDisplayText.value = ''
  subTypingDone.value = false
  subtitleStarted.value = false

  typewriterTimers.forEach(t => clearTimeout(t))
  typewriterTimers = []

  const subDelay = 800
  const subTimers = typeText(SUB_TEXT, SUB_TYPE_SPEED, subDelay, subDisplayText, subTypingDone, () => {
    subtitleStarted.value = true
  })
  typewriterTimers.push(...subTimers)
}

onMounted(() => {
  startAutoPlay()
  startTypewriter()
})

onUnmounted(() => {
  stopAutoPlay()
  typewriterTimers.forEach(t => clearTimeout(t))
})
</script>

<style scoped>
.glitch-title {
  position: relative;
  font-family: 'Inter', 'Segoe UI', 'PingFang SC', sans-serif;
  font-weight: 600;
  color: transparent;
  letter-spacing: 0.05em;
  user-select: none;
}

.glitch-main {
  position: relative;
  z-index: 10;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.15);
}

.glitch-before,
.glitch-after {
  position: absolute;
  top: -5%;
  left: 0;
  width: 100%;
  height: 130%;
  overflow: hidden;
  filter: contrast(200%);
}

.glitch-before {
  left: 0;
  color: #ff2d78;
  text-shadow: 1px 0 0 #ff2d78;
  z-index: 20;
  animation: glitch-anim-1 0.95s infinite step-end;
}

.glitch-after {
  left: -1px;
  color: #00f0ff;
  text-shadow: -1px 0 0 #00f0ff;
  z-index: 30;
  mix-blend-mode: lighten;
  animation: glitch-anim-2 1.1s infinite step-end 0.2s;
}

.glitch-line {
  position: absolute;
  left: -3px;
  width: calc(100% + 6px);
  height: 1px;
  background: #000;
  z-index: 50;
  animation: glitch-line 3s ease-out infinite;
}

@keyframes glitch-anim-1 {
  0% {
    top: 0;
    left: 0;
  }

  10% {
    top: -1.5px;
    left: -3.5px;
  }

  20% {
    top: 1.5px;
    left: -0.5px;
  }

  30% {
    top: 0;
    left: 2px;
  }

  40% {
    top: -1px;
    left: -2.5px;
  }

  50% {
    top: 0;
    left: 0.5px;
  }

  60% {
    top: 4px;
    left: -4px;
  }

  70% {
    top: -2.5px;
    left: 0.3px;
  }

  80% {
    top: -1px;
    left: -3px;
  }

  90% {
    top: 0;
    left: 3px;
  }

  100% {
    top: 0;
    left: -3px;
  }
}

@keyframes glitch-anim-2 {
  0% {
    top: 0;
    left: -1px;
  }

  10% {
    top: 1.5px;
    left: 3px;
  }

  20% {
    top: -1.5px;
    left: -0.5px;
  }

  30% {
    top: 0.5px;
    left: 3px;
  }

  40% {
    top: -2px;
    left: -2px;
  }

  50% {
    top: 0.3px;
    left: 1px;
  }

  60% {
    top: -3px;
    left: 3.5px;
  }

  70% {
    top: 2px;
    left: -2px;
  }

  80% {
    top: -0.5px;
    left: 2.5px;
  }

  90% {
    top: 2.5px;
    left: -2.5px;
  }

  100% {
    top: -0.5px;
    left: 2px;
  }
}

@keyframes glitch-line {
  0% {
    top: -2px;
    opacity: 0;
  }

  2% {
    top: 15px;
    opacity: 1;
  }

  4% {
    top: 42px;
    opacity: 0;
  }

  6% {
    top: 5px;
    opacity: 1;
  }

  8% {
    top: 35px;
    opacity: 0;
  }

  12% {
    top: 8px;
    opacity: 1;
  }

  14% {
    top: 45px;
    opacity: 0;
  }

  18% {
    top: 2px;
    opacity: 1;
  }

  20% {
    top: 38px;
    opacity: 0;
  }

  25% {
    top: 28px;
    opacity: 1;
  }

  27% {
    top: 10px;
    opacity: 0;
  }

  30% {
    top: 40px;
    opacity: 1;
  }

  32% {
    top: 3px;
    opacity: 0;
  }

  38% {
    top: 33px;
    opacity: 1;
  }

  40% {
    top: 7px;
    opacity: 0;
  }

  45% {
    top: 25px;
    opacity: 1;
  }

  47% {
    top: 44px;
    opacity: 0;
  }

  52% {
    top: 1px;
    opacity: 1;
  }

  54% {
    top: 36px;
    opacity: 0;
  }

  60% {
    top: 12px;
    opacity: 1;
  }

  62% {
    top: 42px;
    opacity: 0;
  }

  68% {
    top: 6px;
    opacity: 1;
  }

  70% {
    top: 30px;
    opacity: 0;
  }

  75% {
    top: 20px;
    opacity: 1;
  }

  77% {
    top: 46px;
    opacity: 0;
  }

  82% {
    top: 3px;
    opacity: 1;
  }

  84% {
    top: 35px;
    opacity: 0;
  }

  90% {
    top: 14px;
    opacity: 1;
  }

  92% {
    top: 40px;
    opacity: 0;
  }

  99% {
    top: 8px;
    opacity: 0;
  }

  100% {
    top: -2px;
    opacity: 0;
  }
}

.typewriter-cursor {
  color: #00f0ff;
  font-weight: 300;
  margin-left: 2px;
  opacity: 1;
}

.cursor-blink {
  animation: cursor-blink 0.8s step-end infinite;
}

@keyframes cursor-blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
