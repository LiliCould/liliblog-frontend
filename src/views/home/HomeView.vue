<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroRef" @mousemove="handleHeroMouseMove" @mouseenter="handleHeroMouseEnter"
      @mouseleave="handleHeroMouseLeave">
      <!-- 第0层：视频背景层 (z-index: -1) - 可选 -->
      <video v-if="useVideo" class="hero-video" :src="videoConfig.src" :poster="videoConfig.poster"
        :muted="videoConfig.muted" :loop="videoConfig.loop" :autoplay="videoConfig.autoplay"
        :playsinline="videoConfig.playsInline" preload="auto" ref="videoRef"></video>

      <!-- 第一层：图片轮播层 (z-index: 0) -->
      <div class="hero-carousel-layer">
        <div v-for="(image, index) in heroImages" :key="index" :class="['hero-image', `hero-image-${index}`]"
          :style="{ backgroundImage: `url(${image})` }"></div>
      </div>

      <!-- 第二层：暗色遮罩 (z-index: 1) -->
      <div class="hero-dark-overlay"></div>

      <!-- 第三层：全局暗角 vignette (z-index: 2) -->
      <div class="hero-vignette"></div>

      <!-- 第四层：鼠标渐变跟随层 (z-index: 3) -->
      <div class="mouse-gradient-overlay" v-show="!isMobile"></div>

      <!-- 第五层：内容层 (z-index: 4) -->
      <div class="hero-content">
        <!-- 替换原有 h1：Glitch 故障闪烁字 -->
        <h1 class="glitch-title" ref="titleRef">
          <span v-for="(char, i) in titleChars" :key="i" :class="['glitch-char', { 'space-char': char === ' ' }]"
            :data-char="char" :style="{ animationDelay: `${i * 0.05}s` }">
            {{ char === ' ' ? '\u00A0' : char }}
          </span>
        </h1>
        <!-- 替换原有 p：赛博朋克打字机效果 -->
        <p class="cyber-subtitle" ref="subtitleRef">
          <span class="tag">&lt;</span>
          <span class="typing-text">{{ displayedSubtitle }}</span>
          <span class="cursor" :class="{ 'cursor-blink': typingDone }">_</span>
          <span class="tag">/&gt;</span>
        </p>
        <div class="hero-divider" ref="dividerRef"></div>
        <div class="scroll-indicator" ref="scrollIndicatorRef" @click="scrollToContent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <!-- 轮播指示器 -->
      <div class="carousel-indicators">
        <button v-for="(_image, index) in heroImages" :key="index"
          :class="['carousel-dot', { active: currentIndex === index }]" @click="carousel.goTo(index)"
          :aria-label="`切换到第 ${index + 1} 张图片`"></button>
      </div>

      <!-- 移动端进度条 -->
      <div class="carousel-progress" v-show="isMobile">
        <div class="progress-bar" :style="{ width: `${((currentIndex + 1) / heroImages.length) * 100}%` }"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section page-container" ref="contentRef">
      <div class="home-layout">
        <main class="home-main">
          <div class="article-list">
            <template v-if="articleStore.loading && articleStore.publicList.length === 0">
              <div v-for="i in 3" :key="i" class="skeleton-card">
                <el-skeleton :rows="4" animated />
              </div>
            </template>

            <template v-else-if="articleStore.publicList.length > 0">
              <transition-group name="list" tag="div" class="articles-grid">
                <ArticleCard v-for="(article, index) in articleStore.publicList" :key="article.id" :article="article"
                  :style="{ animationDelay: `${index * 0.08}s` }" />
              </transition-group>

              <div class="load-more-section">
                <template v-if="hasMore">
                  <!-- 替换原有 .btn-load-more：赛博朋克数据流加载按钮 -->
                  <button class="cyber-load-btn clickable" :class="{ 'is-loading': articleStore.loading }"
                    @click="handleLoadMore" :disabled="articleStore.loading" @click.capture="createRipple">
                    <span class="btn-text" v-if="!articleStore.loading">
                      加载更多
                      <span class="btn-arrow">↓</span>
                    </span>

                    <span class="btn-loading" v-else>
                      <span class="loading-track">
                        <span class="loading-bar"></span>
                      </span>
                      <span class="loading-text">LOADING</span>
                    </span>
                  </button>

                  <!-- 新文章加载骨架屏 -->
                  <div v-if="articleStore.loading && articleStore.publicList.length > 0" class="loading-skeletons">
                    <div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton-card-animated">
                      <div class="skeleton-shimmer">
                        <div class="skeleton-line title-line"></div>
                        <div class="skeleton-line text-line"></div>
                        <div class="skeleton-line text-line short"></div>
                        <div class="skeleton-meta">
                          <div class="skeleton-circle"></div>
                          <div class="skeleton-line meta-line"></div>
                          <div class="skeleton-circle"></div>
                          <div class="skeleton-line meta-line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <div v-else class="no-more-indicator">
                  <div class="divider-line"></div>
                  <span class="end-text">已经到底啦</span>
                  <div class="divider-line"></div>
                </div>
              </div>
            </template>

            <template v-else>
              <EmptyState text="暂无文章" />
            </template>
          </div>
        </main>

        <AppSidebar />
      </div>
    </section>

    <!-- Back to Top Button -->
    <transition name="fade">
      <button v-show="showBackToTop" class="back-to-top clickable" @click="scrollToTop" aria-label="回到顶部">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="back-icon" ref="backIconRef">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue'
