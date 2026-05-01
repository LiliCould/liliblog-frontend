<template>
  <div class="home-page page-container">
    <div class="home-layout">
      <main class="home-main">
        <div class="page-header">
          <h1 class="page-title">
            <span class="title-icon">✦</span>
            最新文章
          </h1>
          <p class="page-subtitle">探索技术，分享知识</p>
        </div>

        <div class="article-list">
          <template v-if="articleStore.loading && articleStore.publicList.length === 0">
            <div v-for="i in 3" :key="i" class="skeleton-card">
              <el-skeleton :rows="4" animated />
            </div>
          </template>

          <template v-else-if="articleStore.publicList.length > 0">
            <transition-group name="list" tag="div" class="articles-grid">
              <ArticleCard v-for="(article, index) in articleStore.publicList" :key="article.id" :article="article"
                :style="{ animationDelay: `${index * 0.1}s` }" />
            </transition-group>

            <div class="load-more-section">
              <template v-if="hasMore">
                <button class="btn-load-more" :class="{ loading: articleStore.loading }" @click="loadMore"
                  :disabled="articleStore.loading">
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
            <EmptyState text="暂无文章" icon="📝" />
          </template>
        </div>
      </main>

      <AppSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import ArticleCard from '@/components/common/ArticleCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const articleStore = useArticleStore()
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)

onMounted(async () => {
  await loadArticles()
})

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
</script>

<style scoped>
.home-page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);
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

.page-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-border);
  position: relative;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-title);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--spacing-xs);
}

.title-icon {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  animation: sparkle 3s ease-in-out infinite;
}

@keyframes sparkle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}

.page-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-muted);
  margin-left: calc(var(--font-size-xl) + 12px);
  font-style: italic;
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
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.load-more-section {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 40px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn-load-more::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary-light-2));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
  z-index: -1;
}

.btn-load-more:hover:not(:disabled)::before {
  transform: scaleX(1);
}

.btn-load-more:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.btn-load-more:hover .btn-icon {
  transform: translateY(2px);
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
  transition: all var(--transition-slow);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
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
  .home-page {
    padding-top: var(--spacing-lg);
    padding-bottom: var(--spacing-2xl);
  }

  .page-title {
    font-size: var(--font-size-xl);
  }

  .page-subtitle {
    margin-left: 0;
    display: block;
    margin-top: var(--spacing-xs);
  }

  .article-list {
    gap: var(--spacing-md);
  }
}
</style>
