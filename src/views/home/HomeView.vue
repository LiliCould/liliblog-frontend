<template>
  <div class="home-page page-container">
    <div class="home-layout">
      <div class="home-main">
        <div class="article-list">
          <template v-if="articleStore.loading && articleStore.publicList.length === 0">
            <div v-for="i in 3" :key="i" class="skeleton-card">
              <el-skeleton :rows="4" animated />
            </div>
          </template>

          <template v-else-if="articleStore.publicList.length > 0">
            <ArticleCard
              v-for="article in articleStore.publicList"
              :key="article.id"
              :article="article"
            />

            <div class="load-more">
              <el-button
                v-if="hasMore"
                :loading="articleStore.loading"
                @click="loadMore"
              >
                加载更多
              </el-button>
              <span v-else class="no-more">没有更多文章了</span>
            </div>
          </template>

          <template v-else>
            <EmptyState text="暂无文章" />
          </template>
        </div>
      </div>

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
  padding-top: 24px;
  padding-bottom: 40px;
}

.home-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.home-main {
  flex: 1;
  min-width: 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
}

.load-more {
  text-align: center;
  padding: 20px 0;
}

.no-more {
  font-size: 13px;
  color: var(--color-muted);
}
</style>