import { animate, createTimeline, stagger } from 'animejs'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/common/ArticleCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useHeroCarousel } from '@/composables/useHeroCarousel'
import { useHeroVideo } from '@/composables/useHeroVideo'

const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)
const showBackToTop = ref(false)
const isMobile = ref(false)

const cursorState = inject<{ isHovering: ReturnType<typeof ref>; isText: ReturnType<typeof ref> }>('cursorState', {
  isHovering: ref(false),
  isText: ref(false)
})

// ========== 视频背景配置 ==========
// 设置 useVideo = true 启用视频背景，false 使用图片轮播
const useVideo = false

const videoConfig = {
  src: '/videos/hero-bg.mp4',      // 视频文件路径
  poster: '/images/hero-1.jpg',    // 视频封面图（视频加载前显示）
  muted: true,                     // 静音（必须为 true 才能自动播放）
  loop: true,                      // 循环播放
  autoplay: true,                  // 自动播放
  playsInline: true                // 内联播放（iOS 兼容）
}

useHeroVideo(videoConfig) // 初始化视频控制

// ========== 图片轮播配置 ==========
const heroImages = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
  '/images/hero-4.jpg'
]

const carousel = useHeroCarousel(heroImages, useVideo ? 0 : 6000) // 如果使用视频，禁用图片轮播
const currentIndex = carousel.currentIndex

const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const scrollIndicatorRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const backIconRef = ref<HTMLElement | null>(null)

let rafId: number

// 替换原有标题文字
const titleText = "LiliCould's Blog"
const titleChars = computed(() => titleText.split(''))

// 新增：打字机效果相关变量
const fullSubtitle = '技术与生活的分享空间'
const displayedSubtitle = ref('')
const typingDone = ref(false)

onMounted(async () => {
  await loadArticles()
  checkMobile()
  initHeroAnimation()
  initScrollListener()
  preloadImages()
})

function checkMobile() {
  isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
}

function preloadImages() {
  heroImages.forEach(src => {
    const img = new Image()
    img.src = src
  })
}

function handleHeroMouseMove(e: MouseEvent) {
  if (!heroRef.value || isMobile.value) return

  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    const rect = heroRef.value!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    heroRef.value!.style.setProperty('--mouse-x', `${x}px`)
    heroRef.value!.style.setProperty('--mouse-y', `${y}px`)
  })
}

function handleHeroMouseEnter() {
  carousel.pause()
  if (heroRef.value) {
    heroRef.value.style.setProperty('--gradient-opacity', '1')
  }
}

function handleHeroMouseLeave() {
  carousel.resume()
  if (heroRef.value) {
    heroRef.value.style.setProperty('--gradient-opacity', '0')
  }
}

watch([() => cursorState.isHovering.value, () => cursorState.isText.value], ([hovering, isText]) => {
  if (!heroRef.value || isMobile.value) return

  if (isText) {
    heroRef.value.style.setProperty('--hero-gradient-radius', '150px')
    heroRef.value.style.setProperty('--hero-gradient-color-1', 'rgba(196, 93, 53, 0.25)')
    heroRef.value.style.setProperty('--hero-gradient-color-2', 'rgba(212, 145, 90, 0.15)')
  } else if (hovering) {
    heroRef.value.style.setProperty('--hero-gradient-radius', '500px')
    heroRef.value.style.setProperty('--hero-gradient-color-1', 'rgba(102, 126, 234, 0.35)')
    heroRef.value.style.setProperty('--hero-gradient-color-2', 'rgba(118, 75, 162, 0.25)')
  } else {
    heroRef.value.style.setProperty('--hero-gradient-radius', '400px')
    heroRef.value.style.setProperty('--hero-gradient-color-1', 'rgba(102, 126, 234, 0.25)')
    heroRef.value.style.setProperty('--hero-gradient-color-2', 'rgba(118, 75, 162, 0.15)')
  }
})

