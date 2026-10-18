<template>
  <section
    class="hero-section relative w-full overflow-hidden"
    style="height: min(720px, calc(80vh - var(--header-height))); height: min(720px, calc(80svh - var(--header-height)))"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-all duration-1000 ease-in-out"
      :class="index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'"
    >
      <img
        :src="slide.src"
        :alt="slide.alt"
        class="w-full h-full object-cover"
        :loading="index === 0 ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="index === 0 ? 'high' : 'low'"
      />
      <div
        class="absolute inset-0"
        style="background:linear-gradient(to bottom, rgba(10,10,15,0.28) 0%, rgba(10,10,15,0.55) 68%, var(--color-bg) 100%)"
      />
    </div>

    <div
      class="absolute inset-0 pointer-events-none opacity-70"
      style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(var(--color-primary-rgb),0.02) 2px,rgba(var(--color-primary-rgb),0.02) 4px)"
    />

    <div class="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 class="glitch-title" :class="titleSizeClass" data-text="LiliCould's Blog">
        <span class="glitch-before" aria-hidden="true">LiliCould's Blog</span>
        <span class="glitch-main">LiliCould's Blog</span>
        <span class="glitch-after" aria-hidden="true">LiliCould's Blog</span>
        <span class="glitch-line" />
      </h1>

      <div class="flex min-h-[5rem] flex-col items-center justify-center" aria-hidden="true">
        <p class="max-w-[min(900px,92vw)] break-words font-mono text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">
          <span class="text-t-primary">{{ typedPrefix }}</span>
          <span>{{ typedPhrase }}</span>
          <span class="text-t-primary">{{ typedSuffix }}</span>
          <span class="typewriter-cursor" :class="{ 'cursor-blink': phase === 'holding' }">|</span>
        </p>
      </div>

      <div
        class="w-20 h-0.5 bg-gradient-to-r from-transparent via-t-primary to-transparent shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]"
        :class="{ 'opacity-0': typedLength === 0, 'opacity-100 transition-opacity duration-700': typedLength > 0 }"
      />
    </div>

    <div class="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-md">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="h-2.5 rounded-full transition-all duration-300"
        :class="index === currentIndex
          ? 'w-8 bg-t-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]'
          : 'w-2.5 bg-white/35 hover:bg-white/60'"
        :aria-label="`切换到第 ${index + 1} 张图片`"
        @click="goTo(index)"
      />
    </div>

    <button
      class="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white/80 backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-black/45 hover:text-white"
      aria-label="上一张"
      @click="prev"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    <button
      class="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white/80 backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-black/45 hover:text-white"
      aria-label="下一张"
      @click="next"
    >
      <ChevronRight class="w-5 h-5" />
    </button>

    <div class="absolute bottom-7 right-4 z-20">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white/75 backdrop-blur-md transition-all duration-200 hover:bg-black/45 hover:text-white"
        :aria-label="paused ? '继续自动播放' : '暂停自动播放'"
        @click="togglePause"
      >
        <Pause v-if="!paused" class="w-3.5 h-3.5" />
        <Play v-else class="w-3.5 h-3.5" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'
import { heroCodeTemplates, heroPhrases, type HeroCodeTemplate } from '~/utils/heroPhrases'

interface ActiveLine {
  phrase: string
  template: HeroCodeTemplate
  fullPrefix: string
  fullSuffix: string
  fullText: string
}

const TYPE_SPEED = 65
const DELETE_SPEED = 28
const HOLD_DURATION = 2200

const slides = [
  { src: 'https://oss.lilicould.cn/file/hero-1.png', alt: 'Hero 1' },
  { src: 'https://oss.lilicould.cn/file/hero-2.png', alt: 'Hero 2' },
  { src: 'https://oss.lilicould.cn/file/hero-3.png', alt: 'Hero 3' },
  { src: 'https://oss.lilicould.cn/file/hero-4.jpg', alt: 'Hero 4' },
]

const currentIndex = ref(0)
const paused = ref(false)
const hovering = ref(false)
const reduceMotion = ref(false)
const activeLine = ref<ActiveLine | null>(null)
const typedLength = ref(0)
const phase = ref<'typing' | 'holding' | 'deleting'>('typing')

