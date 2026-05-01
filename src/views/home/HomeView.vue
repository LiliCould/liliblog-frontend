<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroRef" @mousemove="handleHeroMouseMove">
      <div class="hero-background"></div>
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
                <ArticleCard v-for="(article, index) in articleStore.publicList" :key="article.id"
                  :article="article" :style="{ animationDelay: `${index * 0.08}s` }" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { default as anime } from 'animejs'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/common/ArticleCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)
const showBackToTop = ref(false)

const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const scrollIndicatorRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const backIconRef = ref<HTMLElement | null>(null)

const titleText = '立里博客'
const titleChars = computed(() => titleText.split(''))

onMounted(async () => {
  await loadArticles()
  initHeroAnimation()
  initScrollListener()
})

function handleHeroMouseMove(e: MouseEvent) {
  if (!heroRef.value) return
  
  const rect = heroRef.value.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
  
  heroRef.value.style.backgroundPosition = `${50 + x}% ${50 + y}%`
}

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
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #c45d35 80%, #d4915a 100%);
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
  opacity: 0;
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                       radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
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
}
</style>
