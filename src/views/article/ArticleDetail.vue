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
          <ArticleToc :markdown-content="article.content || ''" />
        </aside>
      </div>
    </template>

    <template v-else>
      <EmptyState text="文章不存在" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
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

const currentUrl = computed(() => {
  const id = route.params.id as string
  const slug = route.params.slug as string
  if (slug) {
    return `https://lilicould.cn/article/s/${slug}`
  } else if (id) {
    return `https://lilicould.cn/article/${id}`
  }
  return 'https://lilicould.cn'
})

function updateMetaTags() {
  if (!article.value) return

  const { title, summary, coverImage, authorNickname } = article.value
  const url = currentUrl.value
  const image = coverImage || 'https://lilicould.cn/favicon.svg'
  const description = summary || '立里博客的文章'

  // 更新页面标题
  document.title = `${title} - 立里博客`

  // 更新 meta 标签
  updateMetaTag('description', description)
  updateMetaTag('keywords', `${title},${authorNickname},立里博客`)

  // 更新 Open Graph 标签
  updateOgTag('og:title', title)
  updateOgTag('og:description', description)
  updateOgTag('og:url', url)
  updateOgTag('og:image', image)
  updateOgTag('og:site_name', '立里博客')
  updateOgTag('og:type', 'article')
  updateOgTag('article:author', authorNickname)

  // 更新 Twitter 标签
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image)
  updateMetaTag('twitter:site', '@lilicould')

  // 更新规范链接
  updateCanonicalTag(url)
}

function updateMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.appendChild(tag)
  }
  tag.content = content
}

function updateOgTag(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.content = content
}

function updateCanonicalTag(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = url
}

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
    updateMetaTags()
  }
}

onMounted(loadArticle)

watch(() => [route.params.id, route.params.slug], loadArticle)
watch(article, updateMetaTags, { deep: true })
</script>

<style scoped>
.article-detail-page {
  padding-top: 24px;
  padding-bottom: 40px;
}

.detail-skeleton {
  max-width: 800px;
  margin: 0 auto;
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  padding: 40px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
}

.detail-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  min-height: 100vh;
}

.article-content {
  flex: 1;
  min-width: 0;
  background: var(--color-card);
  backdrop-filter: var(--blur-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: 36px;
  box-shadow: var(--shadow-card);
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
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
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
  position: sticky;
  top: calc(var(--header-height) + 20px);
  align-self: flex-start;
  max-height: calc(100vh - var(--header-height) - 40px);
  overflow-y: auto;
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