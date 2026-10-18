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

      <LoadingState v-if="pending && filteredArticles.length === 0" variant="list" :count="3" />

      <ErrorState
        v-else-if="error && filteredArticles.length === 0"
        title="标签文章加载失败"
        @retry="refresh"
      />

      <ArticleList
        v-else-if="paginatedArticles.length > 0"
        :articles="paginatedArticles"
        :total="filteredArticles.length"
        :current="current"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />

      <EmptyState
        v-else
        :message="tagExists ? '该标签暂无文章' : '标签不存在'"
        :description="tagExists ? '换个标签看看吧' : '请检查链接是否正确'"
      />
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

const MAX_TAG_PAGES = 10

const emptyPage: PageResult<Article> = {
  records: [],
  total: 0,
  size: 0,
  current: 1,
  totalPage: 0,
  hasPrevious: false,
  hasNext: false,
}

async function fetchAllPublishedArticles(): Promise<PageResult<Article>> {
  const firstPage = await api.get<PageResult<Article>>('/api/article', {
    status: 1,
    current: 1,
    size: 100,
  })

  const records = [...(firstPage.records || [])]
  const totalPage = Math.min(Number(firstPage.totalPage || 1), MAX_TAG_PAGES)

  if (totalPage > 1) {
    const remaining = await Promise.all(
      Array.from({ length: totalPage - 1 }, (_, index) =>
        api.get<PageResult<Article>>('/api/article', {
          status: 1,
          current: index + 2,
          size: 100,
        }),
      ),
    )
    for (const page of remaining) {
      records.push(...(page.records || []))
    }
  }

  return { ...firstPage, records }
}

const { data: articlePage, pending, error, refresh } = await useAsyncData(
  'published-articles-for-tags',
  fetchAllPublishedArticles,
  { default: () => emptyPage },
)

const { data: tags } = await useTags()

const tagExists = computed(() => (tags.value || []).some(tag => tag.name === tagName.value))

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