let slideTimer: ReturnType<typeof setInterval> | null = null
let typeTimer: ReturnType<typeof setTimeout> | null = null
let lastPhraseIndex = -1
let lastTemplateIndex = -1

const titleSizeClass = computed(() => 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl')

const typedPrefix = computed(() => {
  const line = activeLine.value
  return line ? line.fullPrefix.slice(0, Math.min(typedLength.value, line.fullPrefix.length)) : ''
})

const typedPhrase = computed(() => {
  const line = activeLine.value
  if (!line) return ''
  const start = line.fullPrefix.length
  return line.phrase.slice(0, Math.max(0, Math.min(typedLength.value - start, line.phrase.length)))
})

const typedSuffix = computed(() => {
  const line = activeLine.value
  if (!line) return ''
  const start = line.fullPrefix.length + line.phrase.length
  return line.fullSuffix.slice(0, Math.max(0, Math.min(typedLength.value - start, line.fullSuffix.length)))
})

function pickRandomIndex(length: number, previous: number): number {
  if (length <= 1) return 0
  let index = Math.floor(Math.random() * length)
  if (index === previous) {
    index = (index + 1 + Math.floor(Math.random() * (length - 1))) % length
  }
  return index
}

function escapePhrase(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function buildLine(): ActiveLine {
  const phraseIndex = pickRandomIndex(heroPhrases.length, lastPhraseIndex)
  const templateIndex = pickRandomIndex(heroCodeTemplates.length, lastTemplateIndex)
  lastPhraseIndex = phraseIndex
  lastTemplateIndex = templateIndex

  const phrase = escapePhrase(heroPhrases[phraseIndex] || '技术与生活的分享空间')
  const template = heroCodeTemplates[templateIndex] || {
    label: 'JavaScript',
    prefix: 'console.log("',
    suffix: '");',
  }

  return {
    phrase,
    template,
    fullPrefix: template.prefix,
    fullSuffix: template.suffix,
    fullText: `${template.prefix}${phrase}${template.suffix}`,
  }
}

function schedule(delay: number): void {
  if (typeTimer) clearTimeout(typeTimer)
  typeTimer = setTimeout(tick, delay)
}

function tick(): void {
  const line = activeLine.value
  if (!line) return

  if (document.hidden) {
    schedule(600)
    return
  }

  if (phase.value === 'typing') {
    if (typedLength.value < line.fullText.length) {
      typedLength.value += 1
      schedule(TYPE_SPEED)
    } else {
      phase.value = 'holding'
      schedule(HOLD_DURATION)
    }
    return
  }

  if (phase.value === 'holding') {
    phase.value = 'deleting'
    schedule(DELETE_SPEED)
    return
  }

  if (typedLength.value > 0) {
    typedLength.value -= 1
    schedule(DELETE_SPEED)
    return
  }

  activeLine.value = buildLine()
  typedLength.value = 0
  phase.value = 'typing'
  schedule(TYPE_SPEED)
}

function startTypewriter(): void {
  stopTypewriter()
  activeLine.value = buildLine()
  typedLength.value = 0
  phase.value = 'typing'
  schedule(TYPE_SPEED)
}

function stopTypewriter(): void {
  if (typeTimer) {
    clearTimeout(typeTimer)
    typeTimer = null
  }
}

function next(): void {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

function prev(): void {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}

function goTo(index: number): void {
  currentIndex.value = index
}

function startAutoPlay(): void {
  stopAutoPlay()
  slideTimer = setInterval(() => {
    if (!paused.value && !hovering.value) next()
  }, 5000)
}

function handleVisibilityChange(): void {
  if (document.hidden) {
    stopAutoPlay()
  } else if (!paused.value) {
    startAutoPlay()
  }
}

function stopAutoPlay(): void {
  if (slideTimer) {
    clearInterval(slideTimer)
    slideTimer = null
  }
}

function togglePause(): void {
  paused.value = !paused.value
  if (paused.value) stopAutoPlay()
  else startAutoPlay()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion.value) {
    paused.value = true
    const line = buildLine()
    activeLine.value = line
    typedLength.value = line.fullText.length
    phase.value = 'holding'
    return
  }

  startAutoPlay()
  startTypewriter()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopAutoPlay()
  stopTypewriter()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
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
  color: #ffffff;
}

.glitch-before,
.glitch-after {
  position: absolute;
  top: -5%;
  left: 0;
  width: 100%;
  height: 130%;
  overflow: hidden;
  will-change: transform;
}

.glitch-before {
  color: var(--color-secondary);
  text-shadow: 1px 0 0 var(--color-secondary);
  z-index: 20;
  animation: glitch-anim-1 0.95s infinite step-end;
}

.glitch-after {
  color: var(--color-primary);
  text-shadow: -1px 0 0 var(--color-primary);
  z-index: 30;
  mix-blend-mode: lighten;
  animation: glitch-anim-2 1.1s infinite step-end 0.2s;
}

.glitch-line {
  position: absolute;
  left: -3px;
  width: calc(100% + 6px);
  height: 1px;
  background: var(--color-border-solid);
  z-index: 50;
  will-change: transform, opacity;
  animation: glitch-line 3s steps(1) infinite;
}

@keyframes glitch-anim-1 {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-3.5px, -1.5px); }
  20% { transform: translate(-0.5px, 1.5px); }
  30% { transform: translate(2px, 0); }
  40% { transform: translate(-2.5px, -1px); }
  50% { transform: translate(0.5px, 0); }
  60% { transform: translate(-4px, 4px); }
  70% { transform: translate(0.3px, -2.5px); }
  80% { transform: translate(-3px, -1px); }
  90% { transform: translate(3px, 0); }
  100% { transform: translate(-3px, 0); }
}