// 新增：打字机效果函数
function startTyping() {
  // 修复：显示副标题容器
  if (subtitleRef.value) {
    subtitleRef.value.style.opacity = '1'
  }

  let i = 0
  const interval = setInterval(() => {
    if (i <= fullSubtitle.length) {
      displayedSubtitle.value = fullSubtitle.slice(0, i)
      i++
    } else {
      clearInterval(interval)
      typingDone.value = true
    }
  }, 100)
}

function initHeroAnimation() {
  const tl = createTimeline({})

  tl
    .add('.hero-carousel-layer', {
      opacity: [0, 1],
      duration: 500,
      ease: 'linear'
    })
    // 替换原有标题动画：使用 glitch-char 类
    .add('.glitch-char', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(40),
      ease: 'outCubic'
    }, '-=200')
    // 替换原有副标题动画：改为打字机效果
    .add({
      duration: 100,
      onComplete: () => startTyping()
    }, '-=400')
    .add(dividerRef.value!, {
      scaleX: [0, 1],
      duration: 600,
      ease: 'outCubic'
    }, '-=300')
    .add(scrollIndicatorRef.value!, {
      opacity: [0, 1],
      duration: 400,
      ease: 'outCubic',
      onComplete: () => {
        if (scrollIndicatorRef.value) {
          animate(scrollIndicatorRef.value, {
            translateY: [0, 10],
            alternate: true,
            loop: true,
            duration: 1000,
            ease: 'inOutSine'
          })
        }
      }
    }, '-=200')
    // 新增：anime.js 霓虹呼吸效果
    .add({
      duration: 100,
      onComplete: () => {
        animate('.glitch-title', {
          textShadow: [
            '0 0 10px rgba(0,240,255,0.3), 0 0 20px rgba(0,240,255,0.1)',
            '0 0 15px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.3), 0 0 45px rgba(0,240,255,0.1)',
            '0 0 10px rgba(0,240,255,0.3), 0 0 20px rgba(0,240,255,0.1)',
          ],
          duration: 4000,
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutSine',
        })
      }
    })
}

function initScrollListener() {
  window.addEventListener('scroll', handleScroll)
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 500
}

async function loadArticles() {
  const data = await articleStore.fetchPublicArticles(currentPage.value, pageSize)
  if (!data || data.length < pageSize) {
    hasMore.value = false
  }
}

async function loadMore() {
  currentPage.value++
  const data = await articleStore.fetchPublicArticles(currentPage.value, pageSize, true)
  if (!data || data.length < pageSize) {
    hasMore.value = false
  }
}

function handleLoadMore(e: MouseEvent) {
  createRipple(e)
  loadMore()
}

function createRipple(e: MouseEvent) {
  const button = e.currentTarget as HTMLElement
  if (!button) return

  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('ripple')

  button.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

function scrollToContent() {
  contentRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  if (backIconRef.value) {
    animate(backIconRef.value, {
      translateY: [0, -10, 0],
      duration: 400,
      ease: 'outCubic'
    })
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --mouse-x: 50%;
  --mouse-y: 50%;
  --gradient-opacity: 0;
}

/* 第0层：视频背景层 (z-index: -1) - 可选 */
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  will-change: transform;
}

/* 第一层：图片轮播层 (z-index: 0) */
.hero-carousel-layer {
  position: absolute;
  inset: 0;
  z-index: var(--z-hero-images);
}

.hero-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  will-change: opacity, transform;
  transform: scale(1);
}

.hero-image:first-child {
  opacity: 1;
}

/* 第二层：暗色遮罩 (z-index: 1) */
.hero-dark-overlay {
  position: absolute;
  inset: 0;
  background: var(--hero-overlay-darkness);
  z-index: var(--z-hero-overlay);
  pointer-events: none;
}

/* 第三层：全局暗角 vignette (z-index: 2) */
.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, var(--hero-vignette-darkness) 100%);
  z-index: var(--z-hero-vignette);
  pointer-events: none;
}

/* 第四层：鼠标渐变跟随层 (z-index: 3) */
.mouse-gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle var(--hero-gradient-radius) at var(--mouse-x) var(--mouse-y),
      var(--hero-gradient-color-1) 0%,
      var(--hero-gradient-color-2) 40%,
      transparent 70%);
  z-index: var(--z-hero-gradient);
  pointer-events: none;
  opacity: var(--gradient-opacity);
  transition: opacity 0.5s ease-out, background 0.3s ease-out;
}

