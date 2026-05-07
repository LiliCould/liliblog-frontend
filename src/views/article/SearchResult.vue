<template>
  <div class="search-page page-container">
    <div class="search-header">
      <h1 class="search-title">搜索文章</h1>
      <SearchBar ref="searchBarRef" />
    </div>

    <div v-if="keyword" class="search-info">
      <span>搜索 "<strong>{{ keyword }}</strong>" 的结果，共 {{ articleStore.searchResults.length }} 篇</span>
    </div>

    <div class="search-results">
      <template v-if="articleStore.loading">
        <div v-for="i in 3" :key="i" class="skeleton-card">
          <el-skeleton :rows="3" animated />
        </div>
      </template>

      <template v-else-if="articleStore.searchResults.length > 0">
        <ArticleCard v-for="article in articleStore.searchResults" :key="article.id" :article="article" />
      </template>

      <template v-else-if="keyword && !articleStore.loading">
        <EmptyState text="没有找到相关文章" />
      </template>

      <template v-else>
        <div class="search-hint">
          <p>输入关键词搜索文章</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import SearchBar from '@/components/common/SearchBar.vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const articleStore = useArticleStore()
const keyword = ref('')
const searchBarRef = ref<InstanceType<typeof SearchBar>>()

async function doSearch(kw: string) {
  keyword.value = kw
  if (kw) {
    await articleStore.search(kw)
  } else {
    articleStore.clearSearch()
  }
}

onMounted(() => {
  const kw = route.query.keyword as string
  if (kw) {
    keyword.value = kw
    if (searchBarRef.value) {
      searchBarRef.value.keyword = kw
    }
    doSearch(kw)
  }
})

watch(() => route.query.keyword, (val) => {
  const kw = (val as string) || ''
  if (kw !== keyword.value) {
    if (searchBarRef.value) {
      searchBarRef.value.keyword = kw
    }
    doSearch(kw)
  }
})
</script>

<style scoped>
.search-page {
  padding-top: 32px;
  padding-bottom: 40px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.search-header {
  text-align: center;
  margin-bottom: 32px;
}

.search-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.search-header :deep(.search-bar) {
  margin: 0 auto;
}

.search-info {
  text-align: center;
  margin: 0 auto;
  font-size: 14px;
  color: var(--color-body);
  max-width: 800px;
}

.search-info strong {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.skeleton-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border);
}

.search-hint {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-muted);
  font-size: 14px;
}
</style>