@keyframes glitch-anim-2 {
  0% { transform: translate(-1px, 0); }
  10% { transform: translate(3px, 1.5px); }
  20% { transform: translate(-0.5px, -1.5px); }
  30% { transform: translate(3px, 0.5px); }
  40% { transform: translate(-2px, -2px); }
  50% { transform: translate(1px, 0.3px); }
  60% { transform: translate(3.5px, -3px); }
  70% { transform: translate(-2px, 2px); }
  80% { transform: translate(2.5px, -0.5px); }
  90% { transform: translate(-2.5px, 2.5px); }
  100% { transform: translate(2px, -0.5px); }
}

@keyframes glitch-line {
  0% { transform: translateY(-2px); opacity: 0; }
  2% { transform: translateY(15px); opacity: 1; }
  4% { transform: translateY(42px); opacity: 0; }
  6% { transform: translateY(5px); opacity: 1; }
  8% { transform: translateY(35px); opacity: 0; }
  12% { transform: translateY(8px); opacity: 1; }
  14% { transform: translateY(45px); opacity: 0; }
  18% { transform: translateY(2px); opacity: 1; }
  20% { transform: translateY(38px); opacity: 0; }
  25% { transform: translateY(28px); opacity: 1; }
  27% { transform: translateY(10px); opacity: 0; }
  30% { transform: translateY(40px); opacity: 1; }
  32% { transform: translateY(3px); opacity: 0; }
  38% { transform: translateY(33px); opacity: 1; }
  40% { transform: translateY(7px); opacity: 0; }
  45% { transform: translateY(25px); opacity: 1; }
  47% { transform: translateY(44px); opacity: 0; }
  52% { transform: translateY(1px); opacity: 1; }
  54% { transform: translateY(36px); opacity: 0; }
  60% { transform: translateY(12px); opacity: 1; }
  62% { transform: translateY(42px); opacity: 0; }
  68% { transform: translateY(6px); opacity: 1; }
  70% { transform: translateY(30px); opacity: 0; }
  75% { transform: translateY(20px); opacity: 1; }
  77% { transform: translateY(46px); opacity: 0; }
  82% { transform: translateY(3px); opacity: 1; }
  84% { transform: translateY(35px); opacity: 0; }
  90% { transform: translateY(14px); opacity: 1; }
  92% { transform: translateY(40px); opacity: 0; }
  99% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(-2px); opacity: 0; }
}

.typewriter-cursor {
  color: var(--color-primary);
  font-weight: 300;
  margin-left: 2px;
  opacity: 1;
}

.cursor-blink {
  animation: cursor-blink 0.8s step-end infinite;
}

@keyframes cursor-blink {
  0%,
  100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .glitch-before,
  .glitch-after,
  .glitch-line,
  .cursor-blink {
    animation: none;
  }
}
</style>