.hero-content {
  position: relative;
  z-index: var(--z-hero-content);
  text-align: center;
  color: white;
}

/* 替换原有 .hero-title：Glitch 故障闪烁字样式 */
.glitch-title {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #e2e8f0;
  position: relative;
  text-transform: uppercase;
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
  gap: 0.05em;
}

.glitch-char {
  position: relative;
  display: inline-block;
  opacity: 0;
}

/* 空格字符特殊样式 - 增加可见宽度 */
.space-char {
  width: 0.6em;
  display: inline-block;
}

/* 青色重影层 */
.glitch-char::before {
  content: attr(data-char);
  position: absolute;
  left: -2px;
  top: 0;
  color: #00f0ff;
  opacity: 0.8;
  clip: rect(0, 900px, 0, 0);
  animation: glitch-1 2.5s infinite linear alternate-reverse;
}

/* 玫红重影层 */
.glitch-char::after {
  content: attr(data-char);
  position: absolute;
  left: 2px;
  top: 0;
  color: #ff003c;
  opacity: 0.8;
  clip: rect(0, 900px, 0, 0);
  animation: glitch-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0% {
    clip: rect(20px, 9999px, 15px, 0);
    transform: skew(0.5deg);
  }

  10% {
    clip: rect(80px, 9999px, 70px, 0);
    transform: skew(-0.5deg);
  }

  20% {
    clip: rect(10px, 9999px, 50px, 0);
    transform: skew(0.3deg);
  }

  30% {
    clip: rect(90px, 9999px, 100px, 0);
    transform: skew(-0.8deg);
  }

  40% {
    clip: rect(30px, 9999px, 20px, 0);
    transform: skew(0.2deg);
  }

  50% {
    clip: rect(70px, 9999px, 60px, 0);
    transform: skew(-0.3deg);
  }

  60% {
    clip: rect(15px, 9999px, 80px, 0);
    transform: skew(0.6deg);
  }

  70% {
    clip: rect(60px, 9999px, 40px, 0);
    transform: skew(-0.4deg);
  }

  80% {
    clip: rect(25px, 9999px, 90px, 0);
    transform: skew(0.7deg);
  }

  90% {
    clip: rect(85px, 9999px, 10px, 0);
    transform: skew(-0.6deg);
  }

  100% {
    clip: rect(40px, 9999px, 55px, 0);
    transform: skew(0.4deg);
  }
}

@keyframes glitch-2 {
  0% {
    clip: rect(65px, 9999px, 100px, 0);
    transform: skew(-0.4deg);
  }

  10% {
    clip: rect(10px, 9999px, 30px, 0);
    transform: skew(0.6deg);
  }

  20% {
    clip: rect(90px, 9999px, 20px, 0);
    transform: skew(-0.7deg);
  }

  30% {
    clip: rect(25px, 9999px, 60px, 0);
    transform: skew(0.5deg);
  }

  40% {
    clip: rect(70px, 9999px, 90px, 0);
    transform: skew(-0.3deg);
  }

  50% {
    clip: rect(15px, 9999px, 40px, 0);
    transform: skew(0.8deg);
  }

  60% {
    clip: rect(80px, 9999px, 10px, 0);
    transform: skew(-0.5deg);
  }

  70% {
    clip: rect(35px, 9999px, 75px, 0);
    transform: skew(0.4deg);
  }

  80% {
    clip: rect(55px, 9999px, 25px, 0);
    transform: skew(-0.6deg);
  }

  90% {
    clip: rect(5px, 9999px, 85px, 0);
    transform: skew(0.7deg);
  }

  100% {
    clip: rect(45px, 9999px, 50px, 0);
    transform: skew(-0.4deg);
  }
}

/* 替换原有 .hero-subtitle：赛博朋克打字机效果 */
.cyber-subtitle {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #94a3b8;
  margin-top: 1rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0;
}

.cyber-subtitle .tag {
  color: #00f0ff;
  opacity: 0.7;
}

