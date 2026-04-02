<template>
  <div class="article-detail-page page-container">
    <template v-if="loading">
      <div class="detail-skeleton">
        <el-skeleton :rows="8" animated />
      </div>
    </template>

    <template v-else-if="article">
      <div class="detail-layout">
        <article class="article-content">
          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <ArticleMeta :article="article" />
            <div v-if="article.tags && article.tags.length > 0" class="article-tags">
              <TagBadge v-for="tag in article.tags" :key="tag.id" :tag="tag" />
            </div>
          </header>

          <div v-if="article.coverImage" class="article-cover">
            <img :src="article.coverImage" :alt="article.title" />
          </div>

          <MarkdownViewer :content="article.content" />
        </article>

        <aside class="detail-sidebar">
          <ArticleToc :html-content="article.contentHtml || ''" />
        </aside>
      </div>
    </template>

    <template v-else>
      <EmptyState text="文章不存在" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import ArticleMeta from '@/components/article/ArticleMeta.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import MarkdownViewer from '@/components/article/MarkdownViewer.vue'
import TagBadge from '@/components/common/TagBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Article } from '@/types/article.d'

const route = useRoute()
const articleStore = useArticleStore()
const article = ref<Article | null>(null)
const loading = ref(true)

async function loadArticle() {
  loading.value = true
  try {
    const id = route.params.id as string
    const slug = route.params.slug as string

    if (id) {
      article.value = (await articleStore.fetchArticleDetail(Number(id))) || null
    } else if (slug) {
      article.value = (await articleStore.fetchArticleBySlug(slug)) || null
    }
  } catch {
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadArticle)

watch(() => [route.params.id, route.params.slug], loadArticle)
</script>

<style scoped>
.article-detail-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

.detail-skeleton {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.detail-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.article-content {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 36px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.article-header {
  margin-bottom: 28px;
}

.article-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-title);
  line-height: 1.4;
  margin-bottom: 16px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.article-cover {
  margin-bottom: 24px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.detail-sidebar {
  width: 260px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .detail-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .article-content {
    padding: 20px;
  }

  .article-title {
    font-size: 20px;
  }
}
</style>