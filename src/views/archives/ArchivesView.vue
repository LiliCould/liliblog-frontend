<template>
  <div class="archives-page page-container">
    <div class="archives-layout">
      <div class="archives-main">
        <div class="archives-card">
          <div class="card-header">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h1 class="header-title">文章归档</h1>
            <span class="article-count">共 {{ totalArticles }} 篇文章</span>
          </div>

          <div v-if="loading && groupedArticles.length === 0" class="loading-state">
            <el-skeleton :rows="8" animated />
          </div>

          <div v-else-if="groupedArticles.length > 0" class="timeline">
            <div v-for="yearData in groupedArticles" :key="yearData.year" class="timeline-year">
              <div class="year-header">
                <span class="year-dot"></span>
                <span class="year-text">{{ yearData.year }}</span>
                <span class="year-count">{{ yearData.count }} 篇</span>
              </div>

              <div class="months-container">
                <div v-for="monthData in yearData.months" :key="monthData.month" class="timeline-month">
                  <div class="month-header">
                    <span class="month-dot"></span>
                    <span class="month-text">{{ monthData.month }} 月</span>
                  </div>

                  <ul class="article-list">
                    <li v-for="article in monthData.articles" :key="article.id" class="article-item">
                      <span class="item-dot"></span>
                      <span class="item-date">{{ formatArticleDate(article.publishTime || article.createTime) }}</span>
                      <router-link
                        :to="article.slug ? `/article/s/${article.slug}` : `/article/${article.id}`"
                        class="item-title"
                      >
                        {{ article.title }}
                      </router-link>
                      <span v-if="article.isTop" class="badge badge-top">置顶</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <EmptyState text="暂无文章" />
          </div>

          <div v-if="hasMore && !loading" class="load-more">
            <el-button @click="loadMore">加载更多</el-button>
          </div>

          <div v-if="loading && groupedArticles.length > 0" class="loading-more">
            <el-button loading>加载中...</el-button>
          </div>
        </div>
      </div>

      <AppSidebar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticleStore } from '@/stores/article'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Article } from '@/types/article.d'

interface MonthData {
  month: number
  articles: Article[]
}

interface YearData {
  year: number
  months: MonthData[]
  count: number
}

const articleStore = useArticleStore()
const allArticles = ref<Article[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 100
const hasMore = ref(true)

const totalArticles = computed(() => allArticles.value.length)

const groupedArticles = computed<YearData[]>(() => {
  const map = new Map<number, Map<number, Article[]>>()

  for (const article of allArticles.value) {
    const date = new Date(article.publishTime || article.createTime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!map.has(year)) {
      map.set(year, new Map())
    }
    const yearMap = map.get(year)!
    if (!yearMap.has(month)) {
      yearMap.set(month, [])
    }
    yearMap.get(month)!.push(article)
  }

  const result: YearData[] = []
  const sortedYears = Array.from(map.keys()).sort((a, b) => b - a)

  for (const year of sortedYears) {
    const yearMap = map.get(year)!
    const months: MonthData[] = []
    let count = 0

    const sortedMonths = Array.from(yearMap.keys()).sort((a, b) => b - a)

    for (const month of sortedMonths) {
      const articles = yearMap.get(month)!
      articles.sort((a, b) => {
        const timeA = new Date(a.publishTime || a.createTime).getTime()
        const timeB = new Date(b.publishTime || b.createTime).getTime()
        return timeB - timeA
      })
      months.push({ month, articles })
      count += articles.length
    }

    result.push({ year, months, count })
  }

  return result
})

function formatArticleDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

onMounted(async () => {
  await fetchAllArticles()
})

async function fetchAllArticles() {
  if (loading.value) return
  loading.value = true

  try {
    const data = await articleStore.fetchPublicArticles(currentPage.value, pageSize)
    if (data) {
      allArticles.value = [...allArticles.value, ...data]
      if (data.length < pageSize) {
        hasMore.value = false
      }
    }
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  currentPage.value++
  await fetchAllArticles()
}
</script>

<style scoped>
.archives-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

.archives-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.archives-main {
  flex: 1;
  min-width: 0;
}

.archives-card {
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 32px;
  box-shadow: var(--shadow-card);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--color-border);
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.header-icon {
  width: 44px;
  height: 44px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--neon-glow-sm);
}

.header-icon svg {
  width: 24px;
  height: 24px;
  color: #0a0a0f;
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-title);
  margin: 0;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
}

