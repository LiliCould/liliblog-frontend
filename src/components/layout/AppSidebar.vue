<template>
  <aside class="app-sidebar">
    <div v-for="(section, index) in sections" :key="section.id" class="sidebar-section" :class="`section-${section.id}`"
      :ref="(el: Element | ComponentPublicInstance | null) => { if (el) sectionRefs[index] = el as HTMLElement }">
      <div class="gradient-bar"></div>
      <div class="section-header">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path :d="section.iconPath"></path>
        </svg>
        <h3 class="section-title">{{ section.title }}</h3>
      </div>

      <div v-if="section.id === 'category'" class="category-list">
        <router-link v-for="cat in appStore.categories" :key="cat.id" :to="`/category/${cat.id}`"
          class="category-item clickable">
          <span class="category-indicator"></span>
          <span class="category-name">{{ cat.name }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
        <div v-if="appStore.categories.length === 0" class="empty-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>暂无分类</span>
        </div>
      </div>

      <div v-else-if="section.id === 'tag'" class="tag-cloud">
        <TagBadge v-for="(tag, tagIndex) in appStore.tags" :key="tag.id" :tag="tag"
          :style="{ animationDelay: `${tagIndex * 0.05}s` }" />
        <div v-if="appStore.tags.length === 0" class="empty-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>暂无标签</span>
        </div>
      </div>

      <div v-else-if="section.id === 'stats'" class="stats-grid">
        <div class="stat-item clickable">
          <span class="stat-value"
            :ref="(el: Element | ComponentPublicInstance | null) => { if (el) statRefs[0] = el as HTMLElement }">{{
              Math.round(animatedCategoriesCount) }}</span>
          <span class="stat-label">分类</span>
        </div>
        <div class="stat-item clickable">
          <span class="stat-value"
            :ref="(el: Element | ComponentPublicInstance | null) => { if (el) statRefs[1] = el as HTMLElement }">{{
              Math.round(animatedTagsCount) }}</span>
          <span class="stat-label">标签</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { animate } from 'animejs'
import { useAppStore } from '@/stores/app'
import TagBadge from '@/components/common/TagBadge.vue'

const appStore = useAppStore()

const sections = [
  {
    id: 'category',
    title: '分类',
    iconPath: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'
  },
  {
    id: 'tag',
    title: '标签',
    iconPath: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z'
  },
  {
    id: 'stats',
    title: '统计',
    iconPath: 'M18 20V10M12 20V4M6 20v-6'
  }
]

const sectionRefs = ref<HTMLElement[]>([])
const statRefs = ref<HTMLElement[]>([])

const animatedCategoriesCount = ref(0)
const animatedTagsCount = ref(0)

onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target as HTMLElement

        if (section.classList.contains('section-stats')) {
          animateStats()
        }

        animate(section, {
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          ease: 'outCubic'
        })

        observer.unobserve(section)
      }
    })
  }, observerOptions)

  sectionRefs.value.forEach(section => {
    if (section) {
      observer.observe(section)
    }
  })

  setTimeout(() => {
    animateStats()
  }, 500)
})

function animateStats() {
  animate(animatedCategoriesCount, {
    value: [0, appStore.categories.length],
    round: 1,
    duration: 1500,
    ease: 'outExpo'
  })

  animate(animatedTagsCount, {
    value: [0, appStore.tags.length],
    round: 1,
    duration: 1500,
    delay: 200,
    ease: 'outExpo'
  })
}
</script>

<style scoped>
.app-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sidebar-section {
  background: rgba(20, 20, 35, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 240, 255, 0.15);
  padding: var(--spacing-lg);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.sidebar-section::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -100%;
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  animation: flow-light 5s linear infinite;
}

@keyframes flow-light {
  0% { left: -60%; }
  100% { left: 100%; }
}

.gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.sidebar-section:hover .gradient-bar {
  width: 100%;
}

.sidebar-section:hover {
  box-shadow: 0 8px 32px rgba(0, 240, 255, 0.1), 0 0 1px rgba(0, 240, 255, 0.3);
  transform: translateY(-2px);
  border-color: rgba(0, 240, 255, 0.3);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  filter: drop-shadow(0 0 3px rgba(0, 240, 255, 0.3));
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-title);
  margin: 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.category-list::-webkit-scrollbar {
  width: 5px;
}

.category-list::-webkit-scrollbar-track {
  background: transparent;
}

.category-list::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.15);
  border-radius: var(--radius-full);
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.3);
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: var(--color-body);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.category-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.4);
}

.category-item .arrow-icon {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-item:hover {
  color: var(--color-primary);
  background: rgba(0, 240, 255, 0.06);
  transform: translateX(4px);
}

.category-item:hover::before {
  height: 60%;
}

.category-item:hover .category-indicator {
  height: 60%;
}

.category-item:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;
}

.tag-cloud::-webkit-scrollbar {
  width: 5px;
}

.tag-cloud::-webkit-scrollbar-track {
  background: transparent;
}

.tag-cloud::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.15);
  border-radius: var(--radius-full);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-md) var(--spacing-sm);
  background: rgba(0, 240, 255, 0.04);
  border: 1px solid rgba(0, 240, 255, 0.08);
  border-radius: var(--radius-md);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  background: rgba(0, 240, 255, 0.08);
  border-color: rgba(0, 240, 255, 0.2);
  transform: scale(1.05);
  box-shadow: var(--neon-glow-sm);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-display);
  color: var(--color-primary);
  line-height: 1;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-medium);
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl) 0;
  color: var(--color-muted);
  font-size: var(--font-size-sm);
}

.empty-hint svg {
  width: 40px;
  height: 40px;
  opacity: 0.4;
}

@media (max-width: 1024px) {
  .app-sidebar {
    display: none;
  }
}
</style>
