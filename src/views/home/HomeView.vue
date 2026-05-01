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
                  <button class="btn-load-more clickable" :class="{ loading: articleStore.loading }"
                    @click="handleLoadMore" :disabled="articleStore.loading" @click.capture="createRipple">
                    <svg v-if="!articleStore.loading" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <svg v-else class="spinner" viewBox="0 0 24 24" fill="none">
                      <circle class="spinner-track" cx="12" cy="12" r="10"></circle>
                      <circle class="spinner-head" cx="12" cy="12" r="10"></circle>
                    </svg>
                    <span>{{ articleStore.loading ? '正在加载' : '加载更多' }}</span>
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

const videoRef = ref<HTMLVideoElement | null>(null)
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
  const tl = createTimeline({
    ease: 'outExpo'
  })

  tl
    .add('.hero-carousel-layer', {
      opacity: [0, 1],
      duration: 500,
      ease: 'linear'
    })
    .add('.title-char', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(40),
      ease: 'outCubic'
    }, '-=200')
    .add(subtitleRef.value, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      ease: 'outCubic'
    }, '-=400')
    .add(dividerRef.value, {
      scaleX: [0, 1],
      duration: 600,
      ease: 'outCubic'
    }, '-=300')
    .add(scrollIndicatorRef.value, {
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
  gap: 10px;
  padding: 16px 48px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.5px;
  color: white;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(196, 93, 53, 0.25);
}

.btn-load-more::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-hover), #d4915a);
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.btn-load-more:hover:not(:disabled) {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(196, 93, 53, 0.4);
}

.btn-load-more:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-load-more:active:not(:disabled) {
  transform: translateY(-3px) scale(0.98);
  transition-duration: 0.15s;
}

.btn-load-more:disabled {
  cursor: not-allowed;
  animation: pulse-loading 2s ease-in-out infinite;
}

@keyframes pulse-loading {

  0%,
  100% {
    box-shadow: 0 4px 20px rgba(196, 93, 53, 0.25);
  }

  50% {
    box-shadow: 0 8px 30px rgba(196, 93, 53, 0.35);
  }
}

.btn-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-load-more:hover .btn-icon {
  transform: translateY(3px);
}

/* Spinner Animation */
.spinner {
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

.spinner-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 2;
}

.spinner-head {
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 50;
  stroke-dashoffset: 40;
  transform-origin: center;
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinner-rotate {
  0% {
    stroke-dashoffset: 40;
  }

  50% {
    stroke-dashoffset: 15;
  }

  100% {
    stroke-dashoffset: 40;
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