.article-count {
  font-size: var(--font-size-sm);
  color: var(--color-muted);
  margin-left: auto;
}

.loading-state {
  padding: 20px 0;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-primary), rgba(0, 240, 255, 0.15));
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
}

.timeline::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 12px;
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, rgba(0, 240, 255, 0.8), transparent);
  border-radius: 2px;
  animation: data-stream 3s ease-in-out infinite;
}

@keyframes data-stream {
  0% { top: 12px; opacity: 1; }
  80% { opacity: 0.6; }
  100% { top: calc(100% - 12px); opacity: 0; }
}

.timeline-year {
  margin-bottom: 28px;
}

.timeline-year:last-child {
  margin-bottom: 0;
}

.year-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  position: relative;
}

.year-dot {
  width: 14px;
  height: 14px;
  background: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(0, 240, 255, 0.15), 0 0 10px rgba(0, 240, 255, 0.4);
  z-index: 1;
}

.year-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-title);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.year-count {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background: rgba(0, 240, 255, 0.08);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.months-container {
  margin-left: 20px;
  padding-left: 18px;
  position: relative;
}

.months-container::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 8px;
  bottom: 8px;
  width: 1.5px;
  background: var(--color-border);
  border-radius: 1px;
}

.timeline-month {
  margin-bottom: 16px;
}

.timeline-month:last-child {
  margin-bottom: 0;
}

.month-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.month-dot {
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(255, 45, 120, 0.15), 0 0 8px rgba(255, 45, 120, 0.3);
  z-index: 1;
}

.month-text {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-body);
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.article-item:hover {
  background: rgba(0, 240, 255, 0.04);
}

.item-dot {
  width: 6px;
  height: 6px;
  background: var(--color-muted);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s;
}

.article-item:hover .item-dot {
  background: var(--color-primary);
  box-shadow: 0 0 6px rgba(0, 240, 255, 0.5);
}

.item-date {
  font-size: 12px;
  color: var(--color-muted);
  font-family: 'SF Mono', 'Consolas', monospace;
  flex-shrink: 0;
  min-width: 42px;
}

.item-title {
  font-size: 14px;
  color: var(--color-body);
  text-decoration: none;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
  transition: all 0.2s;
}

.item-title:hover {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.badge-top {
  background: rgba(0, 240, 255, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.empty-state {
  padding: 40px 0;
}

.load-more {
  text-align: center;
  padding: 24px 0 0;
}

.loading-more {
  text-align: center;
  padding: 16px 0 0;
}

@media (max-width: 768px) {
  .archives-layout {
    flex-direction: column;
  }

  .archives-card {
    padding: 24px 20px;
  }

  .card-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  .article-count {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .months-container {
    margin-left: 12px;
    padding-left: 14px;
  }

  .article-list {
    margin-left: 10px;
  }

  .item-title {
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .archives-card {
    padding: 20px 16px;
  }

  .header-icon {
    width: 38px;
    height: 38px;
  }

  .header-icon svg {
    width: 20px;
    height: 20px;
  }

  .header-title {
    font-size: var(--font-size-lg);
  }

  .year-text {
    font-size: var(--font-size-base);
  }

  .item-date {
    font-size: 11px;
    min-width: 38px;
  }

  .item-title {
    font-size: 13px;
    max-width: 150px;
  }
}
</style>
