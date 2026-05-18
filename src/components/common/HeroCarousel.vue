<template>
  <section class="relative w-full overflow-hidden" :class="heightClass">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-all duration-1000 ease-in-out"
      :class="[
        index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      ]"
    >
      <img
        :src="slide.src"
        :alt="slide.alt"
        class="w-full h-full object-cover"
        loading="lazy"
        :fetchpriority="index === 0 ? 'high' : 'low'"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,15,0.3)] via-[rgba(10,10,15,0.5)] to-[rgba(10,10,15,0.85)]"></div>
    </div>

    <div class="absolute inset-0 pointer-events-none" style="background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,240,255,0.015) 2px,rgba(0,240,255,0.015) 4px)"></div>

    <div class="relative z-10 flex flex-col items-center justify-center h-full gap-6 text-center px-4">
      <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-wider" style="text-shadow:0 0 20px rgba(0,240,255,0.4),0 0 40px rgba(0,240,255,0.15)">
        立里博客
      </h1>
      <p class="text-base sm:text-lg md:text-xl text-[#6b7280] tracking-wide">
        <span class="text-[#00f0ff]">&lt;</span>
        技术与生活的分享空间
        <span class="text-[#00f0ff]">/&gt;</span>
      </p>
      <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>

      <SearchBar placeholder="搜索文章..." @search="handleSearch" />
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
      <button
        v-for="(_, index) in slides"
        :key="index"
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 border"
        :class="[
          index === currentIndex
            ? 'bg-[#00f0ff] border-[#00f0ff] w-8 shadow-[0_0_8px_rgba(0,240,255,0.5)]'
            : 'bg-transparent border-[rgba(0,240,255,0.4)] hover:border-[#00f0ff] hover:bg-[rgba(0,240,255,0.3)]'
        ]"
        @click="goTo(index)"
      ></button>
    </div>

    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.5)] hover:[box-shadow:0_0_12px_rgba(0,240,255,0.3)]"
      @click="prev"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.5)] hover:[box-shadow:0_0_12px_rgba(0,240,255,0.3)]"
      @click="next"
    >
      <ChevronRight class="w-5 h-5" />
    </button>

    <div class="absolute bottom-8 right-4 z-20">
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(20,20,35,0.6)] border border-[rgba(0,240,255,0.2)] text-[#00f0ff] transition-all duration-200 hover:bg-[rgba(0,240,255,0.15)]"
        @click="togglePause"
      >
        <Pause v-if="!paused" class="w-3.5 h-3.5" />
        <Play v-else class="w-3.5 h-3.5" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'
import SearchBar from '@/components/common/SearchBar.vue'

import hero1 from '@/assets/heros/hero-1.png'
import hero2 from '@/assets/heros/hero-2.png'
import hero3 from '@/assets/heros/hero-3.png'
import hero4 from '@/assets/heros/hero-4.jpg'

const router = useRouter()

const slides = [
  { src: hero1, alt: 'Hero 1' },
  { src: hero2, alt: 'Hero 2' },
  { src: hero3, alt: 'Hero 3' },
  { src: hero4, alt: 'Hero 4' },
]

const currentIndex = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const heightClass = computed(() => 'h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh]')

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
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 5000)
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function handleSearch(keyword: string) {
  router.push({ path: '/search', query: { q: keyword } })
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>