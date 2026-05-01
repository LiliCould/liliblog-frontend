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
        <h1 class="hero-title" ref="titleRef">
          <span v-for="(char, index) in titleChars" :key="index" class="title-char">{{ char }}</span>
        </h1>
        <p class="hero-subtitle" ref="subtitleRef">技术与生活的分享空间</p>
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
        <button v-for="(image, index) in heroImages" :key="index"
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
                  <button class="btn-load-more clickable" :class="{ loading: articleStore.loading }"
                    @click="handleLoadMore" :disabled="articleStore.loading" @click.capture="createRipple">
                    <svg v-if="!articleStore.loading" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span>{{ articleStore.loading ? '加载中...' : '加载更多' }}</span>
                  </button>
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
import { default as anime } from 'animejs'
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

const videoRef = ref<HTMLVideoElement | null>(null)
const video = useHeroVideo(videoConfig)

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

const titleText = '立里博客'
const titleChars = computed(() => titleText.split(''))

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

function initHeroAnimation() {
  const tl = anime.timeline({
    easing: 'easeOutExpo'
  })

  tl.add({
    targets: '.hero-background',
    opacity: [0, 1],
    duration: 500,
    easing: 'linear'
  })
    .add({
      targets: '.title-char',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(40),
      easing: 'easeOutCubic'
    }, '-=200')
    .add({
      targets: subtitleRef.value,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutCubic'
    }, '-=400')
    .add({
      targets: dividerRef.value,
      scaleX: [0, 1],
      duration: 600,
      easing: 'easeOutCubic'
    }, '-=300')
    .add({
      targets: scrollIndicatorRef.value,
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutCubic',
      complete: () => {
        if (scrollIndicatorRef.value) {
          anime({
            targets: scrollIndicatorRef.value,
            translateY: [0, 10],
            direction: 'alternate',
            loop: true,
            duration: 1000,
            easing: 'easeInOutSine'
          })
        }
      }
    }, '-=200')
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
    anime({
      targets: backIconRef.value,
      translateY: [0, -10, 0],
      duration: 400,
      easing: 'easeOutCubic'
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

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.15em;
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
  gap: 0.1em;
}

.title-char {
  display: inline-block;
  opacity: 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: var(--spacing-xl);
  opacity: 0;
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

.btn-load-more {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 40px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: white;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.btn-load-more::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-hover), var(--color-accent));
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.btn-load-more:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 93, 53, 0.35);
}

.btn-load-more:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-load-more:active:not(:disabled) {
  transform: translateY(-2px);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-load-more:hover .btn-icon {
  transform: translateY(2px);
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

/* List Transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
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

  .hero-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .hero-subtitle {
    font-size: 1rem;
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