.cyber-subtitle .cursor {
  color: #00f0ff;
  opacity: 1;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.hero-divider {
  width: 80px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  margin: 0 auto var(--spacing-3xl);
  transform: scaleX(0);
}

.scroll-indicator {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.scroll-indicator:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.scroll-indicator svg {
  width: 24px;
  height: 24px;
  color: white;
}

/* Content Section */
.content-section {
  padding-top: var(--spacing-3xl);
  padding-bottom: var(--spacing-3xl);
  min-height: 100vh;
  background: var(--color-bg);
  transition: background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-layout {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.home-main {
  flex: 1;
  min-width: 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.skeleton-card {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-radius: 16px;
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.load-more-section {
  margin-top: var(--spacing-xl);
  text-align: center;
}

/* 替换原有 .btn-load-more：赛博朋克数据流加载按钮 */
.cyber-load-btn {
  position: relative;
  padding: 12px 48px;
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.6);
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  /* 微弱呼吸光效 */
  animation: border-breathe 3s ease-in-out infinite;
}

@keyframes border-breathe {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.2);
  }

  50% {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
  }
}

/* 边框流光效果 */
.cyber-load-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(0, 240, 255, 0.2),
      transparent);
  transition: left 0.5s ease;
  z-index: -1;
}

.cyber-load-btn:hover:not(:disabled)::before {
  left: 100%;
}

.cyber-load-btn:hover:not(:disabled) {
  color: #ffffff;
  border-color: #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(0, 240, 255, 0.1);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.cyber-load-btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* 禁用状态 */
.cyber-load-btn:disabled {
  border-color: rgba(148, 163, 184, 0.3);
  color: #475569;
  cursor: not-allowed;
  animation: none;
}

/* 按钮文字和箭头 */
.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.cyber-load-btn:hover .btn-arrow {
  transform: translateY(3px);
}

/* 加载中状态容器 */
.btn-loading {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 数据流动画轨道 */
.loading-track {
  position: relative;
  width: 80px;
  height: 2px;
  background: rgba(0, 240, 255, 0.2);
  overflow: hidden;
}

/* 数据流动画条 */
.loading-bar {
  position: absolute;
  left: -30%;
  width: 30%;
  height: 100%;
  background: #00f0ff;
  box-shadow: 0 0 10px #00f0ff;
  animation: data-stream 1.2s ease-in-out infinite;
}

@keyframes data-stream {
  0% {
    left: -30%;
  }

  50% {
    left: 100%;
  }

  100% {
    left: 100%;
  }
}

/* 加载文字 */
.loading-text {
  font-size: 0.75rem;
  color: #00f0ff;
  letter-spacing: 0.2em;
}

/* 加载状态脉冲反馈 */
.cyber-load-btn.is-loading {
  animation: loading-pulse 0.5s ease;
}

@keyframes loading-pulse {
  0% {
    border-color: rgba(0, 240, 255, 0.6);
  }

  50% {
    border-color: rgba(0, 240, 255, 1);
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.6);
  }

  100% {
    border-color: rgba(0, 240, 255, 0.6);
  }
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple-effect 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.no-more-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-border), transparent);
}

.end-text {
  font-size: var(--font-size-sm);
  color: var(--color-muted-light);
  white-space: nowrap;
  letter-spacing: 1px;
}

/* List Transition - 优化版 */
.list-enter-active {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}

.list-move {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading Skeletons - Shimmer Effect */
.loading-skeletons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  animation: fade-in-down 0.5s ease-out;
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-card-animated {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-radius: 16px;
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.skeleton-shimmer {
  position: relative;
  width: 100%;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%);
  animation: shimmer 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg,
      var(--color-border) 25%,
      rgba(200, 195, 188, 0.3) 50%,
      var(--color-border) 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  margin-bottom: 12px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.title-line {
  width: 70%;
  height: 24px;
  margin-bottom: 16px;
}

.text-line {
  width: 100%;
}

.text-line.short {
  width: 60%;
}

.meta-line {
  width: 80px;
  height: 14px;
  margin-bottom: 0;
}

.skeleton-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.skeleton-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(90deg,
      var(--color-border) 25%,
      rgba(200, 195, 188, 0.3) 50%,
      var(--color-border) 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(196, 93, 53, 0.3);
  cursor: pointer;
  z-index: var(--z-sticky);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(196, 93, 53, 0.4);
}

.back-icon {
  width: 24px;
  height: 24px;
}

/* Carousel Indicators */
.carousel-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: var(--z-hero-content);
}

.carousel-dot {
  width: var(--carousel-dot-size);
  height: var(--carousel-dot-height);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  outline: none;
}

.carousel-dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

.carousel-dot.active {
  width: var(--carousel-dot-active-width);
  background: white;
}

/* Mobile Progress Bar */
.carousel-progress {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  z-index: var(--z-hero-content);
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 1024px) {
  .home-layout {
    flex-direction: column;
  }

  .app-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content-section {
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);
  }

  .glitch-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .cyber-subtitle {
    font-size: 0.95rem;
  }

  .article-list {
    gap: var(--spacing-md);
  }

  .back-to-top {
    bottom: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
  }

  .carousel-indicators {
    display: none;
  }

  /* 移动端视频优化 */
  .hero-video {
    object-position: center center;
  }
}
</style>
