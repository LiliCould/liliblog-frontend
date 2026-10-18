<template>
  <AppLayout :show-hero="false">
    <div class="min-h-screen">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center">
            <TagIcon class="w-5 h-5 text-t-primary" />
          </div>
          <h1 class="text-2xl font-bold text-t-title">{{ tagName }}</h1>
        </div>
        <p class="text-t-muted text-sm ml-[52px]">共 {{ filteredArticles.length }} 篇文章</p>
      </div>

      <div v-if="pending && filteredArticles.length === 0" class="flex flex-col gap-6">
        <div v-for="i in 3" :key="i" class="h-40 rounded-xl bg-t-surface border border-t-border animate-pulse" />
      </div>

      <ArticleList
        v-else-if="paginatedArticles.length > 0"
        :articles="paginatedArticles"
        :total="filteredArticles.length"
        :current="current"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <EmptyState v-else message="该标签暂无文章" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Tag as TagIcon } from 'lucide-vue-next'
import type { Article, PageResult } from '~/types'
import { absoluteUrl } from '~/utils/seo'

const route = useRoute()
const api = useApi()
const tagName = computed(() => decodeURIComponent(String(route.params.slug || '')))
const current = ref(1)
const pageSize = ref(10)

const { data: articlePage, pending } = await useAsyncData(
  'published-articles-for-tags',
  () => api.get<PageResult<Article>>('/api/article', { status: 1, current: 1, size: 100 }),
  {
    default: () => ({
      records: [],
      total: 0,
      size: 0,
      current: 1,
      totalPage: 0,
      hasPrevious: false,
      hasNext: false,
    } as PageResult<Article>),
  },
)

const filteredArticles = computed(() => {
  const records = articlePage.value?.records || []
  return records.filter(article => article.tags?.some(tag => tag.name === tagName.value))
})

const paginatedArticles = computed(() => {
  const start = (current.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

function handlePageChange(page: number): void {
  current.value = page
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePageSizeChange(size: number): void {
  pageSize.value = size
  current.value = 1
}

useSeoMeta({
  title: () => `#${tagName.value} | 立里博客`,
  description: () => `浏览标签「${tagName.value}」下的文章。`,
  ogTitle: () => `#${tagName.value} | 立里博客`,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: absoluteUrl(`/tag/${encodeURIComponent(tagName.value)}`) }],
}))
</script>
